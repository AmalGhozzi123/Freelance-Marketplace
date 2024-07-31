// backend/routes/userRoutes.js
import express from "express";
import {
  findPagination,
  findOne,
  create,
  update,
  remove,
  findAllClients, // Ajout de la fonction pour récupérer tous les clients
} from "../controllers/userController.js";

const router = express.Router();

router.get("/pagination",findPagination);
router.get("/", findAllClients);// Ajout de la route pour les clients
router.get("/:id", findOne);
router.post("/add", create);
router.put("/update/:id",update);
router.delete("/delete/:id", remove);

export default router;
