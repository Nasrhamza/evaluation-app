const TASK_TYPES = Object.freeze({ matching: 'Relier', choice: 'Entourer / choisir', cloze: 'Compléter avec un choix', order: 'Remettre en ordre', short: 'Écrire une réponse courte', oral: 'Dire / lire à voix haute' });
const clean = (value, max = 1200) => String(value ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, max);

function normalizeTask(source) {
  if (!source || !TASK_TYPES[source.type] || !Array.isArray(source.items)) return null;
  const type = source.type;
  const items = source.items.slice(0, 12).map((item) => {
    if (type === 'matching') return { left: clean(item?.left), right: clean(item?.right) };
    if (type === 'order') return { parts: (Array.isArray(item?.parts) ? item.parts : []).slice(0, 12).map((part) => clean(part, 300)).filter(Boolean) };
    if (type === 'choice' || type === 'cloze') {
      const options = (Array.isArray(item?.options) ? item.options : []).slice(0, 6).map((option) => clean(option, 600));
      return { stem: clean(item?.stem), options, correct: Number.isInteger(item?.correct) ? item.correct : -1 };
    }
    return { stem: clean(item?.stem) };
  }).filter((item) => {
    if (type === 'matching') return item.left && item.right;
    if (type === 'order') return item.parts.length >= 2;
    if (type === 'choice' || type === 'cloze') return item.stem && item.options.length >= 2 && item.options.every(Boolean) && item.correct >= 0 && item.correct < item.options.length;
    return Boolean(item.stem);
  });
  return items.length ? { type, example: clean(source.example, 1600), hint: clean(source.hint, 1600), items } : null;
}

function hash(value) {
  let result = 2166136261;
  for (const character of String(value)) result = Math.imul(result ^ character.charCodeAt(0), 16777619);
  return result >>> 0;
}

// Stable across the preview and all exports. No association is printed as a solved pair.
function scrambledIndices(length, seed) {
  const indices = Array.from({ length }, (_, index) => index);
  for (let index = length - 1; index > 0; index -= 1) {
    const other = hash(`${seed}|${index}`) % (index + 1);
    [indices[index], indices[other]] = [indices[other], indices[index]];
  }
  if (length > 1 && indices.every((value, index) => value === index)) indices.push(indices.shift());
  return indices;
}

function matchingIndices(length, seed) {
  const offset = length > 1 ? 1 + hash(seed) % (length - 1) : 0;
  return Array.from({ length }, (_, index) => (index + offset) % length);
}

// Editable plain text, also round-trippable through Word without JSON.
// A leading * identifies the correct option in the TEACHER bank only.
function taskItemsText(task) {
  if (!task) return '';
  const oneLine = (value) => clean(value).replace(/\r?\n/g, ' ⏎ ');
  return task.items.map((item) => {
    if (task.type === 'matching') return `${oneLine(item.left)} | ${oneLine(item.right)}`;
    if (task.type === 'order') return item.parts.map(oneLine).join(' | ');
    if (task.type === 'choice' || task.type === 'cloze') return [item.stem, ...item.options.map((option, index) => `${index === item.correct ? '*' : ''}${option}`)].map(oneLine).join(' | ');
    return oneLine(item.stem);
  }).join('\n');
}

function taskFromText(type, example, hint, text) {
  if (!type) return null;
  const restoreLineBreaks = (value) => value.replace(/\s*⏎\s*/g, '\n');
  const items = String(text || '').split(/\r?\n|\s*;;\s*/).map((line) => line.trim()).filter(Boolean).map((line) => {
    const parts = line.split('|').map((part) => restoreLineBreaks(part.trim()));
    if (type === 'matching') return { left: parts[0], right: parts[1] };
    if (type === 'order') return { parts };
    if (type === 'choice' || type === 'cloze') {
      const [stem, ...options] = parts;
      const marked = options.map((option, index) => option.startsWith('*') ? index : -1).filter((index) => index >= 0);
      return { stem, options: options.map((option) => option.replace(/^\*/, '')), correct: marked.length === 1 ? marked[0] : -1 };
    }
    return { stem: restoreLineBreaks(line) };
  });
  const normalized = normalizeTask({ type, example, hint, items });
  if (!normalized || normalized.items.length !== items.length) throw new Error('Éléments incomplets : une ligne par question ; séparez les colonnes par | et marquez une seule bonne réponse avec *.');
  return normalized;
}

module.exports = { TASK_TYPES, normalizeTask, scrambledIndices, matchingIndices, taskItemsText, taskFromText };
