import struct
import re
import os
import sys
import json

def find_audio_file(data):
    """
    Cherche le nom du fichier audio dans le fichier .DIR
    """
    audio_patterns = [
        rb"([a-zA-Z0-9_-]+\.(?:mp3|wav|aif|aiff|swa))",
        rb"([a-zA-Z0-9_-]+\.(?:MP3|WAV|AIF|AIFF|SWA))",
    ]
    
    audio_files = []
    for pattern in audio_patterns:
        matches = re.findall(pattern, data)
        audio_files.extend([match.decode('latin-1') for match in matches])
    
    return list(set(audio_files))

def find_orators(data):
    """
    Cherche tous les orateurs dans le fichier .DIR
    """
    try:
        text = data.decode('latin-1', errors='ignore')
        
        orators = []
        orator_patterns = [
            r'([A-Z]\.\s*[A-Z][a-z]+)\s*\(([^)]+)\)',
            r'([A-Z][a-z]+\s+[A-Z][a-z]+)\s*\(([^)]+)\)',
            r'([A-Z][a-z]+\s+[A-Z][a-z]+\s+[A-Z][a-z]+)\s*\(([^)]+)\)',
        ]
        
        seen_names = set()
        
        for pattern in orator_patterns:
            matches = re.finditer(pattern, text)
            for match in matches:
                name = match.group(1).strip()
                location = match.group(2).strip()
                
                if len(name) < 3 or name in seen_names:
                    continue
                
                bad_keywords = ['sprite', 'cursor', 'global', 'handler', 'script']
                if any(keyword in name.lower() for keyword in bad_keywords):
                    continue
                
                city = None
                country = None
                
                if ',' in location:
                    parts = [p.strip() for p in location.split(',')]
                    city = parts[0]
                    country = parts[1] if len(parts) > 1 else None
                else:
                    city = location
                
                orators.append({
                    'name': name,
                    'city': city,
                    'country': country
                })
                
                seen_names.add(name)
        
        return orators
    except Exception as e:
        return []

def find_all_numeric_arrays(data):
    """
    Trouve TOUS les arrays de nombres dans le fichier
    """
    arrays_found = []
    bracket_pattern = rb"=\s*\[([^\]]+)\]"
    
    matches = re.finditer(bracket_pattern, data)
    for match in matches:
        try:
            content = match.group(1).decode('ascii', errors='ignore')
            labeled_pattern = r'#([a-zA-Z]+):\s*(\d+)'
            labeled_matches = re.findall(labeled_pattern, content)
            
            if len(labeled_matches) >= 10:
                arrays_found.append({
                    'type': 'bracket_labeled',
                    'offset': match.start(),
                    'labels': [label for label, _ in labeled_matches],
                    'numbers': [int(num) for _, num in labeled_matches],
                })
            else:
                numbers = [int(n) for n in re.findall(r'\d+', content)]
                if len(numbers) >= 10:
                    arrays_found.append({
                        'type': 'bracket',
                        'offset': match.start(),
                        'numbers': numbers,
                    })
        except:
            pass
    
    return arrays_found

def is_slide_image(filename):
    """
    Détermine si une image est une slide ou non
    """
    filename_lower = filename.lower()
    
    if re.search(r'\d+', filename):
        if re.search(r'(dia|slide|diapo)[a-z]*\d+', filename_lower):
            return True
        if re.search(r'[_-]\d+\.', filename_lower):
            return True
        if re.match(r'^\d+\.', filename_lower):
            return True
    
    non_slide_keywords = [
        'portrait', 'photo', 'avatar', 'logo', 'profil', 'orateur',
        'speaker', 'author', 'auteur', 'background', 'fond', 'pillow'
    ]
    
    for keyword in non_slide_keywords:
        if keyword in filename_lower:
            return False
    
    if not re.search(r'\d', filename):
        short_names = ['intro', 'outro', 'title', 'end']
        name_without_ext = os.path.splitext(filename_lower)[0]
        if name_without_ext in short_names:
            return True
        return False
    
    return False

def extract_frame_data_from_arrays(arrays, total_audio_seconds, num_images, debug=False):
    """
    Analyse les arrays pour identifier celui qui contient les timings
    La dernière slide peut durer longtemps, donc on accepte si elle apparaît AVANT la fin
    """
    candidates = []
    
    if debug:
        print(f"\n🔍 DEBUG - Analyse de {len(arrays)} arrays trouvés:")
        print(f"   Durée audio totale: {total_audio_seconds}s ({total_audio_seconds//60}min {total_audio_seconds%60}s)")
        print(f"   Nombre d'images: {num_images}")
    
    for idx, arr in enumerate(arrays):
        numbers = arr['numbers']
        
        if debug:
            print(f"\n   Array #{idx+1}: {len(numbers)} valeurs")
            print(f"      Premier: {numbers[0]}, Dernier: {numbers[-1]}")
            print(f"      Aperçu: {numbers[:5]}...{numbers[-5:]}")
        
        # Vérifier nombre de valeurs (tolérance)
        if len(numbers) < num_images - 10:
            if debug:
                print(f"      ❌ Trop peu de valeurs ({len(numbers)} < {num_images - 10})")
            continue
        
        # Vérifier ordre croissant
        if not all(numbers[i] <= numbers[i+1] for i in range(len(numbers)-1)):
            if debug:
                print(f"      ❌ Pas en ordre croissant")
            continue
        
        last_value = numbers[-1]
        
        # Test MILLISECONDES (le plus probable)
        last_slide_time_ms = last_value / 1000
        
        # Test FRAMES
        estimated_fps = last_value / total_audio_seconds if total_audio_seconds > 0 else 0
        
        # Test SECONDS
        last_slide_time_sec = last_value
        
        if debug:
            print(f"      Si MILLISECONDS: dernière slide à {last_slide_time_ms:.1f}s ({last_slide_time_ms//60:.0f}min {last_slide_time_ms%60:.0f}s)")
            print(f"      Si FRAMES: fps = {estimated_fps:.1f}")
            print(f"      Si SECONDS: dernière slide à {last_slide_time_sec:.1f}s")
        
        # MILLISECONDES: dernière slide doit être avant la fin (avec marge de 30s minimum pour la dernière slide)
        if 180 <= last_slide_time_ms <= total_audio_seconds:
            time_remaining = total_audio_seconds - last_slide_time_ms
            
            if debug:
                print(f"      → MILLISECONDS viable (dernière slide reste {time_remaining:.1f}s)")
            
            # Score: privilégier les timelines où la dernière slide reste 1-15 minutes
            ideal_last_slide_duration = 300  # 5 minutes idéal
            duration_score = abs(time_remaining - ideal_last_slide_duration)
            
            candidates.append({
                'array': arr,
                'format': 'milliseconds',
                'fps': None,
                'last_slide_duration': time_remaining,
                'score': abs(len(numbers) - num_images) + (duration_score / 100),
            })
        
        # FRAMES (10-120 fps)
        elif 10 <= estimated_fps <= 120:
            if debug:
                print(f"      → FRAMES viable")
            
            candidates.append({
                'array': arr,
                'format': 'frames',
                'fps': estimated_fps,
                'last_slide_duration': 0,
                'score': abs(len(numbers) - num_images),
            })
        
        # SECONDS
        elif 180 <= last_slide_time_sec <= total_audio_seconds:
            time_remaining = total_audio_seconds - last_slide_time_sec
            
            if debug:
                print(f"      → SECONDS viable (dernière slide reste {time_remaining:.1f}s)")
            
            ideal_last_slide_duration = 300
            duration_score = abs(time_remaining - ideal_last_slide_duration)
            
            candidates.append({
                'array': arr,
                'format': 'seconds',
                'fps': None,
                'last_slide_duration': time_remaining,
                'score': abs(len(numbers) - num_images) + (duration_score / 100),
            })
    
    if debug and not candidates:
        print(f"\n   ❌ Aucun candidat trouvé !")
    
    # Trier par score (meilleur = score le plus bas)
    candidates.sort(key=lambda x: x['score'])
    
    if debug and candidates:
        best = candidates[0]
        print(f"\n   🏆 Meilleur candidat: {best['format'].upper()}")
        print(f"      Score: {best['score']:.2f}")
        if best['last_slide_duration'] > 0:
            print(f"      Dernière slide reste: {best['last_slide_duration']:.1f}s ({best['last_slide_duration']//60:.0f}min {best['last_slide_duration']%60:.0f}s)")
    
    return candidates[0] if candidates else None

def build_timeline_from_array(candidate, images):
    """
    Construit la timeline à partir de l'array identifié
    SANS ajouter d'entrée finale
    """
    if not candidate:
        return []
    
    arr = candidate['array']
    values = arr['numbers']
    format_type = candidate['format']
    
    timeline = []
    num_slides = min(len(images), len(values))
    
    # Ajouter toutes les slides du fichier
    for i in range(num_slides):
        value = values[i]
        
        if format_type == 'frames':
            time_sec = value / candidate['fps']
        elif format_type == 'seconds':
            time_sec = value
        else:  # milliseconds
            time_sec = value / 1000
        
        timeline.append({
            "min": int(time_sec // 60),
            "sec": int(time_sec % 60)
        })
    
    return timeline

def analyze_file_structure(data):
    """
    Analyse pour trouver les images - FILTRAGE INTELLIGENT
    """
    all_images_patterns = [
        rb"(dia_\d+\.jpg)",
        rb"(slide_?\d+\.jpg)",
        rb"(Diapositive\d+\.jpg)",
        rb"([a-zA-Z_-]*\d+\.(?:jpg|png|jpeg))",
        rb"([a-zA-Z][a-zA-Z0-9_-]*\.(?:jpg|png|jpeg))",
    ]
    
    all_images_raw = []
    for pattern in all_images_patterns:
        matches = re.findall(pattern, data, re.IGNORECASE)
        all_images_raw.extend(matches)
    
    all_images = [img.decode('latin-1') for img in all_images_raw]
    
    seen = set()
    unique_images = []
    for img in all_images:
        if img not in seen:
            seen.add(img)
            unique_images.append(img)
    
    slide_images = [img for img in unique_images if is_slide_image(img)]
    
    def sort_key(filename):
        match = re.search(r'(\d+)', filename)
        if match:
            return (0, int(match.group(1)))
        else:
            return (1, filename)
    
    slide_images.sort(key=sort_key)
    
    filtered_out = set(unique_images) - set(slide_images)
    if filtered_out:
        print(f"   🗑️ Images filtrées: {', '.join(sorted(filtered_out))}")
    
    return slide_images

def build_timeline_enhanced(file_path, total_audio_seconds, debug=False):
    """
    Génère la timeline depuis un fichier .DIR
    """
    with open(file_path, "rb") as f:
        data = f.read()
    
    print("🔍 Analyse du fichier .DIR...")
    
    # Orateurs
    orators = find_orators(data)
    if orators:
        if len(orators) == 1:
            orator = orators[0]
            orator_info = orator['name']
            if orator.get('city') and orator.get('country'):
                orator_info += f" ({orator['city']}, {orator['country']})"
            elif orator.get('city'):
                orator_info += f" ({orator['city']})"
            print(f"👤 Orateur: {orator_info}")
        else:
            print(f"👥 Orateurs ({len(orators)}):")
            for orator in orators:
                orator_info = orator['name']
                if orator.get('city') and orator.get('country'):
                    orator_info += f" ({orator['city']}, {orator['country']})"
                elif orator.get('city'):
                    orator_info += f" ({orator['city']})"
                print(f"   • {orator_info}")
    
    # Audio
    audio_files = find_audio_file(data)
    if audio_files:
        print(f"🎵 Audio: {', '.join(audio_files)}")
    
    # Images
    images = analyze_file_structure(data)
    if not images:
        print("❌ Aucune image trouvée")
        return []
    print(images)
    print(f"✅ {len(images)} slides détectées")
    
    # Arrays
    arrays = find_all_numeric_arrays(data)
    if not arrays:
        print("❌ Aucun array de timings trouvé")
        return []
    
    # Identifier le bon array
    best_candidate = extract_frame_data_from_arrays(arrays, total_audio_seconds, len(images), debug=debug)
    
    if not best_candidate:
        print("❌ Impossible d'identifier l'array de timings")
        if not debug:
            print("💡 Relancez avec --debug pour plus d'informations")
        return []
    
    # Afficher info format
    format_info = best_candidate['format'].upper()
    if best_candidate.get('fps'):
        format_info += f" ({best_candidate['fps']:.0f} fps)"
    
    print(f"✅ Format détecté: {format_info}")
    
    # Construire timeline
    timeline = build_timeline_from_array(best_candidate, images)
    
    if not timeline:
        print("❌ Impossible de construire la timeline")
        return []
    
    # Afficher info sur la dernière slide
    if best_candidate.get('last_slide_duration', 0) > 0:
        last_duration = best_candidate['last_slide_duration']
        print(f"ℹ️  Dernière slide reste affichée {last_duration//60:.0f}min {last_duration%60:.0f}s")
    
    # Sauvegarder
    out_path = os.path.splitext(file_path)[0] + "_timeline.json"
    with open(out_path, "w", encoding="utf-8") as f:
        f.write("[\n")
        for idx, entry in enumerate(timeline):
            line = f'  {{"min": {entry["min"]}, "sec": {entry["sec"]}}}'
            if idx < len(timeline) - 1:
                line += ","
            f.write(line + "\n")
        f.write("]\n")
    
    print(f"💾 Timeline sauvegardée: {out_path} ({len(timeline)} entrées)")
    
    return timeline


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("❌ Usage: python dir_parser.py chemin/vers/fichier.dir [--debug]")
        sys.exit(1)
    
    file_path = sys.argv[1]
    debug_mode = "--debug" in sys.argv
    
    if not os.path.isfile(file_path):
        print(f"❌ Fichier introuvable: {file_path}")
        sys.exit(1)
    
    try:
        minutes = int(input("⏱️ Durée audio (minutes): "))
        seconds = int(input("⏱️ Durée audio (secondes): "))
        total_audio_seconds = minutes * 60 + seconds
    except ValueError:
        print("❌ Valeur invalide")
        sys.exit(1)
    
    build_timeline_enhanced(file_path, total_audio_seconds, debug=debug_mode)