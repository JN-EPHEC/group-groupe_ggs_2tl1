import express from "express";
import { createCheckoutSession } from "../controllers/checkoutControllers";

const router = express.Router();

router.post("/create-session", createCheckoutSession);

export default router;
