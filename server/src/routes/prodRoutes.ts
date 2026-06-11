import express from 'express';
import checkIdParam from '../middlewares/checkIdParam.js';
import * as prodControllers from '../controllers/prodControllers.js'


const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Catalogue produits public
 */
 
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lister tous les produits actifs
 *     tags: [Products]
 *     security: []
 *     responses:
 *       200:
 *         description: Liste des produits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: Aucun produit trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET all products (Public)
router.get('/',prodControllers.getAllProduct);
/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Récupérer un produit par ID
 *     tags: [Products]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Détail du produit
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: ID invalide ou produit inconnu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET one product (Public)
router.get('/:id',checkIdParam,prodControllers.getProduct)

export default router;
