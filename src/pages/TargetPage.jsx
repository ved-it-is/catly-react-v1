import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  calculateReadiness,
  createEmptyReadiness,
} from "../utils/readiness";

function getReadinessKey(user) {
  return `catly_readiness_${user?.userId || "guest"}`;
}

function loadReadiness(user) {
  const emptyReadiness = createEmptyReadiness();

  try {
    const savedReadiness = JSON.parse(
      localStorage.getItem(getReadinessKey(user)) || "null"
    );

    if (!savedReadiness) {
      return emptyReadiness;
    }

    Object.keys(emptyReadiness).forEach((section) => {
      Object.keys(emptyReadiness[section]).forEach((topic) => {
        emptyReadiness[section][topic] = {
          ...emptyReadiness[section][topic],
          ...(savedReadiness?.[section]?.[topic] || {}),
        };
      });
    });

    return emptyReadiness;
  } catch {
    return emptyReadiness;
  }
}

const sectionOrder = ["QA", "DILR", "VARC"];

export default function TargetPage({ user }) {
  const [target, setTarget] = useState(() => {
    const savedTarget = localStorage.getItem("catly_target_percentile");
    return savedTarget ? Number(savedTarget) : 95;
  });

  const [readiness, setReadiness] = useState(() =>
    loadReadiness(user)
  );

  useEffect(() => {
    localStorage.setItem("catly_target_percentile", target.toString());
  }, [target]);

  useEffect(() => {
    localStorage.setItem(
      getReadinessKey(user),
      JSON.stringify(readiness)
    );
  }, [readiness, user]);

  const result = useMemo(() => {
    return calculateReadiness(readiness);
  }, [readiness]);

  const estimate =
    target >= 99
      ? "95–105"
      : target >= 98
      ? "82–90"
      : target >= 95
      ? "65–75"
      : target >= 90
      ? "50–60"
      : "Below 50";

  function updateTopic(section, topic, field, value) {
    setReadiness((current) => ({
      ...current,

      [section]: {
        ...current[section],

        [topic]: {
          ...current[section][topic],
          [field]: value,
        },
      },
    }));
  }

  function resetReadiness() {
    const confirmed = window.confirm(
      "Reset all CAT readiness information?"
    );

    if (!confirmed) return;

    setReadiness(createEmptyReadiness());
  }

  return (
    <div className="page-content narrow target-page">
      <div className="target-header">
        <div className="section-title xl">
          My Target
        </div>

        <div className="muted">
          Build a goal and track the preparation behind it.
        </div>
      </div>

      {/* TARGET PERCENTILE */}
      <div className="card section-gap target-card">
        <div className="target-glow target-glow-one" />
        <div className="target-glow target-glow-two" />
        <div className="target-glow target-glow-three" />

        <div className="target-content">
          <div className="target-slider-area">
            <div className="target-number">
              {target.toFixed(1)}
              <span>%ile</span>
            </div>

            <input
              className="range target-range"
              type="range"
              min="50"
              max="99.9"
              step=".1"
              value={target}
              onChange={(event) =>
                setTarget(Number(event.target.value))
              }
            />

            <div className="range-labels">
              <span>50</span>
              <span>99.9</span>
            </div>
          </div>

          <div className="result-card target-result-card">
            <div className="warning">
              SIMULATION — NOT OFFICIAL
            </div>

            <div className="eyebrow">
              CAT 2026 TARGET
            </div>

            <div className="target-result">
              {target.toFixed(1)}
            </div>

            <div className="muted historical-range">
              Illustrative historical score range:{" "}
              <b>{estimate}</b>
            </div>
          </div>
        </div>
      </div>

      {/* READINESS CALCULATOR */}
      <section className="readiness-section section-gap">
        <div className="readiness-heading">
          <div>
            <div className="section-title">
              CAT Readiness Index
            </div>

            <div className="muted">
              A data-based estimate from your coverage,
              practice volume and accuracy.
            </div>
          </div>

          <button
            className="readiness-reset"
            onClick={resetReadiness}
          >
            Reset check-in
          </button>
        </div>

        <div className="readiness-summary">
          <div className="readiness-score-card">
            <div className="eyebrow">
              CURRENT READINESS
            </div>

            <div className="readiness-score">
              {result.readinessIndex}
              <span>%</span>
            </div>

            <div className="muted">
              Based on your entered preparation data.
            </div>
          </div>

          <div className="readiness-breakdown">
            {sectionOrder.map((section) => (
              <div
                className="readiness-section-score"
                key={section}
              >
                <span>{section}</span>

                <b>
                  {result.sections[section] || 0}%
                </b>

                <div className="readiness-mini-bar">
                  <i
                    style={{
                      width: `${
                        result.sections[section] || 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="readiness-confidence">
            <span>DATA CONFIDENCE</span>

            <b>{result.confidence}%</b>

            <p>
              {result.topicsWithData} of{" "}
              {result.totalTopics} topics updated ·{" "}
              {result.questionsAttempted} questions logged
            </p>
          </div>
        </div>

        <div className="readiness-note">
          100% means your logged preparation matches CATLY’s
          high-readiness benchmark. It does not guarantee a
          percentile or CAT score.
        </div>

        <div className="readiness-topic-sections">
          {sectionOrder.map((section) => (
            <div
              className="readiness-topic-section"
              key={section}
            >
              <div className="readiness-topic-section-head">
                <h2>{section}</h2>

                <p>
                  Update every topic you are actively preparing.
                </p>
              </div>

              <div className="readiness-topic-list">
                {Object.entries(readiness[section]).map(
                  ([topic, record]) => (
                    <div
                      className="readiness-topic-row"
                      key={topic}
                    >
                      <div className="readiness-topic-name">
                        <b>{topic}</b>

                        <span>
                          Select your stage, then add practice
                          attempts and correct answers.
                        </span>
                      </div>

                      <label>
                        Stage

                        <select
                          value={record.status}
                          onChange={(event) =>
                            updateTopic(
                              section,
                              topic,
                              "status",
                              event.target.value
                            )
                          }
                        >
                          <option value="not-started">
                            Not started
                          </option>

                          <option value="learning">
                            Learning
                          </option>

                          <option value="practicing">
                            Practicing
                          </option>

                          <option value="revised">
                            Revised
                          </option>
                        </select>
                      </label>

                      <label>
                        Attempted

                        <input
                          type="number"
                          min="0"
                          value={record.attempted}
                          onChange={(event) =>
                            updateTopic(
                              section,
                              topic,
                              "attempted",
                              event.target.value
                            )
                          }
                        />
                      </label>

                      <label>
                        Correct

                        <input
                          type="number"
                          min="0"
                          max={record.attempted}
                          value={record.correct}
                          onChange={(event) =>
                            updateTopic(
                              section,
                              topic,
                              "correct",
                              event.target.value
                            )
                          }
                        />
                      </label>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}