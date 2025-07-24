import os
import re

def rename_files_in_folder(folder_path):
    for filename in os.listdir(folder_path):
        full_path = os.path.join(folder_path, filename)
        if not os.path.isfile(full_path):
            continue

        # Sépare nom et extension
        name, ext = os.path.splitext(filename)

        # Supprime le(s) prénom(s) au début du nom, avec ou sans initiale
        # Garde uniquement le dernier mot (le nom de famille)
        parts = name.split('_')
        if len(parts) > 1:
            last_name = parts[-1]
        else:
            last_name = name  # aucun "_" trouvé, on ne change rien

        new_name = f"{last_name}{ext}"
        new_path = os.path.join(folder_path, new_name)

        # Évite d’écraser un fichier déjà existant
        if new_name != filename:
            if os.path.exists(new_path):
                print(f"⚠️  {new_name} existe déjà → ignoré")
                continue
            print(f"🔁 {filename} → {new_name}")
            os.rename(full_path, new_path)

if __name__ == "__main__":
    import tkinter as tk
    from tkinter import filedialog

    root = tk.Tk()
    root.withdraw()

    folder = filedialog.askdirectory(title="Choisis le dossier avec les images à renommer")
    if folder:
        rename_files_in_folder(folder)
        print("✅ Tous les fichiers ont été renommés.")
    else:
        print("❌ Aucun dossier sélectionné.")
