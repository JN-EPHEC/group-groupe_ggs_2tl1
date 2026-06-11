import express from 'express';
import * as userControllers from '../controllers/userControllers';
import checkEmptyBody from '../middlewares/checkEmptyBody.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Utilisateur
 *   description: Gestion du profil de l'utilisateur connecté
 */
 
/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Lire mon profil
 *     tags: [Utilisateur]
 *     responses:
 *       200:
 *         description: Profil de l'utilisateur connecté
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Utilisateur introuvable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
//Permet de lire le profil du client
router.get('/me',userControllers.getProfile);
/**
 * @swagger
 * /api/users/me:
 *   patch:
 *     summary: Modifier mon profil
 *     tags: [Utilisateur]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInputPartial'
 *     responses:
 *       200:
 *         description: Profil mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Body vide ou aucune donnée valide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
//Permet de modifier le profil du client
router.patch('/me', checkEmptyBody, userControllers.modifyClient);
/**
 * @swagger
 * /api/users/me/password:
 *   patch:
 *     summary: Changer mon mot de passe
 *     tags: [Utilisateur]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PasswordInput'
 *     responses:
 *       200:
 *         description: Mot de passe modifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Body vide ou aucune donnée valide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

//Permet de changer le mot de passe du client
router.patch('/me/password', checkEmptyBody, userControllers.modifyPassword);
/**
 * @swagger
 * /api/users/me:
 *   delete:
 *     summary: Désactiver mon compte
 *     tags: [Utilisateur]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [isActive]
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Compte désactivé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Body vide ou aucune donnée valide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
//Permet de supprimer son compte
router.delete('/me', checkEmptyBody, userControllers.deleteAccount);

export default router;
