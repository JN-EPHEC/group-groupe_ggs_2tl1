import express from 'express';
import * as orderControllers from '../controllers/orderControllers'
import checkIdParam from '../middlewares/checkIdParam.js';
import validateOrderBody from '../middlewares/validateOrderBody.js';


const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Commandes
 *   description: Commandes de l'utilisateur connecté
 */
 
/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Récupérer mes commandes
 *     tags: [Commandes]
 *     responses:
 *       200:
 *         description: Liste des commandes de l'utilisateur connecté
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

//Route pour récupérer les commandes d'un client
router.get('/',orderControllers.getOrder);
/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Récupérer une commande par ID
 *     tags: [Commandes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Détail de la commande
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: ID invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Commande introuvable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
//Route récupérer une commande d'un client
router.get('/:id',checkIdParam,orderControllers.getOneOrder);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Créer une commande
 *     tags: [Commandes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderInput'
 *     responses:
 *       201:
 *         description: Commande créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Items invalides ou statut introuvable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Token manquant ou invalide
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Un ou plusieurs produits sont introuvables
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Stock insuffisant pour un ou plusieurs produits
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
//Route pour créer une commande 
router.post('/', validateOrderBody, orderControllers.createOrder);


export default router;
