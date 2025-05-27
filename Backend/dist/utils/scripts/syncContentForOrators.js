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
exports.syncOratorContentIds = syncOratorContentIds;
const content_repository_1 = require("../../src/repository/content.repository");
const orators_repository_1 = require("../../src/repository/orators.repository");
function syncOratorContentIds() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("🔄 Syncing content_ids in orators table...");
        const allOrators = yield orators_repository_1.OratorsRepository.findAll();
        if (!allOrators || allOrators.length === 0) {
            console.log("❌ No orators found.");
            return;
        }
        for (const orator of allOrators) {
            try {
                const existingContentIds = orator.content_ids || [];
                const contents = yield content_repository_1.ContentRepository.findByOratorId(orator.id);
                const foundContentIds = contents.map(content => content.id);
                // Fusion sans doublon
                const mergedContentIds = Array.from(new Set([...existingContentIds, ...foundContentIds]));
                // Vérifie si une mise à jour est nécessaire
                const isDifferent = mergedContentIds.length !== existingContentIds.length ||
                    !mergedContentIds.every(id => existingContentIds.includes(id));
                if (isDifferent) {
                    yield orators_repository_1.OratorsRepository.updateContentIds(orator.id, mergedContentIds);
                    console.log(`✅ Updated orator ${orator.id} (${orator.name}) with content_ids: [${mergedContentIds.join(", ")}]`);
                }
                else {
                    console.log(`ℹ️ No update needed for orator ${orator.id} (${orator.name})`);
                }
            }
            catch (error) {
                const message = error instanceof Error ? error.message : "Unknown error";
                console.error(`❌ Error updating orator ${orator.id}:`, message);
            }
        }
        console.log("🎉 Finished syncing all orators.");
    });
}
