import os
import xml.etree.ElementTree as ET
import json
import re
from pathlib import Path

# 📁 Dossier racine
root_dir = Path("D:/Maunn/Online JAVA 2012/JAVAi")
output_json = {}

# 🔧 Nettoyage du nom
def clean_speaker_name(name: str) -> str:
    titles_to_remove = ["Dr", "Prof", "Mr", "Mrs", "Ms", "M.", "Mme", "Mlle", "Pr"]
    for title in titles_to_remove:
        name = re.sub(rf"\b{title}\b\.?", "", name, flags=re.IGNORECASE)
    name = re.sub(r"[^a-zA-ZÀ-ÿ\s]", "", name)
    name = re.sub(r"\s+", " ", name)
    return name.strip().title()

# 🔧 Nettoyage du titre
def clean_title(title: str) -> str:
    return (
        title.replace("?", "")
        .replace("!", "")
        .replace("'", "")
        .replace(":", "")
        .replace("(", "")
        .replace(")", "")
        .replace(",", "")
        .replace(".", "")
        .replace(" ", "_")
        .strip("_")
    )

# 🔍 Vérifie si les sous-dossiers sont numériques
subdirs = [d for d in root_dir.iterdir() if d.is_dir()]
has_numeric_subdirs = all(d.name[:2].isdigit() for d in subdirs)

if has_numeric_subdirs:
    for day_folder in sorted(subdirs):
        day_key = day_folder.name[:2]
        output_json[day_key] = {}

        for speaker_folder in sorted(day_folder.iterdir()):
            titre_path = speaker_folder / "Titre.xml"
            if not titre_path.exists():
                continue

            try:
                with open(titre_path, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read().replace("UFT-8", "UTF-8")
                with open(titre_path, "w", encoding="utf-8") as f:
                    f.write(content)

                tree = ET.parse(titre_path)
                root = tree.getroot()
                clip = root.find("Clip")
                if clip is None:
                    continue

                raw_name = clip.find("nom").attrib.get("value", "").strip()
                raw_title = clip.find("titre").attrib.get("value", "").strip()
                if not raw_name or not raw_title:
                    continue

                speaker_clean = clean_speaker_name(raw_name)
                title_clean = clean_title(raw_title)

                output_json[day_key].setdefault(speaker_clean, []).append(title_clean)

            except Exception as e:
                print(f"Erreur avec {titre_path}: {e}")

else:
    output_json["01"] = {}

    for speaker_folder in sorted(subdirs):
        titre_path = speaker_folder / "Titre.xml"
        if not titre_path.exists():
            continue

        try:
            with open(titre_path, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read().replace("UFT-8", "UTF-8")
            with open(titre_path, "w", encoding="utf-8") as f:
                f.write(content)

            tree = ET.parse(titre_path)
            root = tree.getroot()
            clip = root.find("Clip")
            if clip is None:
                continue

            raw_name = clip.find("nom").attrib.get("value", "").strip()
            raw_title = clip.find("titre").attrib.get("value", "").strip()
            if not raw_name or not raw_title:
                continue

            speaker_clean = clean_speaker_name(raw_name)
            title_clean = clean_title(raw_title)

            output_json["01"].setdefault(speaker_clean, []).append(title_clean)

        except Exception as e:
            print(f"Erreur avec {titre_path}: {e}")

# Nettoyage final (tri et suppression doublons)
for day in output_json:
    for speaker in output_json[day]:
        output_json[day][speaker] = sorted(list(set(output_json[day][speaker])))

# Sauvegarde
with open("programme_javai_2012.json", "w", encoding="utf-8") as f:
    json.dump(output_json, f, indent=2, ensure_ascii=False)

print("✅ JSON généré dans 'programme_javai_2012.json'")
