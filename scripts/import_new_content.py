import argparse
import os
import re
import json
import requests
import subprocess
from difflib import SequenceMatcher
from moviepy.editor import ImageClip, AudioFileClip, concatenate_videoclips
from PIL import Image

# Configuration
API_BASE_URL = "http://localhost:8080/api"
CONGRESS_NAME = "JAVA_2006"  # À modifier selon tes besoins
SESSION_NAME = "VNI"  # À modifier selon tes besoins
SESSION_ID = 408  # À modifier selon tes besoins

def similarity(a, b):
    """Calcule la similarité entre deux chaînes (0-1)"""
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

def extract_last_name(full_name):
    """
    Extrait le nom de famille d'un nom complet
    Gère les formats: "Prénom Nom", "P. Nom", "P. Q. Nom", etc.
    Le nom de famille est le dernier mot qui n'est pas une initiale
    """
    parts = full_name.strip().split()
    if not parts:
        return ""
    
    # Parcourir de la fin vers le début pour trouver le premier mot qui n'est pas une initiale
    for i in range(len(parts) - 1, -1, -1):
        word = parts[i]
        # Un mot n'est pas une initiale s'il fait plus de 2 caractères OU s'il ne contient pas de point
        if len(word) > 2 or (len(word) == 2 and '.' not in word) or len(word.replace('.', '')) > 1:
            return word
    
    # Si tous les mots sont des initiales, prendre le dernier
    return parts[-1]

def extract_initials(full_name):
    """
    Extrait toutes les initiales d'un nom
    Ex: "N.S. Hill" -> ['N', 'S']
    Ex: "Nicholas S. Hill" -> ['N', 'S']
    Ex: "Nicholas Stephen Hill" -> ['N', 'S']
    """
    parts = full_name.strip().split()
    initials = []
    
    for part in parts[:-1]:  # Tous les mots sauf le dernier (nom de famille)
        # Si c'est une initiale (1-2 caractères avec ou sans point)
        if len(part) <= 2 or (len(part) == 3 and part.endswith('.')):
            initial = part[0].upper()
            initials.append(initial)
        # Si c'est un prénom complet, prendre la première lettre
        elif len(part) > 2:
            initials.append(part[0].upper())
    
    return initials

def names_match(input_name, db_name, threshold=0.85):
    """
    Compare deux noms en mettant l'accent sur le nom de famille
    Gère les initiales multiples (ex: "N.S. Hill" vs "Nicholas S. Hill")
    
    Args:
        input_name: Nom entré par l'utilisateur (ex: "N.S. Hill")
        db_name: Nom dans la DB (ex: "Nicholas S. Hill")
        threshold: Seuil de similarité (0-1)
    
    Returns:
        tuple: (match: bool, score: float, match_type: str)
    """
    input_name = input_name.strip()
    db_name = db_name.strip()
    
    # Extraction des noms de famille
    input_last = extract_last_name(input_name)
    db_last = extract_last_name(db_name)

    # Si les noms de famille sont vides, on ne peut pas comparer
    if not input_last or not db_last:
        return False, 0.0, "invalid"

    # 1. Test exact sur le nom de famille (insensible à la casse)
    if input_last.lower() == db_last.lower():
        # Cas 1a: Noms complets identiques
        if input_name.lower() == db_name.lower():
            return True, 1.0, "exact_match"
        
        # Cas 1b: Nom de famille identique + initiales correspondantes
        input_initials = extract_initials(input_name)
        db_initials = extract_initials(db_name)
        
        # Vérifier si toutes les initiales correspondent
        if input_initials and db_initials:
            # Comparer jusqu'au nombre minimum d'initiales
            min_length = min(len(input_initials), len(db_initials))
            
            if min_length > 0:
                matches = sum(1 for i in range(min_length) if input_initials[i] == db_initials[i])
                
                # Si toutes les initiales comparées correspondent
                if matches == min_length:
                    # Score selon le nombre d'initiales correspondantes
                    if len(input_initials) == len(db_initials) and matches == len(input_initials):
                        return True, 0.95, "lastname_initials_match"
                    else:
                        return True, 0.90, "lastname_partial_initials_match"
        
        # Cas 1c: Même nom de famille, mais prénom/initiales différents
        return True, 0.80, "lastname_only_match"
    
    # 2. Test de similarité sur le nom de famille
    lastname_similarity = similarity(input_last, db_last)
    
    if lastname_similarity >= threshold:
        # Vérifier aussi les initiales/prénoms si disponibles
        input_initials = extract_initials(input_name)
        db_initials = extract_initials(db_name)
        
        if input_initials and db_initials:
            min_length = min(len(input_initials), len(db_initials))
            if min_length > 0:
                matches = sum(1 for i in range(min_length) if input_initials[i] == db_initials[i])
                initial_match_ratio = matches / min_length
                
                # Score pondéré: 70% nom de famille, 30% initiales
                combined_score = lastname_similarity * 0.7 + initial_match_ratio * 0.3
                
                if combined_score >= threshold:
                    return True, combined_score, "fuzzy_match"
        
        return True, lastname_similarity, "lastname_fuzzy_match"
    
    # 3. Aucune correspondance
    return False, 0.0, "no_match"

def find_similar_orator(orator_name, orators_list, threshold=0.85):
    """Trouve un orateur similaire en se basant principalement sur le nom de famille"""
    matches = []
    
    # Parcourir tous les orateurs et calculer les scores
    for orator in orators_list:
        is_match, score, match_type = names_match(orator_name, orator["name"], threshold)
        
        if is_match:
            matches.append({
                "orator": orator,
                "score": score,
                "match_type": match_type
            })
    
    # Trier par score décroissant
    matches.sort(key=lambda x: x["score"], reverse=True)
    
    # Afficher tous les matchs trouvés
    if matches:
        print(f"\n🔍 {len(matches)} orateur(s) similaire(s) trouvé(s) pour '{orator_name}':")
        
        for idx, match in enumerate(matches, 1):
            orator = match["orator"]
            score = match["score"]
            match_type = match["match_type"]
            
            # Emoji selon le type de match
            emoji = {
                "exact_match": "✅",
                "lastname_initials_match": "🎯",
                "lastname_partial_initials_match": "🎯",
                "lastname_only_match": "👤",
                "fuzzy_match": "🔍",
                "lastname_fuzzy_match": "🔎"
            }.get(match_type, "❓")
            
            match_type_label = {
                "exact_match": "Correspondance exacte",
                "lastname_initials_match": "Nom + initiales",
                "lastname_partial_initials_match": "Nom + initiales partielles",
                "lastname_only_match": "Nom de famille uniquement",
                "fuzzy_match": "Correspondance approximative",
                "lastname_fuzzy_match": "Nom de famille approximatif"
            }.get(match_type, "Type inconnu")
            
            print(f"\n   {emoji} Match #{idx}: {orator['name']}")
            print(f"      ID: {orator['id']}")
            print(f"      Ville: {orator.get('city', 'Non spécifiée')}")
            print(f"      Pays: {orator.get('country', 'Non spécifié')}")
            print(f"      Type: {match_type_label}")
            print(f"      Score: {score:.2%}")
            
            confirm = input(f"\n   ❓ Est-ce le bon orateur ? (o/n/s pour suivant): ").strip().lower()
            
            if confirm in ['o', 'oui', 'y', 'yes']:
                print(f"   ✅ Orateur confirmé: {orator['name']}")
                return orator
            elif confirm in ['s', 'suivant', 'next']:
                continue
            else:
                print(f"   ❌ Orateur rejeté")
                continue
    
    print(f"\n❌ Aucun orateur correspondant trouvé ou confirmé pour '{orator_name}'")
    return None

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
        print(f"\n👤 Utilisation de l'orateur existant: {existing_orator['name']}")
        orator_id = existing_orator["id"]
        orator_name = existing_orator["name"]
    else:
        # Cas 2: Création d'un nouvel orateur
        print(f"\n👤 Création d'un nouvel orateur: {user_data['orator_name']}")
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
        return user_data["content_name"], orator_name
    else:
        print("❌ Échec de l'ajout du contenu à la session")
        return None, None

def extract_number(filename):
    """
    Extrait le numéro de séquence (supporte entiers et décimaux)
    
    Exemples:
        "01.jpg"     → 1.0
        "2.jpg"      → 2.0
        "2.1.jpg"    → 2.1
        "2.2.mp3"    → 2.2
        "10.5.jpg"   → 10.5
    """
    # Cherche un pattern: nombre optionnel + point + nombre
    # Exemple: "2.1" dans "slide_2.1.jpg"
    match = re.search(r'(\d+(?:\.\d+)?)', filename)
    
    if match:
        return float(match.group(1))
    return None

def convert_image_to_rgb(image_path):
    """
    Convertit une image en RGB si elle ne l'est pas déjà
    
    Args:
        image_path: Chemin de l'image source
    
    Returns:
        str: Chemin de l'image RGB (même fichier ou temporaire)
    """
    try:
        img = Image.open(image_path)
        
        # Si l'image est déjà en RGB, retourner le chemin original
        if img.mode == 'RGB':
            img.close()
            return image_path
        
        # Sinon, convertir en RGB
        print(f"      🔄 Conversion {img.mode} → RGB: {os.path.basename(image_path)}")
        rgb_img = img.convert('RGB')
        
        # Sauvegarder temporairement (ou écraser)
        temp_path = image_path.replace('.jpg', '_rgb.jpg').replace('.jpeg', '_rgb.jpeg').replace('.png', '_rgb.png')
        rgb_img.save(temp_path, quality=95)
        
        img.close()
        rgb_img.close()
        
        return temp_path
    
    except Exception as e:
        print(f"      ⚠️  Erreur conversion RGB: {e}")
        return image_path

def handle_single(folder, content_name=None, orator_name=None):
    """Mode single: une audio + plusieurs images avec JSON de timings"""
    # Cherche l'audio (mp3 ou mp4)
    audio_files = [f for f in os.listdir(folder) if f.lower().endswith((".mp3", ".mp4", ".mov"))]
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
        starts = json.load(f)

    # Cherche les images et les trie par numéro croissant
    images = [f for f in os.listdir(folder) if f.lower().endswith((".png", ".jpg", ".jpeg"))]
    image_list = [(extract_number(img), img) for img in images if extract_number(img) is not None]
    image_list.sort(key=lambda x: x[0])
    
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
        
        # 🔧 FIX: Convertir l'image en RGB si nécessaire
        rgb_img_path = convert_image_to_rgb(img_path)
        
        entry = starts[i]
        
        print(f"Traitement: {img_filename} (numéro {img_number}) -> timer index {i}")

        if "start" in entry:
            start = entry["start"]
        elif "min" in entry and "sec" in entry:
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
        
        # Utiliser le chemin RGB
        clip = ImageClip(rgb_img_path).set_duration(duration)
        clips.append(clip)

        metadata.append({
            "slide": f"seg_{i:03d}.mp4",
            "start": round(start, 3),
            "duration": round(duration, 3)
        })

    video = concatenate_videoclips(clips, method="compose")
    final = video.set_audio(audio)
    
    if content_name:
        filename = sanitize_filename(content_name)
        out_path = os.path.join(folder, f"{filename}.mp4")
        json_path_out = os.path.join(folder, f"{filename}.json")
    else:
        out_path = os.path.join(folder, "output_single.mp4")
        json_path_out = os.path.join(folder, "output_single.json")
    
    final.write_videofile(out_path, fps=24)

    with open(json_path_out, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    print(f"✅ Vidéo générée : {out_path}")
    print(f"✅ JSON généré : {json_path_out}")
    
    if orator_name:
        upload_files_to_s3(out_path, json_path_out, orator_name)
    
    return out_path, json_path_out

def handle_multiple(folder, content_name=None, orator_name=None):
    """Mode multiple: plusieurs fichiers audio (mp3, mp4 ou mov) + images"""
    media_files = [f for f in os.listdir(folder) if f.lower().endswith((".mp3", ".mp4", ".mov"))]
    image_files = [f for f in os.listdir(folder) if f.lower().endswith((".png", ".jpg", ".jpeg"))]

    print(f"\n📂 Scan du dossier: {folder}")
    print(f"🎵 {len(media_files)} fichiers audio détectés")
    print(f"📸 {len(image_files)} images détectées")

    # Extraction et tri des fichiers par numéro
    media_list = []
    for f in media_files:
        num = extract_number(f)
        if num is not None:
            media_list.append((num, f))
    media_list.sort(key=lambda x: x[0])
    
    image_list = []
    for f in image_files:
        num = extract_number(f)
        if num is not None:
            image_list.append((num, f))
    image_list.sort(key=lambda x: x[0])

    # 🔍 DEBUG: Afficher les listes triées
    print(f"\n🔢 Fichiers audio triés (par ordre):")
    for idx, (num, filename) in enumerate(media_list, 1):
        print(f"   Position {idx}: {filename} (numéro {num})")
    
    print(f"\n🔢 Fichiers images triés (par ordre):")
    for idx, (num, filename) in enumerate(image_list, 1):
        print(f"   Position {idx}: {filename} (numéro {num})")

    # Vérifier les quantités
    if len(media_list) != len(image_list):
        print(f"\n⚠️  ATTENTION: Nombre différent de fichiers!")
        print(f"   Audio: {len(media_list)}")
        print(f"   Images: {len(image_list)}")
        
        confirm = input(f"\n   Continuer avec {min(len(media_list), len(image_list))} paires ? (o/n): ").strip().lower()
        if confirm not in ['o', 'oui', 'y', 'yes']:
            print("❌ Opération annulée")
            return None, None
        
        min_length = min(len(media_list), len(image_list))
        media_list = media_list[:min_length]
        image_list = image_list[:min_length]

    clips = []
    metadata = []
    current_time = 0.0

    print(f"\n🎬 Traitement de {len(media_list)} paires (appariement par position)...")
    
    for idx, ((audio_num, audio_file), (img_num, img_file)) in enumerate(zip(media_list, image_list), 1):
        media_path = os.path.join(folder, audio_file)
        img_path = os.path.join(folder, img_file)
        
        # 🔧 FIX: Convertir l'image en RGB si nécessaire
        rgb_img_path = convert_image_to_rgb(img_path)

        print(f"\n   Paire #{idx}:")
        print(f"      Audio: {audio_file} (numéro {audio_num})")
        print(f"      Image: {img_file} (numéro {img_num})")

        try:
            audio = AudioFileClip(media_path)
            clip = ImageClip(rgb_img_path).set_duration(audio.duration).set_audio(audio)
            clips.append(clip)

            metadata.append({
                "slide": f"seg_{idx:03d}.mp4",
                "start": round(current_time, 3),
                "duration": round(clip.duration, 3)
            })
            current_time += clip.duration
            
            print(f"      ✅ Traité ({clip.duration:.1f}s)")
        
        except Exception as e:
            print(f"      ❌ Erreur: {e}")
            continue

    if not clips:
        raise ValueError("❌ Aucun clip créé!")

    print(f"\n🎥 Assemblage de {len(clips)} clips...")
    final = concatenate_videoclips(clips, method="compose")
    
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