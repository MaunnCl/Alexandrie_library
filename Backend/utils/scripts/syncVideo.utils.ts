import { ContentRepository } from "../../src/repository/content.repository";
import { getPresignedUrl } from "../aws.utils";

export async function syncVideo(): Promise<void> {
  const contents = await ContentRepository.findAll();

  await Promise.all(
    contents.map(async (content) => {
      if (!content.orator_id || !content.url) return;

      const safeUrl: string = content.url; // ✅ Cast sécurisé après vérification

      try {
        const url = await getPresignedUrl(safeUrl);
        await ContentRepository.update(
          content.id,
          content.title,
          content.orator_id,
          content.description,
          url
        );
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(`Error syncing video for content ${content.id}:`, message);
      }
    })
  );
}
