import express from "express";
import * as addressControllers from "../controllers/addressControllers.js";
import checkIdParam from "../middlewares/checkIdParam.js";
import checkEmptyBody from "../middlewares/checkEmptyBody.js";
import validateAddressBody from "../middlewares/validateAddressBody.js";

const router = express.Router();

//Route pour récupérer l'adresse d'un client

/**
 * @swagger
 * tags:
 *   name: Adresses
 *   description: Gestion des adresses de l'utilisateur connecté
 */

/**
 * @swagger
 * /api/addresses/me:
 *   get:
 *     summary: Récupérer mes adresses
 *     tags: [Adresses]
 *     responses:
 *       200:
 *         description: Liste des adresses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Address'
 *       401:
 *         description: Utilisateur non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/me", addressControllers.getMyAddresses);

/**
 * @swagger
 * /api/addresses/me:
 *   post:
 *     summary: Ajouter une adresse
 *     tags: [Adresses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddressInput'
 *     responses:
 *       201:
 *         description: Adresse créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       400:
 *         description: Champs adresse manquants
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Utilisateur non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/me", validateAddressBody, addressControllers.createMyAddress);

/**
 * @swagger
 * /api/addresses/me/{id}:
 *   patch:
 *     summary: Modifier une adresse
 *     tags: [Adresses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddressInputPartial'
 *     responses:
 *       200:
 *         description: Adresse modifiée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Address'
 *       400:
 *         description: Id invalide ou aucune donnée envoyée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Utilisateur non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Adresse introuvable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch("/me/:id", checkIdParam, checkEmptyBody, addressControllers.updateMyAddress);

/**
 * @swagger
 * /api/addresses/me/{id}:
 *   delete:
 *     summary: Supprimer une adresse
 *     tags: [Adresses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       204:
 *         description: Adresse supprimée (aucun contenu retourné)
 *       400:
 *         description: Id adresse invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Utilisateur non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Adresse introuvable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/me/:id", checkIdParam, addressControllers.deleteMyAddress);

export default router;
