import express from 'express';
import { login, refreshAccessToken } from '../controllers/jwtControllers.js';

const router = express.Router();

router.post('/', login);
router.post('/refresh', refreshAccessToken);

export default router;