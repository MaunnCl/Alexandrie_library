import subprocess
import os
import json

LOCAL_FOLDER = "/Users/pierrickg/Desktop/Github/Maunn/Alexandrie_library/orators"
S3_BUCKET = "s3://greatalexandria/orators/"

def rename_images():
    for root, _, files in os.walk(LOCAL_FOLDER):
        for file in files:
            name, ext = os.path.splitext(file)
            if ext:
                old_path = os.path.join(root, file)
                new_path = os.path.join(root, name + ".jpg")

                if old_path != new_path:
                    os.rename(old_path, new_path)
                    print(f"🔄 {file} → {os.path.basename(new_path)}")

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

def upload_images():
    if not os.path.isdir(LOCAL_FOLDER):
        print(f"❌ Le dossier {LOCAL_FOLDER} n'existe pas")
        return

    uploaded_count = 0
    skipped_count = 0

    # Parcours tous les fichiers locaux
    for root, _, files in os.walk(LOCAL_FOLDER):
        for file in files:
            local_file_path = os.path.join(root, file)
            relative_path = os.path.relpath(local_file_path, LOCAL_FOLDER)
            s3_file_path = S3_BUCKET + relative_path.replace("\\", "/")

            # Vérifie si le fichier existe déjà sur S3
            if file_exists_on_s3(s3_file_path):
                print(f"⚠️ Fichier déjà existant, ignoré : {s3_file_path}")
                skipped_count += 1
                continue

            # Upload le fichier individuel
            cmd = ["aws", "s3", "cp", local_file_path, s3_file_path]
            try:
                print(f"📤 Upload : {file}")
                subprocess.run(cmd, check=True, capture_output=True)
                print(f"✅ Uploadé : {s3_file_path}")
                uploaded_count += 1
            except subprocess.CalledProcessError as e:
                print(f"❌ Erreur upload {file}: {e}")

    print(f"\n🎉 Upload terminé !")
    print(f"📊 {uploaded_count} fichiers uploadés")
    print(f"⚠️ {skipped_count} fichiers ignorés (déjà existants)")

if __name__ == "__main__":
    rename_images()
    upload_images()