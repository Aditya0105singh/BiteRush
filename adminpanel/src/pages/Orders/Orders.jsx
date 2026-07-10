import React, { useEffect, useState } from 'react';
import { fetchAllOrders, updateOrderStatus } from '../../services/orderService';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './Orders.css';

const STATUS_OPTIONS = [
  'Food Preparing',
  'Out for delivery',
  'Delivered',
  'Cancelled',
];

const statusClass = s => {
  if (!s) return 'pending';
  const l = s.toLowerCase();
  if (l.includes('deliver') && !l.includes('out')) return 'delivered';
  if (l.includes('out')) return 'out';
  if (l.includes('prepar') || l.includes('confirm')) return 'preparing';
  if (l.includes('cancel')) return 'pending';
  return 'pending';
};

const Orders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const load = async () => {
    try {
      const data = await fetchAllOrders(token);
      setOrders(data.reverse());
    } catch {
      toast.error('Unable to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (orderId, status) => {
    const ok = await updateOrderStatus(orderId, status, token);
    if (ok) { toast.success('Status updated.'); load(); }
    else toast.error('Update failed.');
  };

  const FILTERS = ['All', 'Food Preparing', 'Out for delivery', 'Delivered'];
  const displayed = filter === 'All' ? orders : orders.filter(o => o.orderStatus === filter);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200, flexDirection: 'column', gap: 12, color: 'var(--text-muted)' }}>
      <div className="dash-spinner"></div>
      <p>Loading orders…</p>
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Orders</div>
        <div className="page-sub">{orders.length} total orders</div>
      </div>

      {/* Filter tabs */}
      <div className="cat-tabs" style={{ marginBottom: 20 }}>
        {FILTERS.map(f => (
          <button
            key={f}
            className={`cat-tab${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
            <span className="cat-count">
              {f === 'All' ? orders.length : orders.filter(o => o.orderStatus === f).length}
            </span>
          </button>
        ))}
      </div>

      {displayed.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <i className="bi bi-inbox" style={{ fontSize: '2rem' }}></i>
          <p style={{ marginTop: 8 }}>No orders in this category</p>
        </div>
      ) : (
        <div className="orders-list">
          {displayed.map((order, i) => (
            <div key={i} className="order-card card-modern">
              <div className="order-card-left">
                <div className="order-icon">
                  <i className="bi bi-bag-fill"></i>
                </div>
                <div className="order-info">
                  <div className="order-id">#{order.id?.slice(-8).toUpperCase()}</div>
                  <div className="order-items">
                    {order.orderedItems?.map((it, idx) => (
                      <span key={idx} className="order-item-chip">
                        {it.name} ×{it.quantity}
                      </span>
                    ))}
                  </div>
                  <div className="order-address">
                    <i className="bi bi-geo-alt"></i> {order.userAddress || 'No address'}
                  </div>
                </div>
              </div>

              <div className="order-card-right">
                <div className="order-meta">
                  <span className="order-amount">₹{order.amount?.toFixed(0)}</span>
                  <span className={`badge-status ${order.paymentStatus === 'Paid' ? 'paid' : 'unpaid'}`}>
                    {order.paymentStatus || 'Unpaid'}
                  </span>
                </div>
                <select
                  className="order-status-select"
                  value={order.orderStatus || 'Food Preparing'}
                  onChange={e => updateStatus(order.id, e.target.value)}
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <span className={`badge-status ${statusClass(order.orderStatus)}`} style={{ alignSelf: 'flex-end' }}>
                  {order.orderStatus || 'Pending'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
