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
exports.syncOratorsPhotos = syncOratorsPhotos;
require("dotenv/config");
const orators_repository_1 = require("../../src/repository/orators.repository");
const aws_utils_1 = require("../aws.utils");
const EXTENSIONS = ['JPG', 'jpg'];
function syncOratorsPhotos() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        console.log("📸 SyncOratorsPhotos started...");
        const orators = yield orators_repository_1.OratorsRepository.findAll();
        const filesInBucket = yield (0, aws_utils_1.listObjectsFromPrefix)('orators/');
        const fileMap = new Map();
        for (const file of filesInBucket) {
            fileMap.set(file.toLowerCase(), file);
        }
        for (const orator of orators) {
            const lastName = (_a = orator.name.split(' ').pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            if (!lastName)
                continue;
            const match = EXTENSIONS.map(ext => `orators/${lastName}.${ext}`)
                .map(key => key.toLowerCase())
                .find(normalizedKey => fileMap.has(normalizedKey));
            if (!match) {
                console.warn(`🚫 No matching photo found for ${orator.name}`);
                continue;
            }
            const originalKey = fileMap.get(match);
            try {
                const presignedUrl = yield (0, aws_utils_1.getPresignedUrl)(originalKey);
                yield orators_repository_1.OratorsRepository.update(orator.id, Object.assign(Object.assign({}, orator), { picture: presignedUrl }));
                console.log(`✅ Updated photo for ${orator.name} => ${originalKey}`);
            }
            catch (error) {
                console.error(`❌ Error syncing photo for ${orator.name}:`, error.message);
            }
        }
    });
}
syncOratorsPhotos();
