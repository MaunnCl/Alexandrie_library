#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
import argparse
import subprocess
from pathlib import Path

def get_video_info(input_file):
    """Récupère les informations vidéo du fichier"""
    cmd = [
        'ffprobe',
        '-v', 'quiet',
        '-print_format', 'json',
        '-show_streams',
        '-show_format',
        input_file
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        import json
        data = json.loads(result.stdout)
        
        video_stream = None
        audio_stream = None
        
        for stream in data.get('streams', []):
            if stream.get('codec_type') == 'video' and not video_stream:
                video_stream = stream
            elif stream.get('codec_type') == 'audio' and not audio_stream:
                audio_stream = stream
        
        return {
            'video': video_stream,
            'audio': audio_stream,
            'format': data.get('format', {})
        }
    except:
        return None

def convert_to_mp4(input_file, output_file=None, quality='medium', verbose=True):
    """
    Convertit un fichier MOV en MP4
    
    Args:
        input_file: Chemin du fichier source (.mov)
        output_file: Chemin du fichier de sortie (.mp4) - optionnel
        quality: Qualité de conversion ('low', 'medium', 'high', 'lossless')
        verbose: Afficher les informations
    
    Returns:
        str: Chemin du fichier MP4 créé
    """
    input_path = Path(input_file)
    
    if not input_path.exists():
        raise FileNotFoundError(f"Fichier introuvable: {input_file}")
    
    # Génération du nom de sortie si non fourni
    if output_file is None:
        output_file = input_path.with_suffix('.mp4')
    else:
        output_file = Path(output_file)
    
    # Vérifier si le fichier de sortie existe déjà
    if output_file.exists():
        confirm = input(f"⚠️  {output_file.name} existe déjà. Écraser ? (o/n): ").strip().lower()
        if confirm not in ['o', 'oui', 'y', 'yes']:
            print("❌ Conversion annulée")
            return None
    
    if verbose:
        print(f"🎬 Conversion: {input_path.name} → {output_file.name}")
        
        # Afficher les infos vidéo
        info = get_video_info(str(input_path))
        if info:
            if info['video']:
                codec = info['video'].get('codec_name', 'inconnu')
                width = info['video'].get('width', '?')
                height = info['video'].get('height', '?')
                fps = info['video'].get('r_frame_rate', '?')
                print(f"ℹ️  Vidéo: {codec}, {width}x{height}, {fps} fps")
            
            if info['audio']:
                codec = info['audio'].get('codec_name', 'inconnu')
                sample_rate = info['audio'].get('sample_rate', '?')
                channels = info['audio'].get('channels', '?')
                print(f"ℹ️  Audio: {codec}, {sample_rate}Hz, {channels} canaux")
        
        print(f"ℹ️  Qualité: {quality}")
    
    # Paramètres de qualité
    quality_presets = {
        'lossless': {
            'video_codec': 'libx264',
            'crf': '0',  # Sans perte
            'preset': 'veryslow',
            'audio_codec': 'aac',
            'audio_bitrate': '320k'
        },
        'high': {
            'video_codec': 'libx264',
            'crf': '18',  # Très haute qualité
            'preset': 'slow',
            'audio_codec': 'aac',
            'audio_bitrate': '256k'
        },
        'medium': {
            'video_codec': 'libx264',
            'crf': '23',  # Qualité par défaut (bon compromis)
            'preset': 'medium',
            'audio_codec': 'aac',
            'audio_bitrate': '192k'
        },
        'low': {
            'video_codec': 'libx264',
            'crf': '28',  # Qualité réduite (fichier plus petit)
            'preset': 'fast',
            'audio_codec': 'aac',
            'audio_bitrate': '128k'
        }
    }
    
    params = quality_presets.get(quality, quality_presets['medium'])
    
    # Commande ffmpeg avec filtre pour dimensions paires
    # scale=-2:height force width à être divisible par 2
    # scale=width:-2 force height à être divisible par 2
    # Si les deux sont impairs, on utilise scale='trunc(iw/2)*2':'trunc(ih/2)*2'
    cmd = [
        'ffmpeg',
        '-i', str(input_path),
        '-vf', "scale='trunc(iw/2)*2':'trunc(ih/2)*2'",  # Force dimensions paires
        '-c:v', params['video_codec'],
        '-crf', params['crf'],
        '-preset', params['preset'],
        '-c:a', params['audio_codec'],
        '-b:a', params['audio_bitrate'],
        '-movflags', '+faststart',  # Optimisation pour streaming web
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
            input_size_mb = input_path.stat().st_size / (1024 * 1024)
            output_size_mb = output_file.stat().st_size / (1024 * 1024)
            compression_ratio = (1 - output_size_mb / input_size_mb) * 100
            
            print(f"✅ Conversion réussie: {output_file}")
            print(f"📦 Taille originale: {input_size_mb:.2f} MB")
            print(f"📦 Taille finale: {output_size_mb:.2f} MB")
            print(f"📉 Compression: {compression_ratio:+.1f}%")
        
        return str(output_file)
    
    except subprocess.CalledProcessError as e:
        print(f"❌ Erreur lors de la conversion: {e}")
        return None
    except Exception as e:
        print(f"❌ Erreur inattendue: {e}")
        return None

def batch_convert(input_folder, output_folder=None, quality='medium', extensions=['.mov', '.MOV']):
    """
    Convertit tous les fichiers .mov d'un dossier en .mp4
    
    Args:
        input_folder: Dossier contenant les fichiers
        output_folder: Dossier de sortie (même dossier si None)
        quality: Qualité de conversion
        extensions: Liste des extensions à convertir
    """
    input_path = Path(input_folder)
    
    if not input_path.is_dir():
        raise NotADirectoryError(f"Dossier introuvable: {input_folder}")
    
    output_path = Path(output_folder) if output_folder else input_path
    output_path.mkdir(exist_ok=True, parents=True)
    
    # Chercher tous les fichiers .mov
    video_files = []
    for ext in extensions:
        video_files.extend(input_path.glob(f'*{ext}'))
    
    if not video_files:
        print(f"❌ Aucun fichier {', '.join(extensions)} trouvé dans {input_folder}")
        return
    
    print(f"📂 {len(video_files)} fichier(s) trouvé(s)")
    
    converted = 0
    failed = 0
    
    for video_file in video_files:
        output_file = output_path / video_file.with_suffix('.mp4').name
        
        print(f"\n[{converted + failed + 1}/{len(video_files)}]")
        
        result = convert_to_mp4(video_file, output_file, quality, verbose=True)
        
        if result:
            converted += 1
        else:
            failed += 1
    
    print(f"\n{'='*50}")
    print(f"✅ Convertis: {converted}")
    print(f"❌ Échecs: {failed}")
    print(f"📁 Dossier de sortie: {output_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Convertit des fichiers .mov en .mp4",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Exemples:
  # Convertir un seul fichier (qualité par défaut)
  python mov_to_mp4.py video.mov
  
  # Spécifier le nom de sortie
  python mov_to_mp4.py video.mov -o sortie.mp4
  
  # Haute qualité
  python mov_to_mp4.py video.mov --quality high
  
  # Sans perte (lossless)
  python mov_to_mp4.py video.mov --quality lossless
  
  # Convertir tous les .mov d'un dossier
  python mov_to_mp4.py --batch /chemin/dossier
  
  # Batch avec dossier de sortie personnalisé
  python mov_to_mp4.py --batch /input -o /output --quality high

Niveaux de qualité:
  - lossless : Sans perte (CRF 0) - très gros fichiers
  - high     : Très haute qualité (CRF 18) - gros fichiers
  - medium   : Qualité standard (CRF 23) - bon compromis [DÉFAUT]
  - low      : Basse qualité (CRF 28) - petits fichiers
        """
    )
    
    parser.add_argument('input', help="Fichier .mov ou dossier (avec --batch)")
    parser.add_argument('-o', '--output', help="Fichier/dossier de sortie")
    parser.add_argument('--quality', choices=['lossless', 'high', 'medium', 'low'], 
                        default='medium', help="Qualité de conversion (défaut: medium)")
    parser.add_argument('--batch', action='store_true', 
                        help="Mode batch: convertir tous les .mov d'un dossier")
    parser.add_argument('--extensions', nargs='+', default=['.mov', '.MOV'], 
                        help="Extensions à traiter en mode batch (défaut: .mov .MOV)")
    parser.add_argument('-q', '--quiet', action='store_true', help="Mode silencieux")
    
    args = parser.parse_args()
    
    if args.batch:
        batch_convert(args.input, args.output, args.quality, args.extensions)
    else:
        convert_to_mp4(args.input, args.output, args.quality, verbose=not args.quiet)