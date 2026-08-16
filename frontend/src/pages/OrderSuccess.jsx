import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get("orderId") || "1234567890";
  const invoiceUrl = searchParams.get("invoiceUrl") || "";

  return (
    <div id="main">
      <div
        className="success-container"
        style={{
          padding: "120px 8% 50px 8%",
          color: "#fff",
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="glass-card"
          style={{
            width: "100%",
            maxWidth: "500px",
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            borderRadius: "20px",
            padding: "50px 40px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            textAlign: "center",
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background: "rgba(76, 175, 80, 0.15)",
              border: "3px solid #4caf50",
              margin: "0 auto 30px auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#4caf50",
              fontSize: "50px",
            }}
          >
            <i className="ri-checkbox-circle-fill"></i>
          </div>

          <h1 style={{ fontFamily: "Product Sans B", fontSize: "36px", marginBottom: "15px" }}>
            Success!
          </h1>
          <p style={{ color: "#ccc", fontSize: "16px", marginBottom: "30px" }}>
            Your order has been placed successfully. An email receipt has been dispatched to your email address.
          </p>

          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "30px",
              fontSize: "14px",
            }}
          >
            <span style={{ color: "#aaa" }}>Order ID:</span>{" "}
            <strong style={{ color: "#ff9800" }}>{orderId}</strong>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {invoiceUrl && (
              <a
                href={invoiceUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: "15px",
                  background: "#4caf50",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: "30px",
                  fontWeight: "bold",
                  fontSize: "16px",
                  boxShadow: "0 5px 15px rgba(76,175,80,0.3)",
                  display: "block",
                }}
              >
                <i className="ri-file-download-line" style={{ marginRight: "8px", verticalAlign: "middle" }}></i>
                Download Invoice
              </a>
            )}

            <button
              onClick={() => navigate("/orders")}
              style={{
                padding: "15px",
                background: "rgba(255,255,255,0.1)",
                color: "#fff",
                border: "none",
                borderRadius: "30px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              View Order History
            </button>

            <button
              onClick={() => navigate("/")}
              style={{
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
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
