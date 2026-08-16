import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Login = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "";

  const [isLoginTab, setIsLoginTab] = useState(true);

  // Form states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const [regName, setRegName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regCity, setRegCity] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      alert("Login successful!");
      navigate(redirect ? `/${redirect}` : "/");
    } catch (err) {
      alert(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({
        name: regName,
        username: regUsername,
        email: regEmail,
        password: regPassword,
        phone: regPhone,
        city: regCity,
      });
      alert("Registration successful!");
      navigate(redirect ? `/${redirect}` : "/");
    } catch (err) {
      alert(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="main">
      <div className="login-container" style={{ padding: "120px 8% 50px 8%", color: "#fff", minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div
          className="glass-card"
          style={{
            width: "100%",
            maxWidth: "450px",
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            borderRadius: "20px",
            padding: "40px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
          }}
        >
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "2px solid rgba(255,255,255,0.1)", marginBottom: "30px" }}>
            <button
              onClick={() => setIsLoginTab(true)}
              style={{
                flex: 1,
                background: "none",
                border: "none",
                color: isLoginTab ? "#ff9800" : "#fff",
                fontSize: "18px",
                fontWeight: "bold",
                padding: "15px",
                cursor: "pointer",
                borderBottom: isLoginTab ? "3px solid #ff9800" : "none",
                transition: "0.2s",
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLoginTab(false)}
              style={{
                flex: 1,
                background: "none",
                border: "none",
                color: !isLoginTab ? "#ff9800" : "#fff",
                fontSize: "18px",
                fontWeight: "bold",
                padding: "15px",
                cursor: "pointer",
                borderBottom: !isLoginTab ? "3px solid #ff9800" : "none",
                transition: "0.2s",
              }}
            >
              Sign Up
            </button>
          </div>

          {isLoginTab ? (
            /* LOGIN FORM */
            <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "#ccc" }}>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "30px", padding: "12px 25px", color: "#fff", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "#ccc" }}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "30px", padding: "12px 25px", color: "#fff", outline: "none" }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: "10px",
                  padding: "15px",
                  background: loading ? "#666" : "#ff9800",
                  color: "#fff",
                  border: "none",
                  borderRadius: "30px",
                  fontWeight: "bold",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: "16px",
                  boxShadow: loading ? "none" : "0 5px 15px rgba(255,152,0,0.3)",
                }}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "5px", color: "#ccc", fontSize: "14px" }}>Full Name</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Enter full name"
                  required
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "30px", padding: "10px 20px", color: "#fff", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", color: "#ccc", fontSize: "14px" }}>Username</label>
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="Choose username"
                  required
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "30px", padding: "10px 20px", color: "#fff", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", color: "#ccc", fontSize: "14px" }}>Email</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "30px", padding: "10px 20px", color: "#fff", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", color: "#ccc", fontSize: "14px" }}>Password</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Create password"
                  required
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "30px", padding: "10px 20px", color: "#fff", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", color: "#ccc", fontSize: "14px" }}>Phone</label>
                <input
                  type="text"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="Enter phone number"
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "30px", padding: "10px 20px", color: "#fff", outline: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "5px", color: "#ccc", fontSize: "14px" }}>City</label>
                <input
                  type="text"
                  value={regCity}
                  onChange={(e) => setRegCity(e.target.value)}
                  placeholder="Enter city"
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "30px", padding: "10px 20px", color: "#fff", outline: "none" }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: "10px",
                  padding: "12px",
                  background: loading ? "#666" : "#ff9800",
                  color: "#fff",
                  border: "none",
                  borderRadius: "30px",
                  fontWeight: "bold",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontSize: "16px",
                  boxShadow: loading ? "none" : "0 5px 15px rgba(255,152,0,0.3)",
                }}
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
