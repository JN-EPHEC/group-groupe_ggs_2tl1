import express from 'express';
import * as userControllers from '../controllers/userControllers';
import checkEmptyBody from '../middlewares/checkEmptyBody.js';

const router = express.Router();


//Permet de lire le profil du client
router.get('/me',userControllers.getProfile);

//Permet de modifier le profil du client
router.patch('/me', checkEmptyBody, userControllers.modifyClient);

//Permet de changer le mot de passe du client
router.patch('/me/password', checkEmptyBody, userControllers.modifyPassword);

//Permet de supprimer son compte
router.delete('/me', checkEmptyBody, userControllers.deleteAccount);

export default router;
