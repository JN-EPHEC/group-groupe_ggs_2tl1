import express from 'express';
import * as authControllers from '../controllers/authControllers';

const router = express.Router();

//Permet au client de se créer un compte
router.post('/register',authControllers.authRegister);

//Permet au client de se connecter
router.post('/login',authControllers.authLogin);

//Permet au client de se déconnecter
router.post('/logout',authControllers.authLogout);


export default router;


