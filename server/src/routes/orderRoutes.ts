import express from 'express';
import * as orderControllers from '../controllers/orderControllers'
import checkIdParam from '../middlewares/checkIdParam';
const router = express.Router();

router.get('/',orderControllers.getOrder);

router.get('/:id',checkIdParam,orderControllers.getOneOrder);

router.post('/',orderControllers.createOrder);


export default router;
