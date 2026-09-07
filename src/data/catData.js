/*
  CATLY historical CAT analysis (2021-2025)

  Source set: 15 reconstructed question papers (three slots per year).
  Topic labels are CATLY's analytical classification, not an official IIM
  syllabus. Every row within a section is mutually exclusive so percentages
  reconcile to the actual section size.
*/

export const CAT_EXAM_DATE = "2026-11-29T10:00:00+05:30";

export const years = [2021, 2022, 2023, 2024, 2025];
export const slots = [1, 2, 3];

export const sectionQuestionCount = {
  2021: { QA: 22, VARC: 24, DILR: 20 },
  2022: { QA: 22, VARC: 24, DILR: 20 },
  2023: { QA: 22, VARC: 24, DILR: 20 },
  2024: { QA: 22, VARC: 24, DILR: 22 },
  2025: { QA: 22, VARC: 24, DILR: 22 },
};

/*
  QA classification rule:
  - Arithmetic: ratios, averages, percentages, commercial maths, mixtures,
    time-speed-distance, time-work and interest.
  - Algebra: equations, inequalities, functions, logarithms, surds and series.
  - Geometry & Mensuration: plane, coordinate and solid geometry.
  - Number System: integer properties, factors, remainders and digits.
  - Modern Math: counting, sets, probability and combinatorics.

  A cross-topic question is assigned to exactly one primary bucket according
  to the main operation needed to solve it.
*/
export const qaTopicCoverage = {
  Arithmetic: {
    2021: [11, 11, 11],
    2022: [8, 9, 9],
    2023: [9, 7, 8],
    2024: [8, 8, 8],
    2025: [8, 8, 8],
  },
  Algebra: {
    2021: [5, 5, 6],
    2022: [8, 7, 7],
    2023: [8, 8, 7],
    2024: [8, 8, 7],
    2025: [8, 7, 7],
  },
  "Geometry & Mensuration": {
    2021: [3, 3, 4],
    2022: [3, 4, 4],
    2023: [3, 3, 3],
    2024: [3, 3, 3],
    2025: [3, 3, 3],
  },
  "Number System": {
    2021: [1, 1, 0],
    2022: [1, 1, 1],
    2023: [1, 2, 4],
    2024: [2, 2, 3],
    2025: [1, 4, 3],
  },
  "Modern Math": {
    2021: [2, 2, 1],
    2022: [2, 1, 1],
    2023: [1, 2, 0],
    2024: [1, 1, 1],
    2025: [2, 0, 1],
  },
};

/* Exact question-type counts read from the VARC sections. */
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
    2022: [2, 3, 3],
    2023: [2, 2, 2],
    2024: [3, 3, 3],
    2025: [2, 2, 2],
  },
  "Sentence Insertion": {
    2021: [0, 0, 0],
    2022: [2, 2, 2],
    2023: [2, 2, 2],
    2024: [3, 3, 3],
    2025: [2, 2, 2],
  },
  "Odd Sentence Out": {
    2021: [2, 2, 2],
    2022: [0, 0, 0],
    2023: [2, 2, 2],
    2024: [2, 2, 2],
    2025: [2, 2, 2],
  },
  "Other Verbal Ability": {
    2021: [0, 0, 0],
    2022: [1, 0, 0],
    2023: [0, 0, 0],
    2024: [0, 0, 0],
    2025: [0, 0, 0],
  },
};

/*
  DILR labels frequently overlap, so this section reports objective set-size
  structure. Values are questions belonging to sets of each size, not sets.
*/
export const dilrTopicCoverage = {
  "Questions in 4-question sets": {
    2021: [8, 8, 8],
    2022: [0, 0, 0],
    2023: [0, 0, 0],
    2024: [12, 12, 12],
    2025: [12, 12, 12],
  },
  "Questions in 5-question sets": {
    2021: [0, 0, 0],
    2022: [20, 20, 20],
    2023: [20, 20, 20],
    2024: [10, 10, 10],
    2025: [10, 10, 10],
  },
  "Questions in 6-question sets": {
    2021: [12, 12, 12],
    2022: [0, 0, 0],
    2023: [0, 0, 0],
    2024: [0, 0, 0],
    2025: [0, 0, 0],
  },
};

export const topicCoverage = {
  QA: qaTopicCoverage,
  VARC: varcTopicCoverage,
  DILR: dilrTopicCoverage,
};

export const coverageMeta = {
  QA: {
    title: "Primary Topic Coverage",
    description: "Average questions per slot using one non-overlapping primary topic per question.",
    note: "Cross-topic questions are assigned to the main method required for the solution.",
  },
  VARC: {
    title: "Question-Type Coverage",
    description: "Exact average questions per slot by VARC question format.",
    note: "The one-off 2022 Slot 1 sentence-meaning question is retained under Other Verbal Ability.",
  },
  DILR: {
    title: "Set-Size Structure",
    description: "Average questions per slot grouped by the size of their DILR set.",
    note: "Set themes are not converted to percentages because arrangements, games and DI labels often overlap.",
  },
};

export const dataMethodology = {
  sample: "15 reconstructed papers: 2021-2025, Slots 1-3",
  classification: "CATLY analytical taxonomy; not an official IIM CAT syllabus",
  validation: "Every slot reconciles exactly to its published section total",
  sourceQuality: "Question-paper reconstructions; use official response sheets when available",
};

export function averageQuestions(slotCounts) {
  if (!slotCounts || slotCounts.length === 0) return null;
  return slotCounts.reduce((sum, value) => sum + Number(value || 0), 0) / slotCounts.length;
}

export function averagePercentage(slotCounts, section, year) {
  const average = averageQuestions(slotCounts);
  const total = sectionQuestionCount[year]?.[section];
  if (average === null || !total) return null;
  return (average / total) * 100;
}

export function getTopicRows(section) {
  const sectionData = topicCoverage[section];
  if (!sectionData) return [];

  return Object.entries(sectionData)
    .map(([topic, yearlyData]) => {
      const row = { topic };
      const validPercentages = [];

      years.forEach((year) => {
        const slotCounts = yearlyData[year];
        const questionAverage = averageQuestions(slotCounts);
        const percentage = averagePercentage(slotCounts, section, year);

        row[year] = percentage;
        row[`${year}Questions`] = questionAverage;
        row[`${year}Percentage`] = percentage;
        row[`${year}Slots`] = slotCounts;
        if (percentage !== null) validPercentages.push(percentage);
      });

      row.average = validPercentages.length
        ? validPercentages.reduce((sum, value) => sum + value, 0) / validPercentages.length
        : null;
      return row;
    })
    .sort((a, b) => (b.average ?? -1) - (a.average ?? -1));
}

export function validateTopicCoverage() {
  const issues = [];

  Object.entries(topicCoverage).forEach(([section, sectionData]) => {
    years.forEach((year) => {
      slots.forEach((slot, slotIndex) => {
        const observed = Object.values(sectionData).reduce(
          (sum, topic) => sum + Number(topic[year]?.[slotIndex] || 0),
          0,
        );
        const expected = sectionQuestionCount[year][section];
        if (observed !== expected) {
          issues.push(`${section} ${year} Slot ${slot}: expected ${expected}, found ${observed}`);
        }
      });
    });
  });

  return issues;
}

export const dataValidationIssues = validateTopicCoverage();

/* Kept for compatibility with older imports; unsupported synthetic values were removed. */
export const deepTopicCoverage = {};
