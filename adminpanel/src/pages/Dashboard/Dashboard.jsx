import React, { useEffect, useState } from 'react';
import { fetchAllOrders } from '../../services/orderService';
import { getFoodList } from '../../services/foodService';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const StatCard = ({ icon, label, value, color, sub, trend }) => (
  <div className="dash-stat-card">
    <div className="dash-stat-top">
      <div className="dash-stat-icon" style={{ background: color + '18', color }}>
        <i className={`bi bi-${icon}`}></i>
      </div>
      {trend !== undefined && (
        <span className={`dash-trend ${trend >= 0 ? 'up' : 'down'}`}>
          <i className={`bi bi-arrow-${trend >= 0 ? 'up' : 'down'}-right`}></i>
          {Math.abs(trend)}%
        </span>
      )}
    </div>
    <div className="dash-stat-value">{value}</div>
    <div className="dash-stat-label">{label}</div>
    {sub && <div className="dash-stat-sub">{sub}</div>}
  </div>
);

const statusClass = s => {
  if (!s) return 'pending';
  const l = s.toLowerCase();
  if (l.includes('deliver')) return 'delivered';
  if (l.includes('out')) return 'out';
  if (l.includes('prepar') || l.includes('confirm')) return 'preparing';
  return 'pending';
};

const Dashboard = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [foodCount, setFoodCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [orderData, foodData] = await Promise.all([
          fetchAllOrders(token),
          getFoodList(),
        ]);
        setOrders(orderData);
        setFoodCount(foodData.length);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'Paid')
    .reduce((s, o) => s + (o.amount || 0), 0);

  const pending = orders.filter(
    o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled'
  ).length;

  const delivered = orders.filter(o => o.orderStatus === 'Delivered').length;
  const recent = [...orders].reverse().slice(0, 6);

  if (loading) return (
    <div className="dash-loading">
      <div className="dash-spinner"></div>
      <p>Loading dashboard…</p>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Dashboard</div>
        <div className="page-sub">Welcome back, Admin — here's what's happening today.</div>
      </div>

      {/* Stats */}
      <div className="dash-stats-grid">
        <StatCard icon="currency-rupee"  label="Total Revenue"  value={`₹${totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} color="#fc8019" sub="From paid orders" trend={12} />
        <StatCard icon="bag-check"       label="Total Orders"   value={orders.length}  color="#3b82f6" sub={`${delivered} delivered`} trend={8} />
        <StatCard icon="clock-history"   label="Active Orders"  value={pending}        color="#f59e0b" sub="Needs attention" />
        <StatCard icon="egg-fried"       label="Menu Items"     value={foodCount}      color="#22c55e" sub="On the menu" />
      </div>

      <div className="dash-bottom-grid">
        {/* Recent Orders */}
        <div className="card-modern dash-orders-card">
          <div className="dash-card-header">
            <span className="dash-card-title">Recent Orders</span>
            <span className="dash-card-count">{recent.length} orders</span>
          </div>
          {recent.length === 0 ? (
            <div className="dash-empty">
              <i className="bi bi-inbox"></i>
              <p>No orders yet</p>
            </div>
          ) : (
            <div className="dash-order-list">
              {recent.map((order, i) => (
                <div key={i} className="dash-order-row">
                  <div className="dash-order-icon">
                    <i className="bi bi-bag-fill"></i>
                  </div>
                  <div className="dash-order-info">
                    <div className="dash-order-id">#{order.id?.slice(-8).toUpperCase()}</div>
                    <div className="dash-order-items">
                      {order.orderedItems?.slice(0, 2).map(it => it.name).join(', ')}
                      {order.orderedItems?.length > 2 && ` +${order.orderedItems.length - 2}`}
                    </div>
                  </div>
                  <div className="dash-order-right">
                    <div className="dash-order-amount">₹{order.amount?.toFixed(0)}</div>
                    <span className={`badge-status ${statusClass(order.orderStatus)}`}>
                      {order.orderStatus || 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick stats panel */}
        <div className="card-modern dash-quick-card">
          <div className="dash-card-header">
            <span className="dash-card-title">Order Breakdown</span>
          </div>
          <div className="dash-breakdown">
            {[
              { label: 'Delivered',       count: delivered,                                  color: '#22c55e' },
              { label: 'Active',          count: pending,                                    color: '#f59e0b' },
              { label: 'Cancelled',       count: orders.filter(o => o.orderStatus === 'Cancelled').length, color: '#ef4444' },
              { label: 'Paid',            count: orders.filter(o => o.paymentStatus === 'Paid').length,    color: '#3b82f6' },
            ].map(({ label, count, color }) => (
              <div key={label} className="dash-breakdown-row">
                <div className="dash-breakdown-dot" style={{ background: color }}></div>
                <span className="dash-breakdown-label">{label}</span>
                <span className="dash-breakdown-count">{count}</span>
                <div className="dash-breakdown-bar-wrap">
                  <div
                    className="dash-breakdown-bar"
                    style={{
                      width: orders.length ? `${(count / orders.length) * 100}%` : '0%',
                      background: color,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="dash-revenue-box">
            <div className="dash-revenue-label">Total Revenue</div>
            <div className="dash-revenue-value">
              ₹{totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
            <div className="dash-revenue-sub">From {orders.filter(o => o.paymentStatus === 'Paid').length} paid orders</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
