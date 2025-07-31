"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const node_cron_1 = __importDefault(require("node-cron"));
const syncVideo_utils_1 = require("./utils/scripts/syncVideo.utils");
const syncOratorsPhotos_utils_1 = require("./utils/scripts/syncOratorsPhotos.utils");
const syncTimeStamp_1 = require("./utils/scripts/syncTimeStamp");
const syncContentForOrators_1 = require("./utils/scripts/syncContentForOrators");
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;
const runCronJobs = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("⏳ [CRON] Début de la tâche horaire...");
    try {
        console.log("▶️ Lancement de syncVideo...");
        yield (0, syncVideo_utils_1.syncVideo)();
        console.log("✅ syncVideo terminé !\n");
    }
    catch (err) {
        console.error("❌ Erreur dans syncVideo :\n", err);
    }
    try {
        console.log("▶️ Lancement de syncOratorsPhotos...");
        yield (0, syncOratorsPhotos_utils_1.syncOratorsPhotos)();
        console.log("✅ syncOratorsPhotos terminé !\n");
    }
    catch (err) {
        console.error("❌ Erreur dans syncOratorsPhotos :\n", err);
    }
    try {
        console.log("▶️ Lancement de syncTimeStamp...");
        yield (0, syncTimeStamp_1.syncTimeStamp)();
        console.log("✅ syncTimeStamp terminé !\n");
    }
    catch (err) {
        console.error("❌ Erreur dans syncTimeStamp :\n", err);
    }
    try {
        console.log("▶️ Lancement de syncContentsOrator...");
        yield (0, syncContentForOrators_1.syncOratorContentIds)();
        console.log("✅ syncContentsOrator terminé !\n");
    }
    catch (err) {
        console.error("❌ Erreur dans syncContentsOrator :\n", err);
    }
    console.log("🕒 [CRON] Tâche complète terminée.\n");
});
const server = app_1.default.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Serveur démarré sur http://0.0.0.0:${PORT}`);
    console.log(`📄 Swagger disponible sur http://0.0.0.0:${PORT}/api-docs`);
    // Lancer tout de suite au démarrage
    //runCronJobs();
    // Puis relancer chaque heure
    node_cron_1.default.schedule("0 * * * *", runCronJobs);
    console.log("🕒 Cron job planifié pour exécuter les scripts toutes les heures.");
});
