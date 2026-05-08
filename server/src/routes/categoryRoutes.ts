import express from 'express';
import { getAllCategories } from '../controllers/categoryControllers.js';

const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Récupère la liste des catégories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Liste des catégories
 *       500:
 *         description: Erreur serveur
 */
router.get('/', getAllCategories);

export default router;
