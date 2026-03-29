import basicAuth from "../middlewares/basicAuth";
import express from 'express';
import * as adminControllers from '../controllers/adminControllers'

const router = express.Router();

router.use('/',basicAuth);

router.get('/basic',adminControllers.adminAuth);

export default router;