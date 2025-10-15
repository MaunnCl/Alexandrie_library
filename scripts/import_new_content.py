import argparse
import os
import re
import json
import requests
import subprocess
from difflib import SequenceMatcher
from moviepy.editor import ImageClip, AudioFileClip, concatenate_videoclips

# Configuration
API_BASE_URL = "http://localhost:8080/api"
CONGRESS_NAME = "ISICEM_2007"  # À modifier selon tes besoins
SESSION_NAME = "30"  # À modifier selon tes besoins
SESSION_ID = 334  # À modifier selon tes besoins

def similarity(a, b):
    """Calcule la similarité entre deux chaînes (0-1)"""
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

def get_user_input():
    """Demande les informations utilisateur dans le terminal"""
    print("\n=== Informations du contenu ===")
    orator_name = input("Nom de l'orateur : ").strip()
    city = input("Ville : ").strip()
    country = input("Pays : ").strip()
    content_name = input("Nom du contenu : ").strip()
    
    return {
        "orator_name": orator_name,
        "city": city,
        "country": country,
        "content_name": content_name
    }

def get_all_orators():
    """Récupère tous les orateurs via l'API"""
    try:
        response = requests.get(f"{API_BASE_URL}/orators")
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"❌ Erreur lors de la récupération des orateurs: {e}")
        return []

def find_similar_orator(orator_name, orators_list, threshold=0.8):
    """Trouve un orateur similaire dans la liste avec confirmation utilisateur"""
    for orator in orators_list:
        similarity_score = similarity(orator_name, orator["name"])
        if similarity_score >= threshold:
            print(f"\n🔍 Orateur similaire trouvé:")
            print(f"   Nom recherché: {orator_name}")
            print(f"   Nom trouvé: {orator['name']}")
            print(f"   Ville: {orator.get('city', 'Non spécifiée')}")
            print(f"   Pays: {orator.get('country', 'Non spécifié')}")
            print(f"   Similarité: {similarity_score:.2f}")
            
            confirm = input("\n❓ S'agit-il du même orateur ? (o/n): ").strip().lower()
            if confirm in ['o', 'oui', 'y', 'yes']:
                print(f"✅ Orateur confirmé: {orator['name']}")
                return orator
            else:
                print("❌ Orateur rejeté, recherche d'autres correspondances...")
                continue
    return None

def create_orator(orator_data):
    """Crée un nouvel orateur"""
    payload = {
        "name": orator_data["orator_name"],
        "picture": "",
        "content_ids": [],
        "country": orator_data["country"],
        "city": orator_data["city"]
    }
    
    try:
        response = requests.post(f"{API_BASE_URL}/orators", json=payload)
        response.raise_for_status()
        new_orator = response.json()
        print(f"✅ Nouvel orateur créé: {new_orator['name']} (ID: {new_orator['id']})")
        return new_orator
    except requests.RequestException as e:
        print(f"❌ Erreur lors de la création de l'orateur: {e}")
        return None

def create_content(content_name, orator_id):
    """Crée un nouveau contenu"""
    payload = {
        "title": content_name,
        "orator_id": orator_id,
        "description": "",
        "url": ""
    }
    
    try:
        response = requests.post(f"{API_BASE_URL}/contents", json=payload)
        response.raise_for_status()
        new_content = response.json()
        print(f"✅ Nouveau contenu créé: {new_content['title']} (ID: {new_content['id']})")
        return new_content
    except requests.RequestException as e:
        print(f"❌ Erreur lors de la création du contenu: {e}")
        return None

def add_content_to_session(session_id, content_id):
    """Ajoute un contenu à une session"""
    try:
        response = requests.patch(f"{API_BASE_URL}/sessions/{session_id}/add/{content_id}")
        response.raise_for_status()
        print(f"✅ Contenu {content_id} ajouté à la session {session_id}")
        return True
    except requests.RequestException as e:
        print(f"❌ Erreur lors de l'ajout du contenu à la session: {e}")
        return False

def sanitize_filename(filename):
    """Remplace les espaces par des underscores et nettoie le nom de fichier"""
    return filename.replace(" ", "_").replace("/", "_").replace("\\", "_")

def file_exists_on_s3(s3_path):
    """Vérifie si un fichier existe sur S3"""
    try:
        result = subprocess.run(
            ["aws", "s3", "ls", s3_path], 
            capture_output=True, 
            text=True, 
            check=False
        )
        return result.returncode == 0 and result.stdout.strip()
    except Exception:
        return False

def upload_files_to_s3(mp4_file, json_file, orator_name):
    """Upload les fichiers MP4 et JSON vers S3"""
    if not os.path.exists(mp4_file) or not os.path.exists(json_file):
        print("❌ Fichiers MP4 ou JSON introuvables pour l'upload")
        return False
    
    # Construction du chemin S3
    s3_folder = f"s3://greatalexandria/{CONGRESS_NAME}/{SESSION_NAME}/{orator_name}/"
    
    print(f"\n📤 Upload vers S3 : {s3_folder}")
    
    uploaded_count = 0
    skipped_count = 0
    
    files_to_upload = [mp4_file, json_file]
    
    for local_file in files_to_upload:
        filename = os.path.basename(local_file)
        s3_file_path = s3_folder + filename
        
        # Vérifie si le fichier existe déjà sur S3
        if file_exists_on_s3(s3_file_path):
            print(f"⚠️ Fichier déjà existant, ignoré : {s3_file_path}")
            skipped_count += 1
            continue
        
        # Upload le fichier
        cmd = ["aws", "s3", "cp", local_file, s3_file_path]
        try:
            print(f"📤 Upload : {filename}")
            subprocess.run(cmd, check=True, capture_output=True)
            print(f"✅ Uploadé : {s3_file_path}")
            uploaded_count += 1
        except subprocess.CalledProcessError as e:
            print(f"❌ Erreur upload {filename}: {e}")
            return False
    
    print(f"\n🎉 Upload S3 terminé !")
    print(f"📊 {uploaded_count} fichiers uploadés")
    print(f"⚠️ {skipped_count} fichiers ignorés (déjà existants)")
    return True

def process_content_creation():
    """Processus complet de création/récupération d'orateur et de contenu"""
    print(f"\n🏛️ Congrès: {CONGRESS_NAME}")
    print(f"📋 Session: {SESSION_NAME}")
    print(f"🆔 Session ID: {SESSION_ID}")
    
    # Récupération des informations utilisateur
    user_data = get_user_input()
    
    # Récupération de tous les orateurs
    print("\n📥 Récupération des orateurs...")
    orators = get_all_orators()
    if not orators:
        print("❌ Impossible de récupérer la liste des orateurs")
        return None, None
    
    # Recherche d'un orateur similaire
    existing_orator = find_similar_orator(user_data["orator_name"], orators)
    
    if existing_orator:
        # Cas 1: Orateur existant
        print(f"👤 Utilisation de l'orateur existant: {existing_orator['name']}")
        orator_id = existing_orator["id"]
        orator_name = existing_orator["name"]
    else:
        # Cas 2: Création d'un nouvel orateur
        print(f"👤 Aucun orateur similaire trouvé ou confirmé.")
        print(f"👤 Création d'un nouvel orateur: {user_data['orator_name']}")
        new_orator = create_orator(user_data)
        if not new_orator:
            print("❌ Échec de la création de l'orateur")
            return None, None
        orator_id = new_orator["id"]
        orator_name = new_orator["name"]
    
    # Création du contenu
    print(f"\n📄 Création du contenu: {user_data['content_name']}")
    content = create_content(user_data["content_name"], orator_id)
    if not content:
        print("❌ Échec de la création du contenu")
        return None, None
    
    # Ajout du contenu à la session
    print(f"\n🔗 Ajout du contenu à la session")
    success = add_content_to_session(SESSION_ID, content["id"])
    
    if success:
        print(f"\n🎉 Processus terminé avec succès!")
        print(f"📊 Résumé:")
        print(f"   - Orateur: {orator_name} (ID: {orator_id})")
        print(f"   - Contenu: {user_data['content_name']} (ID: {content['id']})")
        print(f"   - Session: {SESSION_ID}")
        return user_data["content_name"], orator_name  # Retourne le nom du contenu et de l'orateur
    else:
        print("❌ Échec de l'ajout du contenu à la session")
        return None, None

def extract_number(filename):
    """Extrait le premier nombre trouvé dans un nom de fichier."""
    match = re.search(r'(\d+)', filename)
    return int(match.group(1)) if match else None

def handle_single(folder, content_name=None, orator_name=None):
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
    
    # Utilise le nom du contenu pour les fichiers de sortie
    if content_name:
        filename = sanitize_filename(content_name)
        out_path = os.path.join(folder, f"{filename}.mp4")
        json_path_out = os.path.join(folder, f"{filename}.json")
    else:
        out_path = os.path.join(folder, "output_single.mp4")
        json_path_out = os.path.join(folder, "output_single.json")
    
    final.write_videofile(out_path, fps=24)

    # Sauvegarde le JSON
    with open(json_path_out, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    print(f"✅ Vidéo générée : {out_path}")
    print(f"✅ JSON généré : {json_path_out}")
    
    # Upload vers S3 si on a les informations
    if orator_name:
        upload_files_to_s3(out_path, json_path_out, orator_name)
    
    return out_path, json_path_out

def handle_multiple(folder, content_name=None, orator_name=None):
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
    
    # Utilise le nom du contenu pour les fichiers de sortie
    if content_name:
        filename = sanitize_filename(content_name)
        out_path = os.path.join(folder, f"{filename}.mp4")
        json_path = os.path.join(folder, f"{filename}.json")
    else:
        out_path = os.path.join(folder, "output_multiple.mp4")
        json_path = os.path.join(folder, "output_multiple.json")
    
    final.write_videofile(out_path, fps=24)

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    print(f"✅ Vidéo générée : {out_path}")
    print(f"✅ JSON généré : {json_path}")
    
    # Upload vers S3 si on a les informations
    if orator_name:
        upload_files_to_s3(out_path, json_path, orator_name)
    
    return out_path, json_path

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Assembleur vidéo à partir d'images, sons et timings")
    parser.add_argument("--single", type=str, help="Mode single : dossier contenant audio + images + JSON de timings")
    parser.add_argument("--multiple", type=str, help="Mode multiple : dossier contenant x audio/vidéo + x images")
    parser.add_argument("--create-content", action="store_true", help="Mode création de contenu via API")
    parser.add_argument("--with-content", action="store_true", help="Crée le contenu via API puis génère la vidéo")

    args = parser.parse_args()

    if args.create_content:
        process_content_creation()
    elif args.with_content:
        # Mode combiné : création de contenu + génération vidéo + upload S3
        content_name, orator_name = process_content_creation()
        if content_name and orator_name:
            folder = input("\n📁 Chemin du dossier contenant les fichiers (audio/images/JSON) : ").strip()
            if os.path.exists(folder):
                mode = input("Mode de traitement (single/multiple) : ").strip().lower()
                if mode == "single":
                    handle_single(folder, content_name, orator_name)
                elif mode == "multiple":
                    handle_multiple(folder, content_name, orator_name)
                else:
                    print("❌ Mode invalide. Utilise 'single' ou 'multiple'")
            else:
                print("❌ Dossier introuvable")
    elif args.single:
        handle_single(args.single)
    elif args.multiple:
        handle_multiple(args.multiple)
    else:
        print("⚠️ Utilise --single <dossier>, --multiple <dossier>, --create-content ou --with-content")