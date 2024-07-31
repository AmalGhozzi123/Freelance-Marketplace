import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Orders.scss";
import { useQuery } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import getCurrentUser from "../../utils/getCurrentUser";
import { useQueryClient } from "@tanstack/react-query";

const Orders = () => {
  const currentUser = getCurrentUser();
  const queryClient = useQueryClient();
  const { userId } = useParams();
  const { isLoading, error, data } = useQuery({
    queryKey: ["orders", userId],
    queryFn: () => newRequest.get(`/orders/userId=${userId}`).then((res) => res.data),
  });

  const navigate = useNavigate();

  const handleContact = async (order) => {
    const sellerId = order.sellerId;
    const buyerId = order.buyerId;
    const id = sellerId + buyerId;

    try {
      const res = await newRequest.get(`/conversations/single/${id}`);
      navigate(`/message/${res.data.id}`);
    } catch (err) {
      if (err.response.status === 404) {
        const res = await newRequest.post(`/conversations/`, {
          to: currentUser.seller ? buyerId : sellerId,
        });
        navigate(`/message/${res.data.id}`);
      }
    }
  };
  const handleConfirm = async (order) => {
    if (currentUser.isSeller) {
      try {
        const isConfirmed = window.confirm("Are you sure you want to confirm this order?");
        
        if (isConfirmed) {
          const updatedOrder = { ...order, isCompleted: true };
          console.log("Order ID:", order._id);
          console.log("Updated Order:", updatedOrder);
  
          const response = await newRequest.put(`/orders/confirm/${order._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedOrder),
          });
  
          if (!response.ok) {
            throw new Error(`Error confirming order: ${response.status} - ${response.statusText}`);
          }
  
          // Invalidate orders query to trigger a refetch
          queryClient.invalidateQueries(["orders", userId]);
  
          // Rediriger vers la même page
          navigate(`/orders/${userId}`);
        }
      } catch (error) {
        console.error("Error confirming order:", error);
      }
    }
  };
  
  
  const handleDelete = async (order) => {
    try {
      const isConfirmed = window.confirm("Are you sure you want to delete this order?");
      
      if (isConfirmed) {
        const response = await newRequest.delete(`/orders/delete/${order._id}`);
  
        if (response.data.success) {
          // Order deleted successfully
          alert('Order deleted successfully');
          navigate(`/orders/${userId}`);
        } else {
          // Error deleting order
          alert('Error deleting order. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };
  
  
  
  const renderStatus = (isCompleted) => (isCompleted ? "Completed" : "Pending..");

  return (
    <div className="orders">
      {isLoading ? (
        "loading"
      ) : error ? (
        "error"
      ) : (
        <div className="container">
          <div className="title">
            <h1>Orders</h1>
          </div>
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Price(DT)</th>
                <th>Date</th>
                <th>{currentUser.isSeller ? <th>Buyer</th> : <th>Seller</th> }</th>
             {/** {!currentUser.isSeller && <th>Seller`s Phone</th>} */}   
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data && data.length > 0 ? (
                data.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <img className="image" src={order.img} alt="" />
                    </td>
                    <td>{order.title}</td>
                    <td>{order.price}</td>
                    <td>{order.launchDate}</td>
                    <td>
                    {currentUser.isSeller
  ? <span>{order.buyerUsername}</span>
  : <span>{order.sellerUsername}</span>
}
                    </td>
                  {/** {!currentUser.isSeller && <td>{currentUser.isSeller ? currentUser.phone : order.sellerUsername.phone}</td>} */} 
                    <td>{renderStatus(order.isCompleted)}</td>
                    <td>
                    {currentUser.isSeller && !order.isCompleted && (
                       <>
                         <button id="confirmButton" onClick={() => handleConfirm(order)}>
                            Confirm
                         </button>
                         <button id="contactButton" onClick={() => handleContact(order)}>
                            Contact
                         </button>
                         </>
                   )}

                {!currentUser.isSeller && (
                  <>
                    {!order.isCompleted && (
                      <button id="deleteButton" onClick={() => handleDelete(order)}>
                        Delete
                      </button>
                    )}
                    <button id="contactButton" onClick={() => handleContact(order)}>
                      Contact
                    </button>
                  </>
                )}
              </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;