import app from "./app";
import cron from "node-cron";
import { syncVideo } from "./utils/scripts/syncVideo.utils";
import { syncOratorsPhotos } from "./utils/scripts/syncOratorsPhotos.utils";
import { syncTimeStamp } from "./utils/scripts/syncTimeStamp";
import { syncOratorContentIds } from "./utils/scripts/syncContentForOrators";
import { checkVideoSync } from "./utils/scripts/checkMissingVideos";

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Serveur démarré sur http://0.0.0.0:${PORT}`);
  console.log(`📄 Swagger disponible sur http://0.0.0.0:${PORT}/api-docs`);

  cron.schedule("0 * * * *", async () => {
    console.log("⏳ [CRON] Début de la tâche horaire...");

    try {
      console.log("▶️ Lancement de syncVideo...");
      await syncVideo();
      console.log("✅ syncVideo terminé !\n");
    } catch (err) {
      console.error("❌ Erreur dans syncVideo :\n", err);
    }

    try {
      console.log("▶️ Lancement de syncOratorsPhotos...");
      await syncOratorsPhotos();
      console.log("✅ syncOratorsPhotos terminé !\n");
    } catch (err) {
      console.error("❌ Erreur dans syncOratorsPhotos :\n", err);
    }

    try {
      console.log("▶️ Lancement de syncTimeStamp...");
      await syncTimeStamp();
      console.log("✅ syncTimeStamp terminé !\n");
    } catch (err) {
      console.error("❌ Erreur dans syncTimeStamp :\n", err);
    }
  
    try {
      console.log("▶️ Lancement de syncContentsOrator...");
      await syncOratorContentIds();
      console.log("✅ syncContentsOrator terminé !\n");
    } catch (err) {
      console.error("❌ Erreur dans syncContentsOrator :\n", err);
    }

    try {
      console.log("▶️ Lancement de checkMissingVidéos...");
      await checkVideoSync();
      console.log("✅ checkVideoSync terminé !\n");
    } catch (err) {
      console.error("❌ Erreur dans checkVideoSync :\n", err);
    }

    console.log("🕒 [CRON] Tâche complète terminée.\n");
  });

  console.log("🕒 Cron job planifié pour exécuter les scripts toutes les heures.");
});
