import express from 'express';
import * as userControllers from '../controllers/userControllers';
import checkIdParam from '../middlewares/checkIdParam.js';
import checkUser from '../middlewares/checkUser.js';

const router = express.Router();


//Permet de lire le profil du client
router.get('/me',userControllers.getProfile);

//Permet de modifier le profil du client
router.patch('/me',userControllers.modifyClient);

//Permet de changer le mot de passe du client
router.patch('/me/password',userControllers.modifyPassword);

//Permet de supprimer son compte
router.delete('/me',userControllers.deleteAccount);

export default router;
