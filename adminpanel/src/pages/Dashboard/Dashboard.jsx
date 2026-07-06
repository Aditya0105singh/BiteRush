import React, { useEffect, useState } from 'react';
import { fetchAllOrders } from '../../services/orderService';
import { getFoodList } from '../../services/foodService';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const StatCard = ({ icon, label, value, color, sub }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: color + '18', color }}>
      <i className={`bi bi-${icon}`}></i>
    </div>
    <div className="stat-body">
      <p className="stat-label">{label}</p>
      <h3 className="stat-value">{value}</h3>
      {sub && <p className="stat-sub">{sub}</p>}
    </div>
  </div>
);

const Dashboard = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [foodCount, setFoodCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [orderData, foodData] = await Promise.all([
          fetchAllOrders(token),
          getFoodList()
        ]);
        setOrders(orderData);
        setFoodCount(foodData.length);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + (o.amount || 0), 0);

  const pending = orders.filter(o =>
    o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled'
  ).length;

  const delivered = orders.filter(o => o.orderStatus === 'Delivered').length;

  // recent 5 orders
  const recent = [...orders].reverse().slice(0, 5);

  if (loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-warning" role="status" />
    </div>
  );

  return (
    <div className="dashboard-wrap">
      <h4 className="dash-title">Dashboard</h4>
      <p className="dash-sub">Welcome back, Admin 👋</p>

      {/* Stat cards */}
      <div className="stats-grid">
        <StatCard
          icon="currency-rupee"
          label="Total Revenue"
          value={`₹${totalRevenue.toFixed(0)}`}
          color="#fc8019"
          sub="From paid orders"
        />
        <StatCard
          icon="bag-check"
          label="Total Orders"
          value={orders.length}
          color="#5b6ef5"
          sub={`${delivered} delivered`}
        />
        <StatCard
          icon="clock-history"
          label="Pending Orders"
          value={pending}
          color="#f59e0b"
          sub="Needs attention"
        />
        <StatCard
          icon="egg-fried"
          label="Food Items"
          value={foodCount}
          color="#60b246"
          sub="On the menu"
        />
      </div>

      {/* Recent orders table */}
      <div className="recent-card">
        <h6 className="recent-title">Recent Orders</h6>
        {recent.length === 0 ? (
          <p className="text-muted text-center py-3">No orders yet.</p>
        ) : (
          <table className="table table-sm mb-0">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((order, i) => (
                <tr key={i}>
                  <td className="text-muted" style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    #{order.id?.slice(-8).toUpperCase()}
                  </td>
                  <td style={{ fontSize: '0.82rem' }}>
                    {order.orderedItems?.map(it => it.name).join(', ')}
                  </td>
                  <td style={{ fontWeight: 700 }}>₹{order.amount?.toFixed(0)}</td>
                  <td>
                    <span className={`dash-badge status-${order.orderStatus?.toLowerCase().replace(/\s/g, '-')}`}>
                      {order.orderStatus || 'Pending'}
                    </span>
                  </td>
                  <td>
                    <span className={`dash-badge ${order.paymentStatus === 'Paid' ? 'paid' : 'unpaid'}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
