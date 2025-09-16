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
exports.checkVideoSync = checkVideoSync;
const content_repository_1 = require("../../src/repository/content.repository");
const orators_repository_1 = require("../../src/repository/orators.repository");
const session_repository_1 = require("../../src/repository/session.repository");
const congress_repository_1 = require("../../src/repository/congress.repository");
const aws_utils_1 = require("../aws.utils");
function normalizePath(path) {
    return path.trim().replace(/ /g, "_");
}
function checkVideoSync() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("🔍 Vérification des vidéos S3 vs base de données...");
        const s3Paths = yield (0, aws_utils_1.listObjectsFromPrefix)('');
        const s3Mp4Paths = s3Paths.filter((path) => path.endsWith(".mp4"));
        const congresses = yield congress_repository_1.CongressRepository.findAll();
        const dbPaths = [];
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
                    const expectedPath = `${congress.key}/${session.name}/${orator.name}/${normalizePath(content.title)}.mp4`;
                    dbPaths.push(expectedPath);
                }
            }
        }
        const missingInS3 = dbPaths.filter((path) => !s3Mp4Paths.includes(path));
        const missingInDB = s3Mp4Paths.filter((path) => !dbPaths.includes(path));
        // Affichage
        console.log("\n❌ Vidéos en DB mais absentes de S3 :");
        if (missingInS3.length === 0)
            console.log("✅ Aucune");
        else
            missingInS3.forEach((p) => console.log(`  - ${p}`));
        console.log("\n🟡 Vidéos sur S3 mais non référencées dans la DB :");
        if (missingInDB.length === 0)
            console.log("✅ Aucune");
        else
            missingInDB.forEach((p) => console.log(`  - ${p}`));
        console.log("\n✅ Résumé :");
        console.log(`→ Total DB videos : ${dbPaths.length}`);
        console.log(`→ Total S3 videos : ${s3Mp4Paths.length}`);
        console.log(`→ Manquantes sur S3 : ${missingInS3.length}`);
        console.log(`→ En trop sur S3 : ${missingInDB.length}`);
    });
}
