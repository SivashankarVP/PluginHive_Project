import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export const Restaurant = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const name = searchParams.get("name") || "CraveGo Partner";
  const logo = searchParams.get("logo") || "";
  const id = searchParams.get("id") || "1";

  // Map cuisine tags dynamically
  const cuisines = {
    "McDonald's": "Burgers, Fast Food, Beverages",
    "Burger King": "Burgers, Fast Food, Sides",
    "KFC": "Fried Chicken, Burgers, Sides",
    "Wendy's": "Burgers, Fast Food, Shakes",
    "Pizza Hut": "Pizzas, Pasta, Desserts",
    "Domino's": "Pizzas, Garlic Bread, Drinks",
    "Subway": "Sandwiches, Salads, Cookies",
    "Starbucks": "Coffee, Beverages, Snacks",
    "Taco Bell": "Tacos, Burritos, Mexican Fast Food",
  };

  const cuisine = cuisines[name] || "Fast Food, Delicious Meals, Beverages";

  return (
    <div id="main">
      <section className="restaurant-hero" style={{ marginTop: "80px", position: "relative" }}>
        <div
          className="cover-image"
          style={{
            width: "100%",
            height: "40vh",
            background:
              "url('https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=2065&auto=format&fit=crop') no-repeat center center/cover",
          }}
        />

        <div
          className="restaurant-details-card glass-card"
          style={{
            position: "relative",
            maxWidth: "900px",
            margin: "-100px auto 50px auto",
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            borderRadius: "20px",
            padding: "40px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            color: "#fff",
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
          }}
        >
          <div
            id="logo-container"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              border: "4px solid #ff9800",
              background: "#111",
              marginTop: "-80px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 5px 20px rgba(255,152,0,0.3)",
              overflow: "hidden",
            }}
          >
            {logo ? (
              <img
                src={logo}
                alt={name}
                style={{ width: "100%", height: "100%", objectFit: "contain", background: "#fff", padding: "10px" }}
              />
            ) : (
              <i className="ri-restaurant-2-line" style={{ fontSize: "60px", color: "#ff9800" }} />
            )}
          </div>

          <h1 id="restaurant-name-heading" style={{ fontSize: "42px", marginTop: "20px", fontFamily: "Product Sans B" }}>
            {name}
          </h1>
          <p id="restaurant-cuisine" style={{ color: "#bfbfbf", fontSize: "18px", marginTop: "10px" }}>
            {cuisine}
          </p>

          <div
            className="meta-info"
            style={{ display: "flex", gap: "30px", marginTop: "25px", flexWrap: "wrap", justifyContent: "center" }}
          >
            <div
              className="meta-item"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255, 255, 255, 0.1)",
                padding: "10px 20px",
                borderRadius: "30px",
              }}
            >
              <i className="ri-star-fill" style={{ color: "#ff9800", fontSize: "20px" }} />
              <span style={{ fontWeight: "bold" }}>4.9 (15k+ Ratings)</span>
            </div>
            <div
              className="meta-item"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255, 255, 255, 0.1)",
                padding: "10px 20px",
                borderRadius: "30px",
              }}
            >
              <i className="ri-time-line" style={{ color: "#ff9800", fontSize: "20px" }} />
              <span style={{ fontWeight: "bold" }}>20-30 mins</span>
            </div>
            <div
              className="meta-item"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255, 255, 255, 0.1)",
                padding: "10px 20px",
                borderRadius: "30px",
              }}
            >
              <i className="ri-map-pin-line" style={{ color: "#ff9800", fontSize: "20px" }} />
              <span style={{ fontWeight: "bold" }}>1.2 km Away</span>
            </div>
          </div>

          <div className="coupons-container" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", width: "100%", marginTop: "30px" }}>
            <div
              className="offer-banner"
              style={{
                background: "linear-gradient(90deg, #ff9800, #ff5722)",
                padding: "15px 20px",
                borderRadius: "15px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                boxShadow: "0 5px 15px rgba(255, 152, 0, 0.2)",
              }}
            >
              <i
                className="ri-percent-line"
                style={{ fontSize: "22px", background: "rgba(255,255,255,0.2)", padding: "6px", borderRadius: "50%" }}
              />
              <div style={{ textAlign: "left" }}>
                <h3 style={{ fontSize: "16px", margin: 0, fontFamily: "Product Sans B" }}>95% OFF Subtotal</h3>
                <p style={{ fontSize: "13px", margin: 0, opacity: 0.9 }}>Code: SIVA95</p>
              </div>
            </div>
            <div
              className="offer-banner"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.1)",
                padding: "15px 20px",
                borderRadius: "15px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <i
                className="ri-gift-line"
                style={{ fontSize: "22px", color: "#ff9800", background: "rgba(255,152,0,0.1)", padding: "6px", borderRadius: "50%" }}
              />
              <div style={{ textAlign: "left" }}>
                <h3 style={{ fontSize: "16px", margin: 0, fontFamily: "Product Sans B" }}>Flat ₹100 Discount</h3>
                <p style={{ fontSize: "13px", margin: 0, opacity: 0.9, color: "#ccc" }}>Code: WELCOME50</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate(`/menu?restaurantId=${id}&name=${encodeURIComponent(name)}`)}
            className="menu-btn"
            style={{
              marginTop: "30px",
              padding: "15px 40px",
              borderRadius: "50px",
              background: "#ff9800",
              border: "none",
              color: "#fff",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "0.3s",
              boxShadow: "0 8px 20px rgba(255, 152, 0, 0.4)",
            }}
          >
            View Full Menu <i className="ri-arrow-right-line" style={{ verticalAlign: "middle" }} />
          </button>
        </div>
      </section>
    </div>
  );
};
