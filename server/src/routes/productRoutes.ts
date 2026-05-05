import express from 'express';
import { getProductById, getProducts } from '../controllers/productControllers.js';

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

/**
 * @swagger
 * /api/produits/{id}:
 *   get:
 *     summary: Récupère le détail d'un produit
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détail du produit
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Produit introuvable
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', getProductById);

export default router;
