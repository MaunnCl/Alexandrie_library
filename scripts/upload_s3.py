import os
import boto3
import threading
import tkinter as tk
from tkinter import filedialog, scrolledtext

# Configuration AWS brute
BUCKET_NAME = "greatalexandria"
REGION = "eu-north-1"
ACCESS_KEY = "AKIAUPMYNGMYVTD2Q274"
SECRET_KEY = "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"

# Connexion client S3
s3 = boto3.client(
    "s3",
    region_name=REGION,
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_KEY
)

def upload_folder(local_root, log_box, s3_prefix):
    for root, dirs, files in os.walk(local_root):
        dirs[:] = [d for d in dirs if d not in ("segments", "_speakers")]

        for file in files:
            full_path = os.path.join(root, file)
            relative_path = os.path.relpath(full_path, local_root)

            if "_speakers" in root:
                s3_key = f"orators/{file}"
            else:
                clean_relative_path = relative_path.replace("\\", "/")
                s3_key = f"{s3_prefix}{clean_relative_path}"

            log_box.insert(tk.END, f"📤 Uploading {s3_key}...\n")
            log_box.yview_moveto(1.0)
            try:
                s3.upload_file(full_path, BUCKET_NAME, s3_key)
            except Exception as e:
                log_box.insert(tk.END, f"❌ Failed: {e}\n")
                log_box.yview_moveto(1.0)

    log_box.insert(tk.END, "✅ Upload terminé.\n")
    log_box.yview_moveto(1.0)

def start_upload(log_box, prefix_entry):
    folder = filedialog.askdirectory(title="Choisis un dossier à uploader")
    if not folder:
        return

    s3_prefix = prefix_entry.get().strip()
    if not s3_prefix:
        # Utilise le nom du dossier sélectionné comme fallback
        s3_prefix = os.path.basename(folder.rstrip("/\\")) + "/"
    elif not s3_prefix.endswith("/"):
        s3_prefix += "/"

    log_box.insert(tk.END, f"📁 Dossier sélectionné : {folder}\n")
    log_box.insert(tk.END, f"📦 Préfixe S3 : {s3_prefix}\n\n")

    threading.Thread(
        target=upload_folder,
        args=(folder, log_box, s3_prefix),
        daemon=True
    ).start()

# Interface Tkinter
def main_gui():
    window = tk.Tk()
    window.title("Uploader vers S3 – greatalexandria")
    window.geometry("700x520")

    tk.Label(window, text="Uploader vers AWS S3 (greatalexandria)", font=("Segoe UI", 14)).pack(pady=10)

    tk.Label(window, text="📂 Préfixe (dossier cible dans S3) :", font=("Segoe UI", 11)).pack()
    prefix_entry = tk.Entry(window, font=("Segoe UI", 11), width=60)
    prefix_entry.pack(pady=5)
    prefix_entry.insert(0, "")  # Préfixe vide par défaut

    tk.Button(
        window,
        text="🚀 Choisir un dossier et lancer l'upload",
        command=lambda: start_upload(log_box, prefix_entry),
        font=("Segoe UI", 12)
    ).pack(pady=5)

    log_box = scrolledtext.ScrolledText(window, wrap=tk.WORD, width=90, height=25)
    log_box.pack(padx=10, pady=10)

    window.mainloop()

if __name__ == "__main__":
    main_gui()
