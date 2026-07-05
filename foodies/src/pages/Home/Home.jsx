import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import { useState } from 'react';

const Home = () => {
  const [category, setCategory] = useState('All');
  const [searchText, setSearchText] = useState('');

  return (
    <main className='container'>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <div className="input-group mb-4" style={{ maxWidth: 400 }}>
        <span className="input-group-text bg-white">
          <i className="bi bi-search"></i>
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Search for dishes..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
        {searchText && (
          <button className="btn btn-outline-secondary" onClick={() => setSearchText('')}>
            <i className="bi bi-x"></i>
          </button>
        )}
      </div>
      <FoodDisplay category={category} searchText={searchText} />
    </main>
  )
}

export default Home;