import express from 'express';
import checkIdParam from '../middlewares/checkIdParam.js';
import * as catControllers from '../controllers/catControllers.js'

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Catégories
 *   description: Consultation publique des catégories
 */
 
/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Lister toutes les catégories
 *     tags: [Catégories]
 *     security: []
 *     responses:
 *       200:
 *         description: Liste des catégories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
//permet de récupérer les catégories
router.get('/',catControllers.getAllCat); 
/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Récupérer une catégorie par ID
 *     tags: [Catégories]
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
 *         description: Détail de la catégorie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: ID invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Catégorie introuvable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
//permet de récupérer une seule catégorie
router.get('/:id',checkIdParam,catControllers.getOneCat);

export default router;
