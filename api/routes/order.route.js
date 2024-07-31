import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import { getOrders, confirm ,createOrder,deleteOrder } from "../controllers/order.controller.js";

const router = express.Router();

// router.post("/:gigId", verifyToken, createOrder);
router.get("/:userId", verifyToken, getOrders);
router.put("/confirm/:orderId", verifyToken, confirm);
router.post('/create-order', verifyToken, createOrder); 
router.delete('/delete/:orderId',verifyToken,deleteOrder);
export default router;