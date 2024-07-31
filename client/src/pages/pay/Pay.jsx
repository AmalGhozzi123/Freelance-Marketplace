import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Replaced useHistory with useNavigate
//import axios from 'axios';
import './Pay.scss';
import getCurrentUser from "../../utils/getCurrentUser";
import newRequest from "../../utils/newRequest";
const Pay = () => {
  const currentUser = getCurrentUser();
  const { id } = useParams();
  const [userId, setUserId] = useState(null);
  const [service, setService] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await newRequest.get(`/gigs/single/${id}`);
        const gigData = response.data;
  
        // Vérifier que gigData est défini avant d'accéder à ses propriétés
        if (gigData) {
          setUserId({ freelancerId: gigData.userId });
          setService({ gigId: gigData._id, title: gigData.title, cover: gigData.cover });
        } else {
          console.error('Les données du service sont nulles ou non définies.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données du service :', error);
      }
    };
  
    fetchUserData();
  }, [id]);
  
  

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardType: '',
  });
  
  const handlePayment = async () => {
    try {
      const gigResponse = await newRequest.get(`/gigs/single/${id}`);
      const gigData = gigResponse.data;
  
  
      const orderResponse = await newRequest.post(`/orders/create-order`, {
        paymentInfo,
        gigId: gigData._id,
        title: gigData.title,
        cover: gigData.cover,
        buyerId: currentUser, // Utilisez la valeur extraite
        sellerId: gigData.userId
      });
  
      if (orderResponse.data.success) {
        alert('Paiement réussi !');
        navigate(`/gig/${service.gigId}`);
      } else {
        alert('Échec du paiement. Veuillez réessayer.');
      }
    } catch (error) {
      console.error('Erreur lors du paiement :', error);
    }
  };
  
  
  
  

  const handleCancel = () => {
    navigate(`/gig/${service.gigId}`); // Using navigate instead of history.push
  };

  const handleCheckboxChange = (e) => {
    const cardType = e.target.value;
    setPaymentInfo({ ...paymentInfo, cardType });
  };

  return (
    <div className='pay'>
      <h2>Payment Form</h2>

      <label>
        Card Number:
        <input
          type="text"
          value={paymentInfo.cardNumber}
          onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
        />
      </label>

      <label>Card Type:</label>
      <label className="visa">
        <input
          type="checkbox"
          value="Visa"
          checked={paymentInfo.cardType === 'Visa'}
          onChange={handleCheckboxChange}
        />
        Visa
      </label>
      <label className="mastercard">
        <input
          type="checkbox"
          value="MasterCard"
          checked={paymentInfo.cardType === 'MasterCard'}
          onChange={handleCheckboxChange}
        />
        MasterCard
      </label>
      <label className="american-express">
        <input
          type="checkbox"
          value="AmericanExpress"
          checked={paymentInfo.cardType === 'AmericanExpress'}
          onChange={handleCheckboxChange}
        />
        American Express
      </label>
      <label className="discover">
        <input
          type="checkbox"
          value="Discover"
          checked={paymentInfo.cardType === 'Discover'}
          onChange={handleCheckboxChange}
        />
        Discover
      </label>

      <button onClick={handleCancel}>Cancel</button>
      <button onClick={handlePayment}>Pay</button>
    </div>
  );
};

export default Pay;
