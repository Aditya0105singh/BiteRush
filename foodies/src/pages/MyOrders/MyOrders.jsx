import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./MyOrders.css";
import { fetchUserOrders } from "../../service/orderService";

const STEPS = ["Placed", "Confirmed", "Preparing", "Out for Delivery", "Delivered"];

const statusToStep = (status) => {
  if (!status) return 0;
  const s = status.toLowerCase();
  if (s === "cancelled") return -1;
  if (s === "delivered") return 4;
  if (s === "out for delivery") return 3;
  if (s === "preparing") return 2;
  if (s === "confirmed") return 1;
  return 0; // pending / processing
};

const MyOrders = () => {
  const { token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetchUserOrders(token);
      setData(response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0" style={{ color: "var(--br-dark)" }}>My Orders</h3>
        <button className="refresh-btn" onClick={fetchOrders}>
          <i className="bi bi-arrow-clockwise me-1"></i>Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" style={{ color: "var(--br-orange)" }} role="status" />
        </div>
      ) : data.length === 0 ? (
        <div className="empty-orders">
          <i className="bi bi-bag-x"></i>
          <h5>No orders yet</h5>
          <p className="text-muted">When you place an order it will appear here.</p>
        </div>
      ) : (
        data.map((order) => {
          const step = statusToStep(order.orderStatus);
          const cancelled = step === -1;

          return (
            <div key={order.id} className="order-card">
              {/* Header row */}
              <div className="order-card-header">
                <div>
                  <span className="order-id">#{order.id?.slice(-8).toUpperCase()}</span>
                  <div className="order-items-text mt-1">
                    {order.orderedItems?.map((item, i) => (
                      <span key={i}>
                        {item.name} ×{item.quantity}
                        {i < order.orderedItems.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="d-flex flex-column align-items-end gap-1">
                  <span className="order-amount">&#8377;{order.amount?.toFixed(2)}</span>
                  <span className={`payment-badge ${order.paymentStatus === "Paid" ? "payment-paid" : "payment-unpaid"}`}>
                    {order.paymentStatus === "Paid" ? "✓ Paid" : "✗ Unpaid"}
                  </span>
                </div>
              </div>

              {/* Status timeline */}
              <div className="order-timeline-wrap">
                {cancelled ? (
                  <div className="order-cancelled-banner">
                    <i className="bi bi-x-circle-fill me-2"></i>Order Cancelled
                  </div>
                ) : (
                  <div className="order-timeline">
                    {STEPS.map((label, i) => (
                      <div key={i} className={`timeline-step ${i <= step ? "done" : ""} ${i === step ? "active" : ""}`}>
                        <div className="timeline-dot">
                          {i < step ? <i className="bi bi-check-lg"></i> : null}
                        </div>
                        {i < STEPS.length - 1 && (
                          <div className={`timeline-line ${i < step ? "filled" : ""}`} />
                        )}
                        <span className="timeline-label">{label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyOrders;
