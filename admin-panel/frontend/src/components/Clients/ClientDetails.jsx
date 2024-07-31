// ClientDetails.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

function ClientDetails() {
  const { id } = useParams();
  const [client, setClient] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8807/admin/users/${id}`);
        setClient(response.data);
      } catch (error) {
        console.error('Error fetching client details:', error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div>
      <h2>Détails du Client</h2>
      {client ? (
        <div>
          <p>ID: {client.id}</p>
          <p>Nom d'utilisateur: {client.username}</p>
          <p>Email: {client.email}</p>
          <p>Country: {client.country}</p>

          {/* Liens pour la mise à jour et la suppression */}
          <Link to={`/admin/clients/update/${id}`}>Mettre à jour</Link>
          <Link to={`/admin/clients/delete/${id}`}>Supprimer</Link>
        </div>
      ) : (
        <p>Chargement des détails...</p>
      )}
    </div>
  );
}

export default ClientDetails;
