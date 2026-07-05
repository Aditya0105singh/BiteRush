import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./FoodItem.css";

const FoodItem = ({ name, description, id, imageUrl, price, category }) => {
  const { increaseQty, decreaseQty, quantities } = useContext(StoreContext);

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex">
      <div className="food-card card w-100">
        <Link to={`/food/${id}`} className="text-decoration-none">
          <div className="food-card-img-wrapper">
            <img src={imageUrl} className="food-card-img" alt={name} />
          </div>
        </Link>
        <div className="card-body pb-1">
          {category && <span className="category-badge mb-2 d-inline-block">{category}</span>}
          <h5 className="card-title">{name}</h5>
          <p className="card-text">{description}</p>
          <span className="food-price">&#8377;{price}</span>
        </div>
        <div className="food-card-footer d-flex justify-content-between align-items-center">
          <Link className="btn-view" to={`/food/${id}`}>View</Link>
          {quantities[id] > 0 ? (
            <div className="qty-controls">
              <button className="qty-btn qty-btn-minus" onClick={() => decreaseQty(id)}>−</button>
              <span className="qty-display">{quantities[id]}</span>
              <button className="qty-btn qty-btn-plus" onClick={() => increaseQty(id)}>+</button>
            </div>
          ) : (
            <button className="btn-add-cart" onClick={() => increaseQty(id)}>
              <i className="bi bi-plus me-1"></i>Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
