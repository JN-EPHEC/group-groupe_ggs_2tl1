/**
 * @swagger
 * components:
 *   schemas:
 *
 *     # ─── AUTH ──────────────────────────────────────────────────────────────
 *
 *     LoginInput:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           example: "john@exemple.com"
 *         password:
 *           type: string
 *           example: "motdepasse123"
 *
 *     RegisterInput:
 *       type: object
 *       required: [username, email, password]
 *       properties:
 *         username:
 *           type: string
 *           example: "john_doe"
 *         email:
 *           type: string
 *           example: "john@exemple.com"
 *         password:
 *           type: string
 *           example: "motdepasse123"
 *         addresses:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AddressInput'
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 1
 *             username:
 *               type: string
 *               example: "john_doe"
 *             email:
 *               type: string
 *               example: "john@exemple.com"
 *
 *     TokenPair:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: JWT valide 15 minutes
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         refreshToken:
 *           type: string
 *           description: JWT valide 7 jours
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 *     RefreshInput:
 *       type: object
 *       required: [refreshToken]
 *       properties:
 *         refreshToken:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 *     AccessToken:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: Nouvel access token valide 15 minutes
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *
 *     # ─── USER ──────────────────────────────────────────────────────────────
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         username:
 *           type: string
 *           example: "john_doe"
 *         email:
 *           type: string
 *           example: "john@exemple.com"
 *         isActive:
 *           type: boolean
 *           example: true
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *           example: ["admin", "user"]
 *
 *     UserInputPartial:
 *       type: object
 *       description: Tous les champs sont optionnels, au moins un requis
 *       properties:
 *         username:
 *           type: string
 *           example: "nouveau_pseudo"
 *         email:
 *           type: string
 *           example: "nouveau@exemple.com"
 *         isActive:
 *           type: boolean
 *           example: false
 *         role:
 *           type: string
 *           example: "admin"
 *
 *     AdminCreateInput:
 *       type: object
 *       required: [username, email, password]
 *       properties:
 *         username:
 *           type: string
 *           example: "admin_user"
 *         email:
 *           type: string
 *           example: "admin@exemple.com"
 *         password:
 *           type: string
 *           example: "motdepasse123"
 *         role:
 *           type: string
 *           example: "admin"
 *
 *     PasswordInput:
 *       type: object
 *       required: [currentPassword, newPassword]
 *       properties:
 *         currentPassword:
 *           type: string
 *           example: "ancien_motdepasse"
 *         newPassword:
 *           type: string
 *           example: "nouveau_motdepasse123"
 *
 *     # ─── ADDRESS ───────────────────────────────────────────────────────────
 *
 *     Address:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         user_id:
 *           type: integer
 *           example: 1
 *         street:
 *           type: string
 *           example: "12 rue de la Paix"
 *         city:
 *           type: string
 *           example: "Bruxelles"
 *         state:
 *           type: string
 *           example: "Bruxelles-Capitale"
 *         postalCode:
 *           type: string
 *           example: "1000"
 *         country:
 *           type: string
 *           example: "Belgique"
 *
 *     AddressInput:
 *       type: object
 *       required: [street, city, state, postalCode, country]
 *       properties:
 *         street:
 *           type: string
 *           example: "12 rue de la Paix"
 *         city:
 *           type: string
 *           example: "Bruxelles"
 *         state:
 *           type: string
 *           example: "Bruxelles-Capitale"
 *         postalCode:
 *           type: string
 *           example: "1000"
 *         country:
 *           type: string
 *           example: "Belgique"
 *
 *     AddressInputPartial:
 *       type: object
 *       description: Tous les champs sont optionnels, au moins un requis
 *       properties:
 *         street:
 *           type: string
 *           example: "15 avenue Louise"
 *         city:
 *           type: string
 *           example: "Liège"
 *         state:
 *           type: string
 *           example: "Liège"
 *         postalCode:
 *           type: string
 *           example: "4000"
 *         country:
 *           type: string
 *           example: "Belgique"
 *
 *     # ─── PRODUCT ───────────────────────────────────────────────────────────
 *
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "T-shirt premium"
 *         description:
 *           type: string
 *           example: "Un t-shirt de qualité supérieure"
 *         price:
 *           type: number
 *           format: float
 *           example: 29.99
 *         stock:
 *           type: integer
 *           example: 150
 *         category_id:
 *           type: integer
 *           example: 3
 *         isActive:
 *           type: boolean
 *           example: true
 *
 *     ProductInput:
 *       type: object
 *       required: [name, description, price, stock, category_id]
 *       properties:
 *         name:
 *           type: string
 *           example: "T-shirt premium"
 *         description:
 *           type: string
 *           example: "Un t-shirt de qualité supérieure"
 *         price:
 *           type: number
 *           format: float
 *           example: 29.99
 *         stock:
 *           type: integer
 *           example: 150
 *         category_id:
 *           type: integer
 *           example: 3
 *
 *     ProductInputPartial:
 *       type: object
 *       description: Tous les champs sont optionnels, au moins un requis
 *       properties:
 *         name:
 *           type: string
 *           example: "Nouveau nom"
 *         description:
 *           type: string
 *           example: "Nouvelle description"
 *         price:
 *           type: number
 *           format: float
 *           example: 34.99
 *         stock:
 *           type: integer
 *           example: 200
 *         isActive:
 *           type: boolean
 *           example: false
 *         category_id:
 *           type: integer
 *           example: 2
 *
 *     StockInput:
 *       type: object
 *       required: [stock]
 *       properties:
 *         stock:
 *           type: integer
 *           example: 200
 *
 *     ProductsPage:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *         total:
 *           type: integer
 *           example: 120
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 20
 *         totalPages:
 *           type: integer
 *           example: 6
 *
 *     # ─── CATEGORY ──────────────────────────────────────────────────────────
 *
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Vêtements"
 *
 *     CategoryInput:
 *       type: object
 *       required: [name]
 *       properties:
 *         name:
 *           type: string
 *           example: "Accessoires"
 *
 *     # ─── ORDER ─────────────────────────────────────────────────────────────
 *
 *     OrderProduct:
 *       type: object
 *       properties:
 *         product_id:
 *           type: integer
 *           example: 5
 *         quantity:
 *           type: integer
 *           example: 2
 *         priceAtPurchase:
 *           type: number
 *           format: float
 *           example: 29.99
 *
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         user_id:
 *           type: integer
 *           example: 1
 *         orderDate:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00.000Z"
 *         status:
 *           type: string
 *           example: "en_attente"
 *         orderProducts:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderProduct'
 *
 *     OrderInput:
 *       type: object
 *       required: [items]
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             required: [product_id, quantity]
 *             properties:
 *               product_id:
 *                 type: integer
 *                 example: 5
 *               quantity:
 *                 type: integer
 *                 example: 2
 *
 *     OrderStatusInput:
 *       type: object
 *       required: [status_id]
 *       properties:
 *         status_id:
 *           type: integer
 *           example: 2
 *
 *     # ─── CHECKOUT ──────────────────────────────────────────────────────────
 *
 *     CheckoutSessionResponse:
 *       type: object
 *       properties:
 *         url:
 *           type: string
 *           description: URL de la session de paiement Stripe
 *           example: "https://checkout.stripe.com/pay/cs_test_..."
 *
 *     # ─── COMMON ────────────────────────────────────────────────────────────
 *
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Ressource introuvable"
 */

export {}