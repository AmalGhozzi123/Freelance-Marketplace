import express from "express";
import { findAllFreelancers, findFreelancerById, createFreelancer, updateFreelancer, removeFreelancer } from "../controllers/freelancerController.js";
//import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.get("/", findAllFreelancers);
router.get("/:id", findFreelancerById);
router.post("/addF", createFreelancer);
router.put("/updatef/:id", updateFreelancer);
router.delete("/deletef/:id",removeFreelancer);

export default router;
