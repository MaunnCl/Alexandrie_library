"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const history_controller_1 = require("../controllers/history.controller");
const router = express_1.default.Router();
/**
 * @swagger
 * /history:
 *   post:
 *     summary: Ajoute un contenu dans l’historique d’un utilisateur
 *     tags:
 *       - History
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - contentId
 *               - timeStamp
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               contentId:
 *                 type: integer
 *                 example: 10
 *               timeStamp:
 *                 type: string
 *                 example: test
 *     responses:
 *       201:
 *         description: Ajout réussi
 *       400:
 *         description: Données manquantes
 *       500:
 *         description: Erreur serveur
 */
router.post("/history", history_controller_1.historyController.addToHistory);
/**
 * @swagger
 * /history/{userId}:
 *   get:
 *     summary: Récupère l’historique de contenu d’un utilisateur
 *     tags:
 *       - History
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Liste des contenus vus par l'utilisateur
 *       400:
 *         description: Mauvais userId
 *       500:
 *         description: Erreur serveur
 */
router.get("/history/:userId", history_controller_1.historyController.getUserHistory);
/**
 * @swagger
 * /history/{id}:
 *   delete:
 *     summary: Supprime une entrée de l’historique
 *     tags:
 *       - History
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 42
 *     responses:
 *       204:
 *         description: Supprimé avec succès
 *       400:
 *         description: Mauvais id
 *       500:
 *         description: Erreur serveur
 */
router.delete("/history/:id", history_controller_1.historyController.deleteHistoryItem);
exports.default = router;
