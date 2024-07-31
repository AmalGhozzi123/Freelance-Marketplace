import express from "express";
//import { verifyToken } from "../middleware/jwt.js";
import { getOrders, deleteOrder, confirmOrder ,createOrder} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/:gigId", createOrder);
router.get("/", getOrders);
//router.post("/create-payment-intent/:id", intent);
router.put("/", confirmOrder);
router.delete("/delete/:id",deleteOrder);


export default router;