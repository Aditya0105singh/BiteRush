import React, { useContext, useState } from "react";
import "./Menubar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Menubar = () => {
  const [active, setActive] = useState("home");
  const { quantities, token, setToken, setQuantities } =
    useContext(StoreContext);
  const uniqueItemsInCart = Object.values(quantities).filter(
    (qty) => qty > 0
  ).length;
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setQuantities({});
    navigate("/");
  };
  return (
    <nav className="navbar navbar-expand-lg br-navbar">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <img src={assets.logo} alt="BiteRush" height={40} width={40} />
          <span className="fw-bold fs-5" style={{ color: 'var(--br-orange)' }}>BiteRush</span>
        </Link>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-1">
            <li className="nav-item">
              <Link className={`nav-link ${active === 'home' ? 'active' : ''}`} to="/" onClick={() => setActive('home')}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${active === 'explore' ? 'active' : ''}`} to="/explore" onClick={() => setActive('explore')}>
                Explore
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${active === 'contact-us' ? 'active' : ''}`} to="/contact" onClick={() => setActive('contact-us')}>
                Contact
              </Link>
            </li>
          </ul>
          <div className="d-flex align-items-center gap-3">
            <Link to="/cart" className="text-decoration-none position-relative">
              <i className="bi bi-bag fs-5" style={{ color: '#444' }}></i>
              {uniqueItemsInCart > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill cart-badge">
                  {uniqueItemsInCart}
                </span>
              )}
            </Link>
            {!token ? (
              <>
                <button className="btn btn-nav-login" onClick={() => navigate('/login')}>Login</button>
                <button className="btn btn-nav-register" onClick={() => navigate('/register')}>Register</button>
              </>
            ) : (
              <div className="dropdown">
                <a href="#" className="d-flex align-items-center gap-2 text-decoration-none dropdown-toggle" data-bs-toggle="dropdown">
                  <img src={assets.profile} alt="" width={34} height={34} className="rounded-circle border border-2" style={{ borderColor: 'var(--br-orange) !important' }} />
                </a>
                <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 mt-2">
                  <li><span className="dropdown-item" onClick={() => navigate('/myorders')}>
                    <i className="bi bi-bag-check me-2"></i>My Orders
                  </span></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><span className="dropdown-item text-danger" onClick={logout}>
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                  </span></li>
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
