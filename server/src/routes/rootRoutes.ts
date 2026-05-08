import express from 'express';
import * as rootControllers from '../controllers/rootControllers.js'

const router = express.Router();

/**
 * swagger
 * /:
 *   get:
 *     summary: Affiche la route racine de l'API
 *     tags: [Root]
 *     responses:
 *       200:
 *         description: Message de bienvenue
 */
router.get('/', rootControllers.showRoot);

export default router;
