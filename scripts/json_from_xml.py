from lxml import etree
import json
import sys
from pathlib import Path

# === Vérification argument ===
if len(sys.argv) != 2:
    print("Usage : python json_from_xml.py <fichier.xml>")
    sys.exit(1)

xml_path = Path(sys.argv[1])

if not xml_path.exists():
    print("❌ Fichier XML introuvable")
    sys.exit(1)

# === Parsing XML en mode recovery ===
parser = etree.XMLParser(recover=True)
tree = etree.parse(str(xml_path), parser)
root = tree.getroot()

toc_info = root.find(".//tocInfo")
if toc_info is None:
    print("❌ Balise <tocInfo> introuvable")
    sys.exit(1)

nodes = toc_info.findall("node")
times = [float(node.attrib["time"]) for node in nodes]

# === Nom du fichier de sortie ===
base_name = input("Nom du fichier de sortie : ").strip().replace(" ", "_")
output_path = xml_path.parent / f"{base_name}.json"

# === Génération JSON ===
slides = []

for i in range(len(times)):
    start = times[i]
    if i < len(times) - 1:
        duration = round(times[i + 1] - start, 2)
    else:
        duration = 0.0

    slides.append({
        "slide": f"seg_{i:03d}.mp4",
        "start": round(start, 2),
        "duration": duration
    })

# === Écriture fichier ===
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(slides, f, indent=2)

print(f"✅ JSON généré : {output_path}")
