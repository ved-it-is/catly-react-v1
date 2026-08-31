import React, { useState } from "react";
import { signup } from "../auth/auth";

export default function SignupPage({ onSignup, onLogin }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const result = signup(userId, password);

    if (!result.success) {
      setError(result.message);
      return;
    }

    onSignup(result.user);
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

        <h1>Create your account.</h1>

        <p className="auth-description">
          One account. Your entire CAT journey.
        </p>

        <form onSubmit={handleSubmit}>

          <label>CAT User ID</label>

          <input
            type="text"
            placeholder="Your CAT User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />

          <label>Create Password</label>

          <input
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label>Confirm Password</label>

          <input
            type="password"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button type="submit" className="auth-button">
            CREATE ACCOUNT
          </button>

        </form>

        <div className="auth-divider">
          <span>ALREADY HAVE AN ACCOUNT?</span>
        </div>

        <button
          className="auth-secondary-button"
          onClick={onLogin}
        >
          SIGN IN
        </button>

      </div>
    </div>
  );
}