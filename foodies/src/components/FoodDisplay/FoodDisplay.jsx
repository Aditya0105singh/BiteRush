import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';
import './FoodDisplay.css';

const SkeletonCard = () => (
  <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-5">
    <div className="skeleton-card">
      <div className="skel-img"></div>
      <div className="skel-body">
        <div className="skel-line skel-cat"></div>
        <div className="skel-line skel-title"></div>
        <div className="skel-line skel-desc"></div>
        <div className="skel-line skel-price"></div>
      </div>
    </div>
  </div>
);

const FoodDisplay = ({ category, searchText }) => {
  const { foodList, foodLoading } = useContext(StoreContext);

  if (foodLoading) {
    return (
      <div className="container">
        <div className="row">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  const filteredFoods = foodList.filter(food => (
    (category === 'All' || food.category === category) &&
    food.name.toLowerCase().includes((searchText || '').toLowerCase())
  ));

  return (
    <div className="container">
      <div className="row">
        {filteredFoods.length > 0 ? (
          filteredFoods.map((food, index) => (
            <FoodItem key={index}
              name={food.name}
              description={food.description}
              id={food.id}
              imageUrl={food.imageUrl}
              price={food.price}
              category={food.category} />
          ))
        ) : (
          <div className="empty-state text-center mt-4 py-5">
            <div style={{ fontSize: '3rem' }}>🍽️</div>
            <h5 className="mt-3">No dishes found</h5>
            <p className="text-muted">Try a different category or search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
