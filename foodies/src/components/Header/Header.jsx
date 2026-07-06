import React from "react";
import "./Header.css";

const Header = ({ searchText, setSearchText }) => {
  return (
    <div className="br-hero">
      <div className="br-hero-inner">
        <p className="br-hero-eyebrow">Free delivery on your first order 🎉</p>
        <h1 className="br-hero-title">
          Delicious food,<br />delivered fast
        </h1>
        <p className="br-hero-sub">
          Over 50 dishes from your favourite cuisines — hot and fresh at your door.
        </p>

        {/* Search bar integrated in hero — Swiggy style */}
        <div className="br-hero-search">
          <i className="bi bi-search br-search-icon"></i>
          <input
            type="text"
            placeholder="Search for biryani, pizza, burger..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="br-search-input"
          />
          {searchText && (
            <button className="br-search-clear" onClick={() => setSearchText('')}>
              <i className="bi bi-x-lg"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
