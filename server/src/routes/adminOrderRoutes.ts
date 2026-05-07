import express from 'express';
import { updateAdminOrderStatus } from '../controllers/adminOrderControllers.js';
import { verifyAccessToken } from '../middlewares/jwtMiddleware.js';
import { requireAdminRole } from '../middlewares/requireAdminRole.js';

const router = express.Router();

router.use(verifyAccessToken, requireAdminRole);

router.put('/commandes/:id/statut', updateAdminOrderStatus);

export default router;
