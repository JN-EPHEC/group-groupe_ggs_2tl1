import express from 'express';
import * as rootControllers from '../controllers/rootControllers.js'

const router = express.Router();

router.get('/', rootControllers.showRoot);

export default router;
