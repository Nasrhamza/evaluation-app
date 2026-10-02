const test = require('node:test');
const assert = require('node:assert/strict');

const { LEVELS, getUnits, getUnit, getActivity, getCriterion } = require('../src/curriculum');
const { QUESTION_BANK_VERSION, createDefaultQuestionBank, normalizeQuestionBank, upgradeQuestionBank } = require('../src/question-bank');

test('prépare les niveaux 4 à 6 et détaille les quatre unités de 6ème année', () => {
  assert.deepEqual(LEVELS.map((level) => level.id), ['4', '5', '6']);
  assert.equal(getUnits('6').length, 4);
  assert.deepEqual(getUnit('6', '3').modules, ['Module 5', 'Module 6']);
  assert.match(getUnit('6', '3').targets.orthographe, /Accord sujet-verbe/);
});

test('adapte les critères à chaque activité', () => {
  assert.deepEqual(getActivity('lecture').criteria.map((criterion) => criterion.id), [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(getActivity('orthographe').criteria.map((criterion) => criterion.id), [4]);
  assert.deepEqual(getActivity('production').criteria.map((criterion) => criterion.id), [1, 2, 3, 4, 5, 6, 7]);
  assert.equal(getCriterion('lecture', 3).label, 'Compréhension du vocabulaire');
  assert.equal(getCriterion('production', 3).label, 'Correction linguistique');
});

test('fournit une banque pédagogique étendue pour les quatre unités', () => {
  const bank = createDefaultQuestionBank();
  assert.ok(bank.length >= 1500);
  assert.equal(new Set(bank.map((item) => item.id)).size, bank.length);
  for (const unitId of ['1', '2', '3', '4']) {
    assert.ok(bank.filter((item) => item.unitId === unitId && item.activityId === 'lecture').length >= 200);
    assert.equal(new Set(bank.filter((item) => item.unitId === unitId && item.activityId === 'lecture').map((item) => item.setId)).size, 8);
    assert.ok(bank.filter((item) => item.unitId === unitId && item.activityId === 'oral').length >= 36);
    for (const activityId of ['grammaire', 'conjugaison', 'orthographe', 'production']) {
      assert.ok(bank.filter((item) => item.unitId === unitId && item.activityId === activityId).length >= 36);
    }
  }
  assert.ok(bank.some((item) => item.difficulty === 'remediation'));
  assert.ok(bank.some((item) => item.difficulty === 'approfondissement'));
  assert.ok(bank.filter((item) => item.activityId === 'lecture').every((item) => item.support.length > 200));
  assert.ok(bank.every((item) => item.task && item.answer && item.prompt));
  assert.ok(bank.filter((item) => item.task.type === 'matching').length >= 200);
  assert.ok(bank.filter((item) => item.task.type === 'choice').length >= 200);
  assert.ok(bank.every((item) => item.visualType === 'none'));
});

test('met à niveau les exercices intégrés tout en conservant les créations personnelles', () => {
  const custom = { id: 'personnel-1', levelId: '6', unitId: '1', activityId: 'lecture', criterionId: 2, title: 'Mon exercice' };
  const upgraded = upgradeQuestionBank([custom], QUESTION_BANK_VERSION - 1);
  assert.equal(upgraded.length, createDefaultQuestionBank().length + 1);
  assert.ok(upgraded.some((item) => item.id === 'personnel-1'));
  assert.ok(upgraded.some((item) => item.activityId === 'lecture' && item.criterionId === 2 && item.task && item.support.length > 200));
});

test('normalise une banque importée et élimine les identifiants dupliqués', () => {
  const bank = normalizeQuestionBank([
    { id: 'x', activityId: 'orthographe', criterionId: 99, title: 'A' },
    { id: 'x', activityId: 'inconnue', criterionId: 99, title: 'B' }
  ]);
  assert.equal(bank.length, 2);
  assert.notEqual(bank[0].id, bank[1].id);
  assert.equal(bank[0].criterionId, 4);
  assert.equal(bank[1].activityId, 'lecture');
});

test('conserve les exercices favoris et permet leur exclusion du générateur', () => {
  const [question] = normalizeQuestionBank([
    { id: 'favori-1', activityId: 'lecture', criterionId: 2, title: 'Exercice favori', favorite: true, active: false }
  ]);
  assert.equal(question.favorite, true);
  assert.equal(question.active, false);
});
