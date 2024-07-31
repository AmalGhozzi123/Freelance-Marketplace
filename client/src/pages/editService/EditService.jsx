import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import newRequest from '../../utils/newRequest';
import './EditService.scss'; // Assurez-vous d'importer votre fichier CSS si vous en avez un

function EditService() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    cat: '',
    price: 0,
    cover: '',
    images: [],
    features: [],
  });

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        console.log('Fetching service details for ID:', id);
        const response = await newRequest.get(`/gigs/single/${id}`);
        console.log('Response:', response);
        setUserId(response.data.userId);

        setFormData({
          title: response.data.title,
          desc: response.data.desc,
          cat: response.data.cat,
          price: response.data.price,
          cover: response.data.cover,
          images: response.data.images,
          features: response.data.features,
        });
      } catch (error) {
        console.error('Error fetching service details:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
          console.error('Response headers:', error.response.headers);
        }
      }
    };

    fetchServiceDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleAddFeature = (e) => {
    e.preventDefault();
    setFormData((prevFormData) => ({
      ...prevFormData,
      features: [...prevFormData.features, e.target[0].value.trim()],
    }));
    e.target[0].value = '';
  };

  const handleAddImage = (e) => {
    e.preventDefault();
    setFormData((prevFormData) => ({
      ...prevFormData,
      images: [...prevFormData.images, e.target[0].value.trim()],
    }));
    e.target[0].value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedService = await newRequest.put(`/gigs/gigs/${id}`, formData);
      console.log('Service updated successfully:', updatedService);

      navigate(`/mygigs/${userId}`);
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  return (
    <div className="edit-service-container">
      <h1>Edit Service</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="desc" value={formData.desc} onChange={handleChange}></textarea>
        </div>

        <div className="form-group">
          <label>Category</label>
          <select name="cat" value={formData.cat} onChange={handleChange}>
            <option value="design">Design</option>
            <option value="web">Web Development</option>
            <option value="animation">Animation</option>
            <option value="music">Music</option>
          </select>
        </div>

        <div className="form-group">
          <label>Price (DT)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Cover Image</label>
          <input
            type="text"
            name="cover"
            value={formData.cover}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Features (comma-separated)</label>
          <div className="list-container">
            {formData.features.map((feature, index) => (
              <div key={index} className="list-item">
                {feature}
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      features: prevFormData.features.filter((_, i) => i !== index),
                    }))
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="add">
            <input type="text" placeholder="Add features" />
            <button type="submit" onClick={handleAddFeature}>
              Add
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Images (comma-separated URLs)</label>
          <div className="list-container">
            {formData.images.map((image, index) => (
              <div key={index} className="list-item">
                {image}
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prevFormData) => ({
                      ...prevFormData,
                      images: prevFormData.images.filter((_, i) => i !== index),
                    }))
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="add">
            <input type="text" placeholder="Add image URL" />
            <button type="submit" onClick={handleAddImage}>
              Add
            </button>
          </div>
        </div>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditService;
