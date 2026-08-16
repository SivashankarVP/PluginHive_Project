import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Profile = () => {
  const { user, token, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate("/login?redirect=profile");
      return;
    }
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setCity(user.city || "");
    }
  }, [user, token, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await updateProfile({ name, phone, city });
      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) return null;

  return (
    <div id="main">
      <div className="profile-container" style={{ padding: "120px 8% 50px 8%", color: "#fff", minHeight: "80vh", display: "flex", justifyContent: "center" }}>
        <div
          className="glass-card"
          style={{
            width: "100%",
            maxWidth: "600px",
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            borderRadius: "20px",
            padding: "40px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
            <h1 style={{ fontFamily: "Product Sans B" }}>My Profile</h1>
            <button
              onClick={handleLogout}
              style={{
                padding: "10px 20px",
                background: "rgba(255,77,109,0.15)",
                border: "1px solid #ff4d6d",
                color: "#ff4d6d",
                borderRadius: "30px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Sign Out
            </button>
          </div>

          <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#ccc" }}>Username</label>
              <input
                type="text"
                value={user.username}
                disabled
                style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "30px", padding: "12px 25px", color: "#aaa", outline: "none", cursor: "not-allowed" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#ccc" }}>Email Address</label>
              <input
                type="email"
                value={user.email}
                disabled
                style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "30px", padding: "12px 25px", color: "#aaa", outline: "none", cursor: "not-allowed" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#ccc" }}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "30px", padding: "12px 25px", color: "#fff", outline: "none" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#ccc" }}>Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "30px", padding: "12px 25px", color: "#fff", outline: "none" }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#ccc" }}>City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "30px", padding: "12px 25px", color: "#fff", outline: "none" }}
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              style={{
                marginTop: "10px",
                padding: "15px",
                background: updating ? "#666" : "#ff9800",
                color: "#fff",
                border: "none",
                borderRadius: "30px",
                fontWeight: "bold",
                cursor: updating ? "not-allowed" : "pointer",
                fontSize: "16px",
                boxShadow: updating ? "none" : "0 5px 15px rgba(255,152,0,0.3)",
              }}
            >
              {updating ? "Saving Changes..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
