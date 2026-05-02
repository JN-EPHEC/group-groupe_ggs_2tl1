import express from "express";
import * as addressControllers from "../controllers/addressControllers.js";

const router = express.Router();

// TEMP DEV ONLY: injecte un utilisateur fictif pour tester les routes /me sans auth finale.
// A retirer dès que le vrai middleware JWT est branché.
router.use((req, _res, next) => {
  req.user = { id: 1 };
  next();
});

router.get("/me/addresses", addressControllers.getMyAddresses);
router.post("/me/addresses", addressControllers.createMyAddress);
router.patch("/me/addresses/:addressId", addressControllers.updateMyAddress);
router.delete("/me/addresses/:addressId", addressControllers.deleteMyAddress);

export default router;
