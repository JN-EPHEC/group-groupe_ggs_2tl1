import express from 'express';
import checkIdParam from '../middlewares/checkIdParam';
import * as cartControllers from '../controllers/cartControllers'

const router = express.Router();

//Permet de récupérer le panier actuel du client
router.get('/',cartControllers.getCart);

//Permet d'ajouter des articles à son panier
router.post('/items',cartControllers.addItems);

//Permet de modifier un article de son panier
router.patch('/items/:id',checkIdParam,cartControllers.modifyItem);

//Permet de supprimer un articile du panier
router.delete('/items/:id',checkIdParam,cartControllers.deleteItem);

//Permet de supprimer tout le panier
router.delete('/',cartControllers.deleteCart);



export default router;
