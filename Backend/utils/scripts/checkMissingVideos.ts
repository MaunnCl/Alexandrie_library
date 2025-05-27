import { ContentRepository } from "../../src/repository/content.repository";
import { OratorsRepository } from "../../src/repository/orators.repository";
import { SessionRepository } from "../../src/repository/session.repository";
import { CongressRepository } from "../../src/repository/congress.repository";
import { listObjectsFromPrefix } from "../aws.utils";

function normalizePath(path: string): string {
  return path.trim().replace(/ /g, "_");
}

export async function checkVideoSync(): Promise<void> {
  console.log("🔍 Vérification des vidéos S3 vs base de données...");

  const s3Paths = await listObjectsFromPrefix('');
  const s3Mp4Paths = s3Paths.filter((path) => path.endsWith(".mp4"));

  const congresses = await CongressRepository.findAll();
  const dbPaths: string[] = [];

  for (const congress of congresses) {
    if (!congress.session_ids || congress.session_ids.length === 0) continue;

    for (const sessionId of congress.session_ids) {
      const session = await SessionRepository.findById(sessionId);
      if (!session || !session.content_ids) continue;

      for (const contentId of session.content_ids) {
        const content = await ContentRepository.findById(contentId);
        if (!content || !content.orator_id || !content.title) continue;

        const orator = await OratorsRepository.findById(content.orator_id);
        if (!orator) continue;

        const expectedPath = `${congress.key}/${session.name}/${orator.name}/${normalizePath(content.title)}.mp4`;
        dbPaths.push(expectedPath);
      }
    }
  }

  const missingInS3 = dbPaths.filter((path) => !s3Mp4Paths.includes(path));
  const missingInDB = s3Mp4Paths.filter((path) => !dbPaths.includes(path));

  // Affichage
  console.log("\n❌ Vidéos en DB mais absentes de S3 :");
  if (missingInS3.length === 0) console.log("✅ Aucune");
  else missingInS3.forEach((p) => console.log(`  - ${p}`));

  console.log("\n🟡 Vidéos sur S3 mais non référencées dans la DB :");
  if (missingInDB.length === 0) console.log("✅ Aucune");
  else missingInDB.forEach((p) => console.log(`  - ${p}`));

  console.log("\n✅ Résumé :");
  console.log(`→ Total DB videos : ${dbPaths.length}`);
  console.log(`→ Total S3 videos : ${s3Mp4Paths.length}`);
  console.log(`→ Manquantes sur S3 : ${missingInS3.length}`);
  console.log(`→ En trop sur S3 : ${missingInDB.length}`);
}