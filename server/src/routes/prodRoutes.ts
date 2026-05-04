import express from 'express';
import checkIdParam from '../middlewares/checkIdParam';
import * as prodControllers from '../controllers/prodControllers'


const router = express.Router();


//Récupère tous les produits
router.get('/',checkIdParam,prodControllers.getAllProduct);

//Récupère un seul produits
router.get('/:id',checkIdParam,prodControllers.getProduct)

//permet d'ajouter un produit
router.post('/',prodControllers.createProduct);

//permet de supprimer un produit
router.delete('/:id',checkIdParam,prodControllers.deleteProduct);

//permet de modifier un élément d'un produit
router.patch('/:id',checkIdParam,prodControllers.modifyItemProduct);

//permet de modifier complètement un produit
router.put('/:id',checkIdParam,prodControllers.modifyProduct);

export default router;