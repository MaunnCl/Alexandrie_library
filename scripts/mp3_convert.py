#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
import argparse
import subprocess
from pathlib import Path

def get_audio_info(input_file):
    """Récupère les informations audio du fichier"""
    cmd = [
        'ffprobe',
        '-v', 'quiet',
        '-print_format', 'json',
        '-show_streams',
        '-select_streams', 'a:0',
        input_file
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        import json
        data = json.loads(result.stdout)
        if data.get('streams'):
            return data['streams'][0]
        return None
    except:
        return None

def convert_to_mp3(input_file, output_file=None, bitrate='192k', verbose=True, delete_source=False):
    """
    Convertit un fichier MOV (ou autre) en MP3
    
    Args:
        input_file: Chemin du fichier source (.mov, .mp4, etc.)
        output_file: Chemin du fichier de sortie (.mp3) - optionnel
        bitrate: Bitrate audio ('128k', '192k', '320k')
        verbose: Afficher les informations
        delete_source: Supprimer le fichier source après conversion
    
    Returns:
        str: Chemin du fichier MP3 créé
    """
    input_path = Path(input_file)
    
    if not input_path.exists():
        raise FileNotFoundError(f"Fichier introuvable: {input_file}")
    
    # Génération du nom de sortie si non fourni
    if output_file is None:
        output_file = input_path.with_suffix('.mp3')
    else:
        output_file = Path(output_file)
    
    # Vérifier si le fichier de sortie existe déjà
    if output_file.exists():
        confirm = input(f"⚠️  {output_file.name} existe déjà. Écraser ? (o/n): ").strip().lower()
        if confirm not in ['o', 'oui', 'y', 'yes']:
            print("❌ Conversion annulée")
            return None
    
    if verbose:
        print(f"🎵 Conversion: {input_path.name} → {output_file.name}")
        
        # Afficher les infos audio
        audio_info = get_audio_info(str(input_path))
        if audio_info:
            codec = audio_info.get('codec_name', 'inconnu')
            sample_rate = audio_info.get('sample_rate', 'inconnu')
            channels = audio_info.get('channels', 'inconnu')
            print(f"ℹ️  Source: {codec}, {sample_rate}Hz, {channels} canaux")
        
        print(f"ℹ️  Bitrate cible: {bitrate}")
    
    # Commande ffmpeg
    cmd = [
        'ffmpeg',
        '-i', str(input_path),
        '-vn',  # Pas de vidéo
        '-acodec', 'libmp3lame',
        '-b:a', bitrate,
        '-y',  # Écraser sans demander
        str(output_file)
    ]
    
    try:
        if verbose:
            print("⏳ Conversion en cours...")
            subprocess.run(cmd, check=True)
        else:
            subprocess.run(cmd, check=True, capture_output=True)
        
        if verbose:
            size_mb = output_file.stat().st_size / (1024 * 1024)
            print(f"✅ Conversion réussie: {output_file}")
            print(f"📦 Taille: {size_mb:.2f} MB")
        
        # Supprimer le fichier source si demandé
        if delete_source:
            try:
                input_path.unlink()
                if verbose:
                    print(f"🗑️  Fichier source supprimé: {input_path.name}")
            except Exception as e:
                print(f"⚠️  Erreur lors de la suppression de {input_path.name}: {e}")
        
        return str(output_file)
    
    except subprocess.CalledProcessError as e:
        print(f"❌ Erreur lors de la conversion: {e}")
        return None
    except Exception as e:
        print(f"❌ Erreur inattendue: {e}")
        return None

def batch_convert(input_folder, output_folder=None, bitrate='192k', extensions=['.mov', '.mp4', '.avi'], delete_source=False):
    """
    Convertit tous les fichiers vidéo d'un dossier en MP3
    
    Args:
        input_folder: Dossier contenant les fichiers
        output_folder: Dossier de sortie (même dossier si None)
        bitrate: Bitrate audio
        extensions: Liste des extensions à convertir
        delete_source: Supprimer les fichiers sources après conversion
    """
    input_path = Path(input_folder)
    
    if not input_path.is_dir():
        raise NotADirectoryError(f"Dossier introuvable: {input_folder}")
    
    output_path = Path(output_folder) if output_folder else input_path
    output_path.mkdir(exist_ok=True, parents=True)
    
    # Chercher tous les fichiers vidéo
    video_files = []
    for ext in extensions:
        video_files.extend(input_path.glob(f'*{ext}'))
        video_files.extend(input_path.glob(f'*{ext.upper()}'))
    
    if not video_files:
        print(f"❌ Aucun fichier {', '.join(extensions)} trouvé dans {input_folder}")
        return
    
    print(f"📂 {len(video_files)} fichier(s) trouvé(s)")
    
    if delete_source:
        print(f"⚠️  MODE SUPPRESSION ACTIVÉ: Les fichiers sources seront supprimés après conversion")
        confirm = input("   Continuer ? (o/n): ").strip().lower()
        if confirm not in ['o', 'oui', 'y', 'yes']:
            print("❌ Opération annulée")
            return
    
    converted = 0
    failed = 0
    deleted = 0
    
    for video_file in video_files:
        output_file = output_path / video_file.with_suffix('.mp3').name
        
        print(f"\n[{converted + failed + 1}/{len(video_files)}]")
        
        result = convert_to_mp3(video_file, output_file, bitrate, verbose=True, delete_source=delete_source)
        
        if result:
            converted += 1
            if delete_source:
                deleted += 1
        else:
            failed += 1
    
    print(f"\n{'='*50}")
    print(f"✅ Convertis: {converted}")
    print(f"❌ Échecs: {failed}")
    if delete_source:
        print(f"🗑️  Supprimés: {deleted}")
    print(f"📁 Dossier de sortie: {output_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Convertit des fichiers vidéo (.mov, .mp4, etc.) en MP3",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Exemples:
  # Convertir un seul fichier
  python mp3_convert.py video.mov
  
  # Convertir et supprimer le fichier source
  python mp3_convert.py video.mov --delete
  
  # Spécifier le nom de sortie
  python mp3_convert.py video.mov -o audio.mp3
  
  # Changer le bitrate
  python mp3_convert.py video.mov -b 320k
  
  # Convertir tous les .mov d'un dossier
  python mp3_convert.py --batch /chemin/dossier
  
  # Batch avec suppression des sources
  python mp3_convert.py --batch /dossier --delete
  
  # Batch avec dossier de sortie personnalisé
  python mp3_convert.py --batch /input -o /output -b 256k --delete
        """
    )
    
    parser.add_argument('input', help="Fichier vidéo ou dossier (avec --batch)")
    parser.add_argument('-o', '--output', help="Fichier/dossier de sortie")
    parser.add_argument('-b', '--bitrate', default='192k', help="Bitrate audio (défaut: 192k)")
    parser.add_argument('--batch', action='store_true', help="Mode batch: convertir tous les fichiers d'un dossier")
    parser.add_argument('--extensions', nargs='+', default=['.mov', '.mp4', '.avi', '.mkv'], 
                        help="Extensions à traiter en mode batch (défaut: .mov .mp4 .avi .mkv)")
    parser.add_argument('--delete', action='store_true', help="Supprimer les fichiers sources après conversion")
    parser.add_argument('-q', '--quiet', action='store_true', help="Mode silencieux")
    
    args = parser.parse_args()
    
    if args.batch:
        batch_convert(args.input, args.output, args.bitrate, args.extensions, args.delete)
    else:
        convert_to_mp3(args.input, args.output, args.bitrate, verbose=not args.quiet, delete_source=args.delete)