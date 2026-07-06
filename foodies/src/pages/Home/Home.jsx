import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import { useState } from 'react';
import './Home.css';

const OFFERS = [
  { emoji: '🎉', title: 'First order free delivery', sub: 'Use code FIRST50', color: '#fff4ec', border: '#fc8019' },
  { emoji: '⚡', title: 'Lightning fast delivery', sub: 'In under 30 minutes', color: '#eefbf3', border: '#60b246' },
  { emoji: '🍕', title: '20% off on Pizzas', sub: 'Every Wednesday', color: '#f0f4ff', border: '#5b6ef5' },
  { emoji: '🥤', title: 'Free drink on orders ₹500+', sub: 'Limited time deal', color: '#fff8e1', border: '#f6c90e' },
];

const Home = () => {
  const [category, setCategory] = useState('All');
  const [searchText, setSearchText] = useState('');

  return (
    <main className='container'>
      {/* Hero with integrated search */}
      <Header searchText={searchText} setSearchText={setSearchText} />

      {/* Offer banners — horizontal scroll on mobile */}
      <div className="offers-row">
        {OFFERS.map((o, i) => (
          <div
            key={i}
            className="offer-chip"
            style={{ background: o.color, borderColor: o.border }}
          >
            <span className="offer-emoji">{o.emoji}</span>
            <div>
              <p className="offer-title">{o.title}</p>
              <p className="offer-sub">{o.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Category scroll */}
      <ExploreMenu category={category} setCategory={setCategory} />

      {/* Section header */}
      <div className="section-header">
        <h2 className="section-title">
          {category === 'All' ? 'All Dishes' : category}
          {searchText && <span className="search-pill"> · "{searchText}"</span>}
        </h2>
      </div>

      <FoodDisplay category={category} searchText={searchText} />
    </main>
  );
};

export default Home;
