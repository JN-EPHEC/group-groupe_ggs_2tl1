import express from 'express';
import * as authControllers from '../controllers/authControllers';
import { validateLoginBody, validateRegisterBody } from '../middlewares/validateAuthBody.js';

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Inscription et connexion
 */
 
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Créer un compte
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Compte créé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Types invalides, format email invalide ou compte déjà existant
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.post('/login', validateLoginBody, authControllers.authLogin);



//Permet au client de se déconnecter
router.post('/logout', authControllers.authLogout);


export default router;
