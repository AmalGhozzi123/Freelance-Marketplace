import mongoose from 'mongoose';
const { Schema } = mongoose;

const paymentDetailsSchema = new Schema({
  cardNumber: {
    type: String,
    required: true,
  },
  cardType: {
    type: String,
    required: true,
  },
  // Ajoutez d'autres champs de détails de paiement si nécessaire
});

const orderSchema = new Schema({
  gigId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true,
  },
  sellerId: {
    type: String,
    required: true,
  },
  buyerId: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  launchDate: {
    type: Date, 
    default: Date.now, 
  },

  paymentDetails: paymentDetailsSchema, 
  payment_intent: {
    type: String,
    required: false,
  },
}, {
  timestamps: true
});

export default mongoose.model("Order", orderSchema);
