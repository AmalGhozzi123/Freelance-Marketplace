import createError from "../utils/createError.js";
import Order from "../models/order.model.js";

// Create a new order
export const createOrder = async (req, res, next) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    next(err);
  }
};

// Get all orders (seller or buyer)
export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
      isCompleted: true,
    });
    res.status(200).send(orders);
  } catch (err) {
    next(err);
  }
};

// Confirm an order
export const confirmOrder = async (req, res, next) => {
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { paymentIntent: req.body.payment_intent },
      { $set: { isCompleted: true } },
      { new: true }
    );

    if (!updatedOrder) {
      return next(createError(404, "Order not found!"));
    }

    res.status(200).send("Order has been confirmed.");
  } catch (err) {
    next(err);
  }
};

// Delete an order by ID
export const deleteOrder = async (req, res, next) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return next(createError(404, "Order not found!"));
    }

    res.status(200).send("Order has been deleted!");
  } catch (err) {
    next(err);
  }
};
