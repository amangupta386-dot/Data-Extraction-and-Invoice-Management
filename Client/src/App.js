import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import InvoicePage from './components/InvoicePage';
import ProductPage from './components/ProductPage';
import CustomerPage from './components/CustomerPage';
import './App.css';
import RouteNames from './utils/routesConstant';


const App = () => (
  <Router>
    <div>
      {/* Navigation Bar */}
      <nav style={navStyle}>
        <ul style={ulStyle}>
          <li style={liStyle}>
            <Link to={RouteNames.initialRoute}style={linkStyle} className="nav-link">File Upload</Link>
          </li>
          <li style={liStyle}>
            <Link to={RouteNames.invoicePage} style={linkStyle} className="nav-link">Invoice Page</Link>
          </li>
          <li style={liStyle}>
            <Link to={RouteNames.productPage} style={linkStyle} className="nav-link">Product Page</Link>
          </li>
          <li style={liStyle}>
            <Link to={RouteNames.customerPage} style={linkStyle} className="nav-link">Customer Page</Link>
          </li>
        </ul>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path={RouteNames.initialRoute} element={<FileUpload />} />
        <Route path={RouteNames.invoicePage} element={<InvoicePage />} />
        <Route path={RouteNames.productPage} element={<ProductPage />} />
        <Route path={RouteNames.customerPage} element={<CustomerPage />} />
      </Routes>
    </div>
  </Router>
);

export default App;

/* Styling */
const navStyle = {
  background: '#333',
  padding: '1rem',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const ulStyle = {
  display: 'flex',
  listStyle: 'none',
  margin: 0,
  padding: 0,
  justifyContent: 'space-around',
};

const liStyle = {
  margin: '0 1rem',
};

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  padding: '0.5rem 1rem',
  borderRadius: '5px',
  transition: 'background 0.3s, color 0.3s',
};
