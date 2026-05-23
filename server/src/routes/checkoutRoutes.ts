import express from "express";
import { createCheckoutSession } from "../controllers/checkoutControllers";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Checkout
 *   description: Session de paiement Stripe
 */
 
/**
 * @swagger
 * /api/checkout/create-session:
 *   post:
 *     summary: Créer une session de paiement Stripe
 *     tags: [Checkout]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderInput'
 *     responses:
 *       201:
 *         description: Session Stripe créée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CheckoutSessionResponse'
 *       400:
 *         description: Le panier est vide
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
 */

router.post("/create-session", createCheckoutSession);

export default router;
