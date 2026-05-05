import express from 'express';
import { getProducts } from '../controllers/productControllers.js';

const router = express.Router();

/**
 * @swagger
 * /api/produits:
 *   get:
 *     summary: Récupère la liste paginée des produits
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des produits
 *       500:
 *         description: Erreur serveur
 */
router.get('/', getProducts);

export default router;
