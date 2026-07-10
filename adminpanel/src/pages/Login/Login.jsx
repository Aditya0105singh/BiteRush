import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const [data, setData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const onChange = e => setData(d => ({ ...d, [e.target.name]: e.target.value }));

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(data.email, data.password);
    } catch {
      toast.error('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell">
      {/* Left panel — branding */}
      <div className="login-left">
        <div className="login-left-content">
          <div className="login-brand">
            <div className="login-logo-box">
              <i className="bi bi-lightning-charge-fill"></i>
            </div>
            <span>BiteRush</span>
          </div>
          <h2 className="login-tagline">Manage your restaurant<br />with ease.</h2>
          <p className="login-desc">
            One dashboard for menus, orders, revenue, and everything in between.
          </p>
          <div className="login-features">
            {['Real-time order tracking', 'Revenue analytics', 'Menu management', 'Secure admin access'].map(f => (
              <div key={f} className="login-feature-item">
                <i className="bi bi-check-circle-fill"></i>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="login-left-bg"></div>
      </div>

      {/* Right panel — form */}
      <div className="login-right">
        <div className="login-form-wrap">
          <div className="login-form-header">
            <h1 className="login-form-title">Welcome back</h1>
            <p className="login-form-sub">Sign in to your admin account</p>
          </div>

          <form onSubmit={onSubmit} className="login-form">
            <div className="field">
              <label htmlFor="email">Email address</label>
              <div className="input-icon-wrap">
                <i className="bi bi-envelope input-icon"></i>
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="input-modern input-with-icon"
                  placeholder="admin@biterush.com"
                  value={data.email}
                  onChange={onChange}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="input-icon-wrap">
                <i className="bi bi-lock input-icon"></i>
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  name="password"
                  className="input-modern input-with-icon input-with-toggle"
                  placeholder="Enter your password"
                  value={data.password}
                  onChange={onChange}
                  required
                />
                <button
                  type="button"
                  className="pwd-toggle"
                  onClick={() => setShowPwd(v => !v)}
                  tabIndex={-1}
                >
                  <i className={`bi bi-eye${showPwd ? '-slash' : ''}`}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="btn-brand login-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="login-spinner"></span>
                  Signing in…
                </>
              ) : (
                <>
                  <i className="bi bi-arrow-right-circle"></i>
                  Sign in
                </>
              )}
            </button>
          </form>

          <p className="login-hint">
            <i className="bi bi-shield-lock-fill"></i>
            Admin access only. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
