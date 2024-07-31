import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.scss';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <nav id="sidebar" >
            <div className="position-sticky">
              <ul className="nav flex-column">
                <li className="nav-item">
                  <Link to="/dashboard" className="nav-link">
                    Tableau de bord
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/freelancers" className="nav-link">
                    Freelancers
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/clients" className="nav-link">
                    Clients
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/services" className="nav-link">
                    Services
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/orders" className="nav-link">
                    Orders
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/orders" className="nav-link">
                    Orders
                  </Link>
                </li>
              
              </ul>
            </div>
          </nav>

         
          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 main-content">
            <div className="d-flex justify-content-between align-items-center mt-2">
              <h1>Bienvenue dans le tableau de bord</h1>
            </div>

          
          </main>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
