import React, { useState } from "react";
import { login } from "../auth/auth";

export default function LoginPage({ onLogin, onSignup }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    setError("");

    const result = login(userId, password);

    if (!result.success) {
      setError(result.message);
      return;
    }

    onLogin(result.user);
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          CAT<span>LY</span>
        </div>

        <p className="auth-subtitle">
          Your CAT 2026 command centre.
        </p>

        <h1>Welcome back.</h1>

        <p className="auth-description">
          Log in to continue your CAT journey.
        </p>

        <form onSubmit={handleSubmit}>

          <label>CAT User ID</label>

          <input
            type="text"
            placeholder="Enter your CAT User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            autoComplete="username"
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button type="submit" className="auth-button">
            SIGN IN
          </button>

        </form>

        <div className="auth-divider">
          <span>NEW TO CATLY?</span>
        </div>

        <button
          className="auth-secondary-button"
          onClick={onSignup}
        >
          CREATE ACCOUNT
        </button>

      </div>
    </div>
  );
}