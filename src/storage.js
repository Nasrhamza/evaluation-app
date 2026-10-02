const { createEmptyState, migrateLegacyState, normalizeState } = require('./domain');

const STORAGE_KEY = 'evaluationApp.state.v3';
const PREVIOUS_STORAGE_KEY = 'evaluationApp.state.v2';
const LEGACY_STORAGE_KEY = 'evaluationData';
const LEGACY_DISABLED_KEY = 'disabledCriteria';

function parseStoredJson(storage, key) {
  const value = storage.getItem(key);
  if (!value) return null;
  return JSON.parse(value);
}

function loadEvaluation(storage = globalThis.localStorage) {
  try {
    const current = parseStoredJson(storage, STORAGE_KEY);
    if (current) {
      return { state: normalizeState(current), migrated: false, warning: null };
    }

    const previous = parseStoredJson(storage, PREVIOUS_STORAGE_KEY);
    if (previous) {
      return { state: normalizeState(previous), migrated: true, warning: null };
    }
  } catch (_error) {
    return {
      state: createEmptyState(),
      migrated: false,
      warning: 'La sauvegarde locale était illisible. Une nouvelle évaluation a été créée.'
    };
  }

  try {
    const legacy = parseStoredJson(storage, LEGACY_STORAGE_KEY);
    if (legacy) {
      const disabled = parseStoredJson(storage, LEGACY_DISABLED_KEY) ?? [];
      return {
        state: migrateLegacyState(legacy, disabled),
        migrated: true,
        warning: null
      };
    }
  } catch (_error) {
    return {
      state: createEmptyState(),
      migrated: false,
      warning: 'Les anciennes données étaient illisibles. Une nouvelle évaluation a été créée.'
    };
  }

  return { state: createEmptyState(), migrated: false, warning: null };
}

function saveEvaluation(state, storage = globalThis.localStorage) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(normalizeState(state)));
    return { ok: true, error: null };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Erreur de sauvegarde inconnue.'
    };
  }
}

module.exports = {
  STORAGE_KEY,
  PREVIOUS_STORAGE_KEY,
  LEGACY_STORAGE_KEY,
  LEGACY_DISABLED_KEY,
  loadEvaluation,
  saveEvaluation
};
