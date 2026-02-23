import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = process.env.REACT_APP_API_BASE_URL || "https://zerodha-clone-web-app-backend.onrender.com";

const getDashboardURL = () => {
  const url = process.env.REACT_APP_DASHBOARD_URL;
  if (!url) {
    console.error("REACT_APP_DASHBOARD_URL is not set in .env file!");
    return null;
  }
  return url.endsWith("/") ? url.slice(0, -1) : url;
};

const DASHBOARD_URL = getDashboardURL();

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [messageType, setMessageType] = useState("error");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    setMessage("");

    try {
      if (!email || !password) {
        setMessage("Please enter email and password");
        setMessageType("error");
        return;
      }

      const response = await axios.post(
        `${API}/api/auth/login`,
        { email, password }
      );

      if (response.status === 200 && response.data.token) {
        if (!DASHBOARD_URL) {
          setMessage(
            "Configuration Error: Dashboard URL is not set. Please contact support."
          );
          setMessageType("error");
          console.error(
            "Cannot redirect - DASHBOARD_URL from environment is missing",
            { env: process.env.REACT_APP_DASHBOARD_URL }
          );
          return;
        }

        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        const token = response.data.token;
        const dashboardUrlWithToken = `${DASHBOARD_URL}?token=${encodeURIComponent(token)}`;
        
        setMessage("Login successful! Redirecting...");
        setMessageType("success");
        setTimeout(() => {
          window.location.href = dashboardUrlWithToken;
        }, 1500);
      }
    } catch (error) {
      console.error("SignIn error:", error);
      setMessage(error.response?.data?.message || "Log In failed!");
      setMessageType("error");
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, rgba(40, 167, 69, 0.08) 0%, rgba(23, 162, 184, 0.05) 100%)",
      position: "relative",
      overflow: "hidden",
      paddingTop: "2rem",
      paddingBottom: "2rem"
    }}>
      <div style={{
        position: "absolute",
        top: "-100px",
        left: "-100px",
        width: "500px",
        height: "500px",
        background: "radial-gradient(circle, rgba(23, 162, 184, 0.1) 0%, transparent 70%)",
        borderRadius: "50%",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute",
        bottom: "-150px",
        right: "-100px",
        width: "400px",
        height: "400px",
        background: "radial-gradient(circle, rgba(40, 167, 69, 0.08) 0%, transparent 70%)",
        borderRadius: "50%",
        pointerEvents: "none"
      }} />

      <div className="container p-md-5 p-3" style={{position: "relative", zIndex: 1}}>
        <div className="row" style={{
          textAlign: "center",
          marginBottom: "3rem",
          animation: isVisible ? "slideUpFade 0.8s ease-out both" : "none"
        }}>
          <h1 style={{
            fontSize: "clamp(1.8rem, 6vw, 3rem)",
            marginTop: "clamp(2rem, 8vw, 5rem)",
            background: "linear-gradient(135deg, var(--zerotrade-primary) 0%, var(--zerotrade-accent) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontWeight: "700"
          }}>
            Welcome Back to ZEROTRADE
          </h1>
          <h3 style={{
            fontSize: "clamp(1rem, 4vw, 1.3rem)",
            marginBottom: "clamp(1.5rem, 5vw, 2.5rem)",
            color: "var(--zerotrade-text-muted)",
            animation: isVisible ? "slideUpFade 0.8s ease-out 0.1s both" : "none"
          }}>
            Continue your learning journey with our trading simulator
          </h3>
        </div>

        <div className="row p-md-5 p-3" style={{
          maxWidth: "1000px",
          margin: "0 auto"
        }}>
          <div 
            className="col-md-6 col-12 p-md-5 p-3"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: isVisible ? "slideInLeft 0.8s ease-out 0.1s both" : "none"
            }}
          >
            <img
              style={{
                height: "auto",
                width: "100%",
                maxWidth: "400px",
                margin: "0 auto",
                borderRadius: "12px",
                filter: "drop-shadow(0 12px 32px rgba(40, 167, 69, 0.15))"
              }}
              src="media/images/investment_simulator.png"
              alt="Trading Simulation"
            />
          </div>

          <div 
            className="col-md-6 col-12"
            style={{
              animation: isVisible ? "slideInRight 0.8s ease-out 0.1s both" : "none"
            }}
          >
            <h2 style={{
              fontSize: "clamp(1.5rem, 5vw, 1.9rem)",
              color: "var(--zerotrade-text)",
              fontWeight: "700",
              marginBottom: "1rem"
            }}>
              Sign In
            </h2>

            <p style={{
              fontSize: "0.95rem",
              color: "var(--zerotrade-text-muted)",
              marginBottom: "2rem"
            }}>
              Don't have an account?{" "}
              <Link
                to="/signup"
                style={{
                  color: "var(--zerotrade-primary)",
                  fontWeight: "600",
                  textDecoration: "none",
                  transition: "all 0.3s ease"
                }}
              >
                Sign Up here
              </Link>
            </p>

            <form
              onSubmit={handleSignIn}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                animation: isVisible ? "slideUpFade 0.8s ease-out 0.2s both" : "none"
              }}
            >
              <div style={{position: "relative"}}>
                <label style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: "var(--zerotrade-text)"
                }}>
                  <i className="fa-solid fa-envelope" style={{marginRight: "0.5rem"}}></i>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "8px",
                    border: focusedField === "email" 
                      ? "2px solid var(--zerotrade-primary)" 
                      : "2px solid var(--zerotrade-border)",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    backgroundColor: focusedField === "email" 
                      ? "rgba(40, 167, 69, 0.05)" 
                      : "var(--zerotrade-bg-light)",
                    boxShadow: focusedField === "email" 
                      ? "0 4px 12px rgba(40, 167, 69, 0.15)" 
                      : "none"
                  }}
                  required
                />
              </div>

              <div style={{position: "relative"}}>
                <label style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  color: "var(--zerotrade-text)"
                }}>
                  <i className="fa-solid fa-lock" style={{marginRight: "0.5rem"}}></i>
                  Password
                </label>
                <div style={{position: "relative"}}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    style={{
                      width: "100%",
                      padding: "0.75rem 2.5rem 0.75rem 1rem",
                      borderRadius: "8px",
                      border: focusedField === "password" 
                        ? "2px solid var(--zerotrade-primary)" 
                        : "2px solid var(--zerotrade-border)",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                      backgroundColor: focusedField === "password" 
                        ? "rgba(40, 167, 69, 0.05)" 
                        : "var(--zerotrade-bg-light)",
                      boxShadow: focusedField === "password" 
                        ? "0 4px 12px rgba(40, 167, 69, 0.15)" 
                        : "none"
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--zerotrade-text-muted)",
                      fontSize: "1rem",
                      padding: "0.5rem",
                      transition: "color 0.3s ease"
                    }}
                    onMouseEnter={(e) => e.target.style.color = "var(--zerotrade-primary)"}
                    onMouseLeave={(e) => e.target.style.color = "var(--zerotrade-text-muted)"}
                  >
                    <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "0.5rem"
              }}>
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  color: "var(--zerotrade-text)"
                }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{
                      cursor: "pointer",
                      accentColor: "var(--zerotrade-primary)",
                      width: "18px",
                      height: "18px"
                    }}
                  />
                  Remember me
                </label>
                <a href="/" style={{
                  fontSize: "0.9rem",
                  color: "var(--zerotrade-primary)",
                  fontWeight: "600",
                  textDecoration: "none",
                  transition: "all 0.3s ease"
                }}>
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loggingIn}
                style={{
                  padding: "0.875rem 2rem",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "1rem",
                  fontWeight: "600",
                  letterSpacing: "0.5px",
                  background: "linear-gradient(135deg, var(--zerotrade-primary) 0%, #20c997 100%)",
                  color: "#fff",
                  cursor: loggingIn ? "not-allowed" : "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  opacity: loggingIn ? 0.7 : 1,
                  boxShadow: "0 4px 12px rgba(40, 167, 69, 0.2)",
                  marginTop: "1rem"
                }}
                onMouseEnter={(e) => {
                  if (!loggingIn) {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 8px 20px rgba(40, 167, 69, 0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 4px 12px rgba(40, 167, 69, 0.2)";
                }}
              >
                {loggingIn ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin" style={{marginRight: "0.5rem"}}></i>
                    Signing In...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-arrow-right" style={{marginRight: "0.5rem"}}></i>
                    Sign In
                  </>
                )}
              </button>
            </form>

            {message && (
              <div
                style={{
                  marginTop: "1.5rem",
                  padding: "1rem",
                  borderRadius: "8px",
                  background: messageType === "success" 
                    ? "linear-gradient(135deg, rgba(102, 187, 106, 0.1) 0%, rgba(102, 187, 106, 0.05) 100%)"
                    : "linear-gradient(135deg, rgba(239, 83, 80, 0.1) 0%, rgba(239, 83, 80, 0.05) 100%)",
                  border: `2px solid ${messageType === "success" ? "#66bb6a" : "#ef5350"}`,
                  color: messageType === "success" ? "#2e7d32" : "#c62828",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  animation: "slideUpFade 0.4s ease-out"
                }}
              >
                <i className={`fa-solid ${messageType === "success" ? "fa-check-circle" : "fa-exclamation-circle"}`} style={{marginRight: "0.5rem"}}></i>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;