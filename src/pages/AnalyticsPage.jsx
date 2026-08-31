import { useState } from "react";

import {
  getTopicRows,
  deepTopicCoverage,
  years,
} from "../data/catData";

const sections = ["QA", "VARC", "DILR"];


/* =========================================================
   HELPERS
========================================================= */

function average(values) {
  const valid = values.filter(
    (value) =>
      value !== null &&
      value !== undefined &&
      !Number.isNaN(Number(value))
  );

  if (!valid.length) return null;

  return (
    valid.reduce(
      (sum, value) => sum + Number(value),
      0
    ) / valid.length
  );
}


/*
  Detailed QA data is stored as average questions / slot.

  Percentage is calculated against the section size.
*/
function getDeepAveragePercentage(
  questionAverage,
  section,
  year
) {
  if (
    questionAverage === null ||
    questionAverage === undefined
  ) {
    return null;
  }

  const sectionTotals = {
    QA: 22,
    VARC: 24,
    DILR: year >= 2024 ? 22 : 20,
  };

  const total = sectionTotals[section];

  if (!total) return null;

  return (
    (Number(questionAverage) / total) *
    100
  );
}


/*
  Flatten deepTopicCoverage so the UI can render:

  Category
      Topic
          2021
          2022
          ...
*/
function getDeepRows(section) {
  const sectionData =
    deepTopicCoverage?.[section];

  if (!sectionData) return [];

  const rows = [];

  Object.entries(sectionData).forEach(
    ([category, topics]) => {

      Object.entries(topics).forEach(
        ([topic, data]) => {

          /*
            Aggregate-only data
            Example:
              Tables: {
                totalQuestions: 61,
                percentage: 19.6
              }
          */

          if (
            data &&
            typeof data === "object" &&
            (
              "totalQuestions" in data ||
              "percentage" in data
            ) &&
            !years.some(
              (year) =>
                Object.prototype.hasOwnProperty.call(
                  data,
                  year
                )
            )
          ) {

            rows.push({
              category,
              topic,
              type: "aggregate",
              totalQuestions:
                data.totalQuestions ?? null,
              percentage:
                data.percentage ?? null,
            });

            return;
          }


          /*
            Year-by-year data
          */

          const yearly = {};

          years.forEach((year) => {

            yearly[year] =
              Object.prototype.hasOwnProperty.call(
                data,
                year
              )
                ? data[year]
                : null;

          });


          const validYears =
            years.filter(
              (year) =>
                yearly[year] !== null &&
                yearly[year] !== undefined
            );


          const avgQuestions =
            validYears.length
              ? average(
                  validYears.map(
                    (year) => yearly[year]
                  )
                )
              : null;


          rows.push({
            category,
            topic,
            type: "yearly",
            yearly,
            averageQuestions:
              avgQuestions,
          });

        }
      );

    }
  );

  return rows;
}


/* =========================================================
   COMPONENT
========================================================= */

export default function AnalyticsPage() {

  const [section, setSection] =
    useState("QA");


  const rows =
    getTopicRows(section);


  const deepRows =
    getDeepRows(section);


  return (

    <div className="analytics-page">


      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="section-head analytics-title">

        <div>

          <div className="section-title xl">
            CAT Analytics
          </div>

          <div className="muted">
            Historical CAT intelligence for
            smarter preparation.
          </div>

        </div>

      </div>


      {/* ===================================================
          NOTICE
      =================================================== */}

      <div className="notice">

        Historical topic distributions are based
        on PYQ analysis. Topic classification is
        an analytical classification rather than
        an official IIM CAT taxonomy.

      </div>


      {/* ===================================================
          TABLE 1 — TOPIC COVERAGE
      =================================================== */}

      <section className="card section-gap">

        <div className="section-head">

          <div>

            <div className="section-title">
              Topic Coverage
            </div>

            <div className="muted">
              Average questions per slot and
              percentage of the section.
            </div>

          </div>


          <div className="chips">

            {sections.map((s) => (

              <button
                key={s}
                className={`chip ${
                  section === s
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setSection(s)
                }
              >
                {s}
              </button>

            ))}

          </div>

        </div>


        <div className="table-scroll">

          <table>

            <thead>

              <tr>

                <th>
                  Topic
                </th>

                {years.map((year) => (

                  <th key={year}>
                    {year}
                  </th>

                ))}

                <th>
                  5Y AVG
                </th>

              </tr>

            </thead>


            <tbody>

              {rows.map((row) => (

                <tr key={row.topic}>

                  <td>
                    <b>
                      {row.topic}
                    </b>
                  </td>


                  {years.map((year) => {

                    const questions =
                      row[
                        `${year}Questions`
                      ];

                    const percentage =
                      row[
                        `${year}Percentage`
                      ];


                    if (
                      questions === null ||
                      questions === undefined
                    ) {

                      return (

                        <td key={year}>

                          <span className="muted">
                            —
                          </span>

                        </td>

                      );

                    }


                    return (

                      <td key={year}>

                        <div className="topic-cell">

                          <strong>
                            {questions.toFixed(1)} Q
                          </strong>

                          <span className="muted">
                            {percentage.toFixed(1)}%
                          </span>

                        </div>

                      </td>

                    );

                  })}


                  <td>

                    {row.average === null ? (

                      <span className="muted">
                        —
                      </span>

                    ) : (

                      <div className="topic-cell">

                        <strong>
                          {row.average.toFixed(1)}%
                        </strong>

                      </div>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>


      {/* ===================================================
          TABLE 2 — DETAILED PYQ ANALYSIS
      =================================================== */}

      <section className="card section-gap">

        <div className="section-head">

          <div>

            <div className="section-title">
              Detailed PYQ Analysis
            </div>

            <div className="muted">
              Deeper topic and subtopic patterns
              from historical CAT papers.
            </div>

          </div>

        </div>


        <div className="table-scroll">

          <table>

            <thead>

              <tr>

                <th>
                  Topic / Subtopic
                </th>

                {years.map((year) => (

                  <th key={year}>
                    {year}
                  </th>

                ))}

                <th>
                  5Y AVG
                </th>

              </tr>

            </thead>


            <tbody>

              {deepRows.map((row) => (

                <tr
                  key={`${row.category}-${row.topic}`}
                >

                  <td>

                    <div>

                      <span className="muted">
                        {row.category}
                      </span>

                      <br />

                      <b>
                        {row.topic}
                      </b>

                    </div>

                  </td>


                  {row.type === "yearly" && (

                    years.map((year) => {

                      const questions =
                        row.yearly[year];


                      if (
                        questions === null ||
                        questions === undefined
                      ) {

                        return (

                          <td key={year}>

                            <span className="muted">
                              —
                            </span>

                          </td>

                        );

                      }


                      const percentage =
                        getDeepAveragePercentage(
                          questions,
                          section,
                          year
                        );


                      return (

                        <td key={year}>

                          <div className="topic-cell">

                            <strong>
                              {Number(
                                questions
                              ).toFixed(1)} Q
                            </strong>

                            <span className="muted">
                              {percentage !== null
                                ? `${percentage.toFixed(
                                    1
                                  )}%`
                                : "—"}
                            </span>

                          </div>

                        </td>

                      );

                    })

                  )}


                  {row.type === "yearly" && (

                    <td>

                      {row.averageQuestions ===
                      null ? (

                        <span className="muted">
                          —
                        </span>

                      ) : (

                        <div className="topic-cell">

                          <strong>
                            {row.averageQuestions.toFixed(
                              1
                            )} Q
                          </strong>

                        </div>

                      )}

                    </td>

                  )}


                  {row.type ===
                    "aggregate" && (

                    <>

                      <td
                        colSpan={
                          years.length
                        }
                      >

                        <div className="topic-cell">

                          <strong>
                            {row.totalQuestions !==
                            null
                              ? `${row.totalQuestions} Q`
                              : "—"}
                          </strong>

                          <span className="muted">
                            {row.percentage !==
                            null
                              ? `${row.percentage}%`
                              : ""}
                            {" "}of category
                          </span>

                        </div>

                      </td>


                      <td>

                        <span className="muted">
                          Aggregate
                        </span>

                      </td>

                    </>

                  )}

                </tr>

              ))}


              {!deepRows.length && (

                <tr>

                  <td
                    colSpan={
                      years.length + 2
                    }
                  >

                    <span className="muted">
                      No detailed historical
                      data available yet.
                    </span>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>


        <div className="muted analytics-footnote">

          Q = average questions per slot where
          year-wise data is available. “—” means
          a reliable year-level figure has not
          been established. Aggregate figures are
          shown separately and are not converted
          into fabricated yearly values.

        </div>

      </section>


    </div>

  );

}