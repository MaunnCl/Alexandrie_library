import { ContentRepository } from "../../src/repository/content.repository";
import { OratorsRepository } from "../../src/repository/orators.repository";

export async function syncOratorContentIds(): Promise<void> {
  console.log("🔄 Syncing content_ids in orators table...");

  const allOrators = await OratorsRepository.findAll();
  if (!allOrators || allOrators.length === 0) {
    console.log("❌ No orators found.");
    return;
  }

  for (const orator of allOrators) {
    try {
      const existingContentIds = orator.content_ids || [];

      const contents = await ContentRepository.findByOratorId(orator.id);
      const foundContentIds = contents.map(content => content.id);

      // Fusion sans doublon
      const mergedContentIds = Array.from(new Set([...existingContentIds, ...foundContentIds]));

      // Vérifie si une mise à jour est nécessaire
      const isDifferent =
        mergedContentIds.length !== existingContentIds.length ||
        !mergedContentIds.every(id => existingContentIds.includes(id));

      if (isDifferent) {
        await OratorsRepository.updateContentIds(orator.id, mergedContentIds);
        console.log(`✅ Updated orator ${orator.id} (${orator.name}) with content_ids: [${mergedContentIds.join(", ")}]`);
      } else {
        console.log(`ℹ️ No update needed for orator ${orator.id} (${orator.name})`);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error(`❌ Error updating orator ${orator.id}:`, message);
    }
  }

  console.log("🎉 Finished syncing all orators.");
}