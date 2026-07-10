import React, { useState } from 'react';
import { assets } from '../../assets/assets';
import { addFood } from '../../services/foodService';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './AddFood.css';

const CATEGORIES = ['Biryani', 'Burger', 'Pizza', 'Rolls', 'Salad', 'Cake', 'Ice cream', 'Chinese', 'South Indian', 'North Indian'];

const AddFood = () => {
  const { token } = useAuth();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ name: '', description: '', price: '', category: 'Biryani' });

  const onChange = e => setData(d => ({ ...d, [e.target.name]: e.target.value }));

  const onSubmit = async e => {
    e.preventDefault();
    if (!image) { toast.error('Please select an image.'); return; }
    setLoading(true);
    try {
      await addFood(data, image, token);
      toast.success('Food item added successfully!');
      setData({ name: '', description: '', price: '', category: 'Biryani' });
      setImage(null);
    } catch {
      toast.error('Error adding food item.');
    } finally {
      setLoading(false);
    }
  };

  const preview = image ? URL.createObjectURL(image) : null;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Add Food Item</div>
        <div className="page-sub">Fill in the details to add a new dish to the menu</div>
      </div>

      <div className="af-layout">
        {/* Form */}
        <div className="card-modern af-form-card">
          <div className="af-card-header">Food Details</div>
          <form onSubmit={onSubmit} className="af-form">

            <div className="field">
              <label>Food Name</label>
              <input
                type="text"
                name="name"
                className="input-modern"
                placeholder="e.g. Chicken Biryani"
                value={data.name}
                onChange={onChange}
                required
              />
            </div>

            <div className="field">
              <label>Description</label>
              <textarea
                name="description"
                className="input-modern af-textarea"
                placeholder="Describe the dish — ingredients, taste, serving size…"
                rows={4}
                value={data.description}
                onChange={onChange}
                required
              />
            </div>

            <div className="af-row">
              <div className="field" style={{ flex: 1 }}>
                <label>Category</label>
                <select name="category" className="input-modern" value={data.category} onChange={onChange}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="field" style={{ flex: 1 }}>
                <label>Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  className="input-modern"
                  placeholder="200"
                  min="1"
                  value={data.price}
                  onChange={onChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-brand af-submit" disabled={loading}>
              {loading
                ? <><span className="login-spinner"></span> Saving…</>
                : <><i className="bi bi-plus-circle"></i> Add to Menu</>
              }
            </button>
          </form>
        </div>

        {/* Image upload */}
        <div className="af-image-col">
          <div className="card-modern af-upload-card">
            <div className="af-card-header">Food Image</div>
            <label htmlFor="food-img" className="af-drop-zone">
              {preview ? (
                <img src={preview} alt="preview" className="af-preview-img" />
              ) : (
                <div className="af-drop-inner">
                  <div className="af-drop-icon">
                    <i className="bi bi-cloud-arrow-up"></i>
                  </div>
                  <p className="af-drop-text">Click to upload image</p>
                  <p className="af-drop-hint">JPG, PNG, WEBP — max 5 MB</p>
                </div>
              )}
            </label>
            <input
              id="food-img"
              type="file"
              accept="image/*"
              hidden
              onChange={e => setImage(e.target.files[0] || null)}
            />
            {image && (
              <div className="af-img-info">
                <i className="bi bi-image"></i>
                <span>{image.name}</span>
                <button className="af-img-remove" type="button" onClick={() => setImage(null)}>
                  <i className="bi bi-x"></i>
                </button>
              </div>
            )}
          </div>

          {/* Tips card */}
          <div className="card-modern af-tips-card">
            <div className="af-card-header">Tips for a great listing</div>
            <ul className="af-tips-list">
              {[
                'Use a square image (1:1) for best results',
                'Good lighting makes food look more appetising',
                'Keep the description under 150 characters',
                'Set a competitive price for your category',
              ].map(t => (
                <li key={t}><i className="bi bi-lightbulb"></i>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddFood;
