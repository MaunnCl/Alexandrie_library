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
exports.syncTimeStamp = syncTimeStamp;
const congress_repository_1 = require("../../src/repository/congress.repository");
const session_repository_1 = require("../../src/repository/session.repository");
const content_repository_1 = require("../../src/repository/content.repository");
const orators_repository_1 = require("../../src/repository/orators.repository");
const aws_utils_1 = require("../aws.utils");
function syncTimeStamp() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        console.log("🎞️ Syncing content timestamps (.txt / .json)...");
        const congresses = yield congress_repository_1.CongressRepository.findAll();
        for (const congress of congresses) {
            if (!((_a = congress.session_ids) === null || _a === void 0 ? void 0 : _a.length))
                continue;
            for (const sessionId of congress.session_ids) {
                const session = yield session_repository_1.SessionRepository.findById(sessionId);
                if (!((_b = session === null || session === void 0 ? void 0 : session.content_ids) === null || _b === void 0 ? void 0 : _b.length))
                    continue;
                for (const contentId of session.content_ids) {
                    const content = yield content_repository_1.ContentRepository.findById(contentId);
                    if (!content || !content.orator_id || !content.title)
                        continue;
                    const orator = yield orators_repository_1.OratorsRepository.findById(content.orator_id);
                    if (!orator)
                        continue;
                    const fileBasePath = `${congress.key}/${session.name}/${orator.name}/${content.title.replace(/ /g, "_")}`;
                    const extensionsToTry = [".txt", ".json"];
                    let synced = false;
                    for (const ext of extensionsToTry) {
                        const fullPath = `${fileBasePath}${ext}`;
                        const files = yield (0, aws_utils_1.listObjectsFromPrefix)(fullPath);
                        if (files.length > 0) {
                            try {
                                const signedUrl = yield (0, aws_utils_1.getPresignedUrl)(fullPath);
                                yield content_repository_1.ContentRepository.update(content.id, content.title, content.orator_id, (_c = content.description) !== null && _c !== void 0 ? _c : "", (_d = content.url) !== null && _d !== void 0 ? _d : "", signedUrl);
                                console.log(`✅ Synced ${ext} for content ${content.id} (${fullPath})`);
                                synced = true;
                                break; // dès qu’un des deux est trouvé et synchronisé, on arrête
                            }
                            catch (error) {
                                const message = error instanceof Error ? error.message : "Unknown error";
                                console.error(`❌ Erreur pendant la génération du lien pour ${fullPath}:`, message);
                            }
                        }
                    }
                    if (!synced) {
                        console.warn(`⚠️ Aucun .txt ou .json trouvé pour : ${fileBasePath}`);
                    }
                }
            }
            console.log("\n\n");
        }
    });
}
