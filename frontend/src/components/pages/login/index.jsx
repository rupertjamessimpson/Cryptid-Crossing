import { useState } from "react";
import "./index.css";
import API_BASE_URL from "../../../config";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setError("");
        window.location.href = "/shows";
      } else {
        setError(data.error || "Something went wrong!");
      }
    } catch (err) {
      setError("An error occurred during login.");
    }
  };

  return (
    <div className="login-container">
      <h3>Login</h3>
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="button-container">
            <button className="login-button" type="submit">
              Login
            </button>
          </div>
        </form>
      </div>

      {error && <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>}
    </div>
  );
}

export default Login;
