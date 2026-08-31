import React, { useState } from "react";
import { supabase } from "../auth/supabaseClient";
import { Eye, EyeOff, LockKeyhole, Mail, Sparkles } from "lucide-react";

export default function LoginPage({ onLogin, onSignup }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      <div className="auth-shell">
        <aside className="auth-showcase" aria-hidden="true">
          <div className="auth-logo">CAT<span>LY</span></div>
          <div className="auth-showcase-copy">
            <span className="auth-kicker"><Sparkles size={14} /> CAT 2026 command centre</span>
            <h2>Prepare with<br />a clear head.</h2>
            <p>Keep your plan, progress, targets, and motivation in one focused space.</p>
          </div>
          <div className="auth-quote">“Small, consistent steps create remarkable results.”</div>
        </aside>

        <div className="auth-card">
          <div className="auth-mobile-brand auth-logo">CAT<span>LY</span></div>
          <span className="auth-kicker"><Sparkles size={14} /> Welcome back</span>
          <h1>Sign in to continue.</h1>
          <p className="auth-description">Pick up exactly where you left off in your CAT journey.</p>

        <form onSubmit={handleSubmit}>

          <label htmlFor="login-user-id">CAT User ID</label>
          <div className="auth-input-wrap">
            <Mail size={18} aria-hidden="true" />
            <input id="login-user-id" type="text" placeholder="Enter your CAT User ID" value={userId} onChange={(e) => setUserId(e.target.value)} autoComplete="username" required />
          </div>

          <label htmlFor="login-password">Password</label>
          <div className="auth-input-wrap">
            <LockKeyhole size={18} aria-hidden="true" />
            <input id="login-password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
            <button className="password-toggle" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>

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
    </div>
  );
}
