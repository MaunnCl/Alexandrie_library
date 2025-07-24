import os
import subprocess
import shutil
import tkinter as tk
from tkinter import filedialog, messagebox

def convertir_dxr():
    dossier = filedialog.askdirectory(title="Sélectionnez le dossier contenant les fichiers DXR")
    if not dossier:
        return

    exe_path = os.path.abspath("projectorrays-0.2.0.exe")
    if not os.path.isfile(exe_path):
        messagebox.showerror("Erreur", f"Le fichier {exe_path} est introuvable.")
        return

    output_dir = os.path.join(dossier, "dir")
    os.makedirs(output_dir, exist_ok=True)

    dxr_files = [f for f in os.listdir(dossier) if f.lower().endswith(".dxr")]
    if not dxr_files:
        messagebox.showinfo("Info", "Aucun fichier DXR trouvé dans ce dossier.")
        return

    for dxr in dxr_files:
        dxr_path = os.path.join(dossier, dxr)
        try:
            subprocess.run([exe_path, dxr_path], check=True)
        except subprocess.CalledProcessError as e:
            messagebox.showerror("Erreur", f"Erreur lors de la conversion de {dxr}: {e}")
            continue

    # Déplacer tous les .dir générés dans le dossier "dir"
    for f in os.listdir(dossier):
        if f.lower().endswith(".dir"):
            shutil.move(os.path.join(dossier, f), os.path.join(output_dir, f))

    messagebox.showinfo("Terminé", f"Conversion terminée. Fichiers .dir rangés dans {output_dir}")

root = tk.Tk()
root.title("Convertisseur DXR → DIR")

frame = tk.Frame(root, padx=20, pady=20)
frame.pack()

label = tk.Label(frame, text="Cliquez sur le bouton pour convertir les DXR")
label.pack(pady=10)

btn = tk.Button(frame, text="Choisir un dossier et convertir", command=convertir_dxr)
btn.pack(pady=10)

root.mainloop()
