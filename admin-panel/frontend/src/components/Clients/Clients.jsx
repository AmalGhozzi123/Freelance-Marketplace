// Clients.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "./Clients.scss";

function Clients() {
  const [clients, setClients] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8807/admin/users');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDetails = async (clientId) => {
    try {
      const response = await axios.get(`http://localhost:8807/admin/users/${clientId}`);
      // Affichez les détails du client (ou redirigez vers la page des détails du client)
      console.log('Détails du client avec l\'ID :', response.data);
    } catch (error) {
      console.error('Error fetching client details:', error);
    }
  };

  const handleDelete = async (clientId) => {
    try {
      await axios.delete(`http://localhost:8807/admin/users/delete/${clientId}`);
      setClients(prevClients => prevClients.filter(client => client.id !== clientId));
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const handleUpdate = async (clientId) => {
    // Implémentez la logique pour mettre à jour le client ici
    console.log('Mise à jour du client avec l\'ID :', clientId);
  };

  return (
    <div>
      <h2>Liste des Clients</h2>
      <table>
        <thead>
          <tr>
            <th>Nom d'utilisateur</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.id}>
              <td>{client.username}</td>
              <td>{client.email}</td>
              <td>
                <Link to={`/admin/clients/${client.id}`}>
                  <button onClick={() => handleDetails(client.id)}>Détails</button>
                </Link>
                <Link to={`/admin/clients/update/${client.id}`}>
                  <button onClick={() => handleUpdate(client.id)}>Mettre à jour</button>
                </Link>
                <button onClick={() => handleDelete(client.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Clients;
