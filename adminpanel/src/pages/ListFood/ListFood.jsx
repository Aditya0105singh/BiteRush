import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { deleteFood, getFoodList } from '../../services/foodService';
import { useAuth } from '../../context/AuthContext';
import './ListFood.css';

const CATEGORIES = ['All', 'Biryani', 'Burger', 'Pizza', 'Rolls', 'Salad', 'Cake', 'Ice cream', 'Chinese', 'South Indian', 'North Indian'];

const ListFood = () => {
  const { token } = useAuth();
  const [list, setList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchList = async () => {
    try {
      const data = await getFoodList();
      setList(data);
    } catch {
      toast.error('Error loading menu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchList(); }, []);

  useEffect(() => {
    let result = list;
    if (category !== 'All') result = result.filter(f => f.category === category);
    if (search.trim()) result = result.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
    setFiltered(result);
  }, [list, category, search]);

  const removeFood = async id => {
    setDeleting(id);
    try {
      const ok = await deleteFood(id, token);
      if (ok) { toast.success('Item removed.'); fetchList(); }
      else toast.error('Could not remove item.');
    } catch {
      toast.error('Error removing item.');
    } finally {
      setDeleting(null);
    }
  };

  const catCounts = cat => cat === 'All' ? list.length : list.filter(f => f.category === cat).length;

  if (loading) return (
    <div className="lf-loading">
      <div className="dash-spinner"></div>
      <p>Loading menu…</p>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div className="lf-header-row">
          <div>
            <div className="page-title">Food Menu</div>
            <div className="page-sub">{list.length} items on the menu</div>
          </div>
          <div className="search-wrap">
            <i className="bi bi-search"></i>
            <input
              type="text"
              className="input-modern"
              placeholder="Search food…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="cat-tabs">
        {CATEGORIES.filter(c => c === 'All' || list.some(f => f.category === c)).map(c => (
          <button
            key={c}
            className={`cat-tab${category === c ? ' active' : ''}`}
            onClick={() => setCategory(c)}
          >
            {c}
            <span className="cat-count">{catCounts(c)}</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="lf-empty">
          <i className="bi bi-search"></i>
          <p>No items found</p>
        </div>
      ) : (
        <div className="lf-grid">
          {filtered.map(item => (
            <div key={item.id} className="lf-card">
              <div className="lf-img-wrap">
                <img src={item.imageUrl} alt={item.name} className="lf-img" loading="lazy" />
                <span className="lf-cat-badge">{item.category}</span>
              </div>
              <div className="lf-body">
                <div className="lf-name">{item.name}</div>
                <div className="lf-desc">{item.description}</div>
                <div className="lf-footer">
                  <span className="lf-price">₹{item.price}</span>
                  <button
                    className="lf-delete-btn"
                    onClick={() => removeFood(item.id)}
                    disabled={deleting === item.id}
                    title="Delete"
                  >
                    {deleting === item.id
                      ? <i className="bi bi-hourglass-split"></i>
                      : <i className="bi bi-trash3"></i>
                    }
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListFood;
