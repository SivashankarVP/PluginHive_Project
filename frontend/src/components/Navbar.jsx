import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";

export const Navbar = () => {
  const { user } = useAuth();
  const { cartCount } = useCart();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getThemePrefix = () => {
    if (theme === "burger") return "home";
    if (theme === "fanta") return "fanta-home";
    return "pz-home";
  };

  return (
    <nav style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)" }}>
      <Link to="/" className="logo">
        🍔 CraveGo
      </Link>

      <div className={`cntr-nav ${mobileMenuOpen ? "show" : ""}`}>
        <span style={{ cursor: "pointer" }} onClick={() => handleNavClick(getThemePrefix())}>
          Home
        </span>
        <span style={{ cursor: "pointer" }} onClick={() => handleNavClick(theme === "fanta" ? "fanta-flavour" : theme === "pizza" ? "pz-flavour" : "flavour")}>
          Flavour
        </span>
        <span style={{ cursor: "pointer" }} onClick={() => handleNavClick(theme === "burger" ? "menu-section" : theme === "fanta" ? "fanta-menu-section" : "pz-menu-section")}>
          Menu
        </span>
        <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>
          Orders
        </Link>
      </div>

      <div className="nav-right">
        <i
          className="ri-search-line"
          id="search-icon"
          style={{ color: "#fff", fontSize: "24px", cursor: "pointer", transition: ".3s" }}
          onMouseOver={(e) => (e.target.style.color = "#ff9800")}
          onMouseOut={(e) => (e.target.style.color = "#fff")}
          onClick={() => handleNavClick("restaurants")}
        />
        <i
          className="ri-user-line"
          id="profile-icon"
          style={{ color: "#fff", fontSize: "24px", cursor: "pointer", transition: ".3s" }}
          onMouseOver={(e) => (e.target.style.color = "#ff9800")}
          onMouseOut={(e) => (e.target.style.color = "#fff")}
          onClick={() => navigate("/profile")}
        />
        <div
          id="cart-icon-container"
          style={{ position: "relative", cursor: "pointer" }}
          onClick={() => navigate("/cart")}
        >
          <i
            className="ri-shopping-cart-2-line"
            id="cart-icon"
            style={{ color: "#fff", fontSize: "24px", transition: ".3s" }}
            onMouseOver={(e) => (e.target.style.color = "#ff9800")}
            onMouseOut={(e) => (e.target.style.color = "#fff")}
          />
          {cartCount > 0 && (
            <span
              id="cart-count"
              style={{
                position: "absolute",
                top: "-5px",
                right: "-8px",
                background: "#ff9800",
                color: "#fff",
                fontSize: "12px",
                fontWeight: "bold",
                borderRadius: "50%",
                width: "18px",
                height: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {cartCount}
            </span>
          )}
        </div>

        {user ? (
          <Link to="/profile" className="sign-btn">
            <i className="ri-user-line" style={{ marginRight: "5px", verticalAlign: "middle" }}></i>{" "}
            {user.name.split(" ")[0]}
          </Link>
        ) : (
          <Link to="/login" className="sign-btn">
            Sign In
          </Link>
        )}

        <i
          className="ri-menu-fill"
          id="menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
      </div>
    </nav>
  );
};
