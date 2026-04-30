import express from 'express';

const router = express.Router();

//permet de récupérer les catégories
router.get('/',getAllCat);

//permet de récupérer une seule catégorie
router.get('/:id',getOneCat);

export default router;
