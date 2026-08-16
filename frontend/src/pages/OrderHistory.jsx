import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const OrderHistory = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login?redirect=orders");
      return;
    }

    fetch("http://localhost:5000/api/orders", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
        }
      })
      .catch((err) => console.error("Error fetching order history:", err))
      .finally(() => setLoading(false));
  }, [token, navigate]);

  if (loading) {
    return (
      <div id="main">
        <div style={{ color: "#fff", padding: "150px 8% 50px 8%", textAlign: "center", minHeight: "80vh" }}>
          <h2>Loading your orders...</h2>
        </div>
      </div>
    );
  }

  return (
    <div id="main">
      <div className="orders-container" style={{ padding: "120px 8% 50px 8%", color: "#fff", minHeight: "80vh" }}>
        <h1 style={{ fontFamily: "Product Sans B", marginBottom: "30px" }}>Order History</h1>

        {orders.length === 0 ? (
          <div className="glass-card" style={{ padding: "40px", textAlign: "center", background: "rgba(255,255,255,0.05)", borderRadius: "20px" }}>
            <h2>You haven't placed any orders yet!</h2>
            <button
              onClick={() => navigate("/")}
              style={{
                marginTop: "20px",
                padding: "12px 30px",
                background: "#ff9800",
                color: "#fff",
                border: "none",
                borderRadius: "30px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Order Now
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
            {orders.map((order) => (
              <div
                key={order.id}
                className="glass-card"
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "20px",
                  padding: "30px",
                  boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
                }}
              >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "15px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "15px", marginBottom: "20px" }}>
                  <div>
                    <span style={{ color: "#aaa", fontSize: "14px" }}>Order Placed:</span>{" "}
                    <strong>{new Date(order.orderDate).toLocaleString()}</strong>
                  </div>
                  <div>
                    <span style={{ color: "#aaa", fontSize: "14px" }}>Status:</span>{" "}
                    <span style={{ color: "#4caf50", fontWeight: "bold" }}>{order.status}</span>
                  </div>
                  <div>
                    <span style={{ color: "#aaa", fontSize: "14px" }}>Order ID:</span>{" "}
                    <strong>{order.id}</strong>
                  </div>
                </div>

                {/* Items */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                  {order.items &&
                    order.items.map((item, index) => (
                      <div key={index} style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>
                          {item.name} <span style={{ color: "#aaa" }}>x{item.quantity}</span>
                        </span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                </div>

                {/* Footer */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "15px" }}>
                  <div>
                    <span style={{ color: "#aaa" }}>Total Paid:</span>{" "}
                    <strong style={{ fontSize: "20px", color: "#ff9800" }}>₹{order.totalAmount}</strong>
                  </div>
                  {order.invoiceUrl && (
                    <a
                      href={order.invoiceUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: "10px 20px",
                        background: "rgba(76, 175, 80, 0.15)",
                        border: "1px solid #4caf50",
                        borderRadius: "30px",
                        color: "#fff",
                        textDecoration: "none",
                        fontWeight: "bold",
                        fontSize: "14px",
                        transition: "0.2s",
                      }}
                      onMouseOver={(e) => (e.target.style.background = "#4caf50")}
                      onMouseOut={(e) => (e.target.style.background = "rgba(76, 175, 80, 0.15)")}
                    >
                      <i className="ri-file-text-line" style={{ marginRight: "6px" }}></i>
                      Invoice
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
