import express from 'express';
import checkIdParam from '../middlewares/checkIdParam';
import * as prodControllers from '../controllers/prodControllers'


const router = express.Router();

// GET all products (Public)
router.get('/',checkIdParam,prodControllers.getAllProduct);

// GET one product (Public)
router.get('/:id',checkIdParam,prodControllers.getProduct)

export default router;

