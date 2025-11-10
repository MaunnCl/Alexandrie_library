#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
import argparse
from pathlib import Path
import subprocess

try:
    from PIL import Image
except ImportError:
    print("❌ Module Pillow non installé")
    print("💡 Installation: pip install Pillow")
    sys.exit(1)

def check_libreoffice():
    """Vérifie si LibreOffice est installé"""
    result = subprocess.run(['which', 'soffice'], capture_output=True, text=True)
    if result.returncode != 0:
        print("❌ LibreOffice n'est pas installé!")
        print("💡 Installation: brew install --cask libreoffice")
        return False
    return True

def check_poppler():
    """Vérifie si poppler est installé"""
    result = subprocess.run(['which', 'pdftoppm'], capture_output=True, text=True)
    if result.returncode != 0:
        print("❌ Poppler n'est pas installé!")
        print("💡 Installation: brew install poppler")
        return False
    return True

def convert_ppt_to_pdf(ppt_path, output_dir):
    """Convertit .ppt ou .pptx en PDF via LibreOffice"""
    try:
        cmd = [
            'soffice',
            '--headless',
            '--convert-to', 'pdf',
            '--outdir', str(output_dir),
            str(ppt_path)
        ]
        
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)
        
        # Le PDF aura le même nom que le PPT
        pdf_path = output_dir / f"{ppt_path.stem}.pdf"
        
        if pdf_path.exists():
            return pdf_path
        else:
            print(f"❌ PDF non créé: {pdf_path}")
            return None
    
    except subprocess.CalledProcessError as e:
        print(f"❌ Erreur conversion LibreOffice: {e.stderr}")
        return None

def extract_images_from_pdf(pdf_path, output_dir, dpi=150, quality=85, max_width=1280):
    """
    Extrait les images du PDF avec optimisations pour vidéo
    
    Args:
        pdf_path: PDF source
        output_dir: Dossier de sortie
        dpi: 150 DPI suffit pour 720p/1080p
        quality: 85% = bon compromis qualité/poids
        max_width: Largeur max (1280px = 720p, 1920px = 1080p)
    """
    try:
        # Utiliser pdftoppm pour convertir PDF → JPEG
        cmd = [
            'pdftoppm',
            '-jpeg',
            '-r', str(dpi),
            '-jpegopt', f'quality={quality}',
            str(pdf_path),
            str(output_dir / 'temp')
        ]
        
        subprocess.run(cmd, check=True, capture_output=True)
        
        # pdftoppm génère: temp-1.jpg, temp-2.jpg, etc.
        temp_files = sorted(output_dir.glob('temp-*.jpg'))
        output_files = []
        
        for i, temp_file in enumerate(temp_files, start=1):
            # Redimensionner si trop large (optimisation vidéo)
            img = Image.open(temp_file)
            width, height = img.size
            
            if width > max_width:
                # Calculer nouvelle hauteur en gardant le ratio
                new_width = max_width
                new_height = int((max_width / width) * height)
                
                # Redimensionner avec LANCZOS (haute qualité)
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
            
            # Sauvegarder optimisé
            new_name = output_dir / f"{i:02d}.jpg"
            img.save(new_name, format='JPEG', quality=quality, optimize=True, progressive=True)
            
            # Supprimer le fichier temporaire
            temp_file.unlink()
            
            output_files.append(new_name)
            img.close()
        
        return output_files
    
    except subprocess.CalledProcessError as e:
        print(f"❌ Erreur extraction PDF: {e}")
        return []

def extract_slides(ppt_path, output_folder, dpi=150, quality=85, max_width=1280, verbose=True):
    """
    Extrait chaque slide d'un PowerPoint (.ppt ou .pptx) en JPEG optimisé pour vidéo
    
    Args:
        ppt_path: Chemin du fichier .ppt/.pptx
        output_folder: Dossier de sortie
        dpi: Résolution (150 = optimal pour vidéo 720p/1080p)
        quality: Qualité JPEG (85 = bon compromis)
        max_width: Largeur max (1280 = 720p, 1920 = 1080p)
        verbose: Afficher les informations
    
    Returns:
        list: Liste des chemins des images créées
    """
    ppt_path = Path(ppt_path)
    output_folder = Path(output_folder)
    
    if not ppt_path.exists():
        raise FileNotFoundError(f"Fichier PowerPoint introuvable: {ppt_path}")
    
    if not ppt_path.suffix.lower() in ['.ppt', '.pptx']:
        raise ValueError(f"Ce n'est pas un fichier PowerPoint: {ppt_path}")
    
    # Créer le dossier de sortie
    output_folder.mkdir(exist_ok=True, parents=True)
    
    # Vérifier les dépendances
    if not check_libreoffice():
        return []
    
    if not check_poppler():
        return []
    
    if verbose:
        print(f"📊 PowerPoint: {ppt_path.name}")
        print(f"ℹ️  Résolution: {dpi} DPI (optimisé vidéo)")
        print(f"ℹ️  Qualité JPEG: {quality}%")
        print(f"ℹ️  Largeur max: {max_width}px")
        print(f"📁 Sortie: {output_folder}")
        print()
    
    try:
        # Étape 1: Convertir PPT → PDF
        if verbose:
            print("⏳ Étape 1/2: Conversion PowerPoint → PDF...")
        
        pdf_path = convert_ppt_to_pdf(ppt_path, output_folder)
        
        if not pdf_path:
            return []
        
        if verbose:
            print(f"  ✅ PDF créé: {pdf_path.name}")
        
        # Étape 2: Extraire PDF → JPEG optimisé
        if verbose:
            print("\n⏳ Étape 2/2: Extraction PDF → JPEG optimisé...")
        
        output_files = extract_images_from_pdf(pdf_path, output_folder, dpi, quality, max_width)
        
        if not output_files:
            return []
        
        # Afficher les résultats
        if verbose:
            for i, output_file in enumerate(output_files, start=1):
                size_kb = output_file.stat().st_size / 1024
                img = Image.open(output_file)
                width, height = img.size
                img.close()
                print(f"  ✅ Slide {i}/{len(output_files)}: {output_file.name} ({width}x{height}, {size_kb:.1f} KB)")
        
        # Nettoyer le PDF temporaire
        if pdf_path.exists():
            pdf_path.unlink()
            if verbose:
                print(f"\n🗑️  PDF temporaire supprimé")
        
        if verbose:
            total_size = sum(f.stat().st_size for f in output_files) / (1024 * 1024)
            avg_size = (sum(f.stat().st_size for f in output_files) / len(output_files)) / 1024
            print(f"\n🎉 Extraction terminée!")
            print(f"📊 {len(output_files)} slides extraites")
            print(f"📦 Taille totale: {total_size:.2f} MB")
            print(f"📊 Taille moyenne: {avg_size:.1f} KB/slide")
        
        return [str(f) for f in output_files]
    
    except Exception as e:
        print(f"❌ Erreur lors de l'extraction: {e}")
        import traceback
        traceback.print_exc()
        return []

def batch_extract(input_folder, output_folder, dpi=150, quality=85, max_width=1280):
    """Extrait les slides de tous les PowerPoints d'un dossier"""
    input_path = Path(input_folder)
    output_path = Path(output_folder)
    
    if not input_path.is_dir():
        raise NotADirectoryError(f"Dossier introuvable: {input_folder}")
    
    ppt_files = list(input_path.glob('*.ppt')) + list(input_path.glob('*.pptx')) + \
                list(input_path.glob('*.PPT')) + list(input_path.glob('*.PPTX'))
    
    if not ppt_files:
        print(f"❌ Aucun fichier PowerPoint trouvé dans {input_folder}")
        return
    
    print(f"📂 {len(ppt_files)} PowerPoint(s) trouvé(s)\n")
    
    processed = 0
    failed = 0
    
    for ppt_file in ppt_files:
        print(f"{'='*60}")
        print(f"[{processed + failed + 1}/{len(ppt_files)}]")
        
        # Créer un sous-dossier pour ce PPT
        ppt_output = output_path / ppt_file.stem
        
        result = extract_slides(ppt_file, ppt_output, dpi, quality, max_width, verbose=True)
        
        if result:
            processed += 1
        else:
            failed += 1
        
        print()
    
    print(f"{'='*60}")
    print(f"✅ Traités: {processed}")
    print(f"❌ Échecs: {failed}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Extrait chaque slide d'un PowerPoint (.ppt/.pptx) en JPEG optimisé pour vidéo",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Exemples:
  # Extraction optimisée pour vidéo 720p (défaut)
  python extract_from_ppt.py presentation.ppt -o test
  
  # Pour vidéo 1080p Full HD
  python extract_from_ppt.py presentation.ppt -o test --max-width 1920
  
  # Qualité maximale (fichiers plus lourds)
  python extract_from_ppt.py presentation.ppt -o test --quality 95 --dpi 300
  
  # Ultra-compressé (qualité réduite)
  python extract_from_ppt.py presentation.ppt -o test --quality 70 --dpi 100
  
  # Batch
  python extract_from_ppt.py --batch /dossier -o /output

Presets recommandés pour vidéo:
  - 720p  : --dpi 150 --quality 85 --max-width 1280 [DÉFAUT]
  - 1080p : --dpi 200 --quality 90 --max-width 1920
  - 480p  : --dpi 100 --quality 80 --max-width 854

Taille attendue: ~50-150 KB/slide (au lieu de 500 KB)
        """
    )
    
    parser.add_argument('input', nargs='?', help="Fichier .ppt/.pptx ou dossier (avec --batch)")
    parser.add_argument('-o', '--output', required=True, help="Dossier de sortie")
    parser.add_argument('--dpi', type=int, default=150, help="Résolution DPI (défaut: 150 pour vidéo)")
    parser.add_argument('--quality', type=int, default=85, help="Qualité JPEG 1-100 (défaut: 85)")
    parser.add_argument('--max-width', type=int, default=1280, help="Largeur max en pixels (défaut: 1280 = 720p)")
    parser.add_argument('--batch', action='store_true', help="Mode batch")
    parser.add_argument('-q', '--quiet', action='store_true', help="Mode silencieux")
    
    args = parser.parse_args()
    
    if not args.input:
        parser.print_help()
        sys.exit(1)
    
    if args.quality < 1 or args.quality > 100:
        print("❌ La qualité doit être entre 1 et 100")
        sys.exit(1)
    
    if args.batch:
        batch_extract(args.input, args.output, args.dpi, args.quality, args.max_width)
    else:
        extract_slides(args.input, args.output, args.dpi, args.quality, args.max_width, verbose=not args.quiet)