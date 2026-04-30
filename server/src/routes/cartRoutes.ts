import express from 'express';

const router = express.Router();

//Permet de récupérer le panier actuel du client
router.get('/',getCart);

//Permet d'ajouter des articles à son panier
router.post('/items',addItems);

//Permet de modifier un article de son panier
router.patch('/items/:id',modifyItem);

//Permet de supprimer un articile du panier
router.delete('/items/:id', deleteItem);

//Permet de supprimer tout le panier
router.delete('/',deleteCart);



export default router;
