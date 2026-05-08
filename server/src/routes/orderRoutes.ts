import express from 'express';
import * as orderControllers from '../controllers/orderControllers'
import checkIdParam from '../middlewares/checkIdParam';
import validateOrderBody from '../middlewares/validateOrderBody.js';


const router = express.Router();

//Route pour récupérer les commandes d'un client
router.get('/',orderControllers.getOrder);

//Route récupérer une commande d'un client
router.get('/:id',checkIdParam,orderControllers.getOneOrder);

//Route pour créer une commande 
router.post('/', validateOrderBody, orderControllers.createOrder);


export default router;
