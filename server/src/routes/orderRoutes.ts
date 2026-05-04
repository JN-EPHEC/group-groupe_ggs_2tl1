import express from 'express';
import * as orderControllers from '../controllers/orderControllers'
import checkIdParam from '../middlewares/checkIdParam';


const router = express.Router();

// TEMP DEV ONLY: injecte un utilisateur fictif pour tester les routes /me sans auth finale.
// A retirer dès que le vrai middleware JWT est branché.
router.use((req, _res, next) => {
  req.user = { id: 1 };
  next();
});

//Route pour récupérer les commandes d'un client
router.get('/',orderControllers.getOrder);

//Route récupérer une commande d'un client
router.get('/:id',checkIdParam,orderControllers.getOneOrder);

//Route pour créer une commande 
router.post('/',orderControllers.createOrder);


export default router;
