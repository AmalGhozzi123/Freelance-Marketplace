import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {  Link,useParams,useNavigate } from 'react-router-dom';
import { Slider } from "infinite-react-carousel/lib";
import getCurrentUser from "../../utils/getCurrentUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import './DetailService.scss'; 

const DetailService = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const currentUser = getCurrentUser();
  const queryClient = useQueryClient();
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
  const navigate = useNavigate();
  const [userId] = useState('');
  const mutation = useMutation({
    mutationFn: (id) => newRequest.delete(`/gigs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs", currentUser.id]);
      navigate(`/mygigs/${userId}`);
    },
  });
  
  const handleDelete = (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this gig?");

    if (isConfirmed) {
      mutation.mutate(id);
    }
  };
  if (!service) {
    return <div>Loading...</div>;
  }

  return (
    <div className="detail-service-container">
        <div className='sevice-title'>
      <h2>Title :</h2>
      <h2>{service.title}</h2>
      </div>
         <div className="service-cover">
        <h3>Cover Image:</h3>
        <img src={service.cover} alt="Service Cover" />
      </div>
      
      <div className='service-desc'>
      <h2>Description :</h2>
      <p className="service-description">{service.desc}</p>
      </div>
      
      <div className="service-info">
        <div>
          <strong>Price:</strong> {service.price} DT
        </div>
        <div>
          <strong>Category:</strong> {service.cat}
        </div>
        <div>
          <strong>Sales:</strong> {service.sales}
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
            <li key={index}>{feature}</li>
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
      <img
                className="delete-icon"
                src="/public/img/supprimer.GIF"
                alt=""
                onClick={handleDelete}
              /> 
                    <Link to={`/edit/${service._id}`}>
                    <img
                className="delete-icon"
                src="/public/img/update.GIF"
                alt=""
               
              />
                    </Link>
                </div>
    </div>
  );
};

export default DetailService;
