import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import newRequest from '../../utils/newRequest';
import getCurrentUser from '../../utils/getCurrentUser';
import { countries } from "countries-list";
import './Profile.scss';

function Profile() {
    const countryOptions = Object.keys(countries).map((code) => (
        <option key={code} value={code}>
          {countries[code].name}
        </option>
      ));
 // const currentUser = getCurrentUser();
  const { userId } = useParams();
  const queryClient = useQueryClient();
  const { data: userData, isLoading, isError, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await newRequest.get(`/users/${userId.trim()}`);
      return response.data;
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({}); // State to store edited data

  const handleEditClick = () => {
    setIsEditing(true);
    setEditedData({
        image:userData?.img || '',
      username: userData?.username || '',
      email: userData?.email || '',
      country: userData?.country || '',
      desc: userData?.desc || '',
      phone: userData?.phone || '',
      
    });
  };

  const handleInputChange = (e, field) => {
    setEditedData((prevData) => ({ ...prevData, [field]: e.target.value }));
  };

  const handleSaveChanges = async () => {
    try {
      // Perform the update logic here (send editedData to the server, etc.)
      const response = await newRequest.put(`/users/update/${userId.trim()}`, editedData);

      if (response.status === 200) {
        // Update the cache with the new user data
        queryClient.setQueryData(['user', userId], { ...userData, ...editedData });

        // Exit editing mode
        setIsEditing(false);
      } else {
        console.error('Failed to update user data:', response.data);
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    console.error('Error loading user data:', error);
    return <div>Error loading user data</div>;
  }

  return (
    <div className="profile-container">
      <h2 className="profile-title">User Profile</h2>

      <div className="profile-image-container">
        <img className="profile-image" src={userData?.img || "/img/noavatar.jpg"} alt="" />
      </div>

      <div className="profile-details">
        <div className="profile-left-section">
          <p className="profile-username">Username: {userData?.username}</p>
          <p className="profile-email">Email: {userData?.email}</p>
          <p className="profile-country">Country: {userData?.country}</p>
        </div>

        {userData?.isSeller && (
          <div className="profile-right-section">
            <p className="profile-phone">Phone: {userData?.phone}</p>
            <p className="profile-description">Description: {userData?.desc}</p>
          </div>
        )}

    

        {isEditing ? (
          // Editing Dialog Component
          <div className="editing-dialog">
            <label>Image URL:</label>
            <input
              type="text"
              value={editedData.img}
              onChange={(e) => handleInputChange(e, 'img')}
              className="input-field"
            />

            <label>Username:</label>
            <input
              type="text"
              value={editedData.username}
              onChange={(e) => handleInputChange(e, 'username')}
              className="input-field"
            />

            <label>Email:</label>
            <input
              type="text"
              value={editedData.email}
              onChange={(e) => handleInputChange(e, 'email')}
              className="input-field"
            />

            <label>Country:</label>
            <select
            name="country"
            onChange={(e) => handleInputChange(e, 'country')}
            value={editedData.country}
          >
            <option value="">Select Country</option>
            {countryOptions}
          </select>
{userData?.isSeller && (
    <>
            <label>Phone:</label>
            <input
              type="number"
              value={editedData.phone}
              onChange={(e) => handleInputChange(e, 'phone')}
              className="input-field"
            />

            <label>Description:</label>
            <input
              type="text"
              value={editedData.desc}
              onChange={(e) => handleInputChange(e, 'desc')}
              className="input-field"
            />
            </>
)}
            <div className="button-container">
              <button onClick={handleSaveChanges} className="save-button">
                Save Changes
              </button>
              <button onClick={() => setIsEditing(false)} className="cancel-button">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button className="edit-button" onClick={handleEditClick}>
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}

export default Profile;