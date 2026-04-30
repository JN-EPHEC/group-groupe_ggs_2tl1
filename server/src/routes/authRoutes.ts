import express from 'express';


const router = express.Router();

//Permet au client de se créer un compte
router.post('/register',authRegister);

//Permet au client de se connecter
router.post('/login',authLogin);

//Permet au client de se déconnecter
router.post('/logout',authLogout);


export default router;


