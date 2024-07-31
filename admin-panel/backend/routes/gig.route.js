import express from "express";
import {
  createGig,
  deleteGig,
  getGig,
  getGigs,
  updateGig
} from "../controllers/gig.controller.js";

const router = express.Router();

router.post("/add", createGig);
router.delete("/delete/:id",  deleteGig);
router.get("/single/:id", getGig);
router.get("/", getGigs);
router.put("/update/:id", updateGig); 
export default router;