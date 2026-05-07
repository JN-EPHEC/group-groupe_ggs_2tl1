import express from 'express';
import { login, refreshAccessToken } from '../controllers/jwtControllers.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: JWT
 *   description: Authentification et gestion des tokens
 */

/**
 * @swagger
 * /api/jwt:
 *   post:
 *     summary: Connexion
 *     tags: [JWT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TokenPair'
 *       401:
 *         description: Identifiants invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', login);

/**
 * @swagger
 * /api/jwt/refresh:
 *   post:
 *     summary: Rafraîchir l'access token
 *     tags: [JWT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefreshInput'
 *     responses:
 *       200:
 *         description: Nouvel access token généré
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AccessToken'
 *       401:
 *         description: Refresh token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: JWT_REFRESH_SECRET non configuré
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/refresh', refreshAccessToken);

export default router;