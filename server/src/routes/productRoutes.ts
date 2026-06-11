import express from 'express';
import { getProductById, getProducts } from '../controllers/productControllers.js';
import checkIdParam from '../middlewares/checkIdParam.js';

const router = express.Router();

/**
 * @swagger
 * /api/produits:
 *   get:
 *     summary: Récupère la liste paginée des produits
 *     tags: [Products]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: categorie_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: prix_min
 *         schema:
 *           type: number
 *         description: Doit être >= 0
 *       - in: query
 *         name: prix_max
 *         schema:
 *           type: number
 *         description: Doit être >= 0 et >= prix_min
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [prix_asc, prix_desc, nom_asc, nom_desc]
 *     responses:
 *       200:
 *         description: Liste paginée des produits
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductsPage'
 *       400:
 *         description: prix_min, prix_max ou sort invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', getProducts);

/**
 * @swagger
 * /api/produits/{id}:
 *   get:
 *     summary: Récupère le détail d'un produit
 *     tags: [Products]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Détail du produit
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: ID invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Produit introuvable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', checkIdParam, getProductById);

export default router;
