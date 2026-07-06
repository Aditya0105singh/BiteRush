import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchFoodDetails } from "../../service/foodService";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";
import "./FoodDetails.css";

const FoodDetails = () => {
  const { id } = useParams();
  const { increaseQty, foodList } = useContext(StoreContext);
  const navigate = useNavigate();
  const [data, setData] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    const load = async () => {
      try {
        const foodData = await fetchFoodDetails(id);
        setData(foodData);
      } catch {
        toast.error("Error displaying the food details.");
      }
    };
    load();
  }, [id]);

  const addToCart = () => {
    increaseQty(data.id);
    navigate("/cart");
  };

  // "You Might Also Like" — same category, different item, max 4
  const similar = foodList
    .filter(f => f.category === data.category && f.id !== id)
    .slice(0, 4);

  return (
    <>
      <section className="py-5">
        <div className="container px-4 px-lg-5 my-3">
          <div className="row gx-5 align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <img
                src={data.imageUrl}
                alt={data.name}
                className="food-detail-img"
              />
            </div>
            <div className="col-md-6">
              {data.category && (
                <span className="food-detail-cat">{data.category}</span>
              )}
              <h1 className="fw-bold mt-2 mb-1" style={{ fontSize: '2rem' }}>{data.name}</h1>
              <div className="mb-2">
                {[...Array(4)].map((_, i) => (
                  <i key={i} className="bi bi-star-fill text-warning"></i>
                ))}
                <i className="bi bi-star-half text-warning"></i>
                <small className="text-muted ms-1">(4.5)</small>
              </div>
              <p className="text-muted mb-3">{data.description}</p>
              <div className="mb-4">
                <span className="food-detail-price">&#8377;{data.price}</span>
              </div>
              <div className="d-flex gap-3">
                <button className="btn-detail-cart" onClick={addToCart}>
                  <i className="bi bi-cart-plus me-2"></i>Add to Cart
                </button>
                <Link to="/" className="btn-detail-back">
                  ← Back to Menu
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* You Might Also Like */}
      {similar.length > 0 && (
        <section className="container pb-5">
          <h5 className="similar-title">You might also like</h5>
          <div className="similar-grid">
            {similar.map(food => (
              <Link key={food.id} to={`/food/${food.id}`} className="similar-card">
                <img src={food.imageUrl} alt={food.name} className="similar-img" loading="lazy" />
                <div className="similar-body">
                  <p className="similar-name">{food.name}</p>
                  <p className="similar-price">&#8377;{food.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default FoodDetails;
