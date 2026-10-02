const test = require('node:test');
const assert = require('node:assert/strict');
const { createGuidedLanguageBank } = require('../src/guided-language-bank');

test('guided language covers all unit/activity/difficulty combinations with real variation', () => {
  const bank = createGuidedLanguageBank();
  assert.equal(new Set(bank.map((question) => question.id)).size, bank.length);
  for (const unitId of ['1', '2', '3', '4']) {
    for (const activityId of ['grammaire', 'conjugaison', 'orthographe']) {
      for (const difficulty of ['remediation', 'consolidation', 'approfondissement']) {
        const questions = bank.filter((question) => question.unitId === unitId && question.activityId === activityId && question.difficulty === difficulty);
        assert.ok(questions.length >= 16, `${unitId}/${activityId}/${difficulty}`);
        assert.equal(new Set(questions.map((question) => question.answer)).size, questions.length, 'Different labels must not inflate the bank with identical answers.');
        assert.equal(new Set(questions.map((question) => question.task.type)).size, 5);
        assert.ok(questions.filter((question) => ['matching', 'choice'].includes(question.task.type)).length >= 10);
      }
    }
  }
});

test('guided language answers remain correct when options are reduced or shuffled', () => {
  const bank = createGuidedLanguageBank();
  const solutions = new Map();
  for (const question of bank) {
    const { task } = question;
    if (question.difficulty === 'remediation') {
      assert.ok(task.example.trim(), `${question.id} needs a worked example`);
      assert.ok(task.hint.trim(), `${question.id} needs a short cue`);
    }
    if (solutions.has(question.contentKey)) assert.equal(question.answer, solutions.get(question.contentKey));
    else solutions.set(question.contentKey, question.answer);
    assert.ok(!question.answer.includes('undefined'));
    if (task.type === 'matching') {
      assert.ok(task.items.length >= 3);
      assert.equal(new Set(task.items.map((item) => item.right)).size, task.items.length, `${question.id}: matching answers must be unique`);
    }
    if (['choice', 'cloze'].includes(task.type)) {
      for (const item of task.items) {
        assert.equal(item.options.length, question.difficulty === 'remediation' ? 2 : 3);
        assert.equal(new Set(item.options).size, item.options.length);
        assert.ok(item.options.every((option) => typeof option === 'string' && option.length > 0));
        assert.ok(Number.isInteger(item.correct) && item.correct >= 0 && item.correct < item.options.length);
        if (task.type === 'cloze') assert.ok(item.stem.includes('____'));
      }
      assert.equal(question.answerLines, 0);
    }
  }
});
