import React, { useContext, useState } from "react";
import "./Menubar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Menubar = () => {
  const { quantities, token, setToken, setQuantities } = useContext(StoreContext);
  const totalItems = Object.values(quantities).reduce((sum, q) => sum + q, 0);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setQuantities({});
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg br-navbar">
      <div className="container br-navbar-inner">

        {/* Left: Logo + Location */}
        <div className="br-nav-left">
          <Link to="/" className="br-brand">
            <img src={assets.logo} alt="BiteRush" height={36} width={36} />
            <span className="br-brand-name">BiteRush</span>
          </Link>
          <div className="br-location">
            <i className="bi bi-geo-alt-fill br-location-icon"></i>
            <div className="br-location-text">
              <span className="br-location-city">Mumbai</span>
              <i className="bi bi-chevron-down br-location-arrow"></i>
            </div>
          </div>
        </div>

        {/* Mobile toggler */}
        <button
          className="navbar-toggler border-0 d-lg-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#brNavCollapse"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Right: Nav links + Cart + Auth */}
        <div className="collapse navbar-collapse" id="brNavCollapse">
          <ul className="br-nav-links">
            <li><Link className="br-nav-link" to="/">Home</Link></li>
            <li><Link className="br-nav-link" to="/explore">Explore</Link></li>
            <li><Link className="br-nav-link" to="/contact">Contact</Link></li>
          </ul>

          <div className="br-nav-right">
            {/* Cart */}
            <Link to="/cart" className="br-cart-btn">
              <i className="bi bi-bag"></i>
              {totalItems > 0 && (
                <span className="br-cart-count">{totalItems}</span>
              )}
            </Link>

            {/* Auth */}
            {!token ? (
              <div className="br-auth-btns">
                <button className="btn-login" onClick={() => navigate('/login')}>Login</button>
                <button className="btn-signup" onClick={() => navigate('/register')}>Sign up</button>
              </div>
            ) : (
              <div className="dropdown">
                <button className="br-profile-btn dropdown-toggle" data-bs-toggle="dropdown">
                  <img src={assets.profile} alt="" width={32} height={32} className="rounded-circle" />
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 mt-2 p-1">
                  <li>
                    <span className="dropdown-item rounded-2" onClick={() => navigate('/myorders')}>
                      <i className="bi bi-bag-check me-2"></i>My Orders
                    </span>
                  </li>
                  <li><hr className="dropdown-divider my-1" /></li>
                  <li>
                    <span className="dropdown-item rounded-2 text-danger" onClick={logout}>
                      <i className="bi bi-box-arrow-right me-2"></i>Logout
                    </span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

      </div>
    </nav>
  );
};

export default Menubar;
