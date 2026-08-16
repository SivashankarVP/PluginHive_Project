import React, { useState, useEffect, useRef } from "react";
import "../chatbot.css";

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! 👋 I am the CraveGo Assistant. How can I help you today? Ask me about menus, orders, promo codes, or the developer!",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (textToSend) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInputVal("");
    setIsTyping(true);

    // AI/NLP Intent response logic
    setTimeout(() => {
      setIsTyping(false);
      const lower = text.toLowerCase();
      const match = (keywords) => keywords.some((kw) => lower.includes(kw));

      let reply = "";
      if (match(["developer", "creator", "designed", "built", "author", "sivashankar", "about"])) {
        reply = "This project was designed and developed by <strong>Sivashankar V P</strong>.<br/><br/><a href='https://www.instagram.com/sivashankar__007/' target='_blank' style='color:#ff9800; text-decoration:none; font-weight:bold; font-size:16px; margin-right:15px;'><i class='ri-instagram-line'></i> Instagram</a> <a href='https://www.linkedin.com/in/sivashankar-vp' target='_blank' style='color:#ff9800; text-decoration:none; font-weight:bold; font-size:16px;'><i class='ri-linkedin-box-fill'></i> LinkedIn</a>";
      } else if (match(["hello", "hi", "hey", "welcome", "morning", "evening"])) {
        reply = "Hello! I am the CraveGo Assistant. You can ask me about menus, orders, promo codes, or developer info.";
      } else if (match(["recommend", "food", "eat", "burger", "pizza", "menu", "dishes"])) {
        reply = "You can explore a variety of cuisines! Check out our Burgers, Pizzas, and Beverages by navigating to the <strong>Restaurants</strong> page.";
      } else if (match(["coupon", "promo", "discount", "code", "offer"])) {
        reply = "Active Promo Codes:<br/>• <strong>SIVA95</strong>: 95% off your subtotal<br/>• <strong>WELCOME50</strong>: Flat ₹100 off your first order";
      } else if (match(["status", "track", "history", "order"])) {
        reply = "You can track your orders and view past receipts by visiting the <strong>Order History</strong> section from the top navigation bar.";
      } else if (match(["login", "sign", "register", "account", "profile"])) {
        reply = "To manage your account, click the <strong>Sign In</strong> button or your user icon in the top right corner of the page.";
      } else if (match(["support", "help", "contact", "issue"])) {
        reply = "Need help? Please email us at <strong>sivashankar@gmail.com</strong> for support regarding your orders.";
      } else {
        reply = "I am a specialized assistant for the CraveGo project. I can only answer queries related to this application (menus, orders, coupons, developer info). Please ask a relevant question.";
      }

      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    }, 800);
  };

  return (
    <>
      {/* Launcher */}
      <div
        className="chatbot-launcher"
        id="chatbot-launcher"
        onClick={() => setIsOpen(!isOpen)}
        style={{ zIndex: 9999 }}
      >
        {isOpen ? <i className="ri-close-line"></i> : <i className="ri-chat-smile-3-line"></i>}
      </div>

      {/* Window */}
      <div
        className={`chatbot-window ${isOpen ? "active" : ""}`}
        id="chatbot-window"
        style={{ zIndex: 9998 }}
      >
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <div className="chatbot-avatar" style={{ color: "#fff", fontSize: "22px" }}>
              <i className="ri-robot-2-fill"></i>
            </div>
            <div>
              <h3 className="chatbot-title">CraveGo Assistant</h3>
              <p className="chatbot-status">{isTyping ? "Typing..." : "Online"}</p>
            </div>
          </div>
          <i className="ri-close-line chatbot-close" onClick={() => setIsOpen(false)}></i>
        </div>

        <div className="chatbot-messages" id="chatbot-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`message ${msg.sender}`}
              dangerouslySetInnerHTML={{ __html: msg.text }}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-quick-replies">
          <button className="quick-reply-btn" onClick={() => handleSend("Food recommendations")}>
            🍔 Recommendations
          </button>
          <button className="quick-reply-btn" onClick={() => handleSend("Active coupons")}>
            🏷️ Promo codes
          </button>
          <button className="quick-reply-btn" onClick={() => handleSend("Order Status")}>
            📦 Track order
          </button>
          <button className="quick-reply-btn" onClick={() => handleSend("About Developer")}>
            👨‍💻 Developer
          </button>
        </div>

        <div className="chatbot-input-area">
          <input
            type="text"
            className="chatbot-input"
            placeholder="Type a message..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            autoComplete="off"
          />
          <button className="chatbot-send" onClick={() => handleSend()}>
            <i className="ri-send-plane-2-fill"></i>
          </button>
        </div>
      </div>
    </>
  );
};
