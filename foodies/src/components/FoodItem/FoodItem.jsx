import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import "./FoodItem.css";

const NON_VEG_CATEGORIES = ["Chicken", "North Indian", "Biryani", "Burgers", "Chinese", "Street Food"];

const getRating = (name, price) => {
  const hash = (name.charCodeAt(0) * 17 + name.length * 7 + price) % 13;
  return (3.8 + hash * 0.09).toFixed(1);
};

const FoodItem = ({ name, description, id, imageUrl, price, category }) => {
  const { increaseQty, decreaseQty, quantities, token } = useContext(StoreContext);
  const navigate = useNavigate();
  const inCart = quantities[id] > 0;

  const handleAdd = () => {
    if (!token) {
      toast.info('Please login to add items to cart.');
      navigate('/login');
      return;
    }
    increaseQty(id);
  };

  const handleIncrease = () => {
    if (!token) { navigate('/login'); return; }
    increaseQty(id);
  };

  const handleDecrease = () => {
    if (!token) { navigate('/login'); return; }
    decreaseQty(id);
  };
  const isVeg = !NON_VEG_CATEGORIES.includes(category);
  const rating = getRating(name, price);

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-5 d-flex">
      <div className="swiggy-card w-100">

        {/* Image container — overflow: visible so ADD button peeks below */}
        <div className="swiggy-img-wrap">
          <Link to={`/food/${id}`} className="d-block h-100">
            <img src={imageUrl} className="swiggy-img" alt={name} loading="lazy" />
          </Link>

          {/* Top-left: rating */}
          <div className="swiggy-rating">
            <i className="bi bi-star-fill"></i> {rating}
          </div>

          {/* Top-right: veg / non-veg */}
          <div className={`swiggy-veg-badge ${isVeg ? 'veg' : 'nonveg'}`}>
            <span className="veg-dot"></span>
          </div>

          {/* Bottom-right: ADD or qty controller (overlaps card body) */}
          {inCart ? (
            <div className="swiggy-qty">
              <button className="qty-dec" onClick={handleDecrease}>−</button>
              <span>{quantities[id]}</span>
              <button className="qty-inc" onClick={handleIncrease}>+</button>
            </div>
          ) : (
            <button className="swiggy-add-btn" onClick={handleAdd}>ADD</button>
          )}
        </div>

        {/* Card body — padding-top leaves room for the overlapping button */}
        <div className="swiggy-body">
          {category && (
            <span className="swiggy-category">{category}</span>
          )}
          <h6 className="swiggy-name">{name}</h6>
          <p className="swiggy-desc">{description}</p>
          <span className="swiggy-price">&#8377;{price}</span>
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
