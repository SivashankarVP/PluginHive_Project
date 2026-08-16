import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export const Payment = () => {
  const { cart, clearCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [paymentMode, setPaymentMode] = useState("UPI");
  const [paying, setPaying] = useState(false);

  const checkoutDetails = JSON.parse(localStorage.getItem("checkout_details")) || {
    address: "",
    subtotal: 0,
    discount: 0,
    total: 0,
  };

  const handlePay = async () => {
    if (!token) {
      alert("Please login to complete your payment");
      navigate("/login");
      return;
    }

    setPaying(true);

    try {
      const orderData = {
        restaurantId: 1, // Default or parsed from cart
        totalAmount: checkoutDetails.total,
        paymentMode,
        address: checkoutDetails.address,
        items: cart.map((it) => ({
          id: it.id,
          name: it.name,
          quantity: it.quantity,
          price: it.price,
        })),
      };

      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      // Success
      clearCart();
      localStorage.removeItem("checkout_details");
      navigate(`/order-success?orderId=${data.order.id}&invoiceUrl=${encodeURIComponent(data.order.invoiceUrl)}`);
    } catch (err) {
      console.error(err);
      alert(err.message || "An error occurred during payment processing");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div id="main">
      <div className="payment-container" style={{ padding: "120px 8% 50px 8%", color: "#fff", minHeight: "80vh", display: "flex", justifyContent: "center" }}>
        <div className="glass-card" style={{ width: "100%", maxWidth: "500px", background: "rgba(255,255,255,0.05)", borderRadius: "20px", padding: "40px", border: "1px solid rgba(255,255,255,0.1)", textAlign: "center" }}>
          <h1 style={{ fontFamily: "Product Sans B", marginBottom: "30px" }}>Payment</h1>

          <div style={{ background: "rgba(255,255,255,0.05)", padding: "20px", borderRadius: "10px", marginBottom: "30px", textAlign: "left" }}>
            <p style={{ margin: "5px 0", color: "#ccc" }}>Amount to Pay:</p>
            <h2 style={{ margin: "5px 0", color: "#ff9800", fontSize: "32px" }}>₹{checkoutDetails.total}</h2>
          </div>

          <h3 style={{ marginBottom: "20px", textAlign: "left" }}>Select Payment Mode</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px", textAlign: "left", marginBottom: "30px" }}>
            {["UPI", "Credit/Debit Card", "Net Banking", "Cash On Delivery"].map((mode) => (
              <label
                key={mode}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  padding: "15px 20px",
                  background: paymentMode === mode ? "rgba(255,152,0,0.15)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${paymentMode === mode ? "#ff9800" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: paymentMode === mode ? "bold" : "normal",
                  transition: "0.2s",
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMode === mode}
                  onChange={() => setPaymentMode(mode)}
                  style={{ accentColor: "#ff9800" }}
                />
                {mode}
              </label>
            ))}
          </div>

          <button
            onClick={handlePay}
            disabled={paying}
            style={{
              width: "100%",
              padding: "15px",
              background: paying ? "#666" : "#ff9800",
              color: "#fff",
              border: "none",
              borderRadius: "30px",
              fontWeight: "bold",
              cursor: paying ? "not-allowed" : "pointer",
              fontSize: "18px",
              boxShadow: paying ? "none" : "0 5px 15px rgba(255,152,0,0.3)",
            }}
          >
            {paying ? "Processing Payment..." : `Pay ₹${checkoutDetails.total}`}
          </button>
        </div>
      </div>
    </div>
  );
};
