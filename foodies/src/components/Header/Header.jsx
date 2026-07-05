import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <div className="header">
      <div className="header-content">
        <span className="header-badge">🍽️ Free delivery on first order</span>
        <h1>Craving something<br />delicious?</h1>
        <p>Fresh meals delivered fast — straight to your door.</p>
        <Link to="/explore" className="btn-hero">
          Explore Menu <i className="bi bi-arrow-right ms-1"></i>
        </Link>
      </div>
    </div>
  );
};

export default Header;
