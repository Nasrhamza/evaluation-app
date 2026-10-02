const { QUESTION_BANK_VERSION, normalizeQuestionBank, upgradeQuestionBank } = require('./question-bank');

const STATE_VERSION = 7;
const CRITERIA_IDS = Object.freeze([1, 2, 3, 4, 5, 6, 7]);
const CHANCE_OPTIONS = Object.freeze([3, 6, 9, 12, 15]);
const MASTERY_LEVELS = Object.freeze(['-', '+', '++', '+++']);

function createId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }

  return `student-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function cleanText(value, maxLength = 160) {
  return String(value ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .slice(0, maxLength);
}

function isChanceOption(value) {
  return CHANCE_OPTIONS.includes(Number(value));
}

function normalizeScore(value, chances) {
  const numericValue = Number.parseInt(value, 10);
  const safeValue = Number.isFinite(numericValue) ? numericValue : 0;
  return Math.min(Math.max(safeValue, 0), chances);
}

function masteryFor(score, chances) {
  const safeChances = isChanceOption(chances) ? Number(chances) : CHANCE_OPTIONS[0];
  const safeScore = normalizeScore(score, safeChances);

  if (safeScore === safeChances) return '+++';
  if (safeScore >= Math.ceil(safeChances * 2 / 3)) return '++';
  if (safeScore >= Math.ceil(safeChances / 3)) return '+';
  return '-';
}

function createCriteria() {
  return Object.fromEntries(CRITERIA_IDS.map((id) => [id, {
    chances: CHANCE_OPTIONS[0],
    locked: false
  }]));
}

function createEmptyState() {
  return {
    version: STATE_VERSION,
    metadata: {
      levelId: '6',
      teacherName: '',
      classe: '',
      epreuve: '',
      unitId: '1',
      activityId: 'lecture'
    },
    criteria: createCriteria(),
    students: [],
    homeworkConfig: {
      mode: 'personalized',
      layoutMode: 'comfortable',
      duration: 45,
      exerciseCount: 6,
      commonDifficulty: 'consolidation',
      selectedCriteria: {}
    },
    assignmentPlans: {},
    assignmentHistory: [],
    questionBankVersion: QUESTION_BANK_VERSION,
    questionBank: normalizeQuestionBank()
  };
}

function createStudent(name = '', id = createId()) {
  return {
    id: cleanText(id, 100) || createId(),
    name: cleanText(name),
    scores: Object.fromEntries(CRITERIA_IDS.map((criterion) => [criterion, 0]))
  };
}

function normalizeState(candidate) {
  const normalized = createEmptyState();
  if (!candidate || typeof candidate !== 'object') return normalized;

  const metadata = candidate.metadata && typeof candidate.metadata === 'object'
    ? candidate.metadata
    : {};

  const legacyLevel = cleanText(metadata.niveau).match(/[4-6]/)?.[0];
  normalized.metadata.levelId = /^[4-6]$/.test(String(metadata.levelId))
    ? String(metadata.levelId) : legacyLevel || '6';
  normalized.metadata.unitId = /^\d+$/.test(String(metadata.unitId))
    ? String(metadata.unitId) : cleanText(metadata.unite).match(/\d+/)?.[0] || '1';
  normalized.metadata.activityId = ['oral', 'lecture', 'grammaire', 'conjugaison', 'orthographe', 'production'].includes(metadata.activityId)
    ? metadata.activityId : 'lecture';
  normalized.metadata.classe = cleanText(metadata.classe);
  normalized.metadata.teacherName = cleanText(metadata.teacherName);
  normalized.metadata.epreuve = cleanText(metadata.epreuve);

  for (const criterion of CRITERIA_IDS) {
    const source = candidate.criteria?.[criterion] ?? candidate.criteria?.[String(criterion)];
    const chances = source && isChanceOption(source.chances)
      ? Number(source.chances)
      : CHANCE_OPTIONS[0];
    normalized.criteria[criterion] = {
      chances,
      locked: source?.locked === true
    };
  }

  const seenIds = new Set();
  if (Array.isArray(candidate.students)) {
    normalized.students = candidate.students.map((sourceStudent) => {
      const proposedId = cleanText(sourceStudent?.id, 100);
      const id = proposedId && !seenIds.has(proposedId) ? proposedId : createId();
      seenIds.add(id);

      const student = createStudent(sourceStudent?.name, id);
      for (const criterion of CRITERIA_IDS) {
        student.scores[criterion] = normalizeScore(
          sourceStudent?.scores?.[criterion] ?? sourceStudent?.scores?.[String(criterion)],
          normalized.criteria[criterion].chances
        );
      }
      return student;
    });
  }

  normalized.questionBank = upgradeQuestionBank(candidate.questionBank, candidate.questionBankVersion);
  normalized.questionBankVersion = QUESTION_BANK_VERSION;

  const homeworkConfig = candidate.homeworkConfig && typeof candidate.homeworkConfig === 'object'
    ? candidate.homeworkConfig : {};
  normalized.homeworkConfig = {
    mode: homeworkConfig.mode === 'common' ? 'common' : 'personalized',
    layoutMode: ['compact', 'comfortable', 'large'].includes(homeworkConfig.layoutMode) ? homeworkConfig.layoutMode : 'comfortable',
    duration: Math.min(180, Math.max(10, Number.parseInt(homeworkConfig.duration, 10) || 45)),
    exerciseCount: Math.min(10, Math.max(1, Number.parseInt(homeworkConfig.exerciseCount, 10) || 6)),
    commonDifficulty: ['remediation', 'consolidation', 'approfondissement'].includes(homeworkConfig.commonDifficulty) ? homeworkConfig.commonDifficulty : 'consolidation',
    selectedCriteria: homeworkConfig.selectedCriteria && typeof homeworkConfig.selectedCriteria === 'object'
      ? Object.fromEntries(Object.entries(homeworkConfig.selectedCriteria).map(([activity, ids]) => [activity, Array.isArray(ids) ? ids.map(Number).filter((id) => CRITERIA_IDS.includes(id)) : []]))
      : {}
  };
  normalized.assignmentPlans = candidate.assignmentPlans && typeof candidate.assignmentPlans === 'object'
    ? candidate.assignmentPlans : {};
  normalized.assignmentHistory = Array.isArray(candidate.assignmentHistory)
    ? candidate.assignmentHistory.slice(-1000).map((item) => ({
      id: cleanText(item?.id, 120) || createId(),
      date: cleanText(item?.date, 60),
      studentId: cleanText(item?.studentId, 120),
      studentName: cleanText(item?.studentName),
      context: cleanText(item?.context, 500),
      version: Math.max(1, Number.parseInt(item?.version, 10) || 1),
      format: cleanText(item?.format, 40),
      questionIds: Array.isArray(item?.questionIds) ? item.questionIds.map((id) => cleanText(id, 120)).slice(0, 30) : []
    })) : [];

  return normalized;
}

function migrateLegacyState(legacyData, disabledCriteria = []) {
  if (!legacyData || typeof legacyData !== 'object') return createEmptyState();

  const state = createEmptyState();
  state.metadata = {
    levelId: cleanText(legacyData.niveau).match(/[4-6]/)?.[0] || '6',
    teacherName: cleanText(legacyData.teacherName ?? legacyData.enseignant),
    classe: cleanText(legacyData.classe),
    epreuve: cleanText(legacyData.epreuve),
    unitId: cleanText(legacyData.unite).match(/\d+/)?.[0] || '1',
    activityId: 'lecture'
  };

  const locked = new Set((Array.isArray(disabledCriteria) ? disabledCriteria : []).map(Number));
  for (const criterion of CRITERIA_IDS) {
    const legacyChances = legacyData.chances?.[criterion] ?? legacyData.chances?.[String(criterion)];
    state.criteria[criterion] = {
      chances: isChanceOption(legacyChances) ? Number(legacyChances) : CHANCE_OPTIONS[0],
      locked: locked.has(criterion)
    };
  }

  if (Array.isArray(legacyData.students)) {
    state.students = legacyData.students.map((legacyStudent) => {
      const student = createStudent(legacyStudent?.nomPrenom ?? legacyStudent?.name ?? '');
      for (const criterion of CRITERIA_IDS) {
        const legacyScore = legacyStudent?.criteres?.[criterion]
          ?? legacyStudent?.criteres?.[String(criterion)]
          ?? legacyStudent?.scores?.[criterion];
        student.scores[criterion] = normalizeScore(
          legacyScore,
          state.criteria[criterion].chances
        );
      }
      return student;
    });
  }

  return normalizeState(state);
}

function setCriterionChances(state, criterion, chances) {
  const criterionId = Number(criterion);
  if (!CRITERIA_IDS.includes(criterionId) || !isChanceOption(chances)) return state;

  const safeChances = Number(chances);
  state.criteria[criterionId].chances = safeChances;
  for (const student of state.students) {
    student.scores[criterionId] = normalizeScore(student.scores[criterionId], safeChances);
  }
  return state;
}

function namedStudents(state) {
  return state.students.filter((student) => student.name.trim().length > 0);
}

function criterionStats(state, criterion) {
  const criterionId = Number(criterion);
  const config = state.criteria[criterionId];
  const counts = Object.fromEntries(MASTERY_LEVELS.map((level) => [level, 0]));

  if (!config || config.locked) {
    return { criterion: criterionId, active: false, total: 0, mastered: 0, percentage: 0, counts };
  }

  const students = namedStudents(state);
  for (const student of students) {
    counts[masteryFor(student.scores[criterionId], config.chances)] += 1;
  }

  const mastered = counts['++'] + counts['+++'];
  const percentage = students.length === 0 ? 0 : mastered / students.length * 100;

  return {
    criterion: criterionId,
    active: true,
    total: students.length,
    mastered,
    percentage,
    counts
  };
}

function decisionGroups(state, criteriaIds = CRITERIA_IDS) {
  const result = { remediation: {}, consolidation: {} };
  const students = namedStudents(state);

  for (const criterion of criteriaIds) {
    const config = state.criteria[criterion];
    if (config.locked) continue;

    const remediation = [];
    const consolidation = [];

    for (const student of students) {
      const mastery = masteryFor(student.scores[criterion], config.chances);
      if (mastery === '-' || mastery === '+') {
        remediation.push(student.name.trim());
      } else {
        consolidation.push(student.name.trim());
      }
    }

    result.remediation[`C${criterion}`] = remediation.sort((a, b) => a.localeCompare(b, 'fr'));
    result.consolidation[`C${criterion}`] = consolidation.sort((a, b) => a.localeCompare(b, 'fr'));
  }

  return result;
}

module.exports = {
  STATE_VERSION,
  CRITERIA_IDS,
  CHANCE_OPTIONS,
  MASTERY_LEVELS,
  cleanText,
  normalizeScore,
  masteryFor,
  createEmptyState,
  createStudent,
  normalizeState,
  migrateLegacyState,
  setCriterionChances,
  namedStudents,
  criterionStats,
  decisionGroups
};
