import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets";
import "./MyOrders.css";
import { fetchUserOrders } from "../../service/orderService";

const MyOrders = () => {
  const { token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    const response = await fetchUserOrders(token);
    setData(response);
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const getStatusClass = (status) => {
    if (!status) return 'status-default';
    const s = status.toLowerCase();
    if (s === 'delivered') return 'status-delivered';
    if (s === 'processing') return 'status-processing';
    if (s === 'preparing') return 'status-preparing';
    if (s === 'pending') return 'status-pending';
    if (s === 'cancelled') return 'status-cancelled';
    return 'status-default';
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">My Orders</h3>
        <button className="refresh-btn" onClick={fetchOrders}>
          <i className="bi bi-arrow-clockwise me-1"></i>Refresh
        </button>
      </div>

      {data.length === 0 ? (
        <div className="empty-orders">
          <i className="bi bi-bag-x"></i>
          <h5>No orders yet</h5>
          <p className="text-muted">When you place an order it will appear here.</p>
        </div>
      ) : (
        data.map((order, index) => (
          <div key={index} className="order-card card">
            <div className="order-card-header">
              <div>
                <span className="order-id">#{order.id?.slice(-8).toUpperCase()}</span>
                <div className="order-items-text mt-1">
                  {order.orderedItems.map((item, i) => (
                    <span key={i}>{item.name} ×{item.quantity}{i < order.orderedItems.length - 1 ? ', ' : ''}</span>
                  ))}
                </div>
              </div>
              <div className="d-flex flex-column align-items-end gap-1">
                <span className="order-amount">&#8377;{order.amount?.toFixed(2)}</span>
                <span className={`status-badge ${getStatusClass(order.orderStatus)}`}>
                  {order.orderStatus || 'Pending'}
                </span>
                <span className={`payment-badge ${order.paymentStatus === 'Paid' ? 'payment-paid' : 'payment-unpaid'}`}>
                  {order.paymentStatus === 'Paid' ? '✓ Paid' : '✗ Unpaid'}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;
