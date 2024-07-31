import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const CheckoutForm = ({ clientSecret, appearance }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      console.error(error);
    } else {
      if (paymentIntent.status === "succeeded") {
        // Le paiement a réussi, vous pouvez effectuer des actions supplémentaires ici.
        console.log("Payment succeeded!");
        // Redirigez l'utilisateur vers une page de confirmation ou effectuez d'autres actions nécessaires.
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement options={appearance} />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

export default CheckoutForm;
