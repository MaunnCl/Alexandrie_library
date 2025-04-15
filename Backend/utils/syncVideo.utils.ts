import { ContentRepository } from "../repository/content.repository";
import { getPresignedUrl } from "./aws.utils";

export async function syncVideo(): Promise<void> {
  const contents = await ContentRepository.findAll();

  await Promise.all(
    contents.map(async (content) => {
      // Vérifie que content.orator_id et content.url existent et que content.url est bien une string
      if (!content.orator_id || !content.url) return;

      try {
        const url = await getPresignedUrl(content.url); // content.url est sûr ici
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
