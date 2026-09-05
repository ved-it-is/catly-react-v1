import React, { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import MotivationPage from "./pages/MotivationPage";
import TargetPage from "./pages/TargetPage";
import CatWatchPage from "./pages/CatWatchPage";
import RemindersPage from "./pages/RemindersPage";
import CountdownPage from "./pages/CountdownPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { CAT_EXAM_DATE } from "./data/catData";

import { supabase } from "./auth/supabaseClient";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [authPage, setAuthPage] = useState("login");
  const [activePage, setActivePage] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setCurrentUser(session?.user ?? null);
        setAuthLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setCurrentUser(session?.user ?? null);
        setAuthLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  function handleLogin(user) {
    setCurrentUser(user);
    setActivePage("dashboard");
  }

  function handleSignup(user) {
    setCurrentUser(user);
    setActivePage("dashboard");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setAuthPage("login");
  }

  function handlePageChange(page) {
    setActivePage(page);
    setMobileMenuOpen(false);
  }

  if (authLoading) {
    return <div className="auth-page">Loading your account…</div>;
  }

  // LOGIN / SIGNUP
  if (!currentUser) {
    if (authPage === "signup") {
      return (
        <SignupPage
          onSignup={handleSignup}
          onLogin={() => setAuthPage("login")}
        />
      );
    }

    return (
      <LoginPage
        onLogin={handleLogin}
        onSignup={() => setAuthPage("signup")}
      />
    );
  }

  // PAGE ROUTING
  function renderPage() {
    switch (activePage) {
      case "analytics":
        return <AnalyticsPage user={currentUser} />;

      case "countdown":
        return (
          <CountdownPage
            examDate={CAT_EXAM_DATE}
          />
        );

      case "motivation":
        return <MotivationPage user={currentUser} />;

      case "target":
        return <TargetPage user={currentUser} />;

      case "mock":
        return <CatWatchPage user={currentUser} />;

      case "reminders":
        return <RemindersPage user={currentUser} />;

      case "dashboard":
      default:
        return (
          <DashboardPage
            user={currentUser}
            examDate={CAT_EXAM_DATE}
          />
        );
    }
  }

  return (
    <div className="app">

      <Sidebar
        page={activePage}
        setPage={handlePageChange}
        mobileOpen={mobileMenuOpen}
        closeMobile={() => setMobileMenuOpen(false)}
      />

      <main className="main">

        <button
          className="menu-btn"
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        {/* USER / LOGOUT */}
        <div
          style={{
            position: "fixed",
            top: "28px",
            right: "32px",
            zIndex: 30,
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <span
            style={{
              color: "#8e96aa",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            {currentUser.userId || currentUser.email}
          </span>

          <button
            onClick={handleLogout}
            style={{
              border: "1px solid #30364a",
              background: "#11151f",
              color: "#d7dbea",
              borderRadius: "9px",
              padding: "8px 13px",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            LOG OUT
          </button>
        </div>

        <div className={`page-content ${activePage === "countdown" ? "page-content--full-bleed" : ""}`}>
          {renderPage()}
        </div>

      </main>

    </div>
  );
}

export default App;
