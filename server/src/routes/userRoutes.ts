import express from 'express';
import * as userControllers from '../controllers/userControllers';
import checkIdParam from '../middlewares/checkIdParam.js';
import checkUser from '../middlewares/checkUser.js';

const router = express.Router();

// TEMP DEV ONLY: injecte un utilisateur fictif pour tester les routes /me sans auth finale.
// A retirer dès que le vrai middleware JWT est branché.
router.use((req, _res, next) => {
  req.user = { id: 1 };
  next();
});

//Permet de lire le profil du client
router.get('/me',userControllers.getProfile);

//Permet de modifier le profil du client
router.patch('/me',userControllers.modifyClient);

//Permet de changer le mot de passe du client
router.patch('/me/password',userControllers.modifyPassword);

//Permet de supprimer son compte
router.delete('/me',userControllers.deleteAccount);






//je viens de réaliser qu'il faudra des routes pour toutes les infos du user qui sont des relations. on fera ça près 

export default router;
