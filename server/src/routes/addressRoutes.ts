import express from "express";
import * as addressControllers from "../controllers/addressControllers.js";

const router = express.Router();

// TEMP DEV ONLY: injecte un utilisateur fictif pour tester les routes /me sans auth finale.
// A retirer dès que le vrai middleware JWT est branché.
router.use((req, _res, next) => {
  req.user = { id: 1 };
  next();
});

//Route pour récupérer l'adresse d'un client
router.get("/me/addresses", addressControllers.getMyAddresses);

//Route pour ajouter une addresse à un client 
router.post("/me/addresses", addressControllers.createMyAddress);

//Route pour modifier une route d'un client
router.patch("/me/addresses/:addressId", addressControllers.updateMyAddress);

//Route pour supprimer une route d'un client 
router.delete("/me/addresses/:addressId", addressControllers.deleteMyAddress);

export default router;
