import express from 'express'
import * as adminControllers from '../controllers/adminControllers.js'
import checkEmptyBody from '../middlewares/checkEmptyBody.js'
import checkIdParam from '../middlewares/checkIdParam.js'

const router = express.Router();

// Liste tous les users enregistrés
router.get('/users', adminControllers.getAllUsers);

// Renvoie un seul user
router.get('/users/:id', checkIdParam, adminControllers.getUser);

// Modifie un user (role, statut, etc.)
router.patch('/users/:id', checkIdParam, checkEmptyBody, adminControllers.modifyUser);

// Supprime un user
router.delete('/users/:id', checkIdParam, adminControllers.deleteAdmin);

// Crée un user admin
router.post('/users', checkEmptyBody, adminControllers.createAdmin);

router.get('/products', adminControllers.listProducts);
router.get('/products/:id', checkIdParam, adminControllers.getProduct);
router.put('/products/:id/stock', checkIdParam, checkEmptyBody, adminControllers.updateProductStock);

// Ajoute un produit
router.post('/products', checkEmptyBody, adminControllers.createProduct);

// Modifie un produit
router.patch('/products/:id', checkIdParam, checkEmptyBody, adminControllers.modifyProduct);

// Supprime un produit
router.delete('/products/:id', checkIdParam, adminControllers.deleteProduct);

// Ajoute une catégorie
router.post('/categories', checkEmptyBody, adminControllers.createCat);


export default router;
