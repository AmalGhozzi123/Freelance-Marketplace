// Services.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Services = () => {
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [updatedFields, setUpdatedFields] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8807/admin/services');
      setServices(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des services', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

 

  const handleEditClick = (service) => {
    setEditingService(service);
    setUpdatedFields({});
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8807/admin/services/${editingService._id}`, updatedFields);
      setServices((prevServices) =>
        prevServices.map((s) =>
          s._id === editingService._id ? { ...s, ...updatedFields } : s
        )
      );
      setEditingService(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du service', error);
    }
  };

  const handleDeleteClick = async (serviceId) => {
    try {
      await axios.delete(`http://localhost:8807/admin/services/${serviceId}`);
      setServices((prevServices) =>
        prevServices.filter((s) => s._id !== serviceId)
      );
    } catch (error) {
      console.error('Erreur lors de la suppression du service', error);
    }
  };

  if (loading) {
    return <p>Chargement en cours...</p>;
  }

  return (
    <div>
      <h2>Liste des Services</h2>
      <ul>
        {services.map((service) => (
          <li key={service._id}>
            <p>{service.title}</p>
            <p>{service.description}</p>
            <p>{service.price} DT</p>
            <Link to={`/admin/services/${service._id}`}>
            <button >Détails</button>
                </Link>
           
            <button onClick={() => handleEditClick(service)}>Modifier</button>
            <button onClick={() => handleDeleteClick(service._id)}>Supprimer</button>

            {/* Formulaire de mise à jour pour l'édition */}
            {editingService && editingService._id === service._id && (
              <div>
                <input
                  type="text"
                  value={updatedFields.title || ''}
                  onChange={(e) =>
                    setUpdatedFields((prevFields) => ({
                      ...prevFields,
                      title: e.target.value,
                    }))
                  }
                />
                <input
                  type="text"
                  value={updatedFields.description || ''}
                  onChange={(e) =>
                    setUpdatedFields((prevFields) => ({
                      ...prevFields,
                      description: e.target.value,
                    }))
                  }
                />
                <input
                  type="number"
                  value={updatedFields.price || ''}
                  onChange={(e) =>
                    setUpdatedFields((prevFields) => ({
                      ...prevFields,
                      price: e.target.value,
                    }))
                  }
                />
                <button onClick={handleUpdate}>Enregistrer</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Services;
