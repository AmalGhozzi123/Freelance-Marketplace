import React from "react";
import { Link, useParams } from "react-router-dom";
import "./MyGigs.scss";
import getCurrentUser from "../../utils/getCurrentUser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";

function MyGigs() {
  const { userId } = useParams();
  const currentUser = getCurrentUser();
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["myGigs", userId],
    queryFn: async () => {
      try {
        const response = await newRequest.get(`/gigs/mygigs/${userId}`);
        console.log('API Response:', response.data);
        return response.data;
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    },
    onError: (err) => {
      console.error('Error fetching gigs:', err);
    },
  });

  const mutation = useMutation({
    mutationFn: (id) => newRequest.delete(`/gigs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs", currentUser.id]);
    },
  });

  const handleDelete = (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this gig?");

    if (isConfirmed) {
      mutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching gigs: {error.message}</div>;
  }

  console.log('Data:', data);

  return (
    <div className="myGigs">
      <div className="container">
        <div className="title">
          <h1>Services</h1>
          {currentUser.isSeller && (
            <Link to="/add">
              <button>Add New Service</button>
            </Link>
          )}
        </div>
        {data && data.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Sales</th>
                <th>Image</th>
                <th rowSpan='3' >Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((gig) => (
                <tr key={gig._id}>
                  <td>{gig.title}</td>
                  <td>{gig.price} DT</td>
                  <td>{gig.sales}</td>
                  <td>
                    <img className="thumbnail" src={gig.cover} alt={gig.title} />
                  </td>
                  <td>
                  <div className="action-buttons">
                    
                    <img
                className="delete-icon"
                src="/public/img/supprimer.GIF"
                alt=""
                onClick={() => handleDelete(gig._id)}
              />
                      
                    <Link to={`/details/${gig._id}`}>
                    <img
                className="detail-icon"
                src="/public/img/details.GIF"
                alt=""
                
              />
                    </Link>
                    <Link to={`/edit/${gig._id}`}>
                    <img
                className="delete-icon"
                src="/public/img/update.GIF"
                alt=""
               
              />
                    </Link>
                </div>
            </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No gigs found.</div>
        )}
      </div>
    </div>
  );
}

export default MyGigs;