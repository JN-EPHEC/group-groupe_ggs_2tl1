import express from 'express';
import checkIdParam from '../middlewares/checkIdParam';
import * as catControllers from '../controllers/catControllers'

const router = express.Router();

//permet de récupérer les catégories
router.get('/',catControllers.getAllCat); 

//permet de récupérer une seule catégorie
router.get('/:id',checkIdParam,catControllers.getOneCat);

export default router;
