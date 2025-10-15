import argparse
import os
import re
import json
from moviepy.editor import ImageClip, AudioFileClip, concatenate_videoclips


def extract_number(filename):
    """Extrait le premier nombre trouvé dans un nom de fichier."""
    match = re.search(r'(\d+)', filename)
    return int(match.group(1)) if match else None


def handle_single(folder):
    """Mode single: une audio + plusieurs images avec JSON de timings"""
    # Cherche l'audio (mp3 ou mp4)
    audio_files = [f for f in os.listdir(folder) if f.lower().endswith((".mp3", ".mp4"))]
    if not audio_files:
        raise ValueError("Aucun fichier audio trouvé dans le dossier.")
    audio_path = os.path.join(folder, audio_files[0])
    audio = AudioFileClip(audio_path)

    # Cherche le JSON (start times)
    json_files = [f for f in os.listdir(folder) if f.lower().endswith(".json")]
    if not json_files:
        raise ValueError("Aucun fichier JSON trouvé dans le dossier.")
    json_path = os.path.join(folder, json_files[0])
    with open(json_path, "r", encoding="utf-8") as f:
        starts = json.load(f)  # [{ "start": 0 }, { "start": 10 }, ...]

    # Cherche les images et les trie par numéro croissant
    images = [f for f in os.listdir(folder) if f.lower().endswith((".png", ".jpg", ".jpeg"))]
    # Crée une liste de tuples (numéro, nom_fichier) et trie par numéro
    image_list = [(extract_number(img), img) for img in images if extract_number(img) is not None]
    image_list.sort(key=lambda x: x[0])  # Trie par numéro croissant
    
    # Vérifie que le nombre d'images correspond au nombre d'entrées JSON
    if len(image_list) != len(starts):
        print(f"Warning: {len(image_list)} images trouvées, mais {len(starts)} entrées dans le JSON")
        min_count = min(len(image_list), len(starts))
        image_list = image_list[:min_count]
        starts = starts[:min_count]

    clips = []
    metadata = []
    print("starts:", starts)
    
    for i, (img_number, img_filename) in enumerate(image_list):
        img_path = os.path.join(folder, img_filename)
        entry = starts[i]
        
        print(f"Traitement: {img_filename} (numéro {img_number}) -> timer index {i}")

        if "start" in entry:  # si c'est l'ancien format en secondes
            start = entry["start"]
        elif "min" in entry and "sec" in entry:  # nouveau format min/sec
            start = entry["min"] * 60 + entry["sec"]
        else:
            raise ValueError("Format de JSON inconnu, attend 'start' ou 'min'/'sec'")
            
        if i < len(starts) - 1:
            next_entry = starts[i+1]
            if "start" in next_entry:
                end = next_entry["start"]
            elif "min" in next_entry and "sec" in next_entry:
                end = next_entry["min"] * 60 + next_entry["sec"]
            else:
                raise ValueError("Format de JSON inconnu pour end")
        else:
            end = audio.duration
            
        print(start, end)
        duration = end - start
        print(duration)
        clip = ImageClip(img_path).set_duration(duration)
        clips.append(clip)

        metadata.append({
            "slide": f"seg_{i:03d}.mp4",
            "start": round(start, 3),
            "duration": round(duration, 3)
        })

    video = concatenate_videoclips(clips, method="compose")
    final = video.set_audio(audio)
    out_path = os.path.join(folder, "output_single.mp4")
    final.write_videofile(out_path, fps=24)

    # Sauvegarde le JSON
    json_path_out = os.path.join(folder, "output_single.json")
    with open(json_path_out, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    print(f"✅ Vidéo générée : {out_path}")
    print(f"✅ JSON généré : {json_path_out}")


def handle_multiple(folder):
    """Mode multiple: plusieurs fichiers audio (mp3 ou mp4) + images"""
    media_files = [f for f in os.listdir(folder) if f.lower().endswith((".mp3", ".mp4"))]
    image_files = [f for f in os.listdir(folder) if f.lower().endswith((".png", ".jpg", ".jpeg"))]

    media_map = {extract_number(f): f for f in media_files if extract_number(f) is not None}
    image_map = {extract_number(f): f for f in image_files if extract_number(f) is not None}

    clips = []
    metadata = []
    current_time = 0.0

    for num in sorted(media_map.keys()):
        media_file = media_map[num]
        media_path = os.path.join(folder, media_file)

        if num not in image_map:
            raise ValueError(f"Pas d'image correspondante trouvée pour {media_file}")
        img_path = os.path.join(folder, image_map[num])

        # On prend uniquement l'audio
        audio = AudioFileClip(media_path)
        clip = ImageClip(img_path).set_duration(audio.duration).set_audio(audio)
        clips.append(clip)

        metadata.append({
            "slide": f"seg_{num:03d}.mp4",
            "start": round(current_time, 3),
            "duration": round(clip.duration, 3)
        })
        current_time += clip.duration

    final = concatenate_videoclips(clips, method="compose")
    out_path = os.path.join(folder, "output_multiple.mp4")
    final.write_videofile(out_path, fps=24)

    json_path = os.path.join(folder, "output_multiple.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    print(f"✅ Vidéo générée : {out_path}")
    print(f"✅ JSON généré : {json_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Assembleur vidéo à partir d'images, sons et timings")
    parser.add_argument("--single", type=str, help="Mode single : dossier contenant audio + images + JSON de timings")
    parser.add_argument("--multiple", type=str, help="Mode multiple : dossier contenant x audio/vidéo + x images")

    args = parser.parse_args()

    if args.single:
        handle_single(args.single)
    elif args.multiple:
        handle_multiple(args.multiple)
    else:
        print("⚠️ Utilise --single <dossier> ou --multiple <dossier>")