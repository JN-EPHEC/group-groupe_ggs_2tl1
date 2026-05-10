import express from 'express';
import checkIdParam from '../middlewares/checkIdParam.js';
import * as prodControllers from '../controllers/prodControllers.js'


const router = express.Router();

// GET all products (Public)
router.get('/',prodControllers.getAllProduct);

// GET one product (Public)
router.get('/:id',checkIdParam,prodControllers.getProduct)

export default router;
