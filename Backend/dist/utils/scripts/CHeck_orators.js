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
exports.checkDuplicateOrators = checkDuplicateOrators;
const orators_repository_1 = require("../../src/repository/orators.repository");
function checkDuplicateOrators() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("🔍 Vérification des doublons d'orateurs dans la base de données...");
        const allOrators = yield orators_repository_1.OratorsRepository.findAll(); // méthode à avoir
        const nameMap = {}; // nom => liste des IDs
        for (const orator of allOrators) {
            const name = orator.name.trim().toLowerCase(); // normalisation du nom
            if (!nameMap[name]) {
                nameMap[name] = [orator.id];
            }
            else {
                nameMap[name].push(orator.id);
            }
        }
        const duplicates = Object.entries(nameMap).filter(([_, ids]) => ids.length > 1);
        if (duplicates.length === 0) {
            console.log("✅ Aucun doublon trouvé.");
        }
        else {
            console.log("❌ Doublons trouvés :");
            for (const [name, ids] of duplicates) {
                console.log(`→ "${name}" apparaît ${ids.length} fois (IDs: ${ids.join(", ")})`);
            }
        }
    });
}
checkDuplicateOrators();
