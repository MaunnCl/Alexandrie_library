import app from "./app";
import cron from "node-cron";
import { syncVideo } from "./utils/scripts/syncVideo.utils";
import { syncOratorsPhotos } from "@utils/scripts/syncOratorsPhotos.utils";
import { syncTimeStamp } from "@utils/scripts/syncTimeStamp";

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Serveur démarré sur http://0.0.0.0:${PORT}`);
  console.log(`📄 Swagger disponible sur http://0.0.0.0:${PORT}/api-docs`);

  cron.schedule("0 * * * *", async () => {
    console.log("⏳ [CRON] Début de la tâche horaire...");

    try {
      console.log("▶️ Lancement de syncVideo...");
      await syncVideo();
      console.log("✅ syncVideo terminé !");
    } catch (err) {
      console.error("❌ Erreur dans syncVideo :", err);
    }

    try {
      console.log("▶️ Lancement de syncOratorsPhotos...");
      await syncOratorsPhotos();
      console.log("✅ syncOratorsPhotos terminé !");
    } catch (err) {
      console.error("❌ Erreur dans syncOratorsPhotos :", err);
    }

    try {
      console.log("▶️ Lancement de syncTimeStamp...");
      await syncTimeStamp();
      console.log("✅ syncTimeStamp terminé !");
    } catch (err) {
      console.error("❌ Erreur dans syncTimeStamp :", err);
    }
    console.log("🕒 [CRON] Tâche complète terminée.\n");
  });

  console.log("🕒 Cron job planifié pour exécuter les scripts toutes les heures.");
});
