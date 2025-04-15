import { ContentRepository } from "../repository/content.repository";
import { getPresignedUrl } from "./aws.utils";

export async function syncVideo(): Promise<void> {
  const contents = await ContentRepository.findAll();

  await Promise.all(
    contents.map(async (content) => {
      if (!content.orator_id || !content.url) return;

      try {
        const url = await getPresignedUrl(content.url);
        await ContentRepository.update(
          content.id,
          content.title,
          content.orator_id,
          content.description,
          url
        );
      } catch (error: unknown) {
        console.error(`Error syncing video for content ${content.id}:`, (error as Error).message);
      }
    })
  );
}