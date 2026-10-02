const test = require('node:test');
const assert = require('node:assert/strict');

const { createEmptyState, createStudent } = require('../src/domain');
const {
  STORAGE_KEY,
  LEGACY_STORAGE_KEY,
  LEGACY_DISABLED_KEY,
  PREVIOUS_STORAGE_KEY,
  loadEvaluation,
  saveEvaluation
} = require('../src/storage');

function createMemoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    values
  };
}

test('sauvegarde et recharge une évaluation complète', () => {
  const storage = createMemoryStorage();
  const state = createEmptyState();
  state.metadata.classe = 'CM2-B';
  state.criteria[1].chances = 9;
  state.students.push(createStudent('Ilyas', 'student-1'));

  assert.equal(saveEvaluation(state, storage).ok, true);
  const loaded = loadEvaluation(storage);

  assert.equal(loaded.state.metadata.classe, 'CM2-B');
  assert.equal(loaded.state.criteria[1].chances, 9);
  assert.equal(loaded.state.students[0].name, 'Ilyas');
  assert.equal(loaded.migrated, false);
});

test('retombe sur un état propre si la sauvegarde est corrompue', () => {
  const storage = createMemoryStorage({ [STORAGE_KEY]: '{json-invalide' });
  const loaded = loadEvaluation(storage);

  assert.equal(loaded.state.students.length, 0);
  assert.match(loaded.warning, /illisible/);
});

test('détecte et migre automatiquement les anciennes clés', () => {
  const storage = createMemoryStorage({
    [LEGACY_STORAGE_KEY]: JSON.stringify({
      niveau: '5e',
      chances: { 1: 6 },
      students: [{ nomPrenom: 'Sara', criteres: { 1: 4 } }]
    }),
    [LEGACY_DISABLED_KEY]: JSON.stringify(['7'])
  });

  const loaded = loadEvaluation(storage);

  assert.equal(loaded.migrated, true);
  assert.equal(loaded.state.students[0].name, 'Sara');
  assert.equal(loaded.state.criteria[7].locked, true);
});

test('migre automatiquement la sauvegarde de la version 2', () => {
  const storage = createMemoryStorage({
    [PREVIOUS_STORAGE_KEY]: JSON.stringify({
      version: 2,
      metadata: { niveau: '6e', unite: '3', classe: 'B', epreuve: 'Lecture' },
      criteria: {},
      students: []
    })
  });
  const loaded = loadEvaluation(storage);
  assert.equal(loaded.migrated, true);
  assert.equal(loaded.state.metadata.levelId, '6');
  assert.equal(loaded.state.metadata.unitId, '3');
  assert.equal(loaded.state.questionBank.length, require('../src/question-bank').createDefaultQuestionBank().length);
});
