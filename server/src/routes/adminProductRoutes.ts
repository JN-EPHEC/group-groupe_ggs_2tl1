import express from 'express';
import { getAdminProducts, updateAdminProductStock } from '../controllers/adminProductControllers.js';
import { verifyAccessToken } from '../middlewares/jwtMiddleware.js';
import { requireAdminRole } from '../middlewares/requireAdminRole.js';

const router = express.Router();

router.use(verifyAccessToken, requireAdminRole);

router.get('/produits', getAdminProducts);
router.put('/produits/:id/stock', updateAdminProductStock);

export default router;
