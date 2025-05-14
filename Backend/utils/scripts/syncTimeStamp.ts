import { CongressRepository } from "../../src/repository/congress.repository";
import { SessionRepository } from "../../src/repository/session.repository";
import { ContentRepository } from "../../src/repository/content.repository";
import { OratorsRepository } from "../../src/repository/orators.repository";
import { getPresignedUrl, listObjectsFromPrefix } from "../aws.utils";

export async function syncTimeStamp(): Promise<void> {
  console.log("🎞️ Syncing content URLs (.txt / .json)...");

  const congresses = await CongressRepository.findAll();

  for (const congress of congresses) {
    if (!congress.session_ids?.length) continue;

    for (const sessionId of congress.session_ids) {
      const session = await SessionRepository.findById(sessionId);
      if (!session?.content_ids?.length) continue;

      for (const contentId of session.content_ids) {
        const content = await ContentRepository.findById(contentId);
        if (!content || !content.orator_id || !content.title) continue;

        const orator = await OratorsRepository.findById(content.orator_id);
        if (!orator) continue;

        const fileBasePath = `${congress.key}/${session.name}/${orator.name}/${content.title.replace(/ /g, "_")}`;

        // Essayer d'abord avec .txt, sinon .json
        const possibleExtensions = [".txt", ".json"];
        let foundFilePath: string | null = null;

        for (const ext of possibleExtensions) {
          const pathWithExt = `${fileBasePath}${ext}`;
          const matchingFiles = await listObjectsFromPrefix(pathWithExt);
          if (matchingFiles.length > 0) {
            foundFilePath = pathWithExt;
            break;
          }
        }

        if (!foundFilePath) {
          console.warn(`⚠️ Aucun fichier .txt ou .json trouvé pour : ${fileBasePath}`);
          continue;
        }

        try {
          const signedUrl = await getPresignedUrl(foundFilePath);
          await ContentRepository.update(
            content.id,
            content.title,
            content.orator_id,
            content.description ?? "",
            content.url ?? "",
            signedUrl
          );
          console.log(`✅ Synced ${foundFilePath} to content ${content.id}`);
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "Unknown error";
          console.error(`❌ Erreur lors du sync de ${foundFilePath} (content ${content.id}):`, message);
        }
      }
    }
  }
}
