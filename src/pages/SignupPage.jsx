import React, { useState } from "react";
import { supabase } from "../auth/supabaseClient";

export default function SignupPage({ onSignup, onLogin }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    // Format username to match Supabase email requirement
    const email = userId.includes("@") ? userId : `${userId}@catly.app`;

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data?.user) {
      // Create profile row in user_profiles table
      await supabase.from("user_profiles").insert([
        { id: data.user.id, email: data.user.email }
      ]);

      if (onSignup) {
        onSignup(data.user);
      }
    }

    setLoading(false);
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
            required
          />

          <label>Create Password</label>

          <input
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>Confirm Password</label>

          <input
            type="password"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "CREATING..." : "CREATE ACCOUNT"}
          </button>

        </form>

        <div className="auth-divider">
          <span>ALREADY HAVE AN ACCOUNT?</span>
        </div>

        <button
          className="auth-secondary-button"
          onClick={onLogin}
          type="button"
        >
          SIGN IN
        </button>

      </div>
    </div>
  );
}