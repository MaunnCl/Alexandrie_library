import { CongressRepository } from "../../src/repository/congress.repository";
import { SessionRepository } from "../../src/repository/session.repository";
import { ContentRepository } from "../../src/repository/content.repository";
import { OratorsRepository } from "../../src/repository/orators.repository";
import { getPresignedUrl, listObjectsFromPrefix } from "../aws.utils";

export async function syncVideo(): Promise<void> {
  console.log("🎞️ Syncing video URLs...");
  const congresses = await CongressRepository.findAll();

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

        const s3Path = `${congress.key}/${session.name}/${orator.name}/${content.title.replace(/ /g, "_")}.mp4`;

        try {
          const existingFiles = await listObjectsFromPrefix(s3Path);
          if (existingFiles.length === 0) {
            console.log(`⚠️ Aucun fichier .mp4 trouvé pour ${s3Path}`);
            continue;
          }
        
          const signedUrl = await getPresignedUrl(s3Path);
          await ContentRepository.update(
            content.id,
            content.title,
            content.orator_id,
            content.description ?? "",
            signedUrl,
            content.timeStamp ?? ""
          );
          console.log(`✅ Synced video for content ${content.id}: ${s3Path}`);
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "Unknown error";
          console.error(`❌ Error syncing video for content ${content.id}:`, message);
        }
      }
    }
    console.log("\n\n");
  }
}
