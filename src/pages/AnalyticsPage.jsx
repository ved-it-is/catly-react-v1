import { useState } from "react";

import {
  coverageMeta,
  dataMethodology,
  dataValidationIssues,
  getTopicRows,
  years,
} from "../data/catData";

const sections = ["QA", "VARC", "DILR"];

export default function AnalyticsPage() {
  const [section, setSection] = useState("QA");
  const rows = getTopicRows(section);
  const meta = coverageMeta[section];

  return (
    <div className="analytics-page">
      <div className="section-head analytics-title">
        <div>
          <div className="section-title xl">CAT Analytics</div>
          <div className="muted">Historical CAT intelligence with totals that reconcile.</div>
        </div>
      </div>

      <div className="notice">
        Based on reconstructed 2021-2025 papers. Topic classification is analytical rather than an official IIM CAT taxonomy.
      </div>

      <section className="card section-gap">
        <div className="section-head">
          <div>
            <div className="section-title">{meta.title}</div>
            <div className="muted">{meta.description}</div>
          </div>

          <div className="chips">
            {sections.map((item) => (
              <button
                key={item}
                className={`chip ${section === item ? "active" : ""}`}
                onClick={() => setSection(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>{section === "DILR" ? "Set structure" : "Topic"}</th>
                {years.map((year) => <th key={year}>{year}</th>)}
                <th>5Y AVG</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row) => (
                <tr key={row.topic}>
                  <td><b>{row.topic}</b></td>
                  {years.map((year) => (
                    <td key={year}>
                      <div className="topic-cell">
                        <strong>{row[`${year}Questions`].toFixed(1)} Q</strong>
                        <span className="muted">{row[`${year}Percentage`].toFixed(1)}%</span>
                      </div>
                    </td>
                  ))}
                  <td>
                    <div className="topic-cell"><strong>{row.average.toFixed(1)}%</strong></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="muted analytics-footnote">{meta.note}</div>
      </section>

      <section className="card section-gap">
        <div className="section-head">
          <div>
            <div className="section-title">Data Quality</div>
            <div className="muted">What is measured, and how the figures are kept honest.</div>
          </div>
        </div>

        <div className="table-scroll">
          <table>
            <tbody>
              <tr><td><b>Sample</b></td><td>{dataMethodology.sample}</td></tr>
              <tr><td><b>Classification</b></td><td>{dataMethodology.classification}</td></tr>
              <tr><td><b>Validation</b></td><td>{dataMethodology.validation}</td></tr>
              <tr><td><b>Source quality</b></td><td>{dataMethodology.sourceQuality}</td></tr>
              <tr>
                <td><b>Integrity check</b></td>
                <td>{dataValidationIssues.length === 0 ? "Passed - all 45 section-slots reconcile" : dataValidationIssues.join("; ")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
