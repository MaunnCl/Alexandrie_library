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
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncVideo = syncVideo;
const congress_repository_1 = require("../../src/repository/congress.repository");
const session_repository_1 = require("../../src/repository/session.repository");
const content_repository_1 = require("../../src/repository/content.repository");
const orators_repository_1 = require("../../src/repository/orators.repository");
const aws_utils_1 = require("../aws.utils");
function syncVideo() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        console.log("🎞️ Syncing video URLs...");
        const congresses = yield congress_repository_1.CongressRepository.findAll();
        for (const congress of congresses) {
            if (!congress.session_ids || congress.session_ids.length === 0)
                continue;
            for (const sessionId of congress.session_ids) {
                const session = yield session_repository_1.SessionRepository.findById(sessionId);
                if (!session || !session.content_ids)
                    continue;
                for (const contentId of session.content_ids) {
                    const content = yield content_repository_1.ContentRepository.findById(contentId);
                    if (!content || !content.orator_id || !content.title)
                        continue;
                    const orator = yield orators_repository_1.OratorsRepository.findById(content.orator_id);
                    if (!orator)
                        continue;
                    const s3Path = `${congress.key}/${session.name}/${orator.name}/${content.title.replace(/ /g, "_")}.mp4`;
                    try {
                        const existingFiles = yield (0, aws_utils_1.listObjectsFromPrefix)(s3Path);
                        if (existingFiles.length === 0) {
                            console.log(`⚠️ Aucun fichier .mp4 trouvé pour ${s3Path}`);
                            continue;
                        }
                        const signedUrl = yield (0, aws_utils_1.getPresignedUrl)(s3Path);
                        yield content_repository_1.ContentRepository.update(content.id, content.title, content.orator_id, (_a = content.description) !== null && _a !== void 0 ? _a : "", signedUrl, (_b = content.timeStamp) !== null && _b !== void 0 ? _b : "");
                        console.log(`✅ Synced video for content ${content.id}: ${s3Path}`);
                    }
                    catch (error) {
                        const message = error instanceof Error ? error.message : "Unknown error";
                        console.error(`❌ Error syncing video for content ${content.id}:`, message);
                    }
                }
            }
            console.log("\n\n");
        }
    });
}
