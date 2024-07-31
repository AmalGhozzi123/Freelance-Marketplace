import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import newRequest from "../../utils/newRequest";
import getCurrentUser from "../../utils/getCurrentUser";
import "./Review.scss";

  
const Review = ({ review, onUpdateReview }) => {
  const queryClient = useQueryClient();
  const currentUser = getCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedReview, setUpdatedReview] = useState({
    desc: review.desc,
    star: review.star,
  });
  const { isLoading, error, data } = useQuery(
    {
      queryKey: [review.userId],
      queryFn: () =>
        newRequest.get(`/users/${review.userId}`).then((res) => {
          return res.data;
        }),
    },
  );
  const deleteMutation = useMutation({
    mutationFn: async () => {
      try {
        const response = await newRequest.delete(`/reviews/${review._id}`);
        return response;
      } catch (error) {
        if (error.response && error.response.status === 403) {
          // Handle 403 error, e.g., show a message or redirect the user
          console.error('Permission denied: You do not have the necessary permissions.');
        } else {
          throw error;
        }
      }
    },
    onSuccess: () => {
      console.log("Delete Successfully");
      queryClient.invalidateQueries(["reviews"]);
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression de la critique", error);
    },
  });
  
  

  const updateMutation = useMutation({
    mutationFn: (updatedData) => {
      return newRequest.put(`/reviews/${review._id}`, updatedData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["reviews"]);
      setIsEditing(false);
      onUpdateReview(data); // Appeler la fonction parente pour mettre à jour la critique localement
    },
    onError: (error) => {
      console.error("Error updating review:", error);
    },
  });
  

  const handleDelete = async () => {
    console.log("Bouton Supprimer cliqué", review.userId, currentUser._id);
    if (window.confirm("Do you really want to delete this review ?")) {
      console.log("Avant deleteMutation.mutateAsync()");
      try {
        await deleteMutation.mutateAsync();
        console.log("Après deleteMutation.mutateAsync()");
        console.log("Delete Successfully");
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    }
  };
  
  
  
  

  const handleUpdate = () => {
    setIsEditing(true);
  };

  const handleCancelUpdate = () => {
    setIsEditing(false);
    setUpdatedReview({
      desc: review.desc,
      star: review.star,
    });
  };

  const handleSaveUpdate = async () => {
    try {
      console.log("Avant updateMutation.mutateAsync()");
      await updateMutation.mutateAsync(updatedReview);
      console.log("Après updateMutation.mutateAsync()");
    } catch (error) {
      console.error("Error saving update:", error);
    }
  };
  

  return (
    <div className="review">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="user">
          <img className="pp" src={data.img || "/img/noavatar.jpg"} alt="" />
          <div className="info">
            <span>{data.username}</span>
            <div className="country">
              <span>{data.country}</span>
              <span>{review.date}</span>
            </div>
          </div>
        </div>
      )}

      <div className="stars">
        {Array(review.star)
          .fill()
          .map((item, i) => (
            <img src="/img/star.png" alt="" key={i} />
          ))}
        <span>{review.star}</span>
      </div>
     

      {isEditing ? (
        <>
          <textarea
            value={updatedReview.desc}
            onChange={(e) => setUpdatedReview({ ...updatedReview, desc: e.target.value })}
          />
          <input
            type="number"
            value={updatedReview.star}
            onChange={(e) =>
              setUpdatedReview({ ...updatedReview, star: parseInt(e.target.value, 10) || 0 })
            }
          />
        </>
      ) : (
        <p>{review.desc}</p>
      )}

      {currentUser && currentUser._id === review.userId && (
        <div className="actions">
          {isEditing ? (
            <>
              <button onClick={handleSaveUpdate}>Save</button>
              <button onClick={handleCancelUpdate}>Cancel</button>
            </>
          ) : (
            <>
              <img
                className="delete-icon"
                src="/public/img/update.GIF"
                alt=""
                onClick={handleUpdate}
              />
              <img
                className="delete-icon"
                src="/public/img/supprimer.GIF"
                alt=""
                onClick={handleDelete}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Review;
