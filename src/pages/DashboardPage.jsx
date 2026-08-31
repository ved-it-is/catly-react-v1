import { useEffect, useState } from "react";
import CountdownWidget from "../components/CountdownWidget";
import StatCard from "../components/StatCard";
import { topicCoverage } from "../data/catData";
import { calculateReadiness } from "../utils/readiness";

function getReadinessKey(user) {
  return `catly_readiness_${user?.userId || "guest"}`;
}

function getRandomTopic(section) {
  const topics = Object.keys(topicCoverage[section] || {});
  if (!topics.length) return "General Practice";
  return topics[Math.floor(Math.random() * topics.length)];
}

const topicDescriptions = {
  QA: "High historical coverage. Focus on fundamentals and problem-solving speed.",
  VARC: "Maintain consistency with daily reading blocks and accuracy tracking.",
  DILR: "Work on set-selection technique and reducing setup time.",
};

export default function DashboardPage({ examDate, user }) {
  const [targetPercentile, setTargetPercentile] = useState("95.0");
  const [readinessPercent, setReadinessPercent] = useState(0);
  const [randomFocus, setRandomFocus] = useState({
    QA: "Arithmetic",
    VARC: "Reading Comprehension",
    DILR: "Logical Reasoning",
  });

  useEffect(() => {
    // 1. Fetch saved Target Percentile
    const savedTarget = localStorage.getItem("catly_target_percentile");
    if (savedTarget) {
      setTargetPercentile(Number(savedTarget).toFixed(1));
    }

    // 2. Fetch readiness index dynamically from user readiness data
    try {
      const savedReadiness = JSON.parse(
        localStorage.getItem(getReadinessKey(user)) || "null"
      );
      if (savedReadiness) {
        const result = calculateReadiness(savedReadiness);
        setReadinessPercent(result.readinessIndex || 0);
      } else {
        setReadinessPercent(0);
      }
    } catch {
      setReadinessPercent(0);
    }

    // 3. Pick random topics for Today's Focus
    setRandomFocus({
      QA: getRandomTopic("QA"),
      VARC: getRandomTopic("VARC"),
      DILR: getRandomTopic("DILR"),
    });
  }, [user]);

  return (
    <div className="dashboard-page" style={{ position: "relative" }}>
      {/* VIBRANT AMBIENT GLOW EFFECTS */}
      <div
        style={{
          position: "absolute",
          top: "5%",
          right: "10%",
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(147, 51, 234, 0.35) 0%, rgba(147, 51, 234, 0.05) 50%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "45%",
          left: "5%",
          width: "550px",
          height: "550px",
          background:
            "radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, rgba(59, 130, 246, 0.05) 50%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <section className="hero">
          <div>
            <CountdownWidget examDate={examDate} />
          </div>
          <div className="hero-right">
            <div className="label">PREPARATION JOURNEY</div>
            <div className="progress-meta">
              <b>{readinessPercent}%</b>
              <span>{readinessPercent > 50 ? "On track" : "In progress"}</span>
            </div>
            <div className="progress">
              <i style={{ width: `${readinessPercent}%` }} />
            </div>
            <p className="quote">
              You don't need a perfect preparation. You need to keep showing up.
            </p>
          </div>
        </section>

        {/* SINGLE CENTERED TARGET PERCENTILE CARD */}
        <div className="section-gap" style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth: "360px" }}>
            <StatCard
              label="TARGET PERCENTILE"
              value={targetPercentile}
              sub="Your current goal"
            />
          </div>
        </div>

        {/* TODAY'S FOCUS */}
        <section className="section-gap">
          <div className="section-head">
            <div>
              <div className="section-title">Today's focus</div>
              <div className="muted">Simple priorities. No noise.</div>
            </div>
          </div>
          <div className="grid-3">
            <div className="card focus-card">
              <span className="pill">QA</span>
              <h3>{randomFocus.QA}</h3>
              <p>{topicDescriptions.QA}</p>
            </div>
            <div className="card focus-card">
              <span className="pill">VARC</span>
              <h3>{randomFocus.VARC}</h3>
              <p>{topicDescriptions.VARC}</p>
            </div>
            <div className="card focus-card">
              <span className="pill">DILR</span>
              <h3>{randomFocus.DILR}</h3>
              <p>{topicDescriptions.DILR}</p>
            </div>
          </div>
        </section>

        {/* YOUR JOURNEY */}
        <section className="card journey section-gap">
          <div className="section-head">
            <div>
              <div className="section-title">Your journey</div>
              <div className="muted">From preparation to result day.</div>
            </div>
            <span className="pill">CAT 2026</span>
          </div>
          <div className="timeline">
            {["Registration", "Preparation", "Mocks", "CAT", "Result"].map(
              (x, i) => (
                <div
                  className={`timeline-item ${
                    i < 2 ? "done" : i === 2 ? "current" : ""
                  }`}
                  key={x}
                >
                  <div className="dot" />
                  <span>{x}</span>
                </div>
              )
            )}
          </div>
        </section>
      </div>
    </div>
  );
}