import os
import re
from tkinter import filedialog, Tk

def nettoyer_espaces_dossiers(dossier_parent):
    for nom in os.listdir(dossier_parent):
        ancien_chemin = os.path.join(dossier_parent, nom)
        if os.path.isdir(ancien_chemin):
            nouveau_nom = re.sub(r"\s{2,}", " ", nom)
            nouveau_chemin = os.path.join(dossier_parent, nouveau_nom)

            if ancien_chemin != nouveau_chemin:
                if os.path.exists(nouveau_chemin):
                    print(f"⚠️ {nouveau_chemin} existe déjà, ignoré")
                else:
                    print(f"🔁 {nom} → {nouveau_nom}")
                    os.rename(ancien_chemin, nouveau_chemin)

if __name__ == "__main__":
    # Ouvre un sélecteur de dossier
    root = Tk()
    root.withdraw()
    dossier = filedialog.askdirectory(title="Choisis le dossier parent (ex: 20)")
    
    if dossier:
        nettoyer_espaces_dossiers(dossier)
    else:
        print("Aucun dossier sélectionné.")
