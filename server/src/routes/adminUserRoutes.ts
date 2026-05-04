import express from 'express'

const router = express.Router();

// Liste tous les users enregistrés
router.get('/users',getAllUsers);

// Renvoie un seul user
router.get('/users/:id',getUser);

// Modifie un user (role, statut, etc.)
router.patch('/users/:id',modifyUser);

// Supprime un user
router.delete('/users/:id',deleteAdmin);

// Crée un user admin
router.post('/users',createAdmin);

// Ajoute un produit
router.post('/products',createProduct);

// Modifie partiellement un produit
router.patch('/products/:id',modifyItemProduct);

// Modifie complètement un produit
router.put('/products/:id',modifyProduct);

// Supprime un produit
router.delete('/products/:id',deleteProduct);

// Ajoute une catégorie
router.post('/categories',createCat);


export default router;
