// ServicesDetails.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// ... (autres imports)

const ServicesDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8807/admin/services/${id}`);
        setService(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du service', error);
      }
    };

    fetchServiceDetails();
  }, [id]);

  const handleUpdateService = async () => {
    try {
      // Logique pour la mise à jour du service (axios PUT request)
      console.log('Mise à jour du service avec l\'ID :', id);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du service', error);
    }
  };

  const handleDeleteService = async () => {
    try {
      // Logique pour la suppression du service (axios DELETE request)
      console.log('Suppression du service avec l\'ID :', id);
    } catch (error) {
      console.error('Erreur lors de la suppression du service', error);
    }
  };

  return (
    <div>
      <h2>Détails du Service</h2>
      {service ? (
        <div>
          <p>ID: {service._id}</p>
          <p>Titre: {service.title}</p>
          <p>Description: {service.description}</p>
          <p>Prix: {service.price}</p>

          {/* Ajoutez ici d'autres attributs du service en fonction de vos besoins */}

          {/* Liens pour la mise à jour et la suppression */}
          <button onClick={handleUpdateService}>Mettre à jour</button>
          <button onClick={handleDeleteService}>Supprimer</button>
        </div>
      ) : (
        <p>Chargement des détails du service...</p>
      )}
    </div>
  );
};

export default ServicesDetails;
