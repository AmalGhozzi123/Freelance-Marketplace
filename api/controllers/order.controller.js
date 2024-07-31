import Order from "../modules/order.model.js";
import Gig from "../modules/gig.model.js";
import User from "../modules/user.model.js"; // Update the path to your User model

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
      // isCompleted: true,
    });

    // Fetch usernames for seller and buyer
    const ordersWithUsernames = await Promise.all(
      orders.map(async (order) => {
        const seller = await User.findById(order.sellerId, 'username');
        const buyer = await User.findById(order.buyerId, 'username');
        return {
          ...order._doc,
          sellerUsername: seller.username,
          buyerUsername: buyer.username,
        };
      })
    );

    res.status(200).send(ordersWithUsernames);
  } catch (err) {
    next(err);
  }
};
export const confirm = async (req, res, next) => {
  try {
    console.log("Order confirmation request received");
    const order = await Order.findOneAndUpdate(
      {
        isCompleted: false,
      },
      {
        $set: {
          isCompleted: true,
        },
      },
      { new: true }
    );

    if (!order) {
      console.log("Order not found or already completed");
      return res.status(404).send({ message: 'Order not found or already completed' });
    }

    const seller = await User.findById(order.sellerId, 'username');
    const buyer = await User.findById(order.buyerId, 'username');

    res.status(200).send({
      message: 'Order has been confirmed.',
      sellerUsername: seller.username,
      buyerUsername: buyer.username,
    });
  } catch (err) {
    console.log("Error confirming order:", err);
    next(err);
  }
};


export const createOrder = async (req, res, next) => {
  const { gigId, sellerId, buyerId, isCompleted, paymentDetails } = req.body;

  try {
    // Récupérez les détails du service (gig) à partir de la base de données
    const gig = await Gig.findById(gigId);

    // Enregistrez les détails du paiement dans la nouvelle commande
    const newOrder = new Order({
      gigId: gig._id,
      img: gig.cover,
      title: gig.title,
      buyerId,
      sellerId,
      price: gig.price,
      isCompleted,
      paymentDetails: req.body.paymentDetails,
    });

    // Enregistrez la nouvelle commande dans la base de données
    await newOrder.save();

    // Répondez avec la confirmation de la commande
    res.status(200).send({ success: true, message: 'Order created successfully' });
  } catch (error) {
    // Gérez les erreurs ici
    console.error('Error creating order:', error);
    next(error);
  }
};
export const deleteOrder = async (req, res, next) => {
  const orderId = req.params.orderId;

  try {
    // Find and delete the order
    const order = await Order.findByIdAndDelete(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    next(error);
  }
};


