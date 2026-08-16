import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export const Cart = () => {
  const { cart, updateQuantity, removeFromCart, cartSubtotal } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div id="main">
      <div className="cart-container" style={{ padding: "120px 8% 50px 8%", color: "#fff", minHeight: "80vh" }}>
        <h1 style={{ fontFamily: "Product Sans B", marginBottom: "30px" }}>Your Cart</h1>

        {cart.length === 0 ? (
          <div className="glass-card" style={{ padding: "40px", textAlign: "center", background: "rgba(255,255,255,0.05)", borderRadius: "20px" }}>
            <h2>Your cart is empty!</h2>
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
          <div style={{ display: "flex", gap: "30px", flexDirection: "column" }}>
            <div className="glass-card" style={{ background: "rgba(255,255,255,0.05)", borderRadius: "20px", overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    <th style={{ padding: "20px" }}>Item</th>
                    <th style={{ padding: "20px" }}>Price</th>
                    <th style={{ padding: "20px" }}>Quantity</th>
                    <th style={{ padding: "20px" }}>Total</th>
                    <th style={{ padding: "20px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "20px", display: "flex", alignItems: "center", gap: "15px" }}>
                        <img src={item.img} alt={item.name} style={{ width: "60px", height: "60px", borderRadius: "10px", objectFit: "cover" }} />
                        <span>{item.name}</span>
                      </td>
                      <td style={{ padding: "20px" }}>₹{item.price}</td>
                      <td style={{ padding: "20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", width: "30px", height: "30px", borderRadius: "5px", cursor: "pointer" }}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", width: "30px", height: "30px", borderRadius: "5px", cursor: "pointer" }}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: "20px" }}>₹{item.price * item.quantity}</td>
                      <td style={{ padding: "20px" }}>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{ background: "transparent", border: "none", color: "#ff4d6d", cursor: "pointer", fontSize: "20px" }}
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div
              className="glass-card"
              style={{
                alignSelf: "flex-end",
                width: "100%",
                maxWidth: "400px",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "20px",
                padding: "30px",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <h3 style={{ marginBottom: "20px" }}>Order Summary</h3>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                <span>Subtotal</span>
                <span>₹{cartSubtotal}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "15px" }}>
                <span>Delivery Fee</span>
                <span style={{ color: "#4caf50" }}>FREE</span>
              </div>
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "15px", display: "flex", justifyContent: "space-between", marginBottom: "25px", fontWeight: "bold", fontSize: "18px" }}>
                <span>Total</span>
                <span>₹{cartSubtotal}</span>
              </div>
              <button
                onClick={handleCheckout}
                style={{
                  width: "100%",
                  padding: "15px",
                  background: "#ff9800",
                  color: "#fff",
                  border: "none",
                  borderRadius: "30px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontSize: "16px",
                  boxShadow: "0 5px 15px rgba(255,152,0,0.3)",
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
