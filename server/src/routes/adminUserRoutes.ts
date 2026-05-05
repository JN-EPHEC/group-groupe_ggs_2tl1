import express from 'express';
import { getAdminUserById, getAdminUsers } from '../controllers/adminUserControllers.js';
import { verifyAccessToken } from '../middlewares/jwtMiddleware.js';
import { requireAdminRole } from '../middlewares/requireAdminRole.js';

const router = express.Router();

router.use(verifyAccessToken, requireAdminRole);

router.get('/utilisateurs', getAdminUsers);
router.get('/utilisateurs/:id', getAdminUserById);

export default router;
