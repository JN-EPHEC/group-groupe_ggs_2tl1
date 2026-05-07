import express from 'express';
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
} from '../controllers/adminCategoryControllers.js';
import { verifyAccessToken } from '../middlewares/jwtMiddleware.js';
import { requireAdminRole } from '../middlewares/requireAdminRole.js';

const router = express.Router();

router.use(verifyAccessToken, requireAdminRole);

router.get('/categories', getAdminCategories);
router.post('/categories', createAdminCategory);
router.put('/categories/:id', updateAdminCategory);
router.delete('/categories/:id', deleteAdminCategory);

export default router;
