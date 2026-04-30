import express from 'express';


const router = express.Router();


//Récupère tous les produits
router.get('/',getAllProduct);

//Récupère un seul produits
router.get('/:id',getProduct)

//permet d'ajouter un produit
router.post('/',createProduct);

//permet de supprimer un produit
router.delete('/:id',deleteProduct);

//permet de modifier un élément d'un produit
router.patch('/:id',modifyItemProduct);

//permet de modifier complètement un produit
router.put('/:id',modifyProduct);

export default router;