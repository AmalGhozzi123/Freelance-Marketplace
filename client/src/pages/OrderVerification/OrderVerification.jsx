// OrdreVerification.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { Slider } from 'infinite-react-carousel/lib';
import './OrderVerification.scss';

const OrdreVerification = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8808/api/gigs/single/${id}`);
        setService(response.data);
      } catch (error) {
        console.error('Error fetching service details:', error);
      }
    };

    fetchServiceDetails();
  }, [id]);


  

  if (!service) {
    return <div>Loading...</div>;
  }

  return (
    
    <div className="detail-service-container">
      <div className="left">
        {/* Contenu de la partie gauche */}
        <div className="service-title">
          <h2>Title :</h2>
          <p>{service.title}</p>
        </div>
        <div className="service-cover">
          <h3>Cover Image:</h3>
          <img src={service.cover} alt="Service Cover" />
        </div>
        <div className="service-desc">
          <h2>Description :</h2>
          <p className="service-description">{service.desc}</p>
        </div>
      </div>

      <div className="right">
        {/* Contenu de la partie droite */}
        <div className="service-info">
          <div>
            <strong>Price:</strong> {service.price} DT
          </div>
          <div>
            <strong>Total Stars:</strong> {service.totalStars}
          </div>
          <div>
            <strong>Star Number:</strong> {service.starNumber}
          </div>
        </div>
        <div className="service-features">
          <h3>Features:</h3>
          <ul>
            {service.features.map((feature, index) => (
              <li key={index}>
                <img src="/img/greencheck.png" alt="" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <div className="service-images">
          <h3>Images:</h3>
          <Slider slidesToShow={1} arrowsScroll={1} className="slider">
            {service.images.map((image, index) => (
              <img key={index} src={image} alt={`Service Image ${index + 1}`} />
            ))}
          </Slider>
        </div>
        <div className="action-buttons">
          <button>
            <Link to={`/gig/${service._id}`}>Cancel</Link>
          </button>
          <button><Link to={`/pay/${service._id}`}>Create Order</Link></button>
        </div>
      </div>
    </div>
  );
};

export default OrdreVerification;
