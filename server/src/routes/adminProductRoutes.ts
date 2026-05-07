import express from 'express';
import { deleteAdminProduct, getAdminProducts, updateAdminProduct, updateAdminProductStock } from '../controllers/adminProductControllers.js';
import { verifyAccessToken } from '../middlewares/jwtMiddleware.js';
import { requireAdminRole } from '../middlewares/requireAdminRole.js';

const router = express.Router();

router.use(verifyAccessToken, requireAdminRole);

router.get('/produits', getAdminProducts);
router.put('/produits/:id/stock', updateAdminProductStock);
router.put('/produits/:id', updateAdminProduct);
router.delete('/produits/:id', deleteAdminProduct);

export default router;
