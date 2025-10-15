import { CongressRepository } from "../../src/repository/congress.repository";
import { SessionRepository } from "../../src/repository/session.repository";
import { ContentRepository } from "../../src/repository/content.repository";
import { OratorsRepository } from "../../src/repository/orators.repository";
import { getPresignedUrl, listObjectsFromPrefix } from "../aws.utils";

export async function syncVideo(): Promise<void> {
  console.log("🎞️ Syncing video/audio URLs...");
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

        const basePath = `${congress.key}/${session.name}/${orator.name}/${content.title.replace(/ /g, "_")}`;
        const mp4Path = `${basePath}.mp4`;
        const jsonPath = `${basePath}.json`;

        try {
          const mp4Files = await listObjectsFromPrefix(mp4Path);
          
          if (mp4Files.length > 0) {
            const videoUrl = await getPresignedUrl(mp4Path);
            
            const jsonFiles = await listObjectsFromPrefix(jsonPath);
            const timestampUrl = jsonFiles.length > 0 ? await getPresignedUrl(jsonPath) : "";
            
            await ContentRepository.update(
              content.id,
              content.title,
              content.orator_id,
              content.description ?? "",
              videoUrl,
              timestampUrl
            );
            console.log(`✅ Synced video for content ${content.id}: ${mp4Path}`);
          } else {
            const audioExtensions = ['.mp3', '.wav', '.m4a'];
            let audioFound = false;
            
            for (const ext of audioExtensions) {
              const audioPath = `${basePath}${ext}`;
              const audioFiles = await listObjectsFromPrefix(audioPath);
              
              if (audioFiles.length > 0) {
                const audioUrl = await getPresignedUrl(audioPath);
                
                await ContentRepository.update(
                  content.id,
                  content.title,
                  content.orator_id,
                  content.description ?? "",
                  audioUrl,
                  ""
                );
                console.log(`✅ Synced audio for content ${content.id}: ${audioPath} (no timestamps)`);
                audioFound = true;
                break;
              }
            }
            
            if (!audioFound) {
              console.log(`⚠️ No media file (mp4/mp3/wav/m4a) found for ${basePath}`);
            }
          }
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "Unknown error";
          console.error(`❌ Error syncing media for content ${content.id}:`, message);
        }
      }
    }
    console.log("\n\n");
  }
}
