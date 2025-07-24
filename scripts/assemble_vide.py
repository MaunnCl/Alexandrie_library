#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Assemble talk videos (audio + slides) driven by **vide2** timings (frame numbers @ 60 fps)
====================================================================================
Folder layout expected – choose the four roots when launching the GUI:

```
<TIMING_ROOT>/
    18/  19/  20/ …          ← .xls(x) spreadsheets with a “vide2” list
<SLIDES_ROOT>/
    18/  19/  20/ …          ← one sub‑folder per talk, containing dia_01.* etc.
<AUDIO_ROOT>/
    sons18/  sons19/  …      ← or 18/ 19/  … if you don’t have the “sons” prefix
<OUTPUT_ROOT>/               ← where MP4 + JSON will be written
```

A *talk* is detected when a spreadsheet name, an audio file and a slide folder
share the **same numeric prefix** (e.g. `02_`) and a reasonable overlap of the
remaining words. The full filename match takes precedence when possible.

Version history
---------------
* **v1.1 (2025‑07‑10)** – robust matching: tolerates extra words, minor typos,
  or prefix‑only names; verbose `[MATCH] …` logs when a fuzzy rule is used.
"""

from __future__ import annotations

import html
import json
import os
import re
import subprocess
import threading
import unicodedata
from pathlib import Path
from random import randint
from typing import Dict, List, Tuple
import shutil
import traceback, io, sys

import tkinter as tk
from tkinter import filedialog, messagebox, scrolledtext, ttk

import pandas as pd

# ─────────────────────────────── Config ───────────────────────────────
FFMPEG = "ffmpeg"
FFPROBE = "ffprobe"
SWFRENDER = "swfrender"         # optional – ignored if missing
FPS = 60                         # vide2 frames are given at 60 fps
AUDIO_EXTS = [".mp3", ".wav", ".m4a", ".aac", ".flac"]
IMG_EXTS = [".png", ".jpg", ".jpeg", ".gif", ".swf"]

AUDIO_PAT_NUM = re.compile(r"(\d+)")  # natural sort helper

# ────────────────────────────── Logging ───────────────────────────────

# ──────────────── Logging ────────────────
def log(box: scrolledtext.ScrolledText | None, msg: str) -> None:
    """Affiche dans la console *et* dans la zone de log Tk, quel que soit le thread."""
    if box is None:
        print(msg)
        return

    if threading.current_thread() is threading.main_thread():
        box.configure(state="normal")
        box.insert("end", msg + "\n")
        box.see("end")
        box.configure(state="disabled")
    else:
        # Sinon on reprogramme l’écriture dans le thread principal
        box.after(0, lambda: log(box, msg))

# ─────────────────────────── String helpers ───────────────────────────

def slugify(txt: str) -> str:
    txt = unicodedata.normalize("NFKD", txt).encode("ascii", "ignore").decode()
    txt = re.sub(r"[^A-Za-z0-9]+", "_", txt)
    txt = re.sub(r"_{2,}", "_", txt)
    return txt.strip("_").lower()


def natural_key(path: Path) -> Tuple[int, str]:
    """Sort filenames by the first integer they contain, fallback alpha."""
    m = AUDIO_PAT_NUM.search(path.stem)
    return (int(m.group(1)) if m else 10**9, path.stem)

# helpers -------------------------------------------------------------
def ui_call(widget, func, *args, **kwargs):
    """Exécute `func(*args, **kwargs)` dans le thread Tk principal."""
    widget.after(0, lambda: func(*args, **kwargs))

# ──────────────────────────── ffprobe helper ───────────────────────────

def get_duration(path: Path) -> float:
    out = subprocess.check_output([
        FFPROBE,
        "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        str(path),
    ])
    return float(out.decode().strip())

# ─────────────────────── Slide conversion utils ───────────────────────

def is_gif(p: Path) -> bool:
    return p.suffix.lower() == ".gif"


def swf_is_animated(p: Path) -> bool:
    """Detect whether a SWF has more than one frame (needs ffprobe)."""
    try:
        out = subprocess.check_output([
            FFPROBE, "-v", "error",
            "-select_streams", "v:0",
            "-count_packets",
            "-show_entries", "stream=nb_read_packets",
            "-of", "csv=p=0",
            str(p),
        ])
        return int(out.decode().strip() or "0") > 1
    except Exception:
        return False


def ensure_slide(src: Path, out_dir: Path) -> Path:
    """Return a PNG/GIF copy (or conversion) ready for ffmpeg input."""
    out_dir.mkdir(parents=True, exist_ok=True)
    ext = src.suffix.lower()
    safe = slugify(src.stem)
    png_out = out_dir / f"{safe}.png"
    gif_out = out_dir / f"{safe}.gif"

    # Already converted ?
    if gif_out.exists():
        return gif_out
    if png_out.exists():
        return png_out

    # Simple copies -----------------------------------
    if ext in {".png", ".jpg", ".jpeg"}:
        png_out.write_bytes(src.read_bytes())
        return png_out
    if ext == ".gif":
        gif_out.write_bytes(src.read_bytes())
        return gif_out

    # SWF conversion ----------------------------------
    if ext == ".swf":
        # A) GIF animé si le SWF l’est
        if swf_is_animated(src):
            subprocess.run([
                FFMPEG, "-y", "-loglevel", "error", "-i", str(src),
                "-vf", "fps=10,scale=640:-1:flags=lanczos", "-loop", "0", str(gif_out)
            ])
            if gif_out.exists():
                return gif_out

        # B) PNG statique via swfrender … seulement s’il existe
        if shutil.which(SWFRENDER):
            subprocess.run([SWFRENDER, str(src), "-o", str(png_out)],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            if png_out.exists():
                return png_out
        else:
            log(None, "[WARN] swfrender absent → on passe au plan C")

        # C) ultime secours : première frame via ffmpeg
        subprocess.run([
            FFMPEG, "-y", "-loglevel", "error", "-ss", "0", "-i", str(src),
            "-frames:v", "1", str(png_out)
        ])
        if png_out.exists():
            return png_out
        raise FileNotFoundError(f"Cannot convert {src}")

        subprocess.run([SWFRENDER, str(src), "-o", str(png_out)],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if png_out.exists():
            return png_out
        # ultimate fallback : first frame via ffmpeg
        subprocess.run([
            FFMPEG, "-y", "-loglevel", "error", "-ss", "0", "-i", str(src),
            "-frames:v", "1", str(png_out)
        ])
        if png_out.exists():
            return png_out
        raise FileNotFoundError(f"Cannot convert {src}")

    raise FileNotFoundError(f"Unsupported slide type: {src}")

# ─────────────────────── Matching helpers (fuzzy) ──────────────────────

def _num_prefix(name: str) -> str:
    m = re.match(r"^0*([0-9]+)", name)
    return m.group(1) if m else ""


def _token_set(name: str) -> set[str]:
    return set(slugify(name).split("_"))


def find_audio(session_audio_dir: Path, talk_stem: str) -> Path | None:
    if not session_audio_dir.exists():
        return None
    cands = [p for p in session_audio_dir.iterdir() if p.suffix.lower() in AUDIO_EXTS]
    if not cands:
        return None

    tgt_slug = slugify(talk_stem)
    tgt_num  = _num_prefix(tgt_slug)
    tgt_tok  = _token_set(tgt_slug) - {tgt_num}

    # exact match -----------------------------------------------------
    for p in cands:
        if slugify(p.stem) == tgt_slug:
            return p

    # unique numeric prefix ------------------------------------------
    if tgt_num:
        same = [p for p in cands if _num_prefix(p.stem) == tgt_num]
        if len(same) == 1:
            log(None, f"[MATCH] audio by num‑prefix {tgt_num}: {same[0].name}")
            return same[0]

    # token overlap ---------------------------------------------------
    best = max(cands, key=lambda p: len((_token_set(p.stem) - {tgt_num}) & tgt_tok))
    if len((_token_set(best.stem) - {tgt_num}) & tgt_tok):
        log(None, f"[MATCH] audio by tokens: {best.name}")
        return best

    return None


def find_slides(session_slides_dir: Path, talk_stem: str) -> Path | None:
    if not session_slides_dir.exists():
        return None
    dirs = [d for d in session_slides_dir.iterdir() if d.is_dir()]
    if not dirs:
        return None

    tgt_slug = slugify(talk_stem)
    tgt_num  = _num_prefix(tgt_slug)
    tgt_tok  = _token_set(tgt_slug) - {tgt_num}

    # exact match -----------------------------------------------------
    for d in dirs:
        if slugify(d.name) == tgt_slug:
            return d

    # unique numeric prefix ------------------------------------------
    if tgt_num:
        same = [d for d in dirs if _num_prefix(d.name) == tgt_num]
        if len(same) == 1:
            log(None, f"[MATCH] slides by num‑prefix {tgt_num}: {same[0].name}")
            return same[0]
        if same:
            same.sort(key=lambda d: len(_token_set(d.name) & tgt_tok), reverse=True)
            if len(_token_set(same[0].name) & tgt_tok):
                log(None, f"[MATCH] slides by num+tokens: {same[0].name}")
                return same[0]

    # token overlap ---------------------------------------------------
    dirs.sort(key=lambda d: len(_token_set(d.name) & tgt_tok), reverse=True)
    if len(_token_set(dirs[0].name) & tgt_tok):
        log(None, f"[MATCH] slides by tokens: {dirs[0].name}")
        return dirs[0]

    return None

# ───────────────────────── Assemble one talk ──────────────────────────

# ───────────────────────── Assemble one talk ──────────────────────────
def assemble_talk(session_id: str,
                  excel_file: Path,
                  audio_file: Path,
                  slides_dir: Path,
                  output_root: Path,
                  log_box: scrolledtext.ScrolledText,
                  prog: ttk.Progressbar) -> None:
    """Encode all segments for a single talk and concatenate them."""
    talk_stem = slugify(excel_file.stem)

    # 1) timings ------------------------------------------------------
    frames = read_vide2(excel_file)
    if not frames:
        log(log_box, f"⚠️  {excel_file.name}: vide2 not found – skipped")
        return
    times = [f / FPS for f in frames]
    if times[0] != 0.0:          # on force 0 comme première time-code
        times.insert(0, 0.0)

    # 2) slides -------------------------------------------------------
    slide_files = sorted(
        [p for p in slides_dir.iterdir() if p.suffix.lower() in IMG_EXTS],
        key=natural_key
    )
    if not slide_files:
        log(log_box, f"⚠️  {slides_dir}: no slides – skipped")
        return

    # si “ques/quest” trouvé → on s’arrête à cette diapo
    for i, p in enumerate(slide_files):
        if re.search(r"ques", p.stem, re.I):
            slide_files = slide_files[: i + 1]
            break

    # aligne #slides et #timecodes
    if len(slide_files) < len(times):
        slide_files += [slide_files[-1]] * (len(times) - len(slide_files))
    elif len(slide_files) > len(times):
        slide_files = slide_files[: len(times)]

    # 3) découpe audio en segments -----------------------------------
    audio_dur = get_duration(audio_file)
    seg_times: List[Tuple[float, float]] = []
    for i in range(len(times)):
        start = times[i]
        end   = times[i + 1] if i + 1 < len(times) else audio_dur
        seg_times.append((start, max(end, start + 0.05)))   # ≥ 50 ms

    # dossiers de sortie
    talk_dir      = output_root / session_id / talk_stem
    segments_dir  = talk_dir / "segments"
    final_mp4     = talk_dir / f"{talk_stem}.mp4"
    talk_dir.mkdir(parents=True, exist_ok=True)

    if final_mp4.exists():
        log(log_box, f"⏩  {session_id}/{talk_stem}.mp4 already here – skipped")
        return

    # 4) encodage des segments ---------------------------------------
    timestamps: List[Dict[str, float | str]] = []
    concat_entries: List[str] = []
    prog.configure(maximum=len(seg_times), value=0)

    for idx, ((start, end), src_slide) in enumerate(zip(seg_times, slide_files), 1):
        dur      = end - start
        seg_out  = segments_dir / f"seg_{idx:03d}.mp4"

        try:
            slide_img = ensure_slide(src_slide, segments_dir)
        except Exception as exc:
            log(log_box, f"[WARN] {src_slide.name}: {exc} → on réutilise la slide d’avant")
            prev_slide = slide_files[idx - 2] if idx > 1 else src_slide
            slide_img = ensure_slide(prev_slide, segments_dir)

        slide_input = (
            ["-ignore_loop", "0", "-i", str(slide_img)]
            if is_gif(slide_img)
            else ["-loop", "1", "-i", str(slide_img)]
        )

        subprocess.run([
            FFMPEG, "-y", "-loglevel", "error",
            *slide_input,
            "-ss", f"{start:.3f}", "-t", f"{dur:.3f}", "-i", str(audio_file),
            "-vf", "scale=ceil(iw/2)*2:ceil(ih/2)*2",
            "-c:v", "libx264", "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-b:a", "192k",
            "-shortest",
            str(seg_out)
        ], check=True)

        timestamps.append({"slide": seg_out.name, "start": start, "duration": dur})
        concat_entries.append(f"file '{seg_out.name}'")
        ui_call(prog, prog.configure, value=idx)

    concat_file = segments_dir / "concat.txt"
    concat_file.write_text("\n".join(concat_entries), encoding="utf-8")
    subprocess.run([
        FFMPEG, "-y", "-f", "concat", "-safe", "0",
        "-i", str(concat_file), "-c", "copy", str(final_mp4)
    ], check=True)

    (talk_dir / f"{talk_stem}.json").write_text(
        "[\n  " +
        ",\n  ".join(
            f'{{"slide": "{t["slide"]}", "start": {t["start"]:.3f}, "duration": {t["duration"]:.3f}}}'
            for t in timestamps
        ) +
        "\n]", encoding="utf-8"
    )

    log(log_box, f" ✅  {final_mp4.relative_to(output_root)}")
    prog.configure(value=0)
# ───────────────────── vide2 extraction (Excel) ───────────────────────
def read_vide2(xls_path: Path) -> List[int]:
    """
    Renvoie la liste triée des numéros de frames (vide2) trouvés dans un classeur.
    • .xlsx / .xlsm : via pandas + openpyxl
    • .xls          : via xlrd 1.2 SANS passer par pandas (contourne la restriction)
    """
    frames: List[int] = []

    # helper interne --------------------------------------------------
    def grab_from_df(df) -> List[int]:
        lst: List[int] = []

        # a) étiquette et chiffres dans la même cellule
        for cell in df.stack().astype(str):
            if re.search(r"\bvide\s*2\b", cell, re.I):
                lst += [int(x) for x in re.findall(r"\d+", cell)]
                if lst:
                    return lst

        # b) étiquette seule puis chiffres adjacents
        mask = df.applymap(lambda v: isinstance(v, str)
                                    and re.search(r"\bvide\s*2\b", v, re.I))
        if mask.any().any():
            r, c = next(iter(mask.stack()[mask.stack()].index))
            droite   = df.iloc[r:,   c+1:].values.flatten()   # rectangle à droite
            dessous  = df.iloc[r+1:, c  ].values.flatten()   # colonne dessous
            block = list(droite) + list(dessous)
            lst += [int(v) for v in block
                        if isinstance(v, (int, float)) and v > 0]
        return lst

    ext = xls_path.suffix.lower()

    # ----- XLSX / XLSM ------------------------------------------------
    if ext in {".xlsx", ".xlsm"}:
        try:
            sheets = pd.read_excel(xls_path, sheet_name=None, header=None, engine="openpyxl")
            for _, df in sheets.items():
                frames = grab_from_df(df)
                if frames:
                    break
        except Exception as exc:
            print(f"[WARN] {xls_path.name}: openpyxl read error → {exc}")

    # ----- XLS (via xlrd 1.2) ----------------------------------------
    elif ext == ".xls":
        try:
            import xlrd  # xlrd 1.2 requis
            if xlrd.__version__ >= "2.0":
                print(f"[WARN] xlrd {xlrd.__version__} incapable de lire le .xls → pip install xlrd==1.2.0")
            else:
                wb = xlrd.open_workbook(str(xls_path))
                for sh in wb.sheets():
                    data = [[sh.cell_value(r, c) for c in range(sh.ncols)] for r in range(sh.nrows)]
                    df = pd.DataFrame(data)
                    frames = grab_from_df(df)
                    if frames:
                        break
        except ImportError:
            print("[WARN] xlrd n’est pas installé → pip install xlrd==1.2.0")
        except Exception as exc:
            print(f"[WARN] {xls_path.name}: xlrd read error → {exc}")

    else:
        print(f"[WARN] {xls_path.name}: extension inconnue")

    if not frames:
        print(f"[DBG] {xls_path.name}: vide2 non détecté")
    return sorted(frames)

# ───────────────────────────── GUI helpers ────────────────────────────

def choose_and_run(log_box: scrolledtext.ScrolledText, prog: ttk.Progressbar) -> None:
    root_win = log_box.winfo_toplevel()

    timing_root = Path(filedialog.askdirectory(parent=root_win, title="Choose TIMING root") or "")
    if not timing_root:
        return
    slides_root = Path(filedialog.askdirectory(parent=root_win, title="Choose SLIDES root") or "")
    if not slides_root:
        return
    audio_root = Path(filedialog.askdirectory(parent=root_win, title="Choose AUDIO root") or "")
    if not audio_root:
        return
    output_root = Path(filedialog.askdirectory(parent=root_win, title="Choose OUTPUT folder") or "")
    if not output_root:
        return

    jobs: List[Tuple[str, Path, Path, Path]] = []  # session, xls, audio, slides

    for sess_dir in timing_root.iterdir():
        if not sess_dir.is_dir() or not sess_dir.name.isdigit():
            continue
        sid = sess_dir.name
        audio_dir = audio_root / f"sons{sid}"
        if not audio_dir.exists():
            audio_dir = audio_root / sid
        slides_dir_root = slides_root / sid

        for xls in sess_dir.glob("*.xls*"):
            audio = find_audio(audio_dir, xls.stem)
            slides = find_slides(slides_dir_root, xls.stem)
            if not audio or not slides:
                continue
            jobs.append((sid, xls, audio, slides))

    if not jobs:
        messagebox.showwarning("Nothing found", "No talk detected with matching audio & slides.")
        return

    # Selection window -----------------------------------------------
    sel = tk.Toplevel(root_win)
    sel.title("Select presentations to assemble")
    canvas = tk.Canvas(sel, borderwidth=0)
    frame = tk.Frame(canvas)
    vbar = tk.Scrollbar(sel, orient="vertical", command=canvas.yview)
    canvas.configure(yscrollcommand=vbar.set)
    vbar.pack(side="right", fill="y")
    canvas.pack(side="left", fill="both", expand=True)
    canvas.create_window((0, 0), window=frame, anchor="nw")
    frame.bind("<Configure>", lambda e: canvas.configure(scrollregion=canvas.bbox("all")))

    var_by_job: Dict[Tuple[str, Path, Path, Path], tk.BooleanVar] = {}
    for sid, xls, _aud, _sl in sorted(jobs, key=lambda j: (j[0], slugify(j[1].stem))):
        v = tk.BooleanVar(value=True)
        tk.Checkbutton(frame, text=f"{sid} — {xls.stem}", variable=v, anchor="w", justify="left").pack(fill="x", padx=4)
        var_by_job[(sid, xls, _aud, _sl)] = v

    btn_bar = tk.Frame(sel, pady=6)
    btn_bar.pack(fill="x")
    tk.Button(btn_bar, text="Select all", command=lambda: [v.set(True) for v in var_by_job.values()]).pack(side="left", padx=4)
    tk.Button(btn_bar, text="Select none", command=lambda: [v.set(False) for v in var_by_job.values()]).pack(side="left")

    def launch():
        sel.destroy()
        todo = [job for job, v in var_by_job.items() if v.get()]
        if not todo:
            messagebox.showinfo("Nothing to do", "No presentation selected.")
            return

        # ➜ ICI on démarre réellement le travail
        def worker():
            ui_call(log_box, log, log_box, f"📂  {len(todo)} selected — processing…")

            for job in todo:
                try:
                    assemble_talk(*job, output_root, log_box, prog)
                except Exception as exc:
                    buf = io.StringIO()
                    traceback.print_exc(file=buf)
                    ui_call(log_box, log, log_box,
                            f"[ERROR] {exc}\n{buf.getvalue()}")

            ui_call(log_box, log, log_box, "🎉  All done.")
            ui_call(prog,    prog.configure, value=0)

        threading.Thread(target=worker, daemon=True).start()

    tk.Button(btn_bar, text="Cancel", command=sel.destroy).pack(side="right", padx=4)
    tk.Button(btn_bar, text="OK", command=launch).pack(side="right", padx=4)

# ───────────────────────────────── main ────────────────────────────────

def main_gui():
    root = tk.Tk()
    root.title("AER Assembler — vide2 mode")
    frm = tk.Frame(root, padx=10, pady=10)
    frm.pack(fill="both", expand=True)

    log_box = scrolledtext.ScrolledText(frm, width=100, height=28, state="disabled", font=("Consolas", 9))
    log_box.pack(fill="both", expand=True, pady=(0, 10))

    prog = ttk.Progressbar(frm, length=500, mode="determinate")
    prog.pack(pady=(0, 10))

    tk.Button(frm, text="Run assembler…", font=("Segoe UI", 12), command=lambda: choose_and_run(log_box, prog)).pack()

    root.mainloop()

if __name__ == "__main__":
    try:
        subprocess.run([FFMPEG, "-version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        subprocess.run([FFPROBE, "-version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    except Exception:
        raise SystemExit("❌ ffmpeg / ffprobe not found in PATH.")

    main_gui()

