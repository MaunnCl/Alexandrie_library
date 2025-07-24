#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from __future__ import annotations

import html
import json
import os
import re
import subprocess
import threading
import unicodedata
import xml.etree.ElementTree as ET
from pathlib import Path
from random import randint
from typing import Dict, List, Tuple

import tkinter as tk
from tkinter import filedialog, messagebox, scrolledtext, ttk

FFMPEG = "ffmpeg"
FFPROBE = "ffprobe"
SWFRENDER = "swfrender"

AUDIO_PAT = re.compile(r"fm_(\d+)\.", re.I)  # sort clips numerically


# ───────────────────────────── Helpers ──────────────────────────────
def log(box: scrolledtext.ScrolledText | None, msg: str) -> None:
    if box is None:
        print(msg)
        return

    box.configure(state="normal")
    box.insert("end", msg + "\n")
    box.see("end")
    box.configure(state="disabled")

def legacy_slugify(text: str) -> str:
    text = re.sub(r"[ \t\n\r]+", "_", text.strip())
    text = re.sub(r"[^A-Za-z0-9_\-]", "", text)
    return text[:1].upper() + text[1:]


def slugify(text: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    text = re.sub(r"[^A-Za-z0-9]+", "_", text)   # <-- TOUS les séparateurs → "_"
    text = re.sub(r"_{2,}", "_", text)           # condense
    return text.strip("_") or "Untitled"



def get_duration(path: Path) -> float:
    out = subprocess.check_output(
        [
            FFPROBE,
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(path),
        ]
    )
    return float(out.decode().strip())

# ───────── helpers ─────────
def speaker_slug_variants(full_name: str) -> List[str]:
    """
    Renvoie plusieurs formes slugifiées d’un nom :
      – nom complet
      – initiale + nom
      – initiale + dernier mot
      – nom sans le prénom
      – pour les prénoms composés (Pierre-Régis) → initiales P-R
    """
    parts = full_name.strip().split()
    if not parts:
        return []

    first, rest_parts = parts[0], parts[1:]
    rest = " ".join(rest_parts)
    initial = first[0]

    # ▶︎ nouvelles initiales pour prénom composé : Pierre-Régis → P-R
    if "-" in first or "-" in first:                     # tiret normal ou insécable
        seg_initials = "-".join(s[0] for s in re.split(r"[--]", first) if s)
        comp_initial = seg_initials                     # → 'P-R'
    else:
        comp_initial = initial                          # → 'P'

    variants = {
        slugify(full_name),                               # Pierre_Regis_Burgel
        slugify(f"{initial} {rest}") if rest else "",     # P_Regis_Burgel
        slugify(f"{initial} {rest_parts[-1]}") if rest_parts else "",  # P_Burgel
        slugify(rest) if rest else "",                    # Regis_Burgel
        slugify(rest_parts[-1]) if rest_parts else "",    # Burgel
        slugify(f"{comp_initial} {rest}") if rest else "",            # P-R_Regis_Burgel
        slugify(f"{comp_initial} {rest_parts[-1]}") if rest_parts else "",  # P-R_Burgel
    }

    return [v for v in variants if v]

# ───────── helpers ─────────
def ensure_png(src: Path, out_dir: Path, idx: int, last_ok: Path | None = None) -> Path:
    """
    • Copie directe pour PNG/JPG
    • Conversion SWF → PNG :
        1) tentative swfrender  (on ignore le code-retour)
        2) fallback ffmpeg si l’image n’est pas créée
    • Si le PNG généré fait ≤ 1 Kio, on le détruit et on lèvera FileNotFoundError
    """
    out_dir.mkdir(parents=True, exist_ok=True)
    ext = src.suffix.lower()

    raw_name = src.stem                   # « diapo.4 »
    safe_name = slugify(raw_name)         # « diapo_4 »
    slide_id  = raw_name if ext == ".swf" else safe_name
    dest = out_dir / f"{slide_id}.png"

    # ─── fichier minuscule ? on supprime ───
    if dest.exists() and dest.stat().st_size <= 1024:
        dest.unlink()

    # ─── déjà converti ───
    if dest.exists() and dest.stat().st_size > 1024:
        return dest

    # ─── images déjà bitmap ───
    if ext in {".png", ".jpg", ".jpeg"}:
        dest.write_bytes(src.read_bytes())
        return dest

    # ─── conversion SWF ───
    if ext == ".swf":
        # 1) swfrender – on ne vérifie pas le code-retour
        subprocess.run(
            [SWFRENDER, str(src), "-o", str(dest)],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
        )
        if dest.exists() and dest.stat().st_size > 1024:
            return dest        # OK malgré RC=1 éventuel

        # 2) ffmpeg fallback
        subprocess.run(
            [
                FFMPEG, "-y", "-loglevel", "error",
                "-ss", "0.5", "-i", str(src),
                "-frames:v", "1", str(dest),
            ],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
        )
        if dest.exists() and dest.stat().st_size > 1024:
            log(None, f"[DEBUG] {src.name} → {dest.name}  size={dest.stat().st_size} o")
            return dest

        raise FileNotFoundError(f"SWF → PNG impossible : {src}")

    raise FileNotFoundError(f"Unsupported slide format: {src}")

def safe_parse_xml(path: Path) -> ET.Element:
    data = path.read_bytes()
    if b"UFT-8" in data:
        data = data.replace(b"UFT-8", b"UTF-8")

    try:
        txt = data.decode("utf-8")
    except UnicodeDecodeError:
        txt = data.decode("latin-1")

    txt = re.sub(r"&(?!amp;|lt;|gt;|quot;|apos;|#[0-9]+;)", "&amp;", txt)
    txt = re.sub(r"[\x00-\x08\x0B\x0C\x0E-\x1F]", "", txt)

    try:
        return ET.fromstring(txt)
    except ET.ParseError as exc:
        raise ValueError(f"Invalid XML in {path}: {exc}") from None

def clean_speaker_name(name: str) -> str:
    titles_to_remove = ["Dr", "Prof", "Mr", "Mrs", "Ms", "M.", "Mme", "Mlle", "Pr"]
    for title in titles_to_remove:
        name = re.sub(rf"\b{title}\b\.?", "", name, flags=re.IGNORECASE)
    name = re.sub(r"[^a-zA-ZÀ-ÿ\s]", "", name)
    name = re.sub(r"\s+", " ", name)
    return name.strip().title()

def xml_val(elem: ET.Element, tag: str) -> str:
    node = elem.find(tag)
    if node is None:
        return ""
    return node.get("value") or (node.text or "")

# ───────── helpers ─────────
def is_gif(path: Path) -> bool:
    return path.suffix.lower() == ".gif"

def swf_is_animated(path: Path) -> bool:
    """
    Retourne True si le SWF contient plus d’une frame vidéo.
    On interroge ffprobe avec -count_packets : plus robuste que duration.
    """
    try:
        out = subprocess.check_output(
            [
                FFPROBE, "-v", "error",
                "-select_streams", "v:0",
                "-count_packets",
                "-show_entries", "stream=nb_read_packets",
                "-of", "csv=p=0",
                str(path),
            ],
            stderr=subprocess.DEVNULL,
        )
        n = int(out.decode().strip() or "0")
        return n > 1          # une vraie anim a > 1 paquet / frame
    except Exception:
        return False          # si ffprobe rame → on suppose “fixe”

def ensure_slide(src: Path, out_dir: Path, idx: int,
                 last_ok: Path | None = None) -> Path:
    """
    • PNG / JPG → copie
    • SWF :
        – si animé       → GIF via ffmpeg
        – sinon          → PNG via swfrender (puis fallback ffmpeg frame-0)
    """
    out_dir.mkdir(parents=True, exist_ok=True)
    ext   = src.suffix.lower()
    stem  = src.stem
    safe  = slugify(stem)
    slide = stem if ext == ".swf" else safe

    png_dest = out_dir / f"{slide}.png"
    gif_dest = out_dir / f"{slide}.gif"

    # déjà encodé ?
    if gif_dest.exists():
        return gif_dest
    if png_dest.exists():
        return png_dest

    # fichiers bitmap d'origine
    if ext in {".png", ".jpg", ".jpeg"}:
        png_dest.write_bytes(src.read_bytes())
        return png_dest

    # -------- SWF ----------
    if ext == ".swf":
        if swf_is_animated(src):          # ‼️ la nouvelle condition
            log(None, f"[INFO] {src.name} → GIF (anim détectée)")
            subprocess.run(
                [
                    FFMPEG, "-y", "-loglevel", "error",
                    "-i", str(src),
                    "-vf", "fps=10,scale=640:-1:flags=lanczos",
                    "-loop", "0", str(gif_dest),
                ],
                check=True,
                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
            )
            if gif_dest.exists():
                return gif_dest
            raise FileNotFoundError(f"GIF KO : {src}")

        # --- slide fixe : on garde le PNG ---
        subprocess.run([SWFRENDER, str(src), "-o", str(png_dest)],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if png_dest.exists():
            return png_dest

        # fallback frame-0 (rarement nécessaire maintenant)
        subprocess.run([FFMPEG, "-y", "-loglevel", "error",
                        "-ss", "0", "-i", str(src),
                        "-frames:v", "1", str(png_dest)],
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if png_dest.exists():
            return png_dest

        raise FileNotFoundError(f"Impossible de convertir {src}")

    raise FileNotFoundError(f"Format non géré : {src}")

# ────────────────────────── Programme JSON ──────────────────────────
def load_program(json_path: Path) -> Dict[Tuple[str, str], Tuple[str, str, str]]:
    """
    Construit un index :
        (speaker_slug, title_slug) → (Session, Speaker, Title)
    """
    data = json.loads(json_path.read_text(encoding="utf-8"))
    index: Dict[Tuple[str, str], Tuple[str, str, str]] = {}

    for session, speakers in data.items():
        for speaker, talks in speakers.items():                # ← boucle intervenants
            for talk in talks:                                 # ← correctement imbriquée
                t_slug = slugify(talk)
                # on enregistre toutes les variantes du nom
                for s_slug in speaker_slug_variants(speaker):
                    index[(s_slug, t_slug)] = (session, speaker, talk)
    return index

# ─────────────────────────── Assemble talk ──────────────────────────
def assemble_talk(
    folder: Path,
    speakers_dir: Path,
    output_root: Path,
    program_index: Dict[Tuple[str, str], Tuple[str, str, str]],
    log_box: scrolledtext.ScrolledText,
    prog: ttk.Progressbar,
) -> None:
    clips_xml = folder / "Clips.xml"
    titre_xml = folder / "Titre.xml"
    if not clips_xml.is_file() or not titre_xml.is_file():
        log(log_box, f"⏩  {folder.name}: Clips.xml / Titre.xml missing – skipped")
        return

    # ─── métadonnées ───
    titre_root = safe_parse_xml(titre_xml)
    clip_node  = titre_root.find("Clip") or titre_root
    speaker_name_raw = xml_val(clip_node, "nom").strip() or "Unknown"
    speaker_name = clean_speaker_name(speaker_name_raw)
    title_raw    = xml_val(clip_node, "titre").strip() or "Untitled"
    speaker_img  = folder / xml_val(clip_node, "Fond")

    speaker_slug = slugify(speaker_name)
    title_slug   = slugify(title_raw)

    if not (speaker_slug, title_slug) in program_index:
        log(log_box,
            f"[DEBUG] KEY MISS  speaker={speaker_slug!r}  title={title_slug!r}")

    # ─── répertoire de sortie ───
    if (speaker_slug, title_slug) in program_index:
        session_raw, speaker_json, title_json = program_index[(speaker_slug, title_slug)]
    else:
        session_raw, speaker_json, title_json = ("Unsorted", speaker_name, title_raw)

    talk_dir       = output_root / session_raw / speaker_json
    final_basename = slugify(title_json)
    final_mp4      = talk_dir / f"{final_basename}.mp4"

    if final_mp4.is_file():
        log(log_box, f"⏩  {speaker_name} — “{title_raw}” already present – skipped")
        return

    segments_dir = talk_dir / "segments"
    segments_dir.mkdir(parents=True, exist_ok=True)

    # copie éventuelle de la photo intervenant
    if speaker_img.is_file():
        dest_pic = speakers_dir / f"{speaker_slug}{speaker_img.suffix.lower()}"
        if not dest_pic.exists():
            dest_pic.write_bytes(speaker_img.read_bytes())

    # ─── lecture de la play-list ───
    clips: List[Tuple[Path, Path]] = []
    for clip in safe_parse_xml(clips_xml).findall("Clip"):
        aud = folder / xml_val(clip, "Chemin").replace("/", os.sep)
        img = folder / xml_val(clip, "Diapo").replace("/", os.sep)
        if aud.is_file() and img.is_file():
            clips.append((aud, img))

    if not clips:
        log(log_box, f"⚠️  {folder.name}: no valid audio/slide pairs found")
        return

    log(log_box, f"▶︎  {title_raw}  ({len(clips)} segments)")
    prog.configure(maximum=len(clips), value=0)

    timestamps: List[Dict[str, float | str]] = []
    concat_entries: List[str] = []
    cumulative = 0.0
    # ─────────────────────────── boucle segments ───────────────────────────
    last_slide: Path | None = None

    for idx, (aud, img) in enumerate(
        sorted(clips, key=lambda x: int(AUDIO_PAT.search(x[0].name).group(1))), start=1
    ):
        # — slide => PNG | GIF animé —
        try:
            slide_path = ensure_slide(img, segments_dir, idx, last_slide)
            last_slide = slide_path
        except FileNotFoundError:
            # fallback sur la précédente ou sur un blanc
            if last_slide:
                log(log_box, f"⚠️  Slide manquante – on ré-utilise {last_slide.name}")
                slide_path = last_slide
            else:
                blank = segments_dir / "blank.png"
                if not blank.exists():
                    subprocess.run(
                        [FFMPEG, "-y", "-f", "lavfi", "-i", "color=white:s=1280x960",
                         "-frames:v", "1", str(blank)],
                        check=True,
                    )
                slide_path = blank
                last_slide = blank

        log(log_box, f"▶️  Generating segment {idx} for {speaker_name}…")
        seg_out = segments_dir / f"seg_{idx:03d}.mp4"

        # --- paramètres selon fixe / GIF animé ---
        slide_input = (
            ["-ignore_loop", "0", "-i", str(slide_path)]
            if is_gif(slide_path)
            else ["-loop", "1", "-i", str(slide_path)]
        )

        # --- encodage du segment ---
        audio_dur = get_duration(aud)  # ← durée fiable même si ffmpeg “grogne”
        subprocess.run(
            [
                FFMPEG, "-y", "-loglevel", "error",
                *slide_input,
                "-i", str(aud),
                "-t", f"{audio_dur:.3f}",        # ← on borne la vidéo
                "-vf", "scale=ceil(iw/2)*2:ceil(ih/2)*2",
                "-c:v", "libx264", "-pix_fmt", "yuv420p",
                "-c:a", "aac", "-b:a", "192k",
                str(seg_out),
            ],
            check=True,
        )

        # --- timecodes & concat ---
        dur = get_duration(aud)
        timestamps.append({"slide": seg_out.name, "start": cumulative, "duration": dur})
        cumulative += dur
        concat_entries.append(f"file '{seg_out.name}'")

        prog.configure(value=idx)
        log_box.update_idletasks()

    # ───────────── concat et JSON ─────────────
    if not concat_entries:
        log(log_box, f"⚠️  {folder.name}: no usable segments → aborted")
        return

    concat_file = segments_dir / "concat.txt"
    concat_file.write_text("\n".join(concat_entries), encoding="utf-8")

    subprocess.run(
        [FFMPEG, "-y", "-f", "concat", "-safe", "0",
         "-i", str(concat_file), "-c", "copy", str(final_mp4)],
        check=True,
    )

    (talk_dir / f"{final_basename}.json").write_text(
        html.unescape(
            "[\n  " + ",\n  ".join(
                f'{{\n    "slide": "{t["slide"]}",\n    "start": {t["start"]:.3f},\n    "duration": {t["duration"]:.3f}\n  }}'
                for t in timestamps
            ) + "\n]"
        ),
        encoding="utf-8",
    )

    log(log_box, f" ✅  {final_mp4.relative_to(output_root)}")
    prog.configure(value=0)


# ──────────────────────────── GUI part ──────────────────────────────
def choose_and_run(log_box: scrolledtext.ScrolledText, prog: ttk.Progressbar) -> None:
    root_win = log_box.winfo_toplevel()

    # 1) Programme JSON
    json_path = filedialog.askopenfilename(
        parent=root_win,
        title="Choose the programme JSON",
        filetypes=[("JSON", "*.json"), ("All files", "*")],
    )
    if not json_path:
        return
    program_index = load_program(Path(json_path))

    # 2) Dossier source (présentations brutes)
    root_dir = Path(
        filedialog.askdirectory(parent=root_win, title="Choose the congress ROOT folder")
    )
    if not root_dir:
        return

    # 3) Dossier de sortie
    output_root = Path(
        filedialog.askdirectory(parent=root_win, title="Choose OUTPUT folder")
    )
    if not output_root:
        return

    speakers_dir = output_root / "_speakers"
    speakers_dir.mkdir(exist_ok=True)

    # Scan des sous-dossiers
    talks: List[Dict[str, Path | str]] = []
    for d in root_dir.iterdir():
        if not d.is_dir() or not (d / "Clips.xml").is_file() or not (d / "Titre.xml").is_file():
            continue
        if not (d / "Clips.xml").is_file() or not (d / "Titre.xml").is_file():
            continue

        titre_root = safe_parse_xml(d / "Titre.xml")
        clip_node = titre_root.find("Clip") or titre_root
        speaker_raw = xml_val(clip_node, "nom").strip() or "Unknown"
        speaker = clean_speaker_name(speaker_raw)
        title = xml_val(clip_node, "titre").strip() or "Untitled"

        sp_slug = slugify(speaker)
        ti_slug = slugify(title)
        if (sp_slug, ti_slug) in program_index:
            session_raw, speaker_json, title_json = program_index[(sp_slug, ti_slug)]
        else:
            session_raw, speaker_json, title_json = ("Unsorted", speaker, title)
        talk_dir = output_root / session_raw / speaker_json
        final_basename = slugify(title_json)
        final_mp4 = talk_dir / f"{final_basename}.mp4"

        talks.append({"folder": d, "speaker": speaker, "title": title, "final": final_mp4})

    if not talks:
        messagebox.showwarning("Nothing found", "No talk detected inside this folder.")
        return

    # Fenêtre de sélection
    sel = tk.Toplevel(root_win)
    sel.title("Select the presentations to assemble")

    canvas = tk.Canvas(sel, borderwidth=0)
    frame = tk.Frame(canvas)
    vbar = tk.Scrollbar(sel, orient="vertical", command=canvas.yview)
    canvas.configure(yscrollcommand=vbar.set)

    vbar.pack(side="right", fill="y")
    canvas.pack(side="left", fill="both", expand=True)
    canvas.create_window((0, 0), window=frame, anchor="nw")
    frame.bind("<Configure>", lambda e: canvas.configure(scrollregion=canvas.bbox("all")))

    vars_by_folder: Dict[Path, tk.BooleanVar] = {}
    for t in sorted(talks, key=lambda x: (x["speaker"], x["title"])):
        checked = not t["final"].is_file()
        var = tk.BooleanVar(value=checked)
        label = f"{t['speaker']} — {t['title']}"
        if t["final"].is_file():
            label += "  (already assembled)"
        tk.Checkbutton(frame, text=label, variable=var, anchor="w", justify="left").pack(
            fill="x", padx=4
        )
        vars_by_folder[t["folder"]] = var

    btn_bar = tk.Frame(sel, pady=6)
    btn_bar.pack(fill="x")
    tk.Button(btn_bar, text="Select all", command=lambda: [v.set(True) for v in vars_by_folder.values()]).pack(
        side="left", padx=4
    )
    tk.Button(btn_bar, text="Select none", command=lambda: [v.set(False) for v in vars_by_folder.values()]).pack(
        side="left"
    )

    def launch() -> None:
        sel.destroy()
        to_process = [f for f, v in vars_by_folder.items() if v.get()]
        if not to_process:
            messagebox.showinfo("Nothing to do", "No presentation selected.")
            return

        def worker() -> None:
            log(log_box, f"📂  {len(to_process)} folder(s) selected → processing…")
            for d in to_process:
                assemble_talk(d, speakers_dir, output_root, program_index, log_box, prog)
            log(log_box, "🎉  All done.")

        threading.Thread(target=worker, daemon=True).start()

    tk.Button(btn_bar, text="Cancel", command=sel.destroy).pack(side="right", padx=4)
    tk.Button(btn_bar, text="OK", command=launch).pack(side="right", padx=4)


# ─────────────────────────────── main ───────────────────────────────
def main_gui() -> None:
    root = tk.Tk()
    root.title("AER Assembler – JSON mode")

    frm = tk.Frame(root, padx=10, pady=10)
    frm.pack(fill="both", expand=True)

    log_box = scrolledtext.ScrolledText(frm, width=100, height=30, state="disabled", font=("Consolas", 9))
    log_box.pack(fill="both", expand=True, pady=(0, 10))

    prog = ttk.Progressbar(frm, length=500, mode="determinate")
    prog.pack(pady=(0, 10))

    tk.Button(
        frm,
        text="Run assembler…",
        font=("Segoe UI", 12),
        command=lambda: choose_and_run(log_box, prog),
    ).pack()

    root.mainloop()


if __name__ == "__main__":
    try:
        subprocess.run([FFMPEG, "-version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        subprocess.run([FFPROBE, "-version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    except Exception:
        raise SystemExit("❌ ffmpeg / ffprobe not found in PATH.")

    main_gui()
