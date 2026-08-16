import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export const Checkout = () => {
  const { cart, cartSubtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState(user?.city || "");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState("");

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === "SIVA95") {
      const amt = Math.round(cartSubtotal * 0.95);
      setDiscount(amt);
      setPromoApplied("SIVA95 (95% Off Applied)");
    } else if (code === "WELCOME50") {
      const amt = cartSubtotal > 200 ? 100 : 0;
      if (amt === 0) {
        alert("Subtotal must be greater than ₹200 for WELCOME50");
        return;
      }
      setDiscount(amt);
      setPromoApplied("WELCOME50 (₹100 Off Applied)");
    } else {
      alert("Invalid Promo Code");
    }
  };

  const handleProceedToPayment = () => {
    if (!address.trim()) {
      alert("Please enter a delivery address");
      return;
    }
    const finalAmount = cartSubtotal - discount;
    localStorage.setItem(
      "checkout_details",
      JSON.stringify({
        address,
        subtotal: cartSubtotal,
        discount,
        total: finalAmount,
        promoCode: promoApplied ? promoCode : "",
      })
    );
    navigate("/payment");
  };

  return (
    <div id="main">
      <div className="checkout-container" style={{ padding: "120px 8% 50px 8%", color: "#fff", minHeight: "80vh" }}>
        <h1 style={{ fontFamily: "Product Sans B", marginBottom: "30px" }}>Checkout</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "40px" }}>
          {/* Form */}
          <div className="glass-card" style={{ background: "rgba(255,255,255,0.05)", borderRadius: "20px", padding: "40px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <h3 style={{ marginBottom: "20px" }}>Delivery details</h3>
            <div style={{ marginBottom: "25px" }}>
              <label style={{ display: "block", marginBottom: "10px", color: "#ccc" }}>Delivery Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your complete delivery address..."
                style={{ width: "100%", height: "100px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "15px", color: "#fff", outline: "none", resize: "none" }}
              />
            </div>

            <h3 style={{ marginBottom: "20px", marginTop: "30px" }}>Promo Code</h3>
            <div style={{ display: "flex", gap: "15px" }}>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter promo code (e.g. SIVA95)"
                style={{ flex: 1, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "30px", padding: "12px 25px", color: "#fff", outline: "none" }}
              />
              <button
                onClick={handleApplyPromo}
                style={{ padding: "12px 30px", background: "#ff9800", border: "none", borderRadius: "30px", color: "#fff", fontWeight: "bold", cursor: "pointer" }}
              >
                Apply
              </button>
            </div>
            {promoApplied && (
              <p style={{ color: "#4caf50", marginTop: "10px", fontSize: "14px" }}>
                ✓ {promoApplied}
              </p>
            )}
          </div>

          {/* Checkout Totals */}
          <div className="glass-card" style={{ background: "rgba(255,255,255,0.05)", borderRadius: "20px", padding: "30px", border: "1px solid rgba(255,255,255,0.1)", height: "fit-content" }}>
            <h3 style={{ marginBottom: "20px" }}>Billing</h3>
            <div style={{ display: "flex", justifyContext: "space-between", marginBottom: "15px", justifyContent: "space-between" }}>
              <span>Subtotal</span>
              <span>₹{cartSubtotal}</span>
            </div>
            {discount > 0 && (
              <div style={{ display: "flex", justifyContext: "space-between", marginBottom: "15px", justifyContent: "space-between", color: "#ff4d6d" }}>
                <span>Discount</span>
                <span>- ₹{discount}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContext: "space-between", marginBottom: "15px", justifyContent: "space-between" }}>
              <span>Delivery Fee</span>
              <span style={{ color: "#4caf50" }}>FREE</span>
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "15px", display: "flex", justifyContext: "space-between", justifyContent: "space-between", marginBottom: "25px", fontWeight: "bold", fontSize: "18px" }}>
              <span>Total</span>
              <span>₹{cartSubtotal - discount}</span>
            </div>

            <button
              onClick={handleProceedToPayment}
              style={{ width: "100%", padding: "15px", background: "#ff9800", color: "#fff", border: "none", borderRadius: "30px", fontWeight: "bold", cursor: "pointer", fontSize: "16px", boxShadow: "0 5px 15px rgba(255,152,0,0.3)" }}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
