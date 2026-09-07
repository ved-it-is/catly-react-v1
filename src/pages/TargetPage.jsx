import { useMemo } from "react";

import { calculateReadiness } from "../utils/readiness";

const sectionOrder = ["QA", "DILR", "VARC"];

export default function TargetPage({ readinessProfile }) {
  const {
    targetPercentile: target,
    setTargetPercentile: setTarget,
    readiness,
    setReadiness,
    resetReadiness: clearReadiness,
    loading,
    saving,
    error,
  } = readinessProfile;
  const controlsDisabled = loading || Boolean(error);

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

    clearReadiness();
  }

  return (
    <div className="narrow target-page">
      <div className="target-header">
        <div className="section-title xl">
          My Target
        </div>

        <div className="muted">
          Build a goal and track the preparation behind it.
        </div>
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}
      {!error && (loading || saving) && (
        <p className="muted" aria-live="polite">{loading ? "Loading your readiness…" : "Saving changes…"}</p>
      )}

      {/* TARGET PERCENTILE */}
      <div className="card section-gap target-card">
        <div className="target-glow target-glow-one" />
        <div className="target-glow target-glow-two" />
        <div className="target-glow target-glow-three" />

        <div className="target-content">
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

          <div className="target-slider-area">
            <div className="eyebrow">ADJUST YOUR TARGET</div>

            <div className="target-number">
              {target.toFixed(1)}
              <span>%ile</span>
            </div>

            <input
              className="range target-range"
              type="range"
              min="50"
              max="100"
              step=".1"
              value={target}
              onChange={(event) =>
                setTarget(Number(event.target.value))
              }
              aria-label="Target percentile"
              disabled={controlsDisabled}
            />

            <div className="range-labels">
              <span>50</span>
              <span>100</span>
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

        <div className="readiness-actions">
          <button
            className="readiness-reset"
            onClick={resetReadiness}
            disabled={controlsDisabled}
          >
            Reset check-in
          </button>
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
                          disabled={controlsDisabled}
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
                          disabled={controlsDisabled}
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
                          disabled={controlsDisabled}
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
