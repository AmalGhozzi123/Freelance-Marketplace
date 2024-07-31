import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import OrdersDetails from './components/Orders/OrdersDetails.jsx';
import Dashboard from './components/Dashboard';
import Frelancers from './components/Freelancers/Freelancers';
import Clients from './components/Clients/Clients';
import FreelancerDetails from './components/Freelancers/FreelancerDetails.jsx';
import ClientDetails from './components/Clients/ClientDetails.jsx';
import ServicesDetails from './components/Services/ServicesDetails.jsx';
import Services from './components/Services/Services';
import Orders from './components/Orders/Orders';

function App() {
  return (
    <Router>
      <div>
        <h1>My App</h1>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/freelancers" element={<Frelancers />} />
          <Route path="/admin/clients" element={<Clients />} />
          <Route path="/admin/freelancers/:id" element={<FreelancerDetails />} />
        <Route path="/admin/clients/:id" element={<ClientDetails />} /> 
        <Route path="/admin/services" element={<Services  />} /> 
        <Route path="/admin/services/:id" element={<ServicesDetails />} /> 
        <Route path="/admin/orders" element={<Orders  />} /> 
        <Route path="/admin/orders/:id" element={<OrdersDetails />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;