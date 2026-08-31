/*
  CATLY — Historical CAT Data

  DATA MODEL
  ----------
  All topic figures are based on actual CAT slot-wise question counts.

  CATLY does NOT store invented percentages.

  For each year:
      Slot 1 + Slot 2 + Slot 3
                    ↓
              yearly average

  The UI then calculates:
      average questions
      average % of section

  IMPORTANT:
  - Topic classification is a PYQ-analysis classification.
  - It is not an official IIM-published topic taxonomy.
  - DILR is classified into broad DI/LR/Mixed buckets because
    individual DILR sets can legitimately overlap categories.
*/


export const CAT_EXAM_DATE =
  "2026-11-29T10:00:00+05:30";


/* =========================================================
   SECTION SIZES
========================================================= */

export const sectionQuestionCount = {
  2021: {
    QA: 22,
    VARC: 24,
    DILR: 20,
  },

  2022: {
    QA: 22,
    VARC: 24,
    DILR: 20,
  },

  2023: {
    QA: 22,
    VARC: 24,
    DILR: 20,
  },

  2024: {
    QA: 22,
    VARC: 24,
    DILR: 22,
  },

  2025: {
    QA: 22,
    VARC: 24,
    DILR: 22,
  },
};


/* =========================================================
   SCORE → PERCENTILE
=========================================================

   Historical reference points.
   These are NOT official IIM lookup tables.

   Keep this separate from topic analysis.
========================================================= */

export const scorePercentileData = {

  2022: [
    { score: 36.02, percentile: 80 },
    { score: 41.32, percentile: 85 },
    { score: 48.44, percentile: 90 },
    { score: 59.75, percentile: 95 },
    { score: 73.88, percentile: 98 },
    { score: 83.64, percentile: 99 },
  ],

  2023: [
    { score: 38.00, percentile: 85 },
    { score: 44.36, percentile: 90 },
    { score: 54.86, percentile: 95 },
    { score: 62.00, percentile: 97 },
    { score: 76.15, percentile: 99 },
  ],

  2024: [
    { score: 44.00, percentile: 80 },
    { score: 50.00, percentile: 85 },
    { score: 58.00, percentile: 90 },
    { score: 70.00, percentile: 95 },
    { score: 95.13, percentile: 99 },
  ],

  2025: [
    { score: 38.00, percentile: 80 },
    { score: 44.20, percentile: 85 },
    { score: 51.50, percentile: 90 },
    { score: 62.30, percentile: 95 },
    { score: 70.00, percentile: 97 },
    { score: 76.00, percentile: 98 },
    { score: 84.80, percentile: 99 },
  ],

};


/* =========================================================
   SLOT-WISE TOPIC COUNTS
=========================================================

   Structure:

   topic: {
      2021: [slot1, slot2, slot3],
      2022: [slot1, slot2, slot3],
      ...
   }

   These are QUESTION COUNTS, not percentages.
========================================================= */


/* =========================================================
   QA
========================================================= */

export const qaTopicCoverage = {

  Arithmetic: {
    2021: [11, 11, 11],
    2022: [8, 9, 9],
    2023: [8, 9, 9],
    2024: [9, 8, 8],
    2025: [10, 8, 9],
  },

  Algebra: {
    2021: [5, 5, 6],
    2022: [8, 7, 7],
    2023: [8, 7, 7],
    2024: [6, 7, 6],
    2025: [7, 7, 6],
  },

  "Geometry & Mensuration": {
    2021: [3, 3, 4],
    2022: [3, 4, 4],
    2023: [3, 4, 4],
    2024: [3, 3, 3],
    2025: [3, 3, 4],
  },

  "Number System": {
    2021: [2, 2, 0],
    2022: [1, 1, 1],
    2023: [1, 1, 1],
    2024: [2, 2, 3],
    2025: [1, 2, 2],
  },

  "Modern Mathematics": {
    2021: [1, 1, 1],
    2022: [2, 1, 1],
    2023: [2, 1, 1],
    2024: [2, 2, 2],
    2025: [1, 2, 1],
  },

};


/* =========================================================
   VARC
========================================================= */

export const varcTopicCoverage = {

  "Reading Comprehension": {
    2021: [16, 16, 16],
    2022: [16, 16, 16],
    2023: [16, 16, 16],
    2024: [16, 16, 16],
    2025: [16, 16, 16],
  },

  "Para Jumbles": {
    2021: [3, 3, 3],
    2022: [3, 3, 3],
    2023: [2, 2, 2],
    2024: [0, 0, 0],
    2025: [2, 2, 2],
  },

  "Para Summary": {
    2021: [3, 3, 3],
    2022: [3, 3, 3],
    2023: [2, 2, 2],
    2024: [3, 3, 3],
    2025: [2, 2, 2],
  },

  "Para Completion": {
    2021: [0, 0, 0],
    2022: [2, 2, 2],
    2023: [2, 2, 2],
    2024: [3, 3, 3],
    2025: [2, 2, 2],
  },

  "Odd Sentence": {
    2021: [2, 2, 2],
    2022: [0, 0, 0],
    2023: [2, 2, 2],
    2024: [2, 2, 2],
    2025: [2, 2, 2],
  },

};


/* =========================================================
   DILR
=========================================================

   Broad classification deliberately used here:

   DI      = primarily Data Interpretation
   LR      = primarily Logical Reasoning
   Mixed   = genuinely mixed DI + LR / caselet

   This avoids pretending that every DILR set belongs
   exclusively to a rigid topic.
========================================================= */

export const dilrTopicCoverage = {

  "Data Interpretation": {
    2021: [8, 4, 8],
    2022: [10, 10, 10],
    2023: [10, 15, 15],
    2024: [12, 12, 12],
    2025: [4, 4, 4],
  },

  "Logical Reasoning": {
    2021: [12, 16, 12],
    2022: [10, 10, 10],
    2023: [10, 5, 5],
    2024: [10, 10, 10],
    2025: [13, 13, 13],
  },

  "Mixed DI-LR / Caselets": {
    2021: [0, 0, 0],
    2022: [0, 0, 0],
    2023: [0, 0, 0],
    2024: [0, 0, 0],
    2025: [5, 5, 5],
  },

};


/* =========================================================
   YEARS
========================================================= */

export const years = [
  2021,
  2022,
  2023,
  2024,
  2025,
];


/* =========================================================
   SECTION SELECTOR
========================================================= */

export const topicCoverage = {
  QA: qaTopicCoverage,
  VARC: varcTopicCoverage,
  DILR: dilrTopicCoverage,
};


/* =========================================================
   HELPERS
========================================================= */


/*
  Average questions across the 3 slots.
*/
export function averageQuestions(slotCounts) {

  if (!slotCounts || slotCounts.length === 0) {
    return null;
  }

  return (
    slotCounts.reduce(
      (sum, value) => sum + Number(value || 0),
      0
    ) / slotCounts.length
  );

}


/*
  Average percentage of section.

  We calculate percentage from the average question count
  rather than storing a percentage manually.
*/
export function averagePercentage(
  slotCounts,
  section,
  year
) {

  const avg = averageQuestions(slotCounts);

  const total =
    sectionQuestionCount[year]?.[section];

  if (avg === null || !total) {
    return null;
  }

  return (avg / total) * 100;

}


/*
  Build table rows for AnalyticsPage.
*/
export function getTopicRows(section) {

  const sectionData =
    topicCoverage[section];

  if (!sectionData) {
    return [];
  }

  return Object.entries(sectionData)
    .map(([topic, yearlyData]) => {

      const row = {
        topic,
      };

      const validAverages = [];

      years.forEach((year) => {

        const slots =
          yearlyData[year];

        if (!slots) {

          row[year] = null;
          row[`${year}Questions`] = null;
          row[`${year}Percentage`] = null;

          return;
        }

        const avgQuestions =
          averageQuestions(slots);

        const percentage =
          averagePercentage(
            slots,
            section,
            year
          );

        row[year] =
          percentage;

        row[`${year}Questions`] =
          avgQuestions;

        row[`${year}Percentage`] =
          percentage;

        row[`${year}Slots`] =
          slots;

        if (percentage !== null) {
          validAverages.push(
            percentage
          );
        }

      });


      row.average =
        validAverages.length
          ? validAverages.reduce(
              (sum, value) => sum + value,
              0
            ) / validAverages.length
          : null;


      return row;

    })
    .sort((a, b) => {

      if (a.average === null) return 1;
      if (b.average === null) return -1;

      return b.average - a.average;

    });

}

/* =========================================================
   DEEP HISTORICAL PYQ ANALYSIS
=========================================================

   Only data currently established from the historical
   analysis is included here.

   null = year-level figure not established.

   Values are average questions per slot unless stated
   otherwise.
========================================================= */

export const deepTopicCoverage = {

  QA: {

    Geometry: {

      Triangles: {
        2021: 0.7,
        2022: 1.3,
        2023: 0.7,
        2024: 1.0,
        2025: 1.0,
      },

      Circles: {
        2021: 0.3,
        2022: 0.7,
        2023: 1.3,
        2024: 1.0,
        2025: 0.7,
      },

      Mensuration: {
        2021: 0.7,
        2022: 0.7,
        2023: 0.3,
        2024: 0.7,
        2025: 0.7,
      },

      "Coordinate Geometry": {
        2021: null,
        2022: 0.3,
        2023: 0.3,
        2024: 0.7,
        2025: 0.3,
      },

      "Quadrilaterals & Polygons": {
        2021: 0.7,
        2022: 0.3,
        2023: 0.3,
        2024: null,
        2025: 0.3,
      },

    },


    Arithmetic: {

      "Time-Speed-Distance": {
        2021: 1.0,
        2022: 1.3,
        2023: 1.3,
        2024: 1.0,
        2025: 1.7,
      },

      "Sequences & Series": {
        2021: 1.3,
        2022: 1.3,
        2023: 2.0,
        2024: 1.3,
        2025: 1.3,
      },

      "Divisibility & Remainders": {
        2021: null,
        2022: 1.7,
        2023: 1.7,
        2024: 1.3,
        2025: 1.3,
      },

    },

  },


  DILR: {

    "Data Interpretation": {

      Tables: {
        totalQuestions: 61,
        percentage: 19.6,
      },

      "Bar Graphs": {
        totalQuestions: 25,
        percentage: 8.0,
      },

      "Scatter Plot": {
        totalQuestions: 13,
        percentage: 4.2,
      },

    },

    "Logical Reasoning": {

      Arrangements: {
        totalQuestions: 43,
        percentage: 13.8,
      },

      Scheduling: {
        totalQuestions: 20,
        percentage: 6.4,
      },

    },

  },


  VARC: {

    "Reading Comprehension": {

      Inference: {
        totalQuestions: 120,
        percentage: 50,
      },

      "Detail / Factual": {
        totalQuestions: 43,
        percentage: 18,
      },

      "Main Idea / Primary Purpose": {
        totalQuestions: 21,
        percentage: 9,
      },

      EXCEPT: {
        totalQuestions: 13,
        percentage: 5,
      },

      "Vocabulary in Context": {
        totalQuestions: 10,
        percentage: 4,
      },

      "Weaken / Critical Reasoning": {
        totalQuestions: 10,
        percentage: 4,
      },

      "Purpose / Structure": {
        totalQuestions: 6,
        percentage: 3,
      },

      Application: {
        totalQuestions: 5,
        percentage: 2,
      },

      "Author's View": {
        totalQuestions: 4,
        percentage: 2,
      },

      "Tone & Attitude": {
        totalQuestions: 3,
        percentage: 1,
      },

      Other: {
        totalQuestions: 5,
        percentage: 2,
      },

    },

  },

};