import express from 'express'
import * as adminControllers from '../controllers/adminControllers.js'

const router = express.Router();

// Liste tous les users enregistrés
router.get('/users', adminControllers.getAllUsers);

// Renvoie un seul user
router.get('/users/:id', adminControllers.getUser);

// Modifie un user (role, statut, etc.)
router.patch('/users/:id', adminControllers.modifyUser);

// Supprime un user
router.delete('/users/:id', adminControllers.deleteAdmin);

// Crée un user admin
router.post('/users', adminControllers.createAdmin);

// Ajoute un produit
router.post('/products', adminControllers.createProduct);

// Modifie un produit
router.patch('/products/:id',adminControllers.modifyProduct);

// Supprime un produit
router.delete('/products/:id', adminControllers.deleteProduct);

// Ajoute une catégorie
router.post('/categories', adminControllers.createCat);


export default router;
