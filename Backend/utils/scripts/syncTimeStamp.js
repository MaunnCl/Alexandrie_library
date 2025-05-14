"use strict";

const { CongressRepository } = require("../../src/repository/congress.repository");
const { SessionRepository } = require("../../src/repository/session.repository");
const { ContentRepository } = require("../../src/repository/content.repository");
const { OratorsRepository } = require("../../src/repository/orators.repository");
const { getPresignedUrl, listObjectsFromPrefix } = require("../aws.utils");

async function syncTimeStamp() {
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
        const extensions = [".txt", ".json"];
        let foundFilePath = null;

        for (const ext of extensions) {
          const path = `${fileBasePath}${ext}`;
          const files = await listObjectsFromPrefix(path);
          if (files.length > 0) {
            foundFilePath = path;
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
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown error";
          console.error(`❌ Error syncing ${foundFilePath} for content ${content.id}:`, message);
        }
      }
    }
  }
}

syncTimeStamp();
