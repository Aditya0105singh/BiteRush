import React, { useState } from 'react';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import './ExploreFood.css';

const ExploreFood = () => {
  const [category, setCategory] = useState('All');
  const [searchText, setSearchText] = useState('');

  return (
    <div className="container py-4">
      {/* Page header */}
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-1" style={{ color: 'var(--br-dark)', fontSize: '1.5rem' }}>
            Explore Menu
          </h2>
          <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
            Browse all dishes — filter by category or search below
          </p>
        </div>

        {/* Search bar */}
        <div className="explore-search-wrap">
          <i className="bi bi-search explore-search-icon"></i>
          <input
            type="text"
            placeholder="Search dishes..."
            className="explore-search-input"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          {searchText && (
            <button className="explore-search-clear" onClick={() => setSearchText('')}>
              <i className="bi bi-x-lg"></i>
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <ExploreMenu category={category} setCategory={setCategory} />

      {/* Active filter chip */}
      {(category !== 'All' || searchText) && (
        <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
          {category !== 'All' && (
            <span className="filter-chip">
              {category}
              <button onClick={() => setCategory('All')}>×</button>
            </span>
          )}
          {searchText && (
            <span className="filter-chip">
              "{searchText}"
              <button onClick={() => setSearchText('')}>×</button>
            </span>
          )}
        </div>
      )}

      <FoodDisplay category={category} searchText={searchText} />
    </div>
  );
};

export default ExploreFood;
