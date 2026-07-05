import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchFoodDetails } from "../../service/foodService";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";

const FoodDetails = () => {
  const { id } = useParams();
  const { increaseQty } = useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({});

  useEffect(() => {
    const loadFoodDetails = async () => {
      try {
        const foodData = await fetchFoodDetails(id);
        setData(foodData);
      } catch (error) {
        toast.error("Error displaying the food details.");
      }
    };
    loadFoodDetails();
  }, [id]);

  const addToCart = () => {
    increaseQty(data.id);
    navigate("/cart");
  };
  return (
    <section className="py-5">
      <div className="container px-4 px-lg-5 my-3">
        <div className="row gx-5 align-items-center">
          <div className="col-md-6 mb-4 mb-md-0">
            <img
              src={data.imageUrl}
              alt={data.name}
              style={{
                width: '100%',
                height: '380px',
                objectFit: 'cover',
                borderRadius: '18px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
              }}
            />
          </div>
          <div className="col-md-6">
            {data.category && (
              <span style={{
                background: 'var(--br-orange-light)',
                color: 'var(--br-orange)',
                borderRadius: '20px',
                padding: '4px 14px',
                fontSize: '0.82rem',
                fontWeight: 600
              }}>{data.category}</span>
            )}
            <h1 className="fw-bold mt-2 mb-1" style={{ fontSize: '2rem' }}>{data.name}</h1>
            <div className="mb-2">
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-half text-warning"></i>
              <small className="text-muted ms-1">(4.5)</small>
            </div>
            <p className="text-muted mb-3">{data.description}</p>
            <div className="d-flex align-items-center gap-3 mb-4">
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--br-orange)' }}>
                &#8377;{data.price}
              </span>
            </div>
            <div className="d-flex gap-3">
              <button
                style={{
                  background: 'var(--br-orange)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '30px',
                  padding: '0.65rem 2rem',
                  fontWeight: 700,
                  fontSize: '1rem'
                }}
                onClick={addToCart}
              >
                <i className="bi bi-cart-plus me-2"></i>Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoodDetails;
