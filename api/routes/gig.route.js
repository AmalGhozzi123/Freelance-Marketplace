import express from "express";
import {
  createGig,
  deleteGig,
  getGig,
  getGigs,
  getGigsUser,
  updateGig
} from "../controllers/gig.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/gigs", verifyToken, createGig);
router.put("/gigs/:id", verifyToken, updateGig);
router.delete("/:id", verifyToken, deleteGig);
router.get("/single/:id", getGig);
router.get("/", getGigs); 
router.get('/mygigs/:userId', getGigsUser);
export default router;