import React from "react";
import { useTheme } from "../context/ThemeContext";

export const Footer = () => {
  const { theme } = useTheme();

  const getFooterTitle = () => {
    if (theme === "burger") return "🍔 BURGER";
    if (theme === "fanta") return "🍊 FANTA";
    return "🍕 PIZZA";
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <h2>{getFooterTitle()}</h2>
          <p>
            Developed 🚀 by Sivashankar V P<br />
            Transforming Ideas into Reality 🔥<br />
            <br />
            Striving for Growth, Aiming for Excellence 🚀
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <div className="links">
            <a href="/#home">Home</a>
            <a href="/#restaurants">Restaurants</a>
            <a href="/orders">My Orders</a>
          </div>
        </div>

        <div className="footer-social">
          <h3>Follow Us</h3>
          <div className="icons">
            <a
              href="https://www.instagram.com/sivashankar__007/"
              target="_blank"
              rel="noreferrer"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <i className="ri-instagram-line"></i>
            </a>
            <a
              href="https://www.linkedin.com/in/sivashankar-vp"
              target="_blank"
              rel="noreferrer"
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <i className="ri-linkedin-fill"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="copyright">
        <span style={{ marginTop: "10px", display: "inline-block", fontSize: "14px" }}>
          Designed With{" "}
          <a
            href="https://www.instagram.com/sivashankar__007/"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#ff4d6d", textDecoration: "none" }}
          >
            ❤️
          </a>{" "}
          By Sivashankar V P
        </span>
      </div>
    </footer>
  );
};
