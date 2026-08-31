import React, { useState } from "react";
import { supabase } from "../auth/supabaseClient";

export default function LoginPage({ onLogin, onSignup }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Format username to match Supabase email auth
    const email = userId.includes("@") ? userId : `${userId}@catly.app`;

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    if (onLogin) {
      onLogin(data.user);
    }
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
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>

        </form>

        <div className="auth-divider">
          <span>NEW TO CATLY?</span>
        </div>

        <button
          className="auth-secondary-button"
          onClick={onSignup}
          type="button"
        >
          CREATE ACCOUNT
        </button>

      </div>
    </div>
  );
}