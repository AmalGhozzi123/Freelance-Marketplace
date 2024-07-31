// ForgotPassword.js
import React, { useState } from "react";
import newRequest from "../../utils/newRequest";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await newRequest.post("/auth/forgot-password", { email });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error requesting password reset. Please check your email and try again.");
    }
  };

  return (
    <div>
      <h2>Mot de passe oublié?</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Envoyer la demande de réinitialisation</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
