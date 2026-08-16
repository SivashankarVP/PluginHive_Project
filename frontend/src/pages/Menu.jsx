import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import gsap from "gsap";

export const Menu = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart, wishlist, toggleWishlist } = useCart();

  const restaurantId = searchParams.get("restaurantId") || "1";
  const restaurantName = searchParams.get("name") || "Partner Menu";

  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    fetch(`http://localhost:5000/api/menu?restaurantId=${restaurantId}`)
      .then((res) => res.json())
      .then((data) => {
        setMenuItems(data);
      })
      .catch((err) => console.error("Error fetching menu items:", err));
  }, [restaurantId]);

  useEffect(() => {
    if (menuItems.length > 0) {
      gsap.from(".food-card", {
        y: 50,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.7)",
        clearProps: "y",
      });
    }
  }, [menuItems, activeCategory]);

  const handleAddToCart = (item, e) => {
    addToCart({
      id: item.id,
      name: item.itemName,
      price: item.price,
      img: item.imagePath,
    });

    const target = e.target;
    target.innerText = "Added!";
    target.style.background = "green";
    setTimeout(() => {
      target.innerText = "Add to Cart";
      target.style.background = "#ff9800";
    }, 1000);
  };

  const categories = [
    { id: "all", label: "All Items", icon: "ri-restaurant-line" },
    { id: "burger", label: "Burgers", icon: "ri-restaurant-line" },
    { id: "pizza", label: "Pizza", icon: "ri-restaurant-line" },
    { id: "drinks", label: "Drinks", icon: "ri-restaurant-line" },
    { id: "desserts", label: "Desserts", icon: "ri-restaurant-line" },
    { id: "fries", label: "Fries", icon: "ri-restaurant-line" },
  ];

  const filteredItems =
    activeCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

  return (
    <div id="main">
      <div className="menu-container" style={{ paddingTop: "120px" }}>
        {/* Sidebar */}
        <div className="categories-sidebar">
          <h2 style={{ color: "#fff", marginBottom: "20px", fontFamily: "Product Sans B" }}>
            Categories
          </h2>
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`category-item ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <i className={cat.icon} /> {cat.label}
            </div>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="menu-grid" id="menu-grid">
          {filteredItems.map((item) => {
            const isFav = wishlist.some((fav) => fav.id === item.id);
            return (
              <div key={item.id} className="food-card">
                <div className="veg-badge" style={{ border: `2px solid ${item.veg ? "green" : "red"}` }}>
                  <div className={item.veg ? "veg-dot" : "non-veg-dot"} />
                </div>
                <i
                  className={`${isFav ? "ri-heart-fill" : "ri-heart-line"} fav-heart`}
                  style={{ color: isFav ? "red" : "#fff", cursor: "pointer" }}
                  onClick={() => toggleWishlist(item)}
                />
                <img src={item.imagePath} className="food-image" alt={item.itemName} />
                <div className="food-info">
                  <h3>{item.itemName}</h3>
                  <p>{item.description}</p>
                  <div className="price-row">
                    <span className="current-price">₹{item.price}</span>
                    <span className="original-price">₹{item.oldPrice}</span>
                  </div>
                </div>
                <button className="add-cart-btn" onClick={(e) => handleAddToCart(item, e)}>
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
