'use strict';

const DIFFICULTIES = new Set(['remediation', 'consolidation', 'approfondissement']);

function text(value) {
  return String(value ?? '').normalize('NFC').replace(/\s+/g, ' ').trim();
}

function compareText(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function hash(value) {
  let result = 2166136261;
  for (const character of String(value)) {
    result ^= character.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  }
  return typeof value === 'string' ? text(value).toLowerCase() : value ?? '';
}

function identity(exercise) {
  const key = text(exercise.contentKey) || JSON.stringify(canonical({
    support: exercise.support,
    prompt: exercise.prompt,
    task: exercise.task ? { type: exercise.task.type, items: exercise.task.items } : null
  }));
  // Reading aloud and fluent reading are separate observed skills, even when
  // they deliberately use the same passage and the same short instruction.
  return exercise.activityId === 'lecture' && [1, 5].includes(Number(exercise.criterionId))
    ? `reading-${exercise.criterionId}:${key}`
    : key;
}

function masteryRank(mastery) {
  return mastery === '+++' ? 3 : mastery === '++' ? 2 : mastery === '+' ? 1 : 0;
}

function difficultyFor(mastery) {
  return mastery === '+++' ? 'approfondissement' : mastery === '++' ? 'consolidation' : 'remediation';
}

function rotate(values, offset) {
  if (!values.length) return values;
  const start = offset % values.length;
  return [...values.slice(start), ...values.slice(0, start)];
}

function taskType(exercise) {
  return text(exercise.task?.type) || 'short';
}

function orderedCandidates(candidates, used, typeCounts, seed, versionIndex, batchSize) {
  const buckets = new Map();
  for (const exercise of candidates) {
    const key = identity(exercise);
    if (used.has(key)) continue;
    const useCount = typeCounts.get(taskType(exercise)) || 0;
    const favorite = exercise.favorite === true ? 1 : 0;
    const bucketKey = `${useCount}:${favorite}`;
    if (!buckets.has(bucketKey)) buckets.set(bucketKey, { useCount, favorite, contents: new Map() });
    const contents = buckets.get(bucketKey).contents;
    if (!contents.has(key)) contents.set(key, []);
    contents.get(key).push(exercise);
  }
  const result = [];
  const emitted = new Set();
  for (const bucket of [...buckets.values()].sort((a, b) => a.useCount - b.useCount || b.favorite - a.favorite)) {
    const keys = [...bucket.contents.keys()].sort((a, b) =>
      hash(`${seed}|${a}`) - hash(`${seed}|${b}`) || compareText(a, b));
    // Move by a worksheet-sized group when the bank is large enough: another
    // version should not simply keep all but one of the previous questions.
    const offset = versionIndex * Math.min(batchSize, Math.max(1, keys.length - 1));
    for (const key of rotate(keys, offset)) {
      if (emitted.has(key)) continue;
      emitted.add(key);
      const variants = bucket.contents.get(key).sort((a, b) =>
        hash(`${seed}|${a.id}`) - hash(`${seed}|${b.id}`) || compareText(text(a.id), text(b.id)));
      result.push(variants[versionIndex % variants.length]);
    }
  }
  return result;
}

// A maximum matching prevents a broadly reusable item from taking the only
// available content of another criterion. This is about coverage, not marks.
function distinctCoverage(infos, candidatesByCriterion, used) {
  const ownerByContent = new Map();
  function place(infoIndex, visited) {
    const info = infos[infoIndex];
    for (const exercise of candidatesByCriterion.get(info.id) || []) {
      const key = identity(exercise);
      if (used.has(key) || visited.has(key)) continue;
      visited.add(key);
      const owner = ownerByContent.get(key);
      if (owner === undefined || place(owner, visited)) {
        ownerByContent.set(key, infoIndex);
        return true;
      }
    }
    return false;
  }
  let result = 0;
  for (let index = 0; index < infos.length; index += 1) {
    if (place(index, new Set())) result += 1;
  }
  return result;
}

function selectFromPool(pool, infos, count, seed, versionIndex) {
  const candidatesByCriterion = new Map(infos.map((info) => [info.id,
    pool.filter((exercise) => Number(exercise.criterionId) === info.id && exercise.difficulty === info.difficulty)
  ]));
  const selected = [];
  const used = new Set();
  const typeCounts = new Map();
  const add = (info, exercise) => {
    used.add(identity(exercise));
    const type = taskType(exercise);
    typeCounts.set(type, (typeCounts.get(type) || 0) + 1);
    selected.push({ criterionId: info.id, mastery: info.mastery, exercise });
  };

  let coverageNeeded = Math.min(count, distinctCoverage(infos, candidatesByCriterion, used));
  for (let index = 0; index < infos.length && coverageNeeded > 0; index += 1) {
    const info = infos[index];
    const candidates = orderedCandidates(candidatesByCriterion.get(info.id), used, typeCounts,
      `${seed}|criterion-${info.id}`, versionIndex, count);
    const exercise = candidates.find((candidate) => {
      const nextUsed = new Set(used);
      nextUsed.add(identity(candidate));
      return 1 + distinctCoverage(infos.slice(index + 1), candidatesByCriterion, nextUsed) >= coverageNeeded;
    });
    if (!exercise) continue;
    add(info, exercise);
    coverageNeeded -= 1;
  }

  // After covering the requested skills, take turns adding genuinely different
  // items. Exhausted criteria are skipped; another difficulty is never used.
  while (selected.length < count) {
    let added = false;
    for (const info of infos) {
      if (selected.length >= count) break;
      const exercise = orderedCandidates(candidatesByCriterion.get(info.id), used, typeCounts,
        `${seed}|criterion-${info.id}`, versionIndex, count)[0];
      if (!exercise) continue;
      add(info, exercise);
      added = true;
    }
    if (!added) break;
  }
  return selected;
}

function readingGroup(exercise) {
  if (text(exercise.setId)) return `set:${text(exercise.setId)}|support:${text(exercise.support).toLowerCase()}`;
  if (text(exercise.support)) return `support:${text(exercise.support).toLowerCase()}`;
  // Unsupported legacy items cannot silently pull unrelated passages together.
  return `standalone:${text(exercise.id) || identity(exercise)}`;
}

function compareReadingPlans(left, right, infos) {
  const leftCriteria = new Set(left.assignments.map((item) => item.criterionId));
  const rightCriteria = new Set(right.assignments.map((item) => item.criterionId));
  if (leftCriteria.size !== rightCriteria.size) return rightCriteria.size - leftCriteria.size;
  for (const info of infos) {
    if (leftCriteria.has(info.id) !== rightCriteria.has(info.id)) return leftCriteria.has(info.id) ? -1 : 1;
  }
  if (left.assignments.length !== right.assignments.length) return right.assignments.length - left.assignments.length;
  return right.assignments.filter((item) => item.exercise.favorite === true).length
    - left.assignments.filter((item) => item.exercise.favorite === true).length;
}

/**
 * Pure, versioned selection: the same inputs produce the same pupil worksheet
 * for preview, PDF, Word and ZIP. Neither export history nor bank order changes
 * a version. An incomplete bank returns fewer tasks, never a mislabeled task.
 */
function selectAssignments({ bank, metadata = {}, criteria, count = 6, version = 1,
  mode = 'personalized', commonDifficulty = 'consolidation', studentId = '', className = '' } = {}) {
  const requestedCount = Number(count);
  const targetCount = Number.isFinite(requestedCount) ? Math.max(0, Math.min(100, Math.floor(requestedCount))) : 6;
  if (!targetCount || !Array.isArray(bank) || !Array.isArray(criteria)) return [];
  const common = mode === 'common';
  const seenCriteria = new Set();
  const infos = criteria.filter((criterion) => {
    const id = Number(criterion?.id);
    if (!Number.isInteger(id) || id < 1 || seenCriteria.has(id) || criterion?.active === false || criterion?.locked === true) return false;
    seenCriteria.add(id);
    return true;
  }).map((criterion) => ({
    id: Number(criterion.id),
    mastery: text(criterion.mastery),
    difficulty: common ? (DIFFICULTIES.has(commonDifficulty) ? commonDifficulty : 'consolidation') : difficultyFor(text(criterion.mastery))
  })).sort((a, b) => (common ? 0 : masteryRank(a.mastery) - masteryRank(b.mastery)) || a.id - b.id);
  if (!infos.length) return [];
  const infoById = new Map(infos.map((info) => [info.id, info]));
  const pool = bank.filter((exercise) => exercise && exercise.active !== false
    && text(exercise.levelId) === text(metadata.levelId)
    && text(exercise.unitId) === text(metadata.unitId)
    && text(exercise.activityId) === text(metadata.activityId)
    && infoById.has(Number(exercise.criterionId))
    && exercise.difficulty === infoById.get(Number(exercise.criterionId)).difficulty);
  if (!pool.length) return [];
  const parsedVersion = Number(version);
  const versionIndex = Number.isFinite(parsedVersion) ? Math.max(0, Math.floor(parsedVersion) - 1) : 0;
  const seed = [metadata.levelId, metadata.unitId, metadata.activityId, common ? 'common' : 'personalized',
    common ? text(className || metadata.classe) : text(studentId)].join('|');
  if (metadata.activityId !== 'lecture') return selectFromPool(pool, infos, targetCount, seed, versionIndex);

  const groups = new Map();
  for (const exercise of pool) {
    const group = readingGroup(exercise);
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(exercise);
  }
  const plans = [...groups.entries()].map(([key, items]) => ({ key,
    assignments: selectFromPool(items, infos, targetCount, `${seed}|${key}`, versionIndex)
  })).sort((a, b) => compareReadingPlans(a, b, infos)
    || hash(`${seed}|${a.key}`) - hash(`${seed}|${b.key}`) || compareText(a.key, b.key));
  const best = plans.filter((plan) => compareReadingPlans(plan, plans[0], infos) === 0);
  return best[versionIndex % best.length].assignments;
}

module.exports = { selectAssignments };
