'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { selectAssignments } = require('../src/assignment-selection');

const metadata = { levelId: '6', unitId: '1', activityId: 'conjugaison', classe: '6 A' };

function question(id, overrides = {}) {
  return { id, ...metadata, criterionId: 3, difficulty: 'remediation', active: true,
    contentKey: id, prompt: 'Entoure la bonne réponse.', task: { type: 'choice', items: [{ stem: id, options: ['va', 'vont'], correct: 0 }] },
    ...overrides };
}

function select(bank, overrides = {}) {
  return selectAssignments({ bank, metadata, criteria: [{ id: 3, mastery: '-' }], count: 4,
    studentId: 'pupil-1', version: 1, ...overrides });
}

function ids(assignments) {
  return assignments.map((item) => item.exercise.id);
}

test('filters context, inactive items and requested criteria without any fallback', () => {
  const valid = question('valid');
  const bank = [valid, question('inactive', { active: false }), question('level', { levelId: '5' }),
    question('unit', { unitId: '2' }), question('activity', { activityId: 'grammaire' }),
    question('criterion', { criterionId: 4 }), question('hard', { difficulty: 'approfondissement' })];
  assert.deepEqual(ids(select(bank)), ['valid']);
  assert.deepEqual(select(bank, { criteria: [] }), []);
  assert.deepEqual(select(bank, { criteria: [{ id: 3, mastery: '-', locked: true }] }), []);
  assert.deepEqual(select(bank, { criteria: [{ id: 3, mastery: '-', active: false }] }), []);
  assert.deepEqual(select(bank, { count: 0 }), []);
  assert.deepEqual(select(bank, { metadata: { ...metadata, levelId: '4' } }), []);
});

test('uses exact mastery difficulty, including when the easy bank is empty', () => {
  const bank = ['remediation', 'consolidation', 'approfondissement'].map((difficulty) => question(difficulty, { difficulty }));
  for (const [mastery, difficulty] of [['-', 'remediation'], ['−', 'remediation'], ['+', 'remediation'], ['++', 'consolidation'], ['+++', 'approfondissement']]) {
    assert.deepEqual(ids(select(bank, { criteria: [{ id: 3, mastery }] })), [difficulty]);
  }
  assert.deepEqual(select(bank.slice(1)), []);
  assert.deepEqual(select([question('other', { criterionId: 4 })]), []);
});

test('is stable across calls, bank order and exports; version changes a task when alternatives exist', () => {
  const bank = Array.from({ length: 12 }, (_, index) => question(`item-${index}`));
  const before = ids(select(bank));
  assert.deepEqual(ids(select(bank)), before);
  assert.deepEqual(ids(select([...bank].reverse())), before);
  assert.notDeepEqual(ids(select(bank, { version: 2 })), before);
  assert.equal(ids(select(bank, { version: 2 })).filter((id) => before.includes(id)).length, 0);
  assert.notDeepEqual(ids(select(bank, { version: 1, count: 1 })), ids(select(bank, { version: 2, count: 1 })));
  assert.equal(new Set(select(bank).map((item) => item.exercise.contentKey)).size, 4);
});

test('deduplicates semantic content keys and legacy content hidden behind different ids', () => {
  const bank = [question('first', { contentKey: 'one', task: { type: 'choice' } }),
    question('same-as-matching', { contentKey: 'one', task: { type: 'matching' } }),
    question('new', { contentKey: 'two' })];
  assert.equal(select(bank).length, 2);
  const legacy = question('legacy', { contentKey: '', prompt: '  Relie les mots. ', task: { type: 'matching', items: [{ left: 'je', right: 'vais' }] } });
  assert.equal(select([legacy, { ...legacy, id: 'cloned-series', title: 'Série B', prompt: 'Relie   les mots.' }]).length, 1);
});

test('mixes exercise formats and starts with a favorite without filling the whole sheet with its type', () => {
  const bank = [question('favorite-1', { favorite: true }), question('favorite-2', { favorite: true }),
    question('matching', { task: { type: 'matching' } }), question('cloze', { task: { type: 'cloze' } }),
    question('order', { task: { type: 'order' } })];
  const assignments = select(bank);
  assert.equal(assignments[0].exercise.favorite, true);
  assert.equal(new Set(assignments.map((item) => item.exercise.task.type)).size, 4);
});

test('covers criteria first and gives weak criteria priority when the sheet is short', () => {
  const criteria = [{ id: 1, mastery: '+++' }, { id: 2, mastery: '-' }, { id: 3, mastery: '+' }];
  const bank = criteria.flatMap(({ id, mastery }) => [1, 2, 3].map((index) => question(`c${id}-${index}`, {
    criterionId: id, difficulty: mastery === '+++' ? 'approfondissement' : 'remediation'
  })));
  assert.deepEqual(select(bank, { criteria, count: 2 }).map((item) => item.criterionId), [2, 3]);
  assert.deepEqual(new Set(select(bank, { criteria, count: 6 }).map((item) => item.criterionId)), new Set([1, 2, 3]));
  for (const item of select(bank, { criteria, count: 6 })) assert.equal(item.exercise.criterionId, item.criterionId);
});

test('reserves scarce content so every criterion is covered when a distinct assignment exists', () => {
  const criteria = [{ id: 1, mastery: '-' }, { id: 2, mastery: '-' }, { id: 3, mastery: '-' }];
  const bank = [question('c1-shared', { criterionId: 1, contentKey: 'shared', favorite: true }),
    question('c1-own', { criterionId: 1, contentKey: 'own' }),
    question('c2-only', { criterionId: 2, contentKey: 'shared' }),
    question('c3-only', { criterionId: 3, contentKey: 'third' })];
  const assignments = select(bank, { criteria, count: 3 });
  assert.equal(assignments.length, 3);
  assert.equal(assignments.find((item) => item.criterionId === 1).exercise.id, 'c1-own');
  assert.equal(new Set(assignments.map((item) => item.criterionId)).size, 3);
});

test('common mode produces identical questions regardless of pupil identity or mastery', () => {
  const bank = [1, 2, 3].flatMap((criterionId) => Array.from({ length: 4 }, (_, index) =>
    question(`c${criterionId}-${index}`, { criterionId, difficulty: 'consolidation' })));
  const options = { mode: 'common', commonDifficulty: 'consolidation', count: 5,
    criteria: [{ id: 1, mastery: '+++' }, { id: 2, mastery: '-' }, { id: 3, mastery: '+' }] };
  const first = select(bank, options);
  const second = select(bank, { ...options, studentId: 'other-pupil', criteria: [{ id: 3, mastery: '-' }, { id: 2, mastery: '+++' }, { id: 1, mastery: '-' }] });
  assert.deepEqual(ids(first), ids(second));
  assert.ok(first.every((item) => item.exercise.difficulty === 'consolidation'));
});

function readingBank() {
  return ['A', 'B', 'C'].flatMap((setId) => [1, 2, 3, 4, 5, 6].flatMap((criterionId) =>
    [1, 2].map((variant) => question(`${setId}-c${criterionId}-${variant}`, {
      activityId: 'lecture', criterionId, setId, support: `Un texte cohérent ${setId}.`,
      task: { type: variant === 1 ? 'choice' : 'matching' }
    }))));
}

const readingOptions = { metadata: { ...metadata, activityId: 'lecture' },
  criteria: [1, 2, 3, 4, 5, 6].map((id) => ({ id, mastery: '-' })), count: 9 };

test('reading uses one coherent set and distinct extra tasks, and changes set on a new version', () => {
  const bank = readingBank();
  const assignments = select(bank, readingOptions);
  assert.equal(assignments.length, 9);
  assert.equal(new Set(assignments.map((item) => item.exercise.setId)).size, 1);
  assert.equal(new Set(assignments.map((item) => item.exercise.support)).size, 1);
  assert.equal(new Set(assignments.map((item) => item.criterionId)).size, 6);
  assert.equal(new Set(ids(assignments)).size, 9);
  assert.notEqual(select(bank, { ...readingOptions, version: 2 })[0].exercise.setId, assignments[0].exercise.setId);
  assert.deepEqual(ids(select([...bank].reverse(), readingOptions)), ids(assignments));
});

test('reading prioritizes weaker criteria and never mixes sets to hide missing exact difficulty', () => {
  const bank = [question('A-c1', { activityId: 'lecture', setId: 'A', criterionId: 1, difficulty: 'approfondissement' }),
    question('A-c2', { activityId: 'lecture', setId: 'A', criterionId: 2 }),
    question('B-c3', { activityId: 'lecture', setId: 'B', criterionId: 3 })];
  const options = { ...readingOptions, criteria: [{ id: 1, mastery: '+++' }, { id: 2, mastery: '+' }, { id: 3, mastery: '-' }], count: 1 };
  assert.deepEqual(ids(select(bank, options)), ['B-c3']);
  assert.deepEqual(new Set(select(bank, { ...options, count: 3 }).map((item) => item.exercise.setId)), new Set(['A']));
  const weak = select(bank, { ...readingOptions, criteria: [{ id: 1, mastery: '-' }], count: 1 });
  assert.deepEqual(weak, []);
});

test('voice quality and fluency remain separate reading criteria for the same spoken passage', () => {
  const bank = [1, 5].map((criterionId) => question(`read-${criterionId}`, { activityId: 'lecture',
    criterionId, setId: 'same', contentKey: 'same-passage', prompt: 'Lis ce passage à voix haute.' }));
  const assignments = select(bank, { ...readingOptions, criteria: [{ id: 1, mastery: '-' }, { id: 5, mastery: '-' }], count: 2 });
  assert.equal(assignments.length, 2);
  assert.deepEqual(assignments.map((item) => item.criterionId), [1, 5]);
});

test('a reused set id cannot cause two different reading supports to be mixed', () => {
  const bank = [question('support-a', { activityId: 'lecture', setId: 'reused', criterionId: 2, support: 'Texte A.' }),
    question('support-b', { activityId: 'lecture', setId: 'reused', criterionId: 3, support: 'Texte B.' })];
  const assignments = select(bank, { ...readingOptions, criteria: [{ id: 2, mastery: '-' }, { id: 3, mastery: '-' }], count: 2 });
  assert.equal(assignments.length, 1);
});

test('does not mutate the bank, criteria or metadata supplied by the caller', () => {
  const bank = readingBank();
  const snapshot = JSON.stringify({ bank, readingOptions });
  select(bank, readingOptions);
  assert.equal(JSON.stringify({ bank, readingOptions }), snapshot);
  assert.deepEqual(selectAssignments(), []);
});
