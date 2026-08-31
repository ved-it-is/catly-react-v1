import {
  sectionQuestionCount,
  topicCoverage,
  years,
} from "../data/catData";

const STATUS_SCORES = {
  "not-started": 0,
  learning: 0.35,
  practicing: 0.7,
  revised: 1,
};

/*
  Practice targets for a high-readiness benchmark.
  These are editable later if we want CATLY to use a
  stricter or lighter benchmark.
*/
const PRACTICE_TARGETS = {
  QA: {
    Arithmetic: 250,
    Algebra: 200,
    "Geometry & Mensuration": 140,
    "Number System": 90,
    "Modern Mathematics": 90,
  },

  VARC: {
    "Reading Comprehension": 240,
    "Para Jumbles": 80,
    "Para Summary": 80,
    "Para Completion": 80,
    "Odd Sentence": 60,
  },

  DILR: {
    "Data Interpretation": 180,
    "Logical Reasoning": 220,
    "Mixed DI-LR / Caselets": 100,
  },
};

const TARGET_ACCURACY = {
  QA: 0.8,
  VARC: 0.75,
  DILR: 0.75,
};

function getTopicWeight(section, topic) {
  const topicData = topicCoverage[section]?.[topic];

  if (!topicData) return 0;

  let topicTotal = 0;
  let sectionTotal = 0;

  years.forEach((year) => {
    const slots = topicData[year] || [];

    topicTotal += slots.reduce(
      (sum, value) => sum + Number(value || 0),
      0
    );

    const questionsPerSlot =
      sectionQuestionCount[year]?.[section] || 0;

    sectionTotal += questionsPerSlot * slots.length;
  });

  if (!sectionTotal) return 0;

  return topicTotal / sectionTotal;
}

export function createEmptyReadiness() {
  const readiness = {};

  Object.entries(topicCoverage).forEach(
    ([section, topics]) => {
      readiness[section] = {};

      Object.keys(topics).forEach((topic) => {
        readiness[section][topic] = {
          status: "not-started",
          attempted: 0,
          correct: 0,
        };
      });
    }
  );

  return readiness;
}

export function calculateReadiness(readiness) {
  const sections = {};
  let overallScore = 0;
  let overallWeight = 0;
  let topicsWithData = 0;
  let questionsAttempted = 0;

  Object.entries(topicCoverage).forEach(
    ([section, topics]) => {
      let sectionScore = 0;
      let sectionWeight = 0;

      Object.keys(topics).forEach((topic) => {
        const record =
          readiness?.[section]?.[topic] || {};

        const statusScore =
          STATUS_SCORES[record.status] || 0;

        const attempted =
          Math.max(0, Number(record.attempted) || 0);

        const correct = Math.min(
          attempted,
          Math.max(0, Number(record.correct) || 0)
        );

        const practiceTarget =
          PRACTICE_TARGETS[section]?.[topic] || 100;

        const practiceScore = Math.min(
          attempted / practiceTarget,
          1
        );

        const rawAccuracy = attempted
          ? correct / attempted
          : 0;

        /*
          Small sample sizes should not look like mastery.
          Accuracy gains full confidence after 20 questions.
        */
        const sampleConfidence = Math.min(
          attempted / 20,
          1
        );

        const accuracyScore = Math.min(
          rawAccuracy / TARGET_ACCURACY[section],
          1
        ) * sampleConfidence;

        const topicScore =
          statusScore * 0.25 +
          practiceScore * 0.4 +
          accuracyScore * 0.35;

        const topicWeight =
          getTopicWeight(section, topic);

        sectionScore += topicScore * topicWeight;
        sectionWeight += topicWeight;

        questionsAttempted += attempted;

        if (
          record.status !== "not-started" ||
          attempted > 0
        ) {
          topicsWithData += 1;
        }
      });

      const normalizedSectionScore =
        sectionWeight > 0
          ? (sectionScore / sectionWeight) * 100
          : 0;

      sections[section] = Math.round(
        normalizedSectionScore
      );

      /*
        CAT 2025 section split:
        VARC 24, DILR 22, QA 22.
      */
      const sectionExamWeight =
        section === "VARC" ? 24 : 22;

      overallScore +=
        normalizedSectionScore * sectionExamWeight;

      overallWeight += sectionExamWeight;
    }
  );

  const readinessIndex =
    overallWeight > 0
      ? Math.round(overallScore / overallWeight)
      : 0;

  /*
    Shows how trustworthy the number is.
    More topic entries and practice questions = more confidence.
  */
  const totalTopics = Object.values(topicCoverage)
    .reduce(
      (count, topics) =>
        count + Object.keys(topics).length,
      0
    );

  const topicConfidence = Math.min(
    topicsWithData / totalTopics,
    1
  );

  const questionConfidence = Math.min(
    questionsAttempted / 1000,
    1
  );

  const confidence = Math.round(
    (topicConfidence * 0.6 +
      questionConfidence * 0.4) *
      100
  );

  return {
    readinessIndex,
    sections,
    confidence,
    topicsWithData,
    totalTopics,
    questionsAttempted,
  };
}