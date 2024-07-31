import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8807/admin/orders');
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDetailsClick = (orderId) => {
    // Implement logic to display order details
    console.log(`Order details with ID: ${orderId}`);
  };

  const handleDeleteClick = async (orderId) => {
    // Implement logic to delete the order
    try {
      await axios.delete(`/api/orders/${orderId}`);
      setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
    } catch (error) {
      console.error('Error deleting order', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>List of Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            <p>{order.orderNumber}</p>
            {/* Display other order details as needed */}
            <Link to={`/orders/${order._id}`}>
              <button onClick={() => handleDetailsClick(order._id)}>Details</button>
            </Link>
            <button onClick={() => handleDeleteClick(order._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
