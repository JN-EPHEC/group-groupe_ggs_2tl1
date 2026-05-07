/**
 * @swagger
 * components:
 *   schemas:
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
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Adresse introuvable"
 */

export {}