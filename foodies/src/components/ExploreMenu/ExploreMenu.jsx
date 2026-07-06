import React, { useRef } from "react";
import { categories } from "../../assets/assets";
import "./ExploreMenu.css";

const ExploreMenu = ({ category, setCategory }) => {
  const menuRef = useRef(null);

  const scroll = (dir) => {
    if (menuRef.current) menuRef.current.scrollBy({ left: dir * 220, behavior: "smooth" });
  };

  return (
    <div className="explore-menu">
      <div className="explore-menu-header">
        <div>
          <h2 className="explore-title">What's on your mind?</h2>
          <p className="explore-sub">Browse by cuisine or dish type</p>
        </div>
        <div className="explore-scroll-btns">
          <button className="scroll-btn" onClick={() => scroll(-1)}>
            <i className="bi bi-chevron-left"></i>
          </button>
          <button className="scroll-btn" onClick={() => scroll(1)}>
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      <div className="explore-track" ref={menuRef}>
        {categories.map((item, index) => (
          <div
            key={index}
            className={`explore-item ${item.category === category ? 'active' : ''}`}
            onClick={() => setCategory(prev => prev === item.category ? 'All' : item.category)}
          >
            <div className="explore-img-ring">
              <img src={item.icon} alt={item.category} className="explore-img" />
            </div>
            <p className="explore-label">{item.category}</p>
          </div>
        ))}
      </div>

      <hr className="explore-divider" />
    </div>
  );
};

export default ExploreMenu;
