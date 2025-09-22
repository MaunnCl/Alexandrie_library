import subprocess
import os

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

def upload_images():
    if not os.path.isdir(LOCAL_FOLDER):
        print(f"❌ Le dossier {LOCAL_FOLDER} n'existe pas")
        return

    cmd = ["aws", "s3", "cp", LOCAL_FOLDER, S3_BUCKET, "--recursive"]

    try:
        print("🚀 Upload en cours...")
        subprocess.run(cmd, check=True)
        print("✅ Upload terminé avec succès")
    except subprocess.CalledProcessError as e:
        print(f"❌ Erreur lors de l'upload: {e}")

if __name__ == "__main__":
    rename_images()
    upload_images()
