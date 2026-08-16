import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useCart } from "../context/CartContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const Home = () => {
  const { theme, switchTheme } = useTheme();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [showAllRestaurants, setShowAllRestaurants] = useState(false);

  useEffect(() => {
    // Fetch restaurants from backend
    fetch("http://localhost:5000/api/restaurants")
      .then((res) => res.json())
      .then((data) => setRestaurants(data))
      .catch((err) => console.error("Error fetching restaurants:", err));
  }, []);

  useEffect(() => {
    // GSAP ScrollTrigger Animations port
    let mm = gsap.matchMedia();

    // Kill existing ScrollTrigger instances to prevent overlay bugs during theme switches
    ScrollTrigger.getAll().forEach((t) => t.kill());

    if (theme === "burger") {
      mm.add("(min-width: 993px)", () => {
        const tl1 = gsap.timeline({
          scrollTrigger: {
            trigger: ".burger-section.two",
            start: "0% 95%",
            end: "70% 50%",
            scrub: true,
          },
        });
        tl1.to("#burger", { top: "120%", left: "10%" }, "onion");
        tl1.to("#tomato", { top: "160%", left: "23%" }, "onion");
        tl1.to("#onion", { width: "15%", top: "160%", right: "10%" }, "onion");
        tl1.to("#bleaf", { top: "110%", rotate: "130deg", left: "70%" }, "onion");
        tl1.to("#chilli", { top: "110%", rotate: "130deg", left: "0%" }, "onion");

        const tl2 = gsap.timeline({
          scrollTrigger: {
            trigger: ".burger-section.three",
            start: "0% 95%",
            end: "20% 50%",
            scrub: true,
          },
        });
        tl2.from("#burger1", { x: -500, y: 300, rotation: -90, duration: 1 }, "ca");
        tl2.from(".fries", { x: 500, y: 300, rotation: 90, duration: 1 }, "ca");
        tl2.from("#burger2", { x: 500, y: 300, rotation: 90, duration: 1 }, "ca");
        tl2.to("#tomato", { width: "12%", left: "44%", top: "205%" }, "ca");
        tl2.to("#burger", { width: "25%", top: "214%", left: "37.5%" }, "ca");
      });

      mm.add("(max-width: 992px)", () => {
        const tl1 = gsap.timeline({
          scrollTrigger: {
            trigger: ".burger-section.two",
            start: "0% 95%",
            end: "70% 50%",
            scrub: true,
          },
        });
        tl1.to("#burger", { top: "115%", left: "50%", xPercent: -50, width: "45%" }, "onion");
        tl1.to("#tomato", { top: "110%", left: "50%", xPercent: -50, width: "20%" }, "onion");
        tl1.to("#onion", { top: "122%", left: "50%", xPercent: -50, width: "22%" }, "onion");
        tl1.to("#bleaf", { top: "105%", left: "50%", xPercent: -50, rotate: "130deg", width: "22%" }, "onion");
        tl1.to("#chilli", { top: "125%", left: "50%", xPercent: -50, rotate: "130deg", width: "15%" }, "onion");
      });
    } else if (theme === "fanta") {
      mm.add("(min-width: 993px)", () => {
        const tl1 = gsap.timeline({
          scrollTrigger: {
            trigger: ".fanta-section.fanta-two",
            start: "0% 95%",
            end: "70% 50%",
            scrub: true,
          },
        });
        tl1.to("#fanta-fanta", { top: "120%", left: "10%" }, "orange");
        tl1.to("#fanta-orange-cut", { top: "160%", left: "23%" }, "orange");
        tl1.to("#fanta-orange", { width: "15%", top: "160%", right: "10%" }, "orange");
        tl1.to("#fanta-leaf", { top: "110%", rotate: "130deg", left: "70%" }, "orange");

        const tl2 = gsap.timeline({
          scrollTrigger: {
            trigger: ".fanta-section.fanta-three",
            start: "0% 95%",
            end: "20% 50%",
            scrub: true,
          },
        });
        tl2.from("#fanta-cocacola", { x: -500, y: 300, rotation: -90, duration: 1 }, "cb");
        tl2.from(".fanta-lemon", { x: 500, y: 300, rotation: 90, duration: 1 }, "cb");
        tl2.from("#fanta-pepsi", { x: 500, y: 300, rotation: 90, duration: 1 }, "cb");
        tl2.to("#fanta-orange-cut", { width: "12%", left: "44%", top: "205%" }, "cb");
        tl2.to("#fanta-fanta", { width: "25%", top: "214%", left: "37.5%" }, "cb");
      });
    } else if (theme === "pizza") {
      mm.add("(min-width: 993px)", () => {
        const tl1 = gsap.timeline({
          scrollTrigger: {
            trigger: ".pz-section.pz-two",
            start: "0% 95%",
            end: "70% 50%",
            scrub: true,
          },
        });
        tl1.to("#pz-pizza", { top: "120%", left: "10%" }, "pz");
        tl1.to("#pz-tomato", { top: "160%", left: "23%" }, "pz");

        const tl2 = gsap.timeline({
          scrollTrigger: {
            trigger: ".pz-section.pz-three",
            start: "0% 95%",
            end: "20% 50%",
            scrub: true,
          },
        });
        tl2.from("#pz-pizza2", { x: -500, y: 300, rotation: -90, duration: 1 }, "cc");
        tl2.from(".pz-sweetcorn", { x: 500, y: 300, rotation: 90, duration: 1 }, "cc");
        tl2.from("#pz-pizza1", { x: 500, y: 300, rotation: 90, duration: 1 }, "cc");
        tl2.to("#pz-tomato", { width: "12%", left: "44%", top: "205%" }, "cc");
        tl2.to("#pz-pizza", { width: "25%", top: "214%", left: "37.5%" }, "cc");
      });
    }

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      mm.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [theme]);

  const handleAddToCart = (name, price, img, e) => {
    addToCart({
      id: name.toLowerCase().replace(/ /g, "-"),
      name,
      price,
      img,
    });

    const target = e.target;
    const oldText = target.textContent;
    const oldBg = target.style.background;

    target.textContent = "✓ Added!";
    target.style.background = "#4caf50";
    setTimeout(() => {
      target.textContent = oldText;
      target.style.background = oldBg;
    }, 1200);
  };

  const handleRestaurantClick = (res) => {
    navigate(`/restaurant?name=${encodeURIComponent(res.name)}&logo=${encodeURIComponent(res.imagePath)}&id=${res.id}`);
  };

  return (
    <div id="main">
      {/* 1. BURGER THEME SECTIONS */}
      {theme === "burger" && (
        <>
          <section className="one burger-section" id="home">
            <h1>BURGER</h1>
            <img id="tomato" src="Assets/tomato.png" alt="Tomato" />
            <img id="burger" src="Assets/Burger.png" alt="Burger" />
            <img id="onion" src="Assets/onion.png" alt="Onion" />
            <img id="bleaf" src="Assets/bleaf.png" alt="Leaf" />
            <img id="chilli" src="Assets/chilli.png" alt="Chilli" />
            <img id="leaf3" src="Assets/coconoutleaf.png" alt="Leaf" />
          </section>

          <section className="two burger-section" id="flavour">
            <div className="lft-two">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="#e04428"
                  d="M41.5,-59.5C49.8,-51.1,49.7,-33.6,50.7,-19.2C51.7,-4.7,53.8,6.7,52.4,18.9C51.1,31.1,46.3,44.1,36.9,52.9C27.6,61.8,13.8,66.5,-2.5,70C-18.8,73.4,-37.7,75.6,-52.5,68.5C-67.3,61.5,-78.2,45.2,-84.5,27.1C-90.9,9,-92.7,-10.8,-80.5,-19.3C-68.3,-27.8,-42.1,-24.8,-26.3,-30.8C-10.6,-36.8,-5.3,-51.7,5.7,-59.5C16.6,-67.3,33.2,-68,41.5,-59.5Z"
                  transform="translate(100 100)"
                />
              </svg>
            </div>
            <div className="rght-two">
              <h1>Flavour Updated</h1>
              <p>
                Experience our signature double stack burgers layered with real cheddar cheese,
                caramelized sweet onions, and crisp garden lettuce. Fully dynamic real-time theme morphing
                with GSAP interactive scroll timelines.
              </p>
            </div>
          </section>

          <section className="three burger-section" id="menu-section">
            <div className="card">
              <img className="lemon fries" src="Assets/fries.png" alt="" />
              <img id="burger1" src="Assets/burger1.png" alt="" />
              <h1>BBQ Burger</h1>
              <button onClick={(e) => handleAddToCart("BBQ Burger", 199, "Assets/burger1.png", e)}>
                Add to Cart
              </button>
            </div>

            <div className="card">
              <img className="mid-card-img" src="Assets/Burger.png" alt="Cheese Burger" />
              <h1>Cheese Burger</h1>
              <button onClick={(e) => handleAddToCart("Cheese Burger", 179, "Assets/Burger.png", e)}>
                Add to Cart
              </button>
            </div>

            <div className="card">
              <img className="lemon fries" src="Assets/fries.png" alt="" />
              <img id="burger2" src="Assets/burger2.png" alt="" />
              <h1>Crispy Burger</h1>
              <button onClick={(e) => handleAddToCart("Crispy Burger", 159, "Assets/burger2.png", e)}>
                Add to Cart
              </button>
            </div>
          </section>
        </>
      )}

      {/* 2. FANTA THEME SECTIONS */}
      {theme === "fanta" && (
        <>
          <section className="fanta-one fanta-section" id="fanta-home">
            <h1>FANTA</h1>
            <img id="fanta-orange-cut" src="Assets/orange2.png" alt="Orange Cut" />
            <img id="fanta-fanta" src="Assets/fanta.png" alt="Fanta Can" />
            <img id="fanta-orange" src="Assets/orange.webp" alt="Orange" />
            <img id="fanta-leaf" src="Assets/leaf.webp" alt="Leaf" />
            <img id="fanta-leaf2" src="Assets/leaf2.png" alt="Leaf" />
            <img id="fanta-leaf3" src="Assets/coconoutleaf.png" alt="Leaf" />
          </section>

          <section className="fanta-two fanta-section" id="fanta-flavour">
            <div className="fanta-lft-two">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="#ff9800"
                  d="M41.5,-59.5C49.8,-51.1,49.7,-33.6,50.7,-19.2C51.7,-4.7,53.8,6.7,52.4,18.9C51.1,31.1,46.3,44.1,36.9,52.9C27.6,61.8,13.8,66.5,-2.5,70C-18.8,73.4,-37.7,75.6,-52.5,68.5C-67.3,61.5,-78.2,45.2,-84.5,27.1C-90.9,9,-92.7,-10.8,-80.5,-19.3C-68.3,-27.8,-42.1,-24.8,-26.3,-30.8C-10.6,-36.8,-5.3,-51.7,5.7,-59.5C16.6,-67.3,33.2,-68,41.5,-59.5Z"
                  transform="translate(100 100)"
                />
              </svg>
            </div>
            <div className="fanta-rght-two">
              <h1>Flavour Updated</h1>
              <p>
                Get refreshed with Neon Orange, classic Coca Cola, or cool blue Pepsi. 
                Smoothly animated using custom canvas sparks, sesame seed particles, and 
                frosted glass containers.
              </p>
            </div>
          </section>

          <section className="fanta-three fanta-section" id="fanta-menu-section">
            <div className="fanta-card">
              <img className="fanta-lemon fanta-lemon1" src="Assets/lemon.webp" alt="" />
              <img id="fanta-cocacola" src="Assets/cocacola.png" alt="" />
              <h1>CocaCola</h1>
              <button onClick={(e) => handleAddToCart("CocaCola", 99, "Assets/cocacola.png", e)}>
                Add to Cart
              </button>
            </div>

            <div className="fanta-card">
              <img className="mid-card-img" src="Assets/fanta.png" alt="Fanta" />
              <h1>Fanta</h1>
              <button onClick={(e) => handleAddToCart("Fanta", 89, "Assets/fanta.png", e)}>
                Add to Cart
              </button>
            </div>

            <div className="fanta-card">
              <img className="fanta-lemon fanta-lemon2" src="Assets/lemon.webp" alt="" />
              <img id="fanta-pepsi" src="Assets/pepsi.png" alt="" />
              <h1>Pepsi</h1>
              <button onClick={(e) => handleAddToCart("Pepsi", 99, "Assets/pepsi.png", e)}>
                Add to Cart
              </button>
            </div>
          </section>
        </>
      )}

      {/* 3. PIZZA THEME SECTIONS */}
      {theme === "pizza" && (
        <>
          <section className="pz-one pz-section" id="pz-home">
            <h1>PIZZA</h1>
            <img id="pz-tomato" src="Assets/tomato1.png" alt="Tomato" />
            <img id="pz-pizza" src="Assets/pizza.png" alt="Pizza" />
            <img id="pz-onion" src="Assets/onion1.png" alt="Onion" />
            <img id="pz-cheese" src="Assets/chesse.png" alt="Cheese" />
            <img id="pz-chilli" src="Assets/chilli1.png" alt="Chilli" />
            <img id="pz-leaf3" src="Assets/coconoutleaf.png" alt="Leaf" />
          </section>

          <section className="pz-two pz-section" id="pz-flavour">
            <div className="pz-lft-two">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill="#e04428"
                  d="M41.5,-59.5C49.8,-51.1,49.7,-33.6,50.7,-19.2C51.7,-4.7,53.8,6.7,52.4,18.9C51.1,31.1,46.3,44.1,36.9,52.9C27.6,61.8,13.8,66.5,-2.5,70C-18.8,73.4,-37.7,75.6,-52.5,68.5C-67.3,61.5,-78.2,45.2,-84.5,27.1C-90.9,9,-92.7,-10.8,-80.5,-19.3C-68.3,-27.8,-42.1,-24.8,-26.3,-30.8C-10.6,-36.8,-5.3,-51.7,5.7,-59.5C16.6,-67.3,33.2,-68,41.5,-59.5Z"
                  transform="translate(100 100)"
                />
              </svg>
            </div>
            <div className="pz-rght-two">
              <h1>Flavour Updated</h1>
              <p>
                Woodfired Italian pizzas loaded with fresh basil, farm tomatoes, and double mozzarella cheese. 
                Experience the premium interactive theme switching.
              </p>
            </div>
          </section>

          <section className="pz-three pz-section" id="pz-menu-section">
            <div className="pz-card">
              <img className="pz-sweetcorn pz-sweetcorn1" src="Assets/sweetcorn.png" alt="" />
              <img id="pz-pizza2" src="Assets/pizza2.png" alt="" />
              <h1>Veggie Feast</h1>
              <button onClick={(e) => handleAddToCart("Veggie Feast", 249, "Assets/pizza2.png", e)}>
                Add to Cart
              </button>
            </div>

            <div className="pz-card">
              <img className="mid-card-img" src="Assets/pizza.png" alt="Classic Margherita" />
              <h1>Classic Margherita</h1>
              <button onClick={(e) => handleAddToCart("Classic Margherita", 199, "Assets/pizza.png", e)}>
                Add to Cart
              </button>
            </div>

            <div className="pz-card">
              <img className="pz-sweetcorn pz-sweetcorn2" src="Assets/sweetcorn.png" alt="" />
              <img id="pz-pizza1" src="Assets/pizza1.png" alt="" />
              <h1>Peppy Paneer</h1>
              <button onClick={(e) => handleAddToCart("Peppy Paneer", 229, "Assets/pizza1.png", e)}>
                Add to Cart
              </button>
            </div>
          </section>
        </>
      )}

      {/* 4. POPULAR RESTAURANTS SECTION */}
      <section className="restaurants" id="restaurants">
        <div className="restaurant-title">
          <h1>Popular Restaurants</h1>
          <p>Discover your favourite food brands</p>
        </div>

        <div className="restaurant-list">
          {restaurants
            .slice(0, showAllRestaurants ? restaurants.length : 10)
            .map((res) => (
              <div
                key={res.id}
                className="restaurant-item"
                onClick={() => handleRestaurantClick(res)}
              >
                <img src={res.imagePath} alt={res.name} />
                <span>{res.name}</span>
              </div>
            ))}
        </div>

        {!showAllRestaurants && restaurants.length > 10 && (
          <div className="view-btn">
            <button onClick={() => setShowAllRestaurants(true)}>
              View All Restaurants
            </button>
          </div>
        )}
      </section>

      {/* 5. FLOATING GLASSMORPHIC THEME SELECTOR */}
      <div className="theme-selector-floating">
        <button
          onClick={() => switchTheme("burger")}
          className={`theme-btn ${theme === "burger" ? "active-theme" : ""}`}
          title="Burger Theme"
        >
          🍔
        </button>
        <button
          onClick={() => switchTheme("fanta")}
          className={`theme-btn ${theme === "fanta" ? "active-theme" : ""}`}
          title="Fanta Theme"
        >
          🍊
        </button>
        <button
          onClick={() => switchTheme("pizza")}
          className={`theme-btn ${theme === "pizza" ? "active-theme" : ""}`}
          title="Pizza Theme"
        >
          🍕
        </button>
      </div>
    </div>
  );
};
