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
    Retourne aussi les images associées aux orateurs pour les filtrer
    """
    try:
        text = data.decode('latin-1', errors='ignore')
        
        orators = []
        orator_images = set()  # Images à exclure (photos d'orateurs)
        
        # Pattern pour détecter "Nom = image.jpg"
        orator_image_pattern = r'([A-Z][^=\n]{2,50})\s*=\s*([a-zA-Z0-9_-]+\.(?:jpg|jpeg|png|JPG|JPEG|PNG))'
        matches = re.finditer(orator_image_pattern, text)
        
        for match in matches:
            name = match.group(1).strip()
            image = match.group(2).strip()
            
            # Filtrer les faux positifs
            bad_keywords = ['sprite', 'cursor', 'global', 'handler', 'script', 'member', 'field']
            if any(keyword in name.lower() for keyword in bad_keywords):
                continue
            
            # Doit ressembler à un nom de personne
            if len(name) < 3 or len(name) > 50:
                continue
            
            orator_images.add(image.lower())
        
        # Patterns pour orateurs avec ville
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
        
        return orators, orator_images
    except Exception as e:
        return [], set()

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

def is_slide_image(filename, orator_images):
    """
    Détermine si une image est une slide ou non
    
    Args:
        filename: Nom du fichier image
        orator_images: Set des images d'orateurs à exclure
    
    Returns:
        bool: True si c'est une slide, False sinon
    """
    filename_lower = filename.lower()
    
    # 🔧 FIX: Exclure les images d'orateurs en priorité
    if filename_lower in orator_images:
        return False
    
    # Mots-clés qui indiquent clairement une non-slide
    non_slide_keywords = [
        'portrait', 'photo', 'avatar', 'logo', 'profil', 'orateur',
        'speaker', 'author', 'auteur', 'background', 'fond', 'pillow',
        'face', 'headshot', 'bio'
    ]
    
    for keyword in non_slide_keywords:
        if keyword in filename_lower:
            return False
    
    # Images avec numéros = slides (sauf si dans keywords ci-dessus)
    if re.search(r'\d+', filename):
        return True
    
    # Images spéciales acceptées (intro, outro, title)
    special_names = ['intro', 'outro', 'title', 'end', 'start', 'cover']
    name_without_ext = os.path.splitext(filename_lower)[0]
    if name_without_ext in special_names:
        return True
    
    # Par défaut, si pas de numéro et pas dans la liste spéciale = pas une slide
    return False

def extract_frame_data_from_arrays(arrays, total_audio_seconds, num_images, debug=False):
    """
    Analyse les arrays pour identifier celui qui contient les timings
    🎯 ALGORITHME AMÉLIORÉ: Favoriser les arrays PROCHES du nombre d'images
    """
    candidates = []
    all_arrays = []
    
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
        
        # Stocker pour mode debug
        all_arrays.append({
            'index': idx + 1,
            'array': arr,
            'count': len(numbers)
        })
        
        # 🔧 FIX: Accepter les arrays qui ont entre (num_images - 10) et (num_images + 5)
        # Raison: Certaines slides peuvent manquer, ou il y a un timer de fin (+1)
        if len(numbers) < num_images - 10:
            if debug:
                print(f"      ❌ Trop peu de valeurs ({len(numbers)} < {num_images - 10})")
            continue
        
        # 🔧 FIX: Rejeter les arrays avec BEAUCOUP trop d'entrées (incohérent)
        if len(numbers) > num_images + 10:
            if debug:
                print(f"      ❌ Trop de valeurs ({len(numbers)} > {num_images + 10})")
            continue
        
        # Vérifier ordre croissant
        if not all(numbers[i] <= numbers[i+1] for i in range(len(numbers)-1)):
            if debug:
                print(f"      ❌ Pas en ordre croissant")
            continue
        
        last_value = numbers[-1]
        
        # Test formats
        last_slide_time_ms = last_value / 1000
        last_slide_time_tick60 = last_value / 60
        last_slide_time_centisec = last_value / 100
        estimated_fps = last_value / total_audio_seconds if total_audio_seconds > 0 else 0
        last_slide_time_sec = last_value
        
        if debug:
            print(f"      Si MILLISECONDS: dernière slide à {last_slide_time_ms:.1f}s ({last_slide_time_ms//60:.0f}min {last_slide_time_ms%60:.0f}s)")
            print(f"      Si TICKS/60: dernière slide à {last_slide_time_tick60:.1f}s ({last_slide_time_tick60//60:.0f}min {last_slide_time_tick60%60:.0f}s)")
            print(f"      Si CENTISECONDES: dernière slide à {last_slide_time_centisec:.1f}s ({last_slide_time_centisec//60:.0f}min {last_slide_time_centisec%60:.0f}s)")
            print(f"      Si FRAMES: fps = {estimated_fps:.1f}")
            print(f"      Si SECONDS: dernière slide à {last_slide_time_sec:.1f}s")
        
        # 🎯 NOUVEAU SYSTÈME DE SCORE
        # Favoriser les arrays PROCHES du nombre d'images détectées
        count_diff = abs(len(numbers) - num_images)
        
        # Bonus spécial si array = num_images + 1 (timer de fin)
        if len(numbers) == num_images + 1:
            count_score = -20  # Super bonus (timer de fin cohérent)
        # Bonus si array = num_images (match parfait)
        elif len(numbers) == num_images:
            count_score = -15  # Excellent
        # Pénalité progressive selon l'écart
        elif count_diff <= 3:
            count_score = count_diff * 2  # Petit écart = petite pénalité
        else:
            count_score = count_diff * 5  # Grand écart = grosse pénalité
        
        # Bonus pour le premier array valide (mais moins important que le count)
        position_bonus = 0 if idx == 0 else 5
        
        # 🎯 PRIORITÉ 1: TICKS/60
        # 🔧 FIX: Même tolérance qu'en mode debug (+5s pour match parfait, +30s max)
        if total_audio_seconds * 0.5 <= last_slide_time_tick60 <= total_audio_seconds + 30:
            time_remaining = total_audio_seconds - last_slide_time_tick60
            
            # Bonus si match parfait (±5s)
            if abs(time_remaining) <= 5:
                score_bonus = -1000  # Score ultra-prioritaire
                if debug:
                    if time_remaining < 0:
                        print(f"      ✅ TICKS/60 viable (MATCH PARFAIT! dépasse de {abs(time_remaining):.1f}s)")
                    else:
                        print(f"      ✅ TICKS/60 viable (MATCH PARFAIT! reste {time_remaining:.1f}s)")
            # Accepter avec pénalité si dépasse légèrement
            elif time_remaining < 0:
                score_bonus = abs(time_remaining) * 10  # Pénalité proportionnelle
                if debug:
                    print(f"      ⚠️  TICKS/60 viable MAIS dépasse de {abs(time_remaining):.1f}s (pénalité: +{score_bonus:.0f})")
            else:
                score_bonus = 0
                if debug:
                    print(f"      ✅ TICKS/60 viable (dernière slide reste {time_remaining:.1f}s)")
            
            ideal_last_slide_duration = 300  # 5 minutes idéal
            duration_score = abs(time_remaining - ideal_last_slide_duration) / 100
            
            # Bonus TICKS/60
            ticks_priority_bonus = -50
            
            final_score = count_score + duration_score + position_bonus + score_bonus + ticks_priority_bonus
            
            if debug:
                print(f"      📊 Score TICKS/60: count={count_score:.1f} + duration={duration_score:.1f} + position={position_bonus} + bonus={score_bonus} + ticks={ticks_priority_bonus} = {final_score:.1f}")
            
            candidates.append({
                'array': arr,
                'format': 'ticks60',
                'fps': None,
                'last_slide_duration': time_remaining,
                'score': final_score,
            })
        
        # PRIORITÉ 2: MILLISECONDES
        if 180 <= last_slide_time_ms <= total_audio_seconds:
            time_remaining = total_audio_seconds - last_slide_time_ms
            
            if debug:
                print(f"      → MILLISECONDS viable (dernière slide reste {time_remaining:.1f}s)")
            
            ideal_last_slide_duration = 300
            duration_score = abs(time_remaining - ideal_last_slide_duration) / 100
            
            final_score = count_score + duration_score + position_bonus
            
            if debug:
                print(f"      📊 Score MILLISECONDS: count={count_score:.1f} + duration={duration_score:.1f} + position={position_bonus} = {final_score:.1f}")
            
            candidates.append({
                'array': arr,
                'format': 'milliseconds',
                'fps': None,
                'last_slide_duration': time_remaining,
                'score': final_score,
            })
        
        # PRIORITÉ 3: CENTISECONDES
        if 180 <= last_slide_time_centisec <= total_audio_seconds:
            time_remaining = total_audio_seconds - last_slide_time_centisec
            
            if debug:
                print(f"      → CENTISECONDES viable (dernière slide reste {time_remaining:.1f}s)")
            
            ideal_last_slide_duration = 300
            duration_score = abs(time_remaining - ideal_last_slide_duration) / 100
            
            final_score = count_score + duration_score + position_bonus
            
            if debug:
                print(f"      📊 Score CENTISECONDS: count={count_score:.1f} + duration={duration_score:.1f} + position={position_bonus} = {final_score:.1f}")
            
            candidates.append({
                'array': arr,
                'format': 'centiseconds',
                'fps': None,
                'last_slide_duration': time_remaining,
                'score': final_score,
            })
        
        # PRIORITÉ 4: FRAMES (10-120 fps) - SEULEMENT si pas d'autre match
        elif 10 <= estimated_fps <= 120 and not candidates:
            if debug:
                print(f"      → FRAMES viable (fps={estimated_fps:.1f})")
            
            final_score = count_score + 100 + position_bonus
            
            candidates.append({
                'array': arr,
                'format': 'frames',
                'fps': estimated_fps,
                'last_slide_duration': 0,
                'score': final_score,
            })
        
        # PRIORITÉ 5: SECONDS
        elif 180 <= last_slide_time_sec <= total_audio_seconds:
            time_remaining = total_audio_seconds - last_slide_time_sec
            
            if debug:
                print(f"      → SECONDS viable (dernière slide reste {time_remaining:.1f}s)")
            
            ideal_last_slide_duration = 300
            duration_score = abs(time_remaining - ideal_last_slide_duration) / 100
            
            final_score = count_score + duration_score + position_bonus
            
            candidates.append({
                'array': arr,
                'format': 'seconds',
                'fps': None,
                'last_slide_duration': time_remaining,
                'score': final_score,
            })
    
    # Mode debug: TOUJOURS proposer de choisir manuellement
    if debug and all_arrays:
        if candidates:
            candidates.sort(key=lambda x: x['score'])
            best = candidates[0]
            print(f"\n   🏆 Meilleur candidat automatique: {best['format'].upper()}")
            print(f"      Array: {len(best['array']['numbers'])} entrées")
            print(f"      Score: {best['score']:.2f}")
            if best['last_slide_duration'] > 0:
                print(f"      Dernière slide reste: {best['last_slide_duration']:.1f}s ({best['last_slide_duration']//60:.0f}min {best['last_slide_duration']%60:.0f}s)")
        else:
            print(f"\n   ❌ Aucun candidat automatique trouvé !")
        
        print(f"\n   🔧 Mode DEBUG: Arrays disponibles:")
        
        for arr_info in all_arrays:
            arr = arr_info['array']
            numbers = arr['numbers']
            last_value = numbers[-1]
            last_time_ms = last_value / 1000
            last_time_tick60 = last_value / 60
            last_time_centisec = last_value / 100
            
            # Marquer si c'est le meilleur candidat
            marker = ""
            if candidates and arr_info['array'] == candidates[0]['array']:
                marker = " ⭐ RECOMMANDÉ"
            
            print(f"\n      [{arr_info['index']}] Array #{arr_info['index']}: {arr_info['count']} entrées{marker}")
            print(f"          Première valeur: {numbers[0]}")
            print(f"          Dernière valeur: {numbers[-1]}")
            print(f"             → Millisecondes: {last_time_ms:.1f}s ({last_time_ms//60:.0f}min {last_time_ms%60:.0f}s)")
            print(f"             → Centisecondes: {last_time_centisec:.1f}s ({last_time_centisec//60:.0f}min {last_time_centisec%60:.0f}s)")
            print(f"             → Ticks/60: {last_time_tick60:.1f}s ({last_time_tick60//60:.0f}min {last_time_tick60%60:.0f}s)")
            print(f"          Aperçu: {numbers[:3]}...{numbers[-3:]}")
        
        print(f"\n   ❓ Voulez-vous choisir manuellement l'array ?")
        print(f"      Note: Vous avez {num_images} images détectées, audio de {total_audio_seconds}s ({total_audio_seconds//60}min {total_audio_seconds%60}s)")
        
        choice = input(f"\n   Entrer le numéro [1-{len(all_arrays)}] (ou Entrée pour utiliser {'le recommandé' if candidates else 'annuler'}): ").strip()
        
        if choice.isdigit():
            array_index = int(choice) - 1
            
            if 0 <= array_index < len(all_arrays):
                forced_arr = all_arrays[array_index]['array']
                numbers = forced_arr['numbers']
                last_value = numbers[-1]
                last_time_ms = last_value / 1000
                last_time_tick60 = last_value / 60
                last_time_centisec = last_value / 100
                
                print(f"\n   ⚠️  Sélection manuelle de l'array #{choice}")
                print(f"\n   📊 Analyse des formats possibles:")
                
                format_scores = []
                
                # 1. TICKS/60
                if last_time_tick60 < total_audio_seconds + 30:
                    time_remaining_tick60 = total_audio_seconds - last_time_tick60
                    score_tick60 = abs(time_remaining_tick60 - 300)
                    
                    if abs(time_remaining_tick60) <= 5:
                        score_tick60 = -1000
                    
                    format_scores.append({
                        'format': 'ticks60',
                        'time': last_time_tick60,
                        'remaining': time_remaining_tick60,
                        'score': score_tick60
                    })
                
                # 2. CENTISECONDES
                if last_time_centisec < total_audio_seconds:
                    time_remaining_centisec = total_audio_seconds - last_time_centisec
                    score_centisec = abs(time_remaining_centisec - 300)
                    format_scores.append({
                        'format': 'centiseconds',
                        'time': last_time_centisec,
                        'remaining': time_remaining_centisec,
                        'score': score_centisec
                    })
                
                # 3. MILLISECONDES
                if last_time_ms < total_audio_seconds:
                    time_remaining_ms = total_audio_seconds - last_time_ms
                    score_ms = abs(time_remaining_ms - 300)
                    format_scores.append({
                        'format': 'milliseconds',
                        'time': last_time_ms,
                        'remaining': time_remaining_ms,
                        'score': score_ms
                    })
                
                if not format_scores:
                    print(f"      ❌ Aucun format viable trouvé")
                    return None
                
                format_scores.sort(key=lambda x: x['score'])
                
                for idx, fmt in enumerate(format_scores, 1):
                    format_name = fmt['format'].upper()
                    time_val = fmt['time']
                    remaining = fmt['remaining']
                    score = fmt['score']
                    
                    marker = " ⭐ RECOMMANDÉ" if idx == 1 else ""
                    
                    print(f"      [{idx}] {format_name}: dernière slide à {time_val:.1f}s ({time_val//60:.0f}min {time_val%60:.0f}s){marker}")
                    print(f"          → Reste {remaining:.1f}s ({remaining//60:.0f}min {remaining%60:.0f}s) pour la dernière slide")
                    
                    if score >= 0:
                        print(f"          → Score: {score:.1f} (plus bas = meilleur)")
                    else:
                        print(f"          → ✨ Match parfait avec la durée audio!")
                
                best_format = format_scores[0]
                
                print(f"\n   💡 Format recommandé: {best_format['format'].upper()}")
                
                if best_format['score'] < 0:
                    print(f"      ✨ MATCH PARFAIT avec la durée audio!")
                else:
                    print(f"      (dernière slide reste {best_format['remaining']:.1f}s = {best_format['remaining']//60:.0f}min {best_format['remaining']%60:.0f}s)")
                
                max_choice = len(format_scores)
                format_choice = input(f"\n   Utiliser ce format ? (o/n, ou entrer 1-{max_choice} pour choisir): ").strip().lower()
                
                if format_choice in ['o', 'oui', 'y', 'yes', '']:
                    forced_format = best_format['format']
                    last_duration = best_format['remaining']
                    print(f"   ✅ Format sélectionné: {forced_format.upper()}")
                elif format_choice.isdigit():
                    choice_idx = int(format_choice) - 1
                    if 0 <= choice_idx < len(format_scores):
                        chosen = format_scores[choice_idx]
                        forced_format = chosen['format']
                        last_duration = chosen['remaining']
                        print(f"   ✅ Format sélectionné: {forced_format.upper()}")
                    else:
                        print(f"   ❌ Choix invalide")
                        return None
                else:
                    print(f"   ↩️  Annulation")
                    return None
                
                return {
                    'array': forced_arr,
                    'format': forced_format,
                    'fps': None,
                    'last_slide_duration': last_duration,
                    'score': 999,
                    'forced': True
                }
            else:
                print(f"   ❌ Numéro invalide")
        elif choice == "" and candidates:
            print(f"   ✅ Utilisation du candidat recommandé")
            return candidates[0]
        else:
            print(f"   ↩️  Annulation")
            return None
    
    # 🎯 Mode normal: Utiliser le meilleur candidat automatiquement
    if not candidates:
        return None
    
    candidates.sort(key=lambda x: x['score'])
    return candidates[0]

def build_timeline_from_array(candidate, images, debug=False):
    """
    Construit la timeline à partir de l'array identifié
    
    Args:
        candidate: Dictionnaire contenant l'array et le format
        images: Liste des images détectées
        debug: Si True, utilise TOUTES les valeurs de l'array
    
    Returns:
        list: Timeline avec les timings
    """
    if not candidate:
        return []
    
    arr = candidate['array']
    values = arr['numbers']
    format_type = candidate['format']
    
    timeline = []
    
    # 🔧 FIX: En mode debug, utiliser TOUTES les valeurs de l'array
    if debug:
        num_slides = len(values)
        print(f"   🔧 Mode DEBUG: Utilisation de TOUTES les {len(values)} valeurs de l'array")
    else:
        num_slides = min(len(images), len(values))
    
    for i in range(num_slides):
        value = values[i]
        
        # Gérer le format
        if format_type == 'ticks60':
            time_sec = value / 60
        elif format_type == 'frames':
            time_sec = value / candidate['fps']
        elif format_type == 'seconds':
            time_sec = value
        elif format_type == 'centiseconds':
            time_sec = value / 100
        else:  # milliseconds
            time_sec = value / 1000
        
        timeline.append({
            "min": int(time_sec // 60),
            "sec": int(time_sec % 60)
        })
    
    return timeline

def analyze_file_structure(data, orator_images):
    """
    Analyse pour trouver les images - FILTRAGE INTELLIGENT
    
    Args:
        data: Données binaires du fichier .DIR
        orator_images: Set des images d'orateurs à exclure
    
    Returns:
        list: Liste des images de slides
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
    
    # 🔧 FIX: Passer orator_images à is_slide_image
    slide_images = [img for img in unique_images if is_slide_image(img, orator_images)]
    
    def sort_key(filename):
        match = re.search(r'(\d+)', filename)
        if match:
            return (0, int(match.group(1)))
        else:
            return (1, filename)
    
    slide_images.sort(key=sort_key)
    
    filtered_out = set(unique_images) - set(slide_images)
    if filtered_out:
        print(f"   🗑️ Images filtrées (photos d'orateurs): {', '.join(sorted(filtered_out))}")
    
    return slide_images

def build_timeline_enhanced(file_path, total_audio_seconds, debug=False):
    """
    Génère la timeline depuis un fichier .DIR
    """
    with open(file_path, "rb") as f:
        data = f.read()
    
    print("🔍 Analyse du fichier .DIR...")
    
    # Récupérer aussi les images d'orateurs
    orators, orator_images = find_orators(data)
    
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
    
    # Passer orator_images à analyze_file_structure
    images = analyze_file_structure(data, orator_images)
    
    if not images:
        print("❌ Aucune image de slide trouvée")
        return []
    
    print(f"✅ {len(images)} slides détectées:")
    for img in images:
        print(f"   - {img}")
    
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
    
    # 🔧 FIX: Passer le flag debug à build_timeline_from_array
    timeline = build_timeline_from_array(best_candidate, images, debug=debug)
    
    if not timeline:
        print("❌ Impossible de construire la timeline")
        return []
    
    # Afficher info sur la dernière slide
    if best_candidate.get('last_slide_duration', 0) > 0:
        last_duration = best_candidate['last_slide_duration']
        print(f"ℹ️  Dernière slide reste affichée {last_duration//60:.0f}min {last_duration%60:.0f}s")
    
    # 🔧 Avertissement si array > images détectées
    array_count = len(best_candidate['array']['numbers'])
    if debug and array_count > len(images):
        print(f"⚠️  L'array contient {array_count} entrées mais seulement {len(images)} images détectées")
        print(f"   → Mode DEBUG: Toutes les {array_count} entrées seront sauvegardées")
        print(f"   → Il manque peut-être {array_count - len(images)} slides dans la détection")
    
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