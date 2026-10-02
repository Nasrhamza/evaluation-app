const test = require('node:test');
const assert = require('node:assert/strict');

const {
  CRITERIA_IDS,
  masteryFor,
  normalizeScore,
  createEmptyState,
  createStudent,
  setCriterionChances,
  criterionStats,
  decisionGroups,
  migrateLegacyState,
  normalizeState
} = require('../src/domain');

test('calcule les quatre niveaux de maîtrise pour chaque barème', () => {
  for (const chances of [3, 6, 9, 12, 15]) {
    assert.equal(masteryFor(0, chances), '-');
    assert.equal(masteryFor(Math.ceil(chances / 3), chances), '+');
    assert.equal(masteryFor(Math.ceil(chances * 2 / 3), chances), '++');
    assert.equal(masteryFor(chances, chances), '+++');
  }
});

test('normalise la configuration, les brouillons et l’historique des devoirs', () => {
  const normalized = normalizeState({
    homeworkConfig: { mode: 'common', layoutMode: 'large', duration: 95, exerciseCount: 8, commonDifficulty: 'approfondissement', selectedCriteria: { lecture: [1, 3, 99] } },
    assignmentPlans: { 'student-a|6|1|lecture': { version: 3, headerDraft: { teacher: 'Mme Test' } } },
    assignmentHistory: [{ id: 'h1', studentId: 'student-a', studentName: 'Amina', context: '6|1|lecture|common', version: 3, format: 'Word', questionIds: ['q1', 'q2'] }]
  });

  assert.equal(normalized.homeworkConfig.mode, 'common');
  assert.equal(normalized.homeworkConfig.layoutMode, 'large');
  assert.deepEqual(normalized.homeworkConfig.selectedCriteria.lecture, [1, 3]);
  assert.equal(normalized.assignmentPlans['student-a|6|1|lecture'].version, 3);
  assert.deepEqual(normalized.assignmentHistory[0].questionIds, ['q1', 'q2']);
});

test('normalise un score dans les limites du critère', () => {
  assert.equal(normalizeScore(-2, 6), 0);
  assert.equal(normalizeScore('4', 6), 4);
  assert.equal(normalizeScore(20, 6), 6);
  assert.equal(normalizeScore('invalide', 6), 0);
});

test('changer le nombre de chances borne les scores et permet un recalcul exact', () => {
  const state = createEmptyState();
  state.criteria[1].chances = 15;
  const student = createStudent('Amina', 'student-a');
  student.scores[1] = 12;
  state.students.push(student);

  setCriterionChances(state, 1, 6);

  assert.equal(state.criteria[1].chances, 6);
  assert.equal(state.students[0].scores[1], 6);
  assert.equal(masteryFor(state.students[0].scores[1], 6), '+++');
});

test('les statistiques ignorent les lignes sans nom et les critères verrouillés', () => {
  const state = createEmptyState();
  const alice = createStudent('Alice', 'student-a');
  const bob = createStudent('Bob', 'student-b');
  const blank = createStudent('', 'student-empty');
  alice.scores[1] = 2;
  bob.scores[1] = 0;
  blank.scores[1] = 3;
  state.students.push(alice, bob, blank);

  const stats = criterionStats(state, 1);
  assert.equal(stats.total, 2);
  assert.equal(stats.mastered, 1);
  assert.equal(stats.percentage, 50);

  state.criteria[1].locked = true;
  assert.equal(criterionStats(state, 1).active, false);
});

test('construit les groupes par critère actif et conserve les scores verrouillés', () => {
  const state = createEmptyState();
  const alice = createStudent('Alice', 'student-a');
  const bob = createStudent('Bob', 'student-b');
  alice.scores[1] = 1;
  bob.scores[1] = 3;
  state.students.push(alice, bob);
  state.criteria[2].locked = true;
  const scoreBeforeLock = alice.scores[2];

  const groups = decisionGroups(state);

  assert.deepEqual(groups.remediation.C1, ['Alice']);
  assert.deepEqual(groups.consolidation.C1, ['Bob']);
  assert.equal(groups.remediation.C2, undefined);
  assert.equal(alice.scores[2], scoreBeforeLock);
});

test('migre le format de sauvegarde historique', () => {
  const legacy = {
    niveau: '6e',
    classe: 'A',
    epreuve: 'Diagnostic',
    unite: '1',
    chances: { 1: 6 },
    students: [{ nomPrenom: 'Nora', criteres: { 1: 5 } }]
  };

  const migrated = migrateLegacyState(legacy, ['2']);

  assert.equal(migrated.version, 7);
  assert.equal(migrated.metadata.levelId, '6');
  assert.equal(migrated.metadata.unitId, '1');
  assert.equal(migrated.criteria[1].chances, 6);
  assert.equal(migrated.criteria[2].locked, true);
  assert.equal(migrated.students[0].name, 'Nora');
  assert.equal(migrated.students[0].scores[1], 5);
  assert.deepEqual(Object.keys(migrated.students[0].scores).map(Number), CRITERIA_IDS);
  assert.equal(migrated.questionBank.length, require('../src/question-bank').createDefaultQuestionBank().length);
});
