import { CongressRepository } from "../../src/repository/congress.repository";
import { SessionRepository } from "../../src/repository/session.repository";
import { ContentRepository } from "../../src/repository/content.repository";
import { OratorsRepository } from "../../src/repository/orators.repository";
import { getPresignedUrl, listObjectsFromPrefix } from "../aws.utils";

export async function syncTimeStamp(): Promise<void> {
  console.log("🎞️ Syncing content timestamps (.txt / .json)...");

  const congresses = await CongressRepository.findAll();

  for (const congress of congresses) {
    if (congress.key !== "ISICEM_2006") continue; // Pour tests locaux uniquement

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

        const extensionsToTry = [".txt", ".json"];
        let synced = false;

        for (const ext of extensionsToTry) {
          const fullPath = `${fileBasePath}${ext}`;
          const files = await listObjectsFromPrefix(fullPath);

          if (files.length > 0) {
            try {
              const signedUrl = await getPresignedUrl(fullPath);
              await ContentRepository.update(
                content.id,
                content.title,
                content.orator_id,
                content.description ?? "",
                content.url ?? "",
                signedUrl
              );
              console.log(`✅ Synced ${ext} for content ${content.id} (${fullPath})`);
              synced = true;
              break; // dès qu’un des deux est trouvé et synchronisé, on arrête
            } catch (error: unknown) {
              const message = error instanceof Error ? error.message : "Unknown error";
              console.error(`❌ Erreur pendant la génération du lien pour ${fullPath}:`, message);
            }
          }
        }

        if (!synced) {
          console.warn(`⚠️ Aucun .txt ou .json trouvé pour : ${fileBasePath}`);
        }
      }
    }

    console.log("\n\n");
  }
}
