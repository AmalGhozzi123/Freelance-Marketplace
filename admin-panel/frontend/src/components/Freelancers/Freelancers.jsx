// Freelancers.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Freelancers() {
  const [editingFreelancer, setEditingFreelancer] = useState(null);
  const [updatedFields, setUpdatedFields] = useState({});
  const [freelancers, setFreelancers] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8807/admin/freelancers');
      setFreelancers(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (freelancerId) => {
    try {
      await axios.delete(`/admin/freelancers/${freelancerId}`);
      setFreelancers(prevFreelancers => prevFreelancers.filter(f => f.id !== freelancerId));
    } catch (error) {
      console.error('Error deleting freelancer:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`/admin/freelancers/${editingFreelancer.id}`, updatedFields);

      setFreelancers(prevFreelancers =>
        prevFreelancers.map(f =>
          f.id === editingFreelancer.id ? { ...f, ...updatedFields } : f
        )
      );

      setEditingFreelancer(null);
      setUpdatedFields({});
    } catch (error) {
      console.error('Error updating freelancer:', error);
    }
  };

  return (
    <div>
      <h2>Freelancers</h2>
      <ul>
        {freelancers.map(freelancer => (
          <li key={freelancer.id}>
            {editingFreelancer && editingFreelancer.id === freelancer.id ? (
              <div>
                <input
                  type="text"
                  value={updatedFields.username || ''}
                  onChange={(e) => setUpdatedFields(prevFields => ({ ...prevFields, username: e.target.value }))}
                />
                <button onClick={handleUpdate}>Enregistrer</button>
              </div>
            ) : (
              <div>
                <strong>{freelancer.username}</strong> - {freelancer.desc} - {freelancer.phone} - {freelancer.country} - {freelancer.email}
                <button onClick={() => handleDelete(freelancer.id)}>Supprimer</button>
                <Link to={`/freelancers/${freelancer.id}`}>
                  <button>Détails</button>
                </Link>
                <button onClick={() => setEditingFreelancer(freelancer)}>Modifier</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Freelancers;
