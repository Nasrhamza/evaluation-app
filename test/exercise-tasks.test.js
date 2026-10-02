const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeTask, taskItemsText, taskFromText, scrambledIndices, matchingIndices } = require('../src/exercise-tasks');
const { normalizeQuestion, normalizeQuestionBank, upgradeQuestionBank, createDefaultQuestionBank, QUESTION_BANK_VERSION } = require('../src/question-bank');
const { createExpandedSixthGradeBank } = require('../src/sixth-grade-bank');

test('les éléments guidés survivent à la normalisation et au modèle Word sans JSON', () => {
  for (const task of [
    { type: 'matching', items: [{ left: 'Je', right: 'suis' }, { left: 'Nous', right: 'sommes' }] },
    { type: 'choice', items: [{ stem: 'Nous ____ prêts.', options: ['suis', 'sommes'], correct: 1 }] },
    { type: 'cloze', items: [{ stem: 'Il ____ un vélo.', options: ['a', 'à'], correct: 0 }] },
    { type: 'order', items: [{ parts: ['Il', 'range', 'son sac.'] }] },
    { type: 'short', items: [{ stem: 'Écris une phrase.' }] },
    { type: 'oral', items: [{ stem: 'Lis cette phrase.' }] }
  ]) {
    const question = normalizeQuestion({ id: 'test', task: { ...task, example: 'Un autre exemple.', hint: 'Observe bien.' }, contentKey: 'unique', answerLines: 0 });
    assert.equal(question.answerLines, 0);
    assert.equal(question.contentKey, 'unique');
    assert.deepEqual(taskFromText(task.type, question.task.example, question.task.hint, taskItemsText(question.task)), question.task);
    assert.deepEqual(taskFromText(task.type, question.task.example, question.task.hint, taskItemsText(question.task).replace(/\n/g, ' ;; ')), question.task);
  }
});

test('les mauvaises données de choix ne deviennent pas des questions sans bonne réponse', () => {
  assert.equal(normalizeTask({ type: 'choice', items: [{ stem: 'Test', options: ['A', 'B'], correct: 4 }] }), null);
  assert.throws(() => taskFromText('choice', '', '', 'Test | A | B'));
  assert.throws(() => taskFromText('choice', '', '', 'Test | *A | *B'));
  assert.throws(() => taskFromText('matching', '', '', 'Incomplet'));
});

test('les colonnes à relier sont stables mais aucune paire correcte n’est alignée', () => {
  for (let length = 2; length <= 12; length++) {
    for (let version = 0; version < 20; version++) {
      const order = matchingIndices(length, `test${version}`);
      assert.ok(order.every((value, index) => value !== index));
      assert.equal(new Set(order).size, length);
      assert.deepEqual(order, matchingIndices(length, `test${version}`));
      assert.notDeepEqual(scrambledIndices(length, `test${version}`), Array.from({ length }, (_, index) => index));
    }
  }
});

test('migration : remplace les anciens originaux sans écraser corrections, favoris ou exclusions', () => {
  const old = normalizeQuestionBank(createExpandedSixthGradeBank());
  const originalId = old[0].id;
  old[1].prompt = 'Une consigne personnelle à conserver.';
  old[2].active = false;
  old[3].favorite = true;
  const upgraded = upgradeQuestionBank(old, 3);
  assert.equal(upgraded.length, createDefaultQuestionBank().length + 3);
  assert.ok(!upgraded.some((item) => item.id === originalId));
  assert.equal(upgraded.find((item) => item.id === old[1].id).prompt, old[1].prompt);
  assert.equal(upgraded.find((item) => item.id === old[2].id).active, false);
  assert.equal(upgraded.find((item) => item.id === old[3].id).favorite, true);
  assert.deepEqual(upgradeQuestionBank(upgraded, QUESTION_BANK_VERSION), upgraded);
});

test('toutes les nouvelles tâches conservent leurs éléments après sauvegarde', () => {
  const bank = createDefaultQuestionBank();
  const normalized = normalizeQuestionBank(bank);
  for (let index = 0; index < bank.length; index++) {
    const original = bank[index];
    const after = normalized[index];
    assert.ok(after.task, original.id);
    assert.equal(after.task.items.length, original.task.items.length, original.id);
    assert.deepEqual(taskFromText(after.task.type, after.task.example, after.task.hint, taskItemsText(after.task)), after.task, original.id);
  }
});
