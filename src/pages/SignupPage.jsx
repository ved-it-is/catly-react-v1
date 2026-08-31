import React, { useState } from "react";
import { supabase } from "../auth/supabaseClient";
import { Eye, EyeOff, LockKeyhole, Mail, Sparkles } from "lucide-react";

export default function SignupPage({ onSignup, onLogin }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      <div className="auth-shell">
        <aside className="auth-showcase" aria-hidden="true">
          <div className="auth-logo">CAT<span>LY</span></div>
          <div className="auth-showcase-copy">
            <span className="auth-kicker"><Sparkles size={14} /> CAT 2026 command centre</span>
            <h2>Your best prep<br />starts here.</h2>
            <p>Build a calmer, more intentional path to your CAT goal—one day at a time.</p>
          </div>
          <div className="auth-quote">One account. Your entire CAT journey.</div>
        </aside>

        <div className="auth-card">
          <div className="auth-mobile-brand auth-logo">CAT<span>LY</span></div>
          <span className="auth-kicker"><Sparkles size={14} /> Start your journey</span>
          <h1>Create your account.</h1>
          <p className="auth-description">Your personalised CAT command centre is a few details away.</p>

        <form onSubmit={handleSubmit}>

          <label htmlFor="signup-user-id">CAT User ID</label>
          <div className="auth-input-wrap"><Mail size={18} aria-hidden="true" /><input id="signup-user-id" type="text" placeholder="Your CAT User ID" value={userId} onChange={(e) => setUserId(e.target.value)} autoComplete="username" required /></div>

          <label htmlFor="signup-password">Create password</label>
          <div className="auth-input-wrap"><LockKeyhole size={18} aria-hidden="true" /><input id="signup-password" type={showPassword ? "text" : "password"} placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required /><button className="password-toggle" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>

          <label htmlFor="signup-confirm-password">Confirm password</label>
          <div className="auth-input-wrap"><LockKeyhole size={18} aria-hidden="true" /><input id="signup-confirm-password" type={showPassword ? "text" : "password"} placeholder="Repeat your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" required /></div>

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
    </div>
  );
}
