import express from 'express';

const router = express.Router();

router.get('/',getOrder);

router.get('/:id',getOneOrder);

router.post('/',createOrder);


export default router;
