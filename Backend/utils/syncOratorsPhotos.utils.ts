import { OratorsRepository } from "../repository/orators.repository";
import { getPresignedUrl } from "./aws.utils";

export async function syncOratorsPhotos(): Promise<void> {
  const orators = await OratorsRepository.findAll();

  await Promise.all(
    orators.map(async (orator) => {
      if (!orator.picture) return;
      try {
        const url = await getPresignedUrl(orator.picture);
        await OratorsRepository.update(orator.id, {
          ...orator,
          picture: url,
        });
      } catch (error: unknown) {
        console.error(`Error syncing photo for orator ${orator.id}:`, (error as Error).message);
      }
    })
  );
}