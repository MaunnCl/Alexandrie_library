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

  for (const orator of orators) {
    const lastName = orator.name.split(' ').pop()?.toLowerCase();
    if (!lastName) continue;

    const match = EXTENSIONS.map(ext => `orators/${lastName}.${ext}`)
      .map(key => key.toLowerCase())
      .find(normalizedKey => fileMap.has(normalizedKey));

    if (!match) {
      console.warn(`🚫 No matching photo found for ${orator.name}`);
      continue;
    }

    const originalKey = fileMap.get(match)!;

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
}

syncOratorsPhotos();