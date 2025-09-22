import 'dotenv/config';
import { OratorsRepository } from "../../src/repository/orators.repository";
import { getPresignedUrl, listObjectsFromPrefix } from "../aws.utils";

const EXTENSIONS = ['JPG', 'jpg'];

export async function syncOratorsPhotos(): Promise<void> {
  console.log("📸 SyncOratorsPhotos started...");

  const orators = await OratorsRepository.findAll();
  const filesInBucket = await listObjectsFromPrefix('orators/');
  const fileMap = new Map<string, string>();
  for (const file of filesInBucket) {
    fileMap.set(file.toLowerCase(), file);
  }

  const usedFiles = new Set<string>();

  for (const orator of orators) {
    const parts = orator.name.split(' ');
    const lastName = parts.pop()?.toLowerCase();
    const firstName = parts[0]?.toLowerCase();

    if (!lastName) continue;

    const sameLastName = orators.filter(o => o.name.split(' ').pop()?.toLowerCase() === lastName);

    let possibleKeys: string[];
    if (sameLastName.length > 1 && firstName) {
      const firstInitial = firstName[0];
      possibleKeys = EXTENSIONS.map(ext => `orators/${firstInitial}_${lastName}.${ext}`);
    } else {
      possibleKeys = EXTENSIONS.map(ext => `orators/${lastName}.${ext}`);
    }

    const match = possibleKeys
      .map(key => key.toLowerCase())
      .find(normalizedKey => fileMap.has(normalizedKey));

    if (!match) {
      console.warn(`🚫 No matching photo found for ${orator.name}`);
      continue;
    }

    const originalKey = fileMap.get(match)!;
    
    usedFiles.add(originalKey);

    try {
      const presignedUrl = await getPresignedUrl(originalKey);
      await OratorsRepository.update(orator.id, {
        ...orator,
        picture: presignedUrl,
      });
      console.log(`✅ Updated photo for ${orator.name} => ${originalKey}`);
    } catch (error: unknown) {
      console.error(`❌ Error syncing photo for ${orator.name}:`, (error as Error).message);
    }
  }
  const unusedFiles = filesInBucket.filter(f => !usedFiles.has(f));
  if (unusedFiles.length > 3) {
    console.log("\n📂 Fichiers inutilisés :");
    unusedFiles.forEach(f => console.log(f));
  } else {
    console.log("\n✅ Tous les fichiers sont utilisés !");
  }
}
