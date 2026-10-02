const mammoth = require('mammoth');
const JSZip = require('jszip');
const {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType
} = require('docx');

const {
  CRITERIA_IDS,
  CHANCE_OPTIONS,
  cleanText,
  normalizeScore,
  masteryFor,
  createStudent,
  normalizeState,
  setCriterionChances,
  namedStudents,
  criterionStats,
  decisionGroups
} = require('./domain');
const { loadEvaluation, saveEvaluation } = require('./storage');
const {
  LEVELS,
  ACTIVITY_DEFINITIONS,
  getLevel,
  getUnits,
  getUnit,
  getActivity,
  getCriterion
} = require('./curriculum');
const { DIFFICULTIES, normalizeQuestion, normalizeQuestionBank } = require('./question-bank');
const { TASK_TYPES, scrambledIndices, matchingIndices, taskItemsText, taskFromText } = require('./exercise-tasks');
const { selectAssignments } = require('./assignment-selection');

const elements = {
  addStudent: document.getElementById('add-student'),
  emptyAddStudent: document.getElementById('empty-add-student'),
  upload: document.getElementById('word-upload'),
  exportWord: document.getElementById('export-word'),
  showStats: document.getElementById('show-stats'),
  showDecision: document.getElementById('show-decision'),
  showBank: document.getElementById('show-bank'),
  showHomeworkBuilder: document.getElementById('show-homework-builder'),
  showHistory: document.getElementById('show-history'),
  backupExport: document.getElementById('backup-export'),
  backupImport: document.getElementById('backup-import'),
  printPortrait: document.getElementById('print-portrait'),
  printLandscape: document.getElementById('print-landscape'),
  printStats: document.getElementById('print-stats'),
  printDecision: document.getElementById('print-decision'),
  printStudentPlan: document.getElementById('print-student-plan'),
  exportStudentWord: document.getElementById('export-student-word'),
  newStudentVersion: document.getElementById('new-student-version'),
  studentVersionLabel: document.getElementById('student-version-label'),
  studentShowCorrection: document.getElementById('student-show-correction'),
  studentPageCount: document.getElementById('student-page-count'),
  resetStudentLayout: document.getElementById('reset-student-layout'),
  tableHead: document.getElementById('student-table-head'),
  tableBody: document.getElementById('student-table-body'),
  tableFoot: document.getElementById('student-table-foot'),
  tableScroll: document.querySelector('.table-scroll'),
  emptyState: document.getElementById('empty-state'),
  studentSummary: document.getElementById('student-summary'),
  teacherName: document.getElementById('teacher-name'),
  saveState: document.getElementById('save-state'),
  printHeader: document.getElementById('print-header'),
  printFooter: document.getElementById('print-footer'),
  statsDialog: document.getElementById('stats-dialog'),
  statsContent: document.getElementById('stats-content'),
  decisionDialog: document.getElementById('decision-dialog'),
  decisionContent: document.getElementById('decision-content'),
  studentPlanDialog: document.getElementById('student-plan-dialog'),
  studentPlanContent: document.getElementById('student-plan-content'),
  levelSelect: document.getElementById('level-select'),
  unitSelect: document.getElementById('unit-select'),
  activitySelect: document.getElementById('activity-select'),
  curriculumContext: document.getElementById('curriculum-context'),
  bankDialog: document.getElementById('bank-dialog'),
  bankSearch: document.getElementById('bank-search'),
  bankLevelFilter: document.getElementById('bank-level-filter'),
  bankUnitFilter: document.getElementById('bank-unit-filter'),
  bankActivityFilter: document.getElementById('bank-activity-filter'),
  bankDifficultyFilter: document.getElementById('bank-difficulty-filter'),
  bankAdd: document.getElementById('bank-add'),
  bankExport: document.getElementById('bank-export'),
  bankImport: document.getElementById('bank-import'),
  bankSummary: document.getElementById('bank-summary'),
  bankList: document.getElementById('bank-list'),
  bankEditor: document.getElementById('bank-editor'),
  bankEditorEmpty: document.getElementById('bank-editor-empty'),
  questionLevel: document.getElementById('question-level'),
  questionUnit: document.getElementById('question-unit'),
  questionActivity: document.getElementById('question-activity'),
  questionCriterion: document.getElementById('question-criterion'),
  questionDifficulty: document.getElementById('question-difficulty'),
  questionModel: document.getElementById('question-model'),
  questionSet: document.getElementById('question-set'),
  questionVisualType: document.getElementById('question-visual-type'),
  questionVisualTitle: document.getElementById('question-visual-title'),
  questionVisualData: document.getElementById('question-visual-data'),
  questionTitle: document.getElementById('question-title'),
  questionIndicator: document.getElementById('question-indicator'),
  questionSupport: document.getElementById('question-support'),
  questionPrompt: document.getElementById('question-prompt'),
  questionTaskType: document.getElementById('question-task-type'),
  questionExample: document.getElementById('question-example'),
  questionHint: document.getElementById('question-hint'),
  questionItems: document.getElementById('question-items'),
  questionAnswerLines: document.getElementById('question-answer-lines'),
  questionAnswer: document.getElementById('question-answer'),
  questionSource: document.getElementById('question-source'),
  questionActive: document.getElementById('question-active'),
  questionFavorite: document.getElementById('question-favorite'),
  questionDuplicate: document.getElementById('question-duplicate'),
  questionDelete: document.getElementById('question-delete'),
  homeworkBuilderDialog: document.getElementById('homework-builder-dialog'),
  homeworkTeacher: document.getElementById('homework-teacher'),
  homeworkMode: document.getElementById('homework-mode'),
  homeworkLayout: document.getElementById('homework-layout'),
  homeworkDuration: document.getElementById('homework-duration'),
  homeworkCount: document.getElementById('homework-count'),
  homeworkCommonDifficulty: document.getElementById('homework-common-difficulty'),
  homeworkCriteria: document.getElementById('homework-criteria'),
  homeworkValidation: document.getElementById('homework-validation'),
  exportClassWord: document.getElementById('export-class-word'),
  exportClassZip: document.getElementById('export-class-zip'),
  exportClassPdf: document.getElementById('export-class-pdf'),
  historyDialog: document.getElementById('history-dialog'),
  historyContent: document.getElementById('history-content'),
  batchPrintDocument: document.getElementById('batch-print-document'),
  toast: document.getElementById('toast')
};

const loadedEvaluation = loadEvaluation();
let state = loadedEvaluation.state;
let toastTimer = null;
let selectedQuestionId = null;
let selectedStudentId = null;
let pdfExportRunning = false;

function createElement(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function masteryClass(mastery) {
  return {
    '-': 'mastery-none',
    '+': 'mastery-developing',
    '++': 'mastery-achieved',
    '+++': 'mastery-excellent'
  }[mastery] ?? 'mastery-na';
}

function notify(message, tone = 'info') {
  window.clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.dataset.tone = tone;
  elements.toast.classList.add('toast-visible');
  toastTimer = window.setTimeout(() => {
    elements.toast.classList.remove('toast-visible');
  }, 4200);
}

function persist() {
  elements.saveState.textContent = 'Enregistrement…';
  const result = saveEvaluation(state);
  if (result.ok) {
    elements.saveState.textContent = 'Données enregistrées localement';
  } else {
    elements.saveState.textContent = 'Échec de l’enregistrement';
    notify(`Impossible d’enregistrer les données : ${result.error}`, 'error');
  }
  return result.ok;
}

function fillSelect(select, options, selectedValue) {
  select.replaceChildren();
  for (const item of options) {
    const option = document.createElement('option');
    option.value = String(item.id);
    option.textContent = item.label;
    option.selected = String(item.id) === String(selectedValue);
    select.append(option);
  }
}

function displayedCriteria() {
  return getActivity(state.metadata.activityId).criteria.map((criterion) => criterion.id);
}

function metadataSummary(separator = ' · ') {
  const parts = [
    `Niveau : ${getLevel(state.metadata.levelId).label}`,
    `Unité : ${getUnit(state.metadata.levelId, state.metadata.unitId).label}`,
    `Activité : ${getActivity(state.metadata.activityId).label}`
  ];
  if (state.metadata.classe.trim()) parts.push(`Classe : ${state.metadata.classe.trim()}`);
  if (state.metadata.epreuve.trim()) parts.push(`Épreuve : ${state.metadata.epreuve.trim()}`);
  if (state.metadata.teacherName.trim()) parts.push(`Enseignant(e) : ${state.metadata.teacherName.trim()}`);
  return parts.join(separator);
}

function renderCurriculumContext() {
  const level = getLevel(state.metadata.levelId);
  const unit = getUnit(state.metadata.levelId, state.metadata.unitId);
  const activity = getActivity(state.metadata.activityId);
  const blocks = [
    ['Base active', `${level.label} · ${unit.label} · ${activity.label}`],
    ['Modules et thèmes', unit.modules.length ? `${unit.modules.join(' + ')} — ${unit.themes.join(' · ')}` : 'Structure prête. Le référentiel détaillé de ce niveau pourra être ajouté sans modifier le moteur.'],
    ['Objectif ciblé', unit.targets[activity.id] || 'Objectif à configurer.']
  ];
  const fragment = document.createDocumentFragment();
  for (const [title, value] of blocks) {
    const block = createElement('div', 'context-block');
    block.append(createElement('strong', '', title), createElement('p', '', value));
    fragment.append(block);
  }
  elements.curriculumContext.replaceChildren(fragment);
}

function updateUnitOptions() {
  const units = getUnits(state.metadata.levelId);
  if (!units.some((unit) => unit.id === state.metadata.unitId)) state.metadata.unitId = units[0].id;
  fillSelect(elements.unitSelect, units, state.metadata.unitId);
}

function renderMetadata() {
  fillSelect(elements.levelSelect, LEVELS.map((level) => ({
    ...level,
    label: level.configured ? level.label : `${level.label} — structure prête`
  })), state.metadata.levelId);
  updateUnitOptions();
  fillSelect(elements.activitySelect, Object.values(ACTIVITY_DEFINITIONS), state.metadata.activityId);

  document.querySelectorAll('[data-meta]').forEach((input) => {
    const key = input.dataset.meta;
    input.value = state.metadata[key] ?? '';
    input.addEventListener('input', () => {
      state.metadata[key] = cleanText(input.value);
      persist();
    });
  });

  elements.levelSelect.addEventListener('change', () => {
    state.metadata.levelId = elements.levelSelect.value;
    state.metadata.unitId = getUnits(state.metadata.levelId)[0].id;
    updateUnitOptions();
    persist();
    renderCurriculumContext();
    renderEvaluation();
    resetTableScroll();
    notify(`Base active : ${getLevel(state.metadata.levelId).label}.`);
  });
  elements.unitSelect.addEventListener('change', () => {
    state.metadata.unitId = elements.unitSelect.value;
    persist();
    renderCurriculumContext();
    resetTableScroll();
    notify(`La banque utilise maintenant ${getUnit(state.metadata.levelId, state.metadata.unitId).label}.`);
  });
  elements.activitySelect.addEventListener('change', () => {
    state.metadata.activityId = elements.activitySelect.value;
    persist();
    renderCurriculumContext();
    renderEvaluation();
    resetTableScroll();
    notify(`Critères adaptés à l’activité « ${getActivity(state.metadata.activityId).label} ».`);
  });
  renderCurriculumContext();
}

function resetTableScroll() {
  requestAnimationFrame(() => {
    elements.tableScroll.scrollTop = 0;
    elements.tableScroll.scrollLeft = 0;
  });
}

function createCriterionControls(criterion) {
  const config = state.criteria[criterion];
  const wrapper = createElement('div', 'criterion-controls no-print');

  const select = document.createElement('select');
  select.className = 'chance-select';
  select.setAttribute('aria-label', `Nombre de chances pour le critère C${criterion}`);
  select.disabled = config.locked;
  for (const chance of CHANCE_OPTIONS) {
    const option = document.createElement('option');
    option.value = String(chance);
    option.textContent = `${chance} chances`;
    option.selected = chance === config.chances;
    select.append(option);
  }
  select.addEventListener('change', () => {
    setCriterionChances(state, criterion, Number(select.value));
    persist();
    renderEvaluation();
    notify(`C${criterion} utilise maintenant ${select.value} chances. Les résultats ont été recalculés.`);
  });

  const lockButton = createElement(
    'button',
    config.locked ? 'lock-button lock-button-active' : 'lock-button',
    config.locked ? 'Verrouillé' : 'Actif'
  );
  lockButton.type = 'button';
  lockButton.setAttribute('aria-pressed', String(config.locked));
  lockButton.setAttribute('aria-label', `${config.locked ? 'Déverrouiller' : 'Verrouiller'} le critère C${criterion}`);
  lockButton.addEventListener('click', () => {
    config.locked = !config.locked;
    persist();
    renderEvaluation();
    notify(
      config.locked
        ? `C${criterion} est verrouillé. Les scores sont conservés.`
        : `C${criterion} est de nouveau actif.`
    );
  });

  wrapper.append(select, lockButton);
  return wrapper;
}

function renderTableHead() {
  const firstRow = document.createElement('tr');
  const secondRow = document.createElement('tr');

  const nameHeader = createElement('th', 'student-name-header', 'Nom et prénom');
  nameHeader.rowSpan = 2;
  nameHeader.scope = 'col';
  firstRow.append(nameHeader);

  for (const criterion of displayedCriteria()) {
    const criterionHeader = document.createElement('th');
    criterionHeader.colSpan = 2;
    criterionHeader.scope = 'colgroup';
    criterionHeader.className = state.criteria[criterion].locked
      ? 'criterion-header criterion-header-locked criterion-print-hidden'
      : 'criterion-header';

    const criterionInfo = getCriterion(state.metadata.activityId, criterion);
    const title = createElement('div', 'criterion-title', `C${criterion}`);
    title.append(createElement('small', '', criterionInfo?.label ?? 'Critère'));
    title.title = criterionInfo?.indicator ?? '';
    criterionHeader.append(title, createCriterionControls(criterion));
    firstRow.append(criterionHeader);

    const scoreHeader = createElement('th', 'sub-header', 'Score');
    scoreHeader.scope = 'col';
    const masteryHeader = createElement('th', 'sub-header', 'Maîtrise');
    masteryHeader.scope = 'col';
    if (state.criteria[criterion].locked) {
      scoreHeader.classList.add('criterion-print-hidden');
      masteryHeader.classList.add('criterion-print-hidden');
    }
    secondRow.append(scoreHeader, masteryHeader);
  }

  const actionHeader = createElement('th', 'actions-cell no-print', 'Actions');
  actionHeader.rowSpan = 2;
  actionHeader.scope = 'col';
  firstRow.append(actionHeader);

  elements.tableHead.replaceChildren(firstRow, secondRow);
}

function updateSummary() {
  const count = namedStudents(state).length;
  elements.studentSummary.textContent = count === 0
    ? 'Aucun élève renseigné'
    : `${count} élève${count > 1 ? 's' : ''} renseigné${count > 1 ? 's' : ''}`;
}

function renderTableRows() {
  const fragment = document.createDocumentFragment();

  for (const student of state.students) {
    const row = document.createElement('tr');
    row.dataset.studentId = student.id;

    const nameCell = document.createElement('td');
    nameCell.className = 'student-name-cell';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.className = 'student-name-input';
    nameInput.value = student.name;
    nameInput.placeholder = 'Nom et prénom';
    nameInput.maxLength = 160;
    nameInput.setAttribute('aria-label', 'Nom et prénom de l’élève');
    const planButton = createElement('button', 'student-plan-button no-print', student.name.trim() || 'Ouvrir la fiche ciblée');
    planButton.type = 'button';
    planButton.title = 'Voir les besoins et les exercices ciblés';
    planButton.setAttribute('aria-label', `Voir la fiche ciblée de ${student.name || 'cet élève'}`);
    planButton.addEventListener('click', () => openStudentPlan(student.id));
    nameInput.addEventListener('input', () => {
      student.name = cleanText(nameInput.value);
      planButton.textContent = student.name.trim() || 'Ouvrir la fiche ciblée';
      planButton.setAttribute('aria-label', `Voir la fiche ciblée de ${student.name || 'cet élève'}`);
      persist();
      renderTableFoot();
      updateSummary();
    });
    nameCell.append(nameInput, planButton);
    row.append(nameCell);

    for (const criterion of displayedCriteria()) {
      const config = state.criteria[criterion];
      const scoreCell = document.createElement('td');
      scoreCell.className = config.locked
        ? 'score-cell criterion-locked criterion-print-hidden'
        : 'score-cell';
      const scoreInput = document.createElement('input');
      scoreInput.type = 'number';
      scoreInput.className = 'score-input';
      scoreInput.min = '0';
      scoreInput.max = String(config.chances);
      scoreInput.step = '1';
      scoreInput.value = String(student.scores[criterion]);
      scoreInput.disabled = config.locked;
      scoreInput.setAttribute('aria-label', `Score de ${student.name || 'l’élève'} pour C${criterion}, sur ${config.chances}`);
      scoreInput.addEventListener('change', () => {
        student.scores[criterion] = normalizeScore(scoreInput.value, config.chances);
        persist();
        renderEvaluation();
      });
      scoreCell.append(scoreInput);

      const masteryCell = document.createElement('td');
      masteryCell.className = config.locked
        ? 'mastery-cell criterion-locked criterion-print-hidden'
        : 'mastery-cell';
      const mastery = config.locked ? '—' : masteryFor(student.scores[criterion], config.chances);
      const badge = createElement('span', `mastery-badge ${config.locked ? 'mastery-na' : masteryClass(mastery)}`, mastery);
      badge.setAttribute('aria-label', config.locked ? `Critère C${criterion} non évalué` : `Maîtrise ${mastery}`);
      masteryCell.append(badge);

      row.append(scoreCell, masteryCell);
    }

    const actionsCell = document.createElement('td');
    actionsCell.className = 'actions-cell no-print';
    const deleteButton = createElement('button', 'delete-button', 'Supprimer');
    deleteButton.type = 'button';
    deleteButton.setAttribute('aria-label', `Supprimer ${student.name || 'cet élève'}`);
    deleteButton.addEventListener('click', () => {
      state.students = state.students.filter((candidate) => candidate.id !== student.id);
      persist();
      renderEvaluation();
      notify('L’élève a été supprimé.', 'warning');
    });
    actionsCell.append(deleteButton);
    row.append(actionsCell);

    fragment.append(row);
  }

  elements.tableBody.replaceChildren(fragment);
}

function statisticTone(percentage) {
  if (percentage > 50) return 'stat-good';
  if (percentage < 50) return 'stat-alert';
  return 'stat-medium';
}

function renderTableFoot() {
  const totalRow = document.createElement('tr');
  const percentageRow = document.createElement('tr');
  totalRow.className = 'summary-row';
  percentageRow.className = 'summary-row';

  const totalLabel = createElement('th', 'summary-label', 'Maîtrise minimale atteinte');
  totalLabel.scope = 'row';
  const percentageLabel = createElement('th', 'summary-label', 'Pourcentage');
  percentageLabel.scope = 'row';
  totalRow.append(totalLabel);
  percentageRow.append(percentageLabel);

  for (const criterion of displayedCriteria()) {
    const stats = criterionStats(state, criterion);
    const totalCell = createElement('td', 'summary-value', stats.active ? String(stats.mastered) : '—');
    totalCell.colSpan = 2;
    const percentageCell = createElement(
      'td',
      stats.active ? `summary-value ${statisticTone(stats.percentage)}` : 'summary-value summary-disabled',
      stats.active ? `${stats.percentage.toFixed(1)} %` : '—'
    );
    percentageCell.colSpan = 2;
    if (!stats.active) {
      totalCell.classList.add('criterion-print-hidden');
      percentageCell.classList.add('criterion-print-hidden');
    }
    totalRow.append(totalCell);
    percentageRow.append(percentageCell);
  }

  totalRow.append(createElement('td', 'actions-cell no-print', ''));
  percentageRow.append(createElement('td', 'actions-cell no-print', ''));
  elements.tableFoot.replaceChildren(totalRow, percentageRow);
}

function renderEvaluation() {
  const criterionCount = displayedCriteria().length;
  const table = elements.tableHead.closest('table');
  table.dataset.criteriaCount = String(criterionCount);
  elements.tableScroll.dataset.criteriaCount = String(criterionCount);
  renderTableHead();
  renderTableRows();
  renderTableFoot();
  updateSummary();
  const empty = state.students.length === 0;
  elements.tableScroll.hidden = empty;
  elements.emptyState.hidden = !empty;
}

function addStudent() {
  const student = createStudent();
  state.students.push(student);
  persist();
  renderEvaluation();
  requestAnimationFrame(() => {
    const input = elements.tableBody.querySelector(`[data-student-id="${student.id}"] .student-name-input`);
    input?.focus();
  });
}

function appendCell(row, text, header = false) {
  const cell = new TableCell({
    children: [new Paragraph({
      alignment: header ? AlignmentType.CENTER : AlignmentType.LEFT,
      children: [new TextRun({ text, bold: header })]
    })]
  });
  row.push(cell);
}

async function exportToDocx() {
  elements.exportWord.disabled = true;
  elements.exportWord.setAttribute('aria-busy', 'true');

  try {
    const headerCells = [];
    appendCell(headerCells, 'Nom et prénom', true);
    for (const criterion of displayedCriteria()) {
      appendCell(headerCells, `C${criterion} — ${getCriterion(state.metadata.activityId, criterion)?.label ?? ''}`, true);
    }

    const rows = [new TableRow({ children: headerCells, tableHeader: true })];
    for (const student of state.students) {
      const cells = [];
      appendCell(cells, student.name.trim() || 'Élève sans nom');
      for (const criterion of displayedCriteria()) {
        const config = state.criteria[criterion];
        const value = config.locked
          ? 'Non évalué'
          : `${student.scores[criterion]}/${config.chances} (${masteryFor(student.scores[criterion], config.chances)})`;
        appendCell(cells, value);
      }
      rows.push(new TableRow({ children: cells }));
    }

    const totalCells = [];
    appendCell(totalCells, 'Maîtrise minimale', true);
    for (const criterion of displayedCriteria()) {
      const stats = criterionStats(state, criterion);
      appendCell(totalCells, stats.active ? `${stats.mastered}/${stats.total} · ${stats.percentage.toFixed(1)} %` : '—');
    }
    rows.push(new TableRow({ children: totalCells }));

    const documentFile = new Document({
      sections: [{
        children: [
          new Paragraph({
            text: 'Tableau récapitulatif des évaluations',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER
          }),
          new Paragraph({ text: metadataSummary(' — '), alignment: AlignmentType.CENTER }),
          new Paragraph({ text: '' }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows
          })
        ]
      }]
    });

    const blob = await Packer.toBlob(documentFile);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const label = [state.metadata.classe, state.metadata.epreuve]
      .filter(Boolean)
      .join('-')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase();
    link.href = url;
    link.download = `evaluation-${label || 'classe'}.docx`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    notify('Le document Word a été généré.');
  } catch (error) {
    console.error(error);
    notify(`Échec de l’export Word : ${error.message}`, 'error');
  } finally {
    elements.exportWord.disabled = false;
    elements.exportWord.removeAttribute('aria-busy');
  }
}

async function importFromWord(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    if (!file.name.toLowerCase().endsWith('.docx')) {
      throw new Error('Sélectionnez un fichier au format .docx.');
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Le document dépasse la taille maximale de 10 Mo.');
    }

    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    const names = result.value
      .split(/\r?\n/)
      .map((name) => cleanText(name.trim()))
      .filter(Boolean);

    if (names.length === 0) throw new Error('Aucun nom n’a été trouvé dans le document.');
    if (names.length > 500) throw new Error('Le document contient plus de 500 lignes.');

    if (state.students.length > 0 && !window.confirm('Remplacer la liste actuelle par les élèves du document Word ?')) {
      return;
    }

    state.students = names.map((name) => createStudent(name));
    persist();
    renderEvaluation();
    notify(`${names.length} élève${names.length > 1 ? 's' : ''} importé${names.length > 1 ? 's' : ''}.`);
  } catch (error) {
    console.error(error);
    notify(error.message || 'Impossible de lire ce document Word.', 'error');
  } finally {
    event.target.value = '';
  }
}

function appendStatsTable(statsList, container) {
  const table = createElement('table', 'report-table');
  const head = document.createElement('thead');
  const headerRow = document.createElement('tr');
  for (const label of ['Critère', '-', '+', '++', '+++', 'Maîtrise minimale']) {
    const cell = createElement('th', '', label);
    cell.scope = 'col';
    headerRow.append(cell);
  }
  head.append(headerRow);

  const body = document.createElement('tbody');
  for (const stats of statsList) {
    const row = document.createElement('tr');
    const values = [
      `C${stats.criterion}`,
      String(stats.counts['-']),
      String(stats.counts['+']),
      String(stats.counts['++']),
      String(stats.counts['+++']),
      `${stats.mastered}/${stats.total} · ${stats.percentage.toFixed(1)} %`
    ];
    values.forEach((value, index) => {
      const cell = createElement(index === 0 ? 'th' : 'td', '', value);
      if (index === 0) cell.scope = 'row';
      row.append(cell);
    });
    body.append(row);
  }
  table.append(head, body);
  container.append(table);
}

function drawStatsChart(canvas, statsList) {
  const context = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const margin = { top: 30, right: 30, bottom: 50, left: 55 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  context.clearRect(0, 0, width, height);
  context.font = '14px system-ui, sans-serif';
  context.strokeStyle = '#cbd5e1';
  context.fillStyle = '#475569';
  context.lineWidth = 1;

  for (let percentage = 0; percentage <= 100; percentage += 25) {
    const y = margin.top + chartHeight - chartHeight * percentage / 100;
    context.beginPath();
    context.moveTo(margin.left, y);
    context.lineTo(width - margin.right, y);
    context.stroke();
    context.fillText(`${percentage} %`, 8, y + 5);
  }

  const slot = chartWidth / Math.max(statsList.length, 1);
  const barWidth = Math.min(72, slot * 0.55);
  statsList.forEach((stats, index) => {
    const x = margin.left + slot * index + (slot - barWidth) / 2;
    const barHeight = chartHeight * stats.percentage / 100;
    const y = margin.top + chartHeight - barHeight;
    context.fillStyle = stats.percentage >= 50 ? '#15803d' : '#dc2626';
    context.fillRect(x, y, barWidth, barHeight);
    context.fillStyle = '#0f172a';
    context.textAlign = 'center';
    context.fillText(`C${stats.criterion}`, x + barWidth / 2, height - 18);
    context.fillText(`${stats.percentage.toFixed(1)} %`, x + barWidth / 2, Math.max(y - 8, 18));
  });
  context.textAlign = 'left';
}

function renderStats() {
  const statsList = displayedCriteria()
    .map((criterion) => criterionStats(state, criterion))
    .filter((stats) => stats.active);
  const content = document.createDocumentFragment();

  const intro = createElement('p', 'report-context', metadataSummary());
  content.append(intro);

  if (statsList.length === 0) {
    content.append(createElement('div', 'notice notice-warning', 'Aucun critère actif. Déverrouillez au moins un critère pour afficher les statistiques.'));
    elements.statsContent.replaceChildren(content);
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.className = 'stats-chart';
  canvas.width = 1000;
  canvas.height = 360;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Pourcentage de maîtrise minimale par critère');
  content.append(canvas);

  const tableContainer = createElement('div', 'report-table-wrapper');
  appendStatsTable(statsList, tableContainer);
  content.append(tableContainer);
  elements.statsContent.replaceChildren(content);
  drawStatsChart(canvas, statsList);
}

function appendGroupColumn(container, title, description, groups, tone) {
  const column = createElement('section', `group-column group-${tone}`);
  const heading = createElement('h3', '', title);
  const note = createElement('p', 'group-note', description);
  column.append(heading, note);

  for (const [criterion, students] of Object.entries(groups)) {
    const block = createElement('div', 'group-block');
    const criterionId = Number(criterion.replace('C', ''));
    const criterionInfo = getCriterion(state.metadata.activityId, criterionId);
    block.append(createElement('h4', '', `${criterion} — ${criterionInfo?.label ?? 'Critère'} · ${students.length} élève${students.length > 1 ? 's' : ''}`));
    if (students.length === 0) {
      block.append(createElement('p', 'muted', 'Aucun élève dans ce groupe.'));
    } else {
      const list = document.createElement('ul');
      list.className = 'student-list';
      for (const student of students) list.append(createElement('li', '', student));
      block.append(list);
    }
    const targetDifficulties = tone === 'remediation'
      ? ['remediation'] : ['consolidation', 'approfondissement'];
    let suggestions = state.questionBank.filter((question) =>
      question.active
      && question.levelId === state.metadata.levelId
      && question.unitId === state.metadata.unitId
      && question.activityId === state.metadata.activityId
      && question.criterionId === criterionId
      && targetDifficulties.includes(question.difficulty)
    ).slice(0, 3);
    if (suggestions.length === 0) {
      suggestions = state.questionBank.filter((question) =>
        question.active
        && question.levelId === state.metadata.levelId
        && question.unitId === state.metadata.unitId
        && question.activityId === state.metadata.activityId
        && targetDifficulties.includes(question.difficulty)
      ).slice(0, 3);
    }
    if (suggestions.length) {
      const suggestion = createElement('div', 'exercise-suggestions');
      suggestion.append(createElement('strong', '', 'Exercices suggérés'));
      const list = document.createElement('ul');
      for (const exercise of suggestions) list.append(createElement('li', '', `${exercise.title} · modèle ${exercise.model}`));
      suggestion.append(list);
      block.append(suggestion);
    }
    column.append(block);
  }
  container.append(column);
}

function exercisesForStudentCriterion(criterionId, mastery, limit = 3) {
  const difficulty = difficultyForMastery(mastery);
  const sameBase = (question) => question.active
    && question.levelId === state.metadata.levelId
    && question.unitId === state.metadata.unitId
    && question.activityId === state.metadata.activityId
    && question.difficulty === difficulty;
  const exact = state.questionBank.filter((question) => sameBase(question) && question.criterionId === criterionId);
  return exact.slice(0, limit);
}

function difficultyForMastery(mastery) {
  return mastery === '+++' ? 'approfondissement' : mastery === '++' ? 'consolidation' : 'remediation';
}

function assignmentOptions(studentId) {
  const key = `${studentId}|${state.metadata.levelId}|${state.metadata.unitId}|${state.metadata.activityId}`;
  const current = state.assignmentPlans[key] && typeof state.assignmentPlans[key] === 'object' ? state.assignmentPlans[key] : {};
  state.assignmentPlans[key] = {
    version: Math.max(1, Number.parseInt(current.version, 10) || 1),
      includeVisuals: false,
    showCorrection: current.showCorrection === true,
    headerDraft: current.headerDraft && typeof current.headerDraft === 'object' ? current.headerDraft : {},
    exerciseDrafts: current.exerciseDrafts && typeof current.exerciseDrafts === 'object' ? current.exerciseDrafts : {}
  };
  return state.assignmentPlans[key];
}

function assignmentHeaderData(student, options) {
  const defaults = {
    school: '................................................',
    title: state.metadata.epreuve.trim() || (state.homeworkConfig.mode === 'common' ? 'Devoir commun' : 'Devoir personnalisé'),
    teacher: state.metadata.teacherName.trim() || '........................................',
    student: student.name.trim() || '................................................',
    className: state.metadata.classe.trim() || '....................',
    date: new Date().toLocaleDateString('fr-FR')
  };
  return { ...defaults, ...options.headerDraft };
}

function exerciseDraftValue(options, exercise, field) {
  return options.exerciseDrafts?.[exercise.id]?.[field] ?? exercise[field] ?? '';
}

function updateExerciseDraft(options, exercise, field, value) {
  if (!options.exerciseDrafts[exercise.id]) options.exerciseDrafts[exercise.id] = {};
  options.exerciseDrafts[exercise.id][field] = cleanText(value, 4000);
}

function answerLineCount(activityId, exercise) {
  if (Number.isInteger(exercise?.answerLines)) return exercise.answerLines;
  const mode = state.homeworkConfig.layoutMode || 'comfortable';
  const counts = {
    compact: { production: 10, oral: 2, lecture: 2, default: 2 },
    comfortable: { production: 16, oral: 3, lecture: 4, default: 3 },
    large: { production: 20, oral: 4, lecture: 5, default: 4 }
  }[mode];
  return counts[activityId] || counts.default;
}

function validateAssignments(assignments) {
  const messages = [];
  if (!assignments.length) messages.push({ tone: 'error', text: 'Aucun exercice disponible pour les critères choisis.' });
  else if (assignments.length < state.homeworkConfig.exerciseCount) messages.push({ tone: 'warning', text: `${assignments.length} exercices disponibles sur ${state.homeworkConfig.exerciseCount} demandés, sans répétition ni changement de critère ou de difficulté.` });
  if (assignments.some(({ exercise }) => !exercise.prompt.trim())) messages.push({ tone: 'error', text: 'Une consigne est vide.' });
  if (state.metadata.activityId === 'lecture' && assignments.length && !assignments[0].exercise.support.trim()) messages.push({ tone: 'error', text: 'Le devoir de lecture n’a pas de texte support.' });
  if (state.homeworkConfig.layoutMode === 'compact' && state.metadata.activityId === 'production') messages.push({ tone: 'warning', text: 'Le mode compact laisse moins d’espace pour la production écrite.' });
  const criterionCount = new Set(assignments.map(({ criterionId }) => criterionId)).size;
  if (!messages.length) messages.push({ tone: 'success', text: `Devoir de remédiation prêt : ${assignments.length} exercice${assignments.length > 1 ? 's' : ''}, ${criterionCount} critère${criterionCount > 1 ? 's' : ''}, espace de réponse vérifié.` });
  return messages;
}

function validationNode(assignments) {
  const box = createElement('div', 'assignment-validation no-print');
  validateAssignments(assignments).forEach((message) => box.append(createElement('p', `validation-${message.tone}`, message.text)));
  return box;
}

function editableText(tag, className, text, onChange) {
  const node = createElement(tag, `${className || ''} editable-preview-field`.trim(), text);
  node.contentEditable = 'true';
  node.spellcheck = true;
  node.title = 'Cliquez pour modifier avant l’export';
  node.addEventListener('input', () => onChange(node.textContent.trim()));
  node.addEventListener('blur', persist);
  return node;
}

function editableIdentityLine(label, value, onChange) {
  const paragraph = createElement('p', '', '');
  paragraph.append(document.createTextNode(`${label} : `), editableText('span', '', value, onChange));
  return paragraph;
}

function taskPresentation(exercise, options) {
  const task = exercise.task;
  if (!task) return null;
  const field = (key, fallback) => ({ key: `task.${key}`, text: options.exerciseDrafts?.[exercise.id]?.[`task.${key}`] ?? fallback });
  const rightOrder = matchingIndices(task.items.length, exercise.id);
  return {
    type: task.type,
    example: field('example', task.example),
    hint: field('hint', task.hint),
    rows: task.items.map((item, index) => {
      if (task.type === 'matching') return { left: field(`items.${index}.left`, item.left), right: field(`items.${rightOrder[index]}.right`, task.items[rightOrder[index]].right) };
      if (task.type === 'order') return { parts: scrambledIndices(item.parts.length, `${exercise.id}|${index}`).map((partIndex) => field(`items.${index}.parts.${partIndex}`, item.parts[partIndex])) };
      const stem = field(`items.${index}.stem`, item.stem);
      return { stem, choices: item.options ? scrambledIndices(item.options.length, `${exercise.id}|${index}`).map((optionIndex) => field(`items.${index}.options.${optionIndex}`, item.options[optionIndex])) : [] };
    })
  };
}

function appendTaskPreview(section, exercise, options, editable = true) {
  const task = taskPresentation(exercise, options);
  if (!task) return;
  const edit = (tag, className, field) => editable ? editableText(tag, className, field.text, (value) => updateExerciseDraft(options, exercise, field.key, value)) : createElement(tag, className, field.text);
  const body = createElement('div', `guided-task task-${task.type}`);
  for (const [label, field, className] of [['Exemple', task.example, 'task-example'], ['Aide', task.hint, 'task-hint']]) {
    if (field.text) {
      const paragraph = createElement('p', className);
      paragraph.append(createElement('strong', '', `${label} : `), edit('span', '', field));
      body.append(paragraph);
    }
  }
  if (task.type === 'matching') {
    const table = createElement('table', 'task-matching');
    table.setAttribute('aria-label', 'Deux colonnes à relier par des flèches');
    const tbody = document.createElement('tbody');
    task.rows.forEach((row) => {
      const tr = document.createElement('tr');
      const left = document.createElement('td');
      left.append(edit('span', '', row.left), createElement('span', 'match-dot', '●'));
      const gap = createElement('td', 'match-gap');
      const right = document.createElement('td');
      right.append(createElement('span', 'match-dot', '●'), edit('span', '', row.right));
      tr.append(left, gap, right);
      tbody.append(tr);
    });
    table.append(tbody);
    body.append(table);
  } else {
    task.rows.forEach((row, index) => {
      const line = createElement('div', 'task-item');
      if (row.stem) {
        const stem = createElement('p', 'task-stem');
        stem.append(document.createTextNode(`${index + 1}. `), edit('span', '', row.stem));
        line.append(stem);
      }
      if (row.parts || row.choices?.length) {
        const choices = createElement('div', 'task-options');
        (row.parts || row.choices).forEach((choice) => choices.append(edit('span', 'task-option', choice)));
        line.append(choices);
      }
      body.append(line);
    });
  }
  section.append(body);
}

function wordTaskBlocks(exercise, options) {
  const task = taskPresentation(exercise, options);
  if (!task) return [];
  const blocks = [];
  for (const [label, field] of [['Exemple', task.example], ['Aide', task.hint]]) {
    if (field.text) blocks.push(new Paragraph({ children: [new TextRun({ text: `${label} : `, bold: true }), new TextRun(field.text)], keepNext: true }));
  }
  if (task.type === 'matching') {
    const border = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
    blocks.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      columnWidths: [3900, 1500, 3900],
      borders: { top: border, bottom: border, left: border, right: border, insideHorizontal: border, insideVertical: border },
      rows: task.rows.map((row, index) => new TableRow({
        cantSplit: true,
        children: [row.left.text + '   ●', '', '●   ' + row.right.text].map((text, cellIndex) => new TableCell({
          width: { size: cellIndex === 1 ? 16 : 42, type: WidthType.PERCENTAGE },
          margins: { top: 150, bottom: 150, left: 50, right: 50 },
          children: [new Paragraph({ text, alignment: cellIndex === 0 ? AlignmentType.RIGHT : AlignmentType.LEFT, keepNext: index < task.rows.length - 1 })]
        }))
      }))
    }));
    blocks.push(new Paragraph({ text: '' }));
  } else {
    task.rows.forEach((row, index) => {
      if (row.stem) blocks.push(new Paragraph({ text: `${index + 1}. ${row.stem.text}`, keepNext: Boolean(row.choices.length) }));
      const choices = row.parts || row.choices;
      if (choices?.length) blocks.push(new Paragraph({
        text: choices.map((choice) => `  ${choice.text}  `).join('     /     '),
        spacing: { after: 220 }, keepLines: true
      }));
    });
  }
  return blocks;
}

function hashString(value) {
  let hash = 2166136261;
  for (const character of String(value)) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededOrder(items, seed) {
  return [...items].sort((left, right) => {
    const favoriteDifference = Number(Boolean(right?.favorite)) - Number(Boolean(left?.favorite));
    return favoriteDifference || hashString(`${seed}|${left.id || left}`) - hashString(`${seed}|${right.id || right}`);
  });
}

function recentlyUsedQuestionIds(studentId) {
  const context = `${state.metadata.levelId}|${state.metadata.unitId}|${state.metadata.activityId}`;
  return new Set(state.assignmentHistory
    .filter((item) => item.studentId === studentId && item.context.startsWith(context))
    .flatMap((item) => item.questionIds));
}

function parseVisualTable(data) {
  return String(data || '').split(/\r?\n/).map((line) => line.split('|').map((cell) => cell.trim())).filter((row) => row.some(Boolean));
}

function buildVisualNode(exercise) {
  if (!exercise?.visualType || exercise.visualType === 'none') return null;
  const figure = createElement('figure', `exercise-visual visual-${exercise.visualType}`);
  if (exercise.visualTitle) figure.append(createElement('figcaption', '', exercise.visualTitle));
  if (exercise.visualType === 'table') {
    const rows = parseVisualTable(exercise.visualData);
    const table = document.createElement('table');
    rows.forEach((row, rowIndex) => {
      const tr = document.createElement('tr');
      row.forEach((value) => tr.append(createElement(rowIndex === 0 ? 'th' : 'td', '', value)));
      table.append(tr);
    });
    figure.append(table);
    return figure;
  }
  const labels = String(exercise.visualData || 'Observer|Réfléchir|Répondre').split('|').slice(0, 4);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${labels.length * 180} 145`);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', exercise.visualTitle || 'Illustration pédagogique');
  labels.forEach((label, index) => {
    const x = index * 180 + 10;
    const rect = document.createElementNS(svg.namespaceURI, 'rect');
    rect.setAttribute('x', x); rect.setAttribute('y', '12'); rect.setAttribute('width', '145'); rect.setAttribute('height', '105'); rect.setAttribute('rx', '14');
    rect.setAttribute('fill', index % 2 ? '#e8f3ff' : '#eef8f1'); rect.setAttribute('stroke', '#4776b9');
    const circle = document.createElementNS(svg.namespaceURI, 'circle');
    circle.setAttribute('cx', x + 72); circle.setAttribute('cy', '48'); circle.setAttribute('r', '20'); circle.setAttribute('fill', index % 2 ? '#2f6fed' : '#1e8e54');
    const number = document.createElementNS(svg.namespaceURI, 'text');
    number.setAttribute('x', x + 72); number.setAttribute('y', '55'); number.setAttribute('text-anchor', 'middle'); number.setAttribute('fill', 'white'); number.setAttribute('font-size', '20'); number.setAttribute('font-weight', '700'); number.textContent = String(index + 1);
    const textNode = document.createElementNS(svg.namespaceURI, 'text');
    textNode.setAttribute('x', x + 72); textNode.setAttribute('y', '92'); textNode.setAttribute('text-anchor', 'middle'); textNode.setAttribute('fill', '#17345c'); textNode.setAttribute('font-size', '13'); textNode.setAttribute('font-weight', '700'); textNode.textContent = label.slice(0, 20);
    svg.append(rect, circle, number, textNode);
    if (index < labels.length - 1) {
      const arrow = document.createElementNS(svg.namespaceURI, 'text');
      arrow.setAttribute('x', x + 161); arrow.setAttribute('y', '69'); arrow.setAttribute('font-size', '24'); arrow.setAttribute('fill', '#667085'); arrow.textContent = '→'; svg.append(arrow);
    }
  });
  figure.append(svg);
  return figure;
}

function appendExerciseDetails(container, exercises) {
  if (exercises.length === 0) {
    container.append(createElement('p', 'notice notice-warning', 'Aucun exercice prêt pour cette base. Ajoutez le guide ou créez un exercice dans la banque.'));
    return;
  }
  const list = createElement('div', 'student-exercise-list');
  for (const exercise of exercises) {
    const details = document.createElement('details');
    details.className = 'student-exercise';
    const summary = createElement('summary', '', `${exercise.title} · modèle ${exercise.model}`);
    if (exercise.support) {
      details.append(summary, createElement('strong', '', 'Texte / support'), createElement('p', 'exercise-support', exercise.support));
    } else {
      details.append(summary);
    }
    const promptLabel = createElement('strong', '', 'Consigne');
    const prompt = createElement('p', '', exercise.prompt || 'Consigne à compléter.');
    const answerLabel = createElement('strong', 'answer-label', 'Correction / réponse attendue');
    const answer = createElement('p', 'exercise-answer', exercise.answer || 'Correction à compléter.');
    details.append(promptLabel, prompt);
    appendTaskPreview(details, exercise, { exerciseDrafts: {} }, false);
    details.append(answerLabel, answer);
    list.append(details);
  }
  container.append(list);
}

function renderStudentPlan(student) {
  const activity = getActivity(state.metadata.activityId);
  const unit = getUnit(state.metadata.levelId, state.metadata.unitId);
  const content = document.createDocumentFragment();
  const screen = createElement('div', 'student-plan-screen');
  const heading = createElement('div', 'student-plan-heading');
  heading.append(
    createElement('div', 'student-avatar', (student.name.trim()[0] || '?').toUpperCase()),
    createElement('div', '', student.name.trim() || 'Élève sans nom')
  );
  const context = createElement('p', 'report-context', `${getLevel(state.metadata.levelId).label} · ${unit.label} · ${activity.label}`);
  screen.append(heading, context);

  const activeCriteria = displayedCriteria().filter((criterionId) => !state.criteria[criterionId].locked);
  if (activeCriteria.length === 0) {
    screen.append(createElement('div', 'notice notice-warning', 'Aucun critère actif pour calculer le parcours de cet élève.'));
    elements.studentPlanContent.replaceChildren(screen);
    return;
  }

  const cards = createElement('div', 'student-plan-grid');
  let remediationCount = 0;
  for (const criterionId of activeCriteria) {
    const criterion = getCriterion(state.metadata.activityId, criterionId);
    const config = state.criteria[criterionId];
    const score = student.scores[criterionId];
    const mastery = masteryFor(score, config.chances);
    const needsRemediation = mastery === '-' || mastery === '+';
    if (needsRemediation) remediationCount += 1;
    const workLabel = mastery === '+++'
      ? 'Approfondissement'
      : mastery === '++' ? 'Consolidation' : 'Remédiation ciblée';
    const card = createElement('section', `student-need-card ${needsRemediation ? 'need-remediation' : 'need-consolidation'}`);
    const cardHeader = createElement('div', 'student-need-header');
    const titles = createElement('div');
    titles.append(
      createElement('span', 'criterion-code', `C${criterionId}`),
      createElement('h3', '', criterion?.label ?? 'Critère')
    );
    const badge = createElement('span', `mastery-badge ${masteryClass(mastery)}`, mastery);
    cardHeader.append(titles, badge);
    card.append(
      cardHeader,
      createElement('p', 'criterion-indicator', criterion?.indicator ?? ''),
      createElement('p', 'student-diagnosis', `${score}/${config.chances} · ${workLabel}`),
      createElement('h4', '', `Exercices prêts — ${workLabel}`)
    );
    appendExerciseDetails(card, exercisesForStudentCriterion(criterionId, mastery));
    cards.append(card);
  }
  const summary = createElement(
    'div',
    remediationCount ? 'student-plan-summary summary-remediation' : 'student-plan-summary summary-success',
    remediationCount
      ? `${remediationCount} critère${remediationCount > 1 ? 's' : ''} à renforcer. Les exercices de remédiation sont affichés en priorité.`
      : 'Les critères actifs sont acquis. Le parcours propose consolidation et approfondissement.'
  );
  screen.append(summary, cards);
  const options = assignmentOptions(student.id);
  const assignments = studentAssignments(student, options.version);
  const previewHeading = createElement('div', 'preview-heading no-print');
  previewHeading.append(
    createElement('h3', '', 'Aperçu du devoir prêt à imprimer'),
    createElement('p', '', 'Cliquez directement sur les zones encadrées pour modifier le devoir. Le Word et le PDF reprendront ces changements.')
  );
  content.append(screen, validationNode(assignments), previewHeading, buildStudentPrintDocument(student, assignments, options));
  elements.studentPlanContent.replaceChildren(content);
  elements.studentVersionLabel.textContent = `Version ${options.version}`;
  elements.studentShowCorrection.checked = options.showCorrection;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const preview = elements.studentPlanContent.querySelector('.student-preview-document');
    if (!preview || !preview.clientWidth) return;
    const printableHeight = preview.clientWidth * 297 / 210;
    const pageCount = Math.max(1, Math.ceil(preview.scrollHeight / printableHeight));
    elements.studentPageCount.textContent = `${pageCount} page${pageCount > 1 ? 's' : ''}`;
  }));
}

function openStudentPlan(studentId) {
  const student = state.students.find((candidate) => candidate.id === studentId);
  if (!student) return;
  selectedStudentId = studentId;
  renderStudentPlan(student);
  openDialog(elements.studentPlanDialog);
}

function studentAssignments(student, version = 1) {
  const activityId = state.metadata.activityId;
  const configuredCriteria = state.homeworkConfig.selectedCriteria?.[activityId];
  const activeCriteria = displayedCriteria().filter((criterionId) =>
    !state.criteria[criterionId].locked
    && (!Array.isArray(configuredCriteria) || configuredCriteria.includes(criterionId))
  );
  return selectAssignments({
    bank: state.questionBank,
    metadata: state.metadata,
    criteria: activeCriteria.map((id) => ({ id, mastery: masteryFor(student.scores[id], state.criteria[id].chances) })),
    count: state.homeworkConfig.exerciseCount,
    version,
    mode: state.homeworkConfig.mode,
    commonDifficulty: state.homeworkConfig.commonDifficulty,
    studentId: student.id,
    className: state.metadata.classe
  });
}

function buildStudentPrintDocument(student, assignments, options) {
  const container = createElement('article', `student-print-document student-preview-document layout-${state.homeworkConfig.layoutMode || 'comfortable'}`);
  const headerData = assignmentHeaderData(student, options);
  const header = createElement('header', 'worksheet-header');
  const decorativeHeader = document.createElement('img');
  decorativeHeader.className = 'worksheet-decorative-header';
  decorativeHeader.src = 'assets/premier-trimestre-header.png';
  decorativeHeader.alt = 'Premier Trimestre';
  decorativeHeader.decoding = 'sync';
  const country = createElement('p', 'worksheet-country', 'République Tunisienne · École : ');
  country.append(editableText('span', '', headerData.school, (value) => { options.headerDraft.school = value; }));
  header.append(decorativeHeader, country, editableText('h1', '', headerData.title, (value) => { options.headerDraft.title = value; }));
  const identity = createElement('div', 'worksheet-identities');
  identity.append(
    editableIdentityLine('Enseignant(e)', headerData.teacher, (value) => { options.headerDraft.teacher = value; }),
    editableIdentityLine('Élève', headerData.student, (value) => { options.headerDraft.student = value; }),
    editableIdentityLine('Classe', headerData.className, (value) => { options.headerDraft.className = value; }),
    editableIdentityLine('Date', headerData.date, (value) => { options.headerDraft.date = value; }),
    createElement('p', '', `${getLevel(state.metadata.levelId).label} · ${getUnit(state.metadata.levelId, state.metadata.unitId).label} · ${getActivity(state.metadata.activityId).label}`),
    createElement('p', 'worksheet-version', `Version ${options.version} · Durée : ${state.homeworkConfig.duration} min`)
  );
  header.append(identity);
  const scoreStrip = createElement('div', 'worksheet-score-strip');
  const masteryScale = createElement('div', 'worksheet-mastery-scale');
  masteryScale.append(createElement('strong', '', 'Niveau de maîtrise :'));
  for (const level of ['−', '+', '++', '+++']) masteryScale.append(createElement('span', '', `☐ ${level}`));
  scoreStrip.append(masteryScale, createElement('span', '', 'Appréciation : ................................................................................'));
  header.append(scoreStrip);
  container.append(header);
  let printedSupportKey = null;
  assignments.forEach(({ criterionId, exercise }, index) => {
    const section = createElement('section', 'print-exercise-block');
    section.dataset.exerciseId = exercise.id;
    const supportKey = exercise.setId || exercise.id;
    if (exercise.support && supportKey !== printedSupportKey) {
      const support = createElement('section', 'worksheet-support');
      support.append(
        editableText('h2', '', `Support — ${exerciseDraftValue(options, exercise, 'title').replace(/\s—\sC\d+$/, '')}`, (value) => updateExerciseDraft(options, exercise, 'title', value.replace(/^Support\s*—\s*/i, ''))),
        editableText('p', 'print-support', exerciseDraftValue(options, exercise, 'support'), (value) => updateExerciseDraft(options, exercise, 'support', value))
      );
      if (options.includeVisuals) {
        const visual = buildVisualNode(exercise);
        if (visual) support.append(visual);
      }
      container.append(support);
      printedSupportKey = supportKey;
    }
    const criterion = getCriterion(state.metadata.activityId, criterionId);
    section.append(editableText('h2', '', `Exercice ${index + 1} — C${criterionId} · ${criterion?.label || 'Critère'} — ${exerciseDraftValue(options, exercise, 'title').replace(/\s—\sC\d+$/, '').replace(/^Support\s*—\s*/i, '')}`, (value) => updateExerciseDraft(options, exercise, 'title', value.replace(new RegExp(`^Exercice\\s+${index + 1}\\s*—\\s*C${criterionId}\\s*·\\s*[^—]+—\\s*`, 'i'), ''))));
    section.append(editableText('p', 'exercise-instruction', exerciseDraftValue(options, exercise, 'prompt'), (value) => updateExerciseDraft(options, exercise, 'prompt', value)));
    appendTaskPreview(section, exercise, options);
    if (!exercise.support && options.includeVisuals) {
      const visual = buildVisualNode(exercise);
      if (visual) section.append(visual);
    }
    const lineCount = answerLineCount(state.metadata.activityId, exercise);
    for (let line = 0; line < lineCount; line += 1) section.append(createElement('div', 'answer-line', ''));
    container.append(section);
  });
  const correction = createElement('section', `print-correction${options.showCorrection ? '' : ' correction-hidden'}`);
  correction.append(createElement('h1', '', 'Corrigé enseignant'));
  assignments.forEach(({ criterionId, exercise }, index) => {
    correction.append(
      createElement('h2', '', `Exercice ${index + 1} — C${criterionId}`),
      editableText('p', '', exerciseDraftValue(options, exercise, 'answer') || 'Correction à compléter par l’enseignant.', (value) => updateExerciseDraft(options, exercise, 'answer', value))
    );
  });
  container.append(correction);
  container.append(createElement(
    'footer',
    'worksheet-footer',
    `${getLevel(state.metadata.levelId).label} · ${getUnit(state.metadata.levelId, state.metadata.unitId).label} · ${getActivity(state.metadata.activityId).label} · Version ${options.version}`
  ));
  return container;
}

function safeFileLabel(value) {
  return String(value || 'eleve').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();
}

function visualPngBytes(exercise) {
  const labels = String(exercise.visualData || 'Observer|Réfléchir|Répondre').split('|').slice(0, 4);
  const canvas = document.createElement('canvas');
  canvas.width = 900; canvas.height = 230;
  const context = canvas.getContext('2d');
  context.fillStyle = '#ffffff'; context.fillRect(0, 0, canvas.width, canvas.height);
  context.font = 'bold 24px Arial'; context.fillStyle = '#17345c'; context.fillText(exercise.visualTitle || 'Support illustré', 24, 34);
  const width = 190; const gap = 24;
  labels.forEach((label, index) => {
    const x = 24 + index * (width + gap);
    context.fillStyle = index % 2 ? '#e8f3ff' : '#eef8f1'; context.strokeStyle = '#4776b9'; context.lineWidth = 3;
    context.beginPath(); context.roundRect(x, 58, width, 135, 16); context.fill(); context.stroke();
    context.fillStyle = index % 2 ? '#2f6fed' : '#1e8e54'; context.beginPath(); context.arc(x + 95, 103, 28, 0, Math.PI * 2); context.fill();
    context.fillStyle = '#ffffff'; context.font = 'bold 26px Arial'; context.textAlign = 'center'; context.fillText(String(index + 1), x + 95, 112);
    context.fillStyle = '#17345c'; context.font = 'bold 18px Arial'; context.fillText(label.slice(0, 20), x + 95, 163);
  });
  const base64 = canvas.toDataURL('image/png').split(',')[1];
  return Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
}

function wordVisualBlocks(exercise) {
  if (exercise.visualType === 'table') {
    const rows = parseVisualTable(exercise.visualData);
    return [
      new Paragraph({ children: [new TextRun({ text: exercise.visualTitle || 'Tableau', bold: true })] }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: rows.map((row, rowIndex) => new TableRow({ children: row.map((cell) => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: cell, bold: rowIndex === 0 })] })] })) }))
      })
    ];
  }
  if (exercise.visualType === 'image') {
    return [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new ImageRun({ data: visualPngBytes(exercise), transformation: { width: 600, height: 153 }, type: 'png' })]
    })];
  }
  return [];
}

function wordFontSize() {
  return { compact: 22, comfortable: 26, large: 30 }[state.homeworkConfig.layoutMode] || 26;
}

function wordDocument(children) {
  return new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Arial', size: wordFontSize() },
          paragraph: { spacing: { after: 100, line: state.homeworkConfig.layoutMode === 'large' ? 330 : 285 } }
        }
      }
    },
    sections: [{ properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 900, bottom: 900, left: 900, right: 900 } } }, children }]
  });
}

function wordChildrenForStudent(student, assignments, options, pageBreakBefore = false) {
  const headerData = assignmentHeaderData(student, options);
  const children = [
      new Paragraph({ text: `République Tunisienne · École : ${headerData.school}`, alignment: AlignmentType.CENTER, pageBreakBefore }),
      new Paragraph({ children: [new TextRun({ text: headerData.title, bold: true, size: wordFontSize() + 8 })], alignment: AlignmentType.CENTER }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({ children: [
            new TableCell({ children: [new Paragraph({ text: `Enseignant(e) : ${headerData.teacher}` })] }),
            new TableCell({ children: [new Paragraph({ text: `Élève : ${headerData.student}` })] })
          ] }),
          new TableRow({ children: [
            new TableCell({ children: [new Paragraph({ text: `Classe : ${headerData.className}` })] }),
            new TableCell({ children: [new Paragraph({ text: `Date : ${headerData.date} · Version ${options.version}` })] })
          ] })
        ]
      }),
      new Paragraph({ text: `${getLevel(state.metadata.levelId).label} — ${getUnit(state.metadata.levelId, state.metadata.unitId).label} — ${getActivity(state.metadata.activityId).label}`, alignment: AlignmentType.CENTER }),
      new Paragraph({ text: `Durée : ${state.homeworkConfig.duration} min` }),
      new Paragraph({ text: 'Niveau de maîtrise :  ☐ −   ☐ +   ☐ ++   ☐ +++' }),
      new Paragraph({ text: 'Appréciation : ........................................................................................................' }),
      new Paragraph({ text: '' })
    ];
    let printedSupportKey = null;
    assignments.forEach(({ criterionId, exercise }, index) => {
      const supportKey = exercise.setId || exercise.id;
      if (exercise.support && supportKey !== printedSupportKey) {
        children.push(
          new Paragraph({ text: `Support — ${exerciseDraftValue(options, exercise, 'title').replace(/\s—\sC\d+$/, '').replace(/^Support\s*—\s*/i, '')}`, heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: exerciseDraftValue(options, exercise, 'support') })
        );
        if (options.includeVisuals) children.push(...wordVisualBlocks(exercise));
        printedSupportKey = supportKey;
      }
      children.push(new Paragraph({
        children: [new TextRun({
          text: `Exercice ${index + 1} — C${criterionId} · ${getCriterion(state.metadata.activityId, criterionId)?.label || 'Critère'} — ${exerciseDraftValue(options, exercise, 'title').replace(/\s—\sC\d+$/, '').replace(/^Support\s*—\s*/i, '')}`,
          bold: true,
          size: wordFontSize() + 2
        })],
        keepNext: true
      }));
      const wordLineCount = answerLineCount(state.metadata.activityId, exercise);
      children.push(
        new Paragraph({ text: exerciseDraftValue(options, exercise, 'prompt'), keepNext: true }),
        ...wordTaskBlocks(exercise, options),
        ...Array.from({ length: wordLineCount }, (_value, lineIndex) => new Paragraph({
          text: '................................................................................................................',
          keepLines: true,
          keepNext: lineIndex < wordLineCount - 1
        }))
      );
      if (!exercise.support && options.includeVisuals) children.push(...wordVisualBlocks(exercise));
    });
    if (options.showCorrection) {
      children.push(new Paragraph({ text: 'Corrigé enseignant', heading: HeadingLevel.TITLE, pageBreakBefore: true }));
      assignments.forEach(({ criterionId, exercise }, index) => {
        children.push(
          new Paragraph({ text: `Exercice ${index + 1} — C${criterionId}`, heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: exerciseDraftValue(options, exercise, 'answer') || 'Correction à compléter par l’enseignant.' })
        );
      });
    }
    children.push(new Paragraph({ text: `${getLevel(state.metadata.levelId).label} · Unité ${state.metadata.unitId} · ${getActivity(state.metadata.activityId).label} · Version ${options.version}`, alignment: AlignmentType.CENTER }));
    return children;
}

function assignmentContext() {
  return `${state.metadata.levelId}|${state.metadata.unitId}|${state.metadata.activityId}|${state.homeworkConfig.mode}`;
}

function recordAssignmentExport(student, assignments, options, format) {
  state.assignmentHistory.push({
    id: globalThis.crypto?.randomUUID?.() || `history-${Date.now()}-${student.id}`,
    date: new Date().toISOString(),
    studentId: student.id,
    studentName: student.name,
    context: assignmentContext(),
    version: options.version,
    format,
    questionIds: assignments.map(({ exercise }) => exercise.id)
  });
  state.assignmentHistory = state.assignmentHistory.slice(-1000);
  persist();
}

async function exportStudentPlanWord() {
  const student = state.students.find((candidate) => candidate.id === selectedStudentId);
  if (!student) return;
  const options = assignmentOptions(student.id);
  const assignments = studentAssignments(student, options.version);
  if (assignments.length === 0) {
    notify('Aucun exercice prêt à exporter pour cette base.', 'warning');
    return;
  }
  elements.exportStudentWord.disabled = true;
  try {
    const documentFile = wordDocument(wordChildrenForStudent(student, assignments, options));
    const filename = `devoir-${safeFileLabel(student.name)}-${state.metadata.levelId}e-u${state.metadata.unitId}-${state.metadata.activityId}-v${options.version}.docx`;
    downloadBlob(await Packer.toBlob(documentFile), filename);
    recordAssignmentExport(student, assignments, options, 'Word individuel');
    notify('Le devoir Word a été généré avec ses critères de maîtrise et ses espaces de réponse.');
  } catch (error) {
    notify(`Export Word impossible : ${error.message}`, 'error');
  } finally {
    elements.exportStudentWord.disabled = false;
  }
}

function renderDecision() {
  const groups = decisionGroups(state, displayedCriteria());
  const activeCount = Object.keys(groups.remediation).length;
  const content = document.createDocumentFragment();
  content.append(createElement('p', 'report-context', metadataSummary()));

  if (activeCount === 0) {
    content.append(createElement('div', 'notice notice-warning', 'Aucun critère actif. Déverrouillez au moins un critère.'));
    elements.decisionContent.replaceChildren(content);
    return;
  }

  const grid = createElement('div', 'decision-grid');
  appendGroupColumn(grid, 'Remédiation', 'Élèves ayant obtenu − ou +', groups.remediation, 'remediation');
  appendGroupColumn(grid, 'Consolidation', 'Élèves ayant obtenu ++ ou +++', groups.consolidation, 'consolidation');
  content.append(grid);
  elements.decisionContent.replaceChildren(content);
}

function updateBankUnitFilter() {
  const levelId = elements.bankLevelFilter.value || state.metadata.levelId;
  const options = [{ id: '', label: 'Toutes les unités' }, ...getUnits(levelId)];
  const previous = elements.bankUnitFilter.value;
  fillSelect(elements.bankUnitFilter, options, previous);
}

function initializeBankFilters() {
  fillSelect(elements.bankLevelFilter, [{ id: '', label: 'Tous les niveaux' }, ...LEVELS], state.metadata.levelId);
  updateBankUnitFilter();
  elements.bankUnitFilter.value = state.metadata.unitId;
  fillSelect(elements.bankActivityFilter, [{ id: '', label: 'Toutes les activités' }, ...Object.values(ACTIVITY_DEFINITIONS)], state.metadata.activityId);
  fillSelect(elements.bankDifficultyFilter, [{ id: '', label: 'Tous les niveaux de travail' }, ...DIFFICULTIES], '');
}

function filteredQuestions() {
  const search = elements.bankSearch.value.trim().toLocaleLowerCase('fr');
  return state.questionBank.filter((question) => {
    if (elements.bankLevelFilter.value && question.levelId !== elements.bankLevelFilter.value) return false;
    if (elements.bankUnitFilter.value && question.unitId !== elements.bankUnitFilter.value) return false;
    if (elements.bankActivityFilter.value && question.activityId !== elements.bankActivityFilter.value) return false;
    if (elements.bankDifficultyFilter.value && question.difficulty !== elements.bankDifficultyFilter.value) return false;
    if (!search) return true;
    return [question.title, question.prompt, question.answer, question.indicator, question.source]
      .join(' ').toLocaleLowerCase('fr').includes(search);
  });
}

function renderBankList() {
  const questions = filteredQuestions();
  const active = questions.filter((question) => question.active).length;
  elements.bankSummary.textContent = `${questions.length} exercice${questions.length > 1 ? 's' : ''} affiché${questions.length > 1 ? 's' : ''} · ${active} actif${active > 1 ? 's' : ''} · ${state.questionBank.length} au total`;
  const fragment = document.createDocumentFragment();
  for (const question of questions) {
    const card = createElement('button', `question-card${question.id === selectedQuestionId ? ' question-card-selected' : ''}${question.active ? '' : ' question-card-inactive'}`);
    card.type = 'button';
    const tags = createElement('div', 'question-tags');
    const activity = getActivity(question.activityId);
    const difficulty = DIFFICULTIES.find((item) => item.id === question.difficulty)?.label ?? question.difficulty;
    for (const tag of [`${getLevel(question.levelId).label} · U${question.unitId}`, activity.label, `C${question.criterionId}`, difficulty, `Modèle ${question.model}`]) {
      tags.append(createElement('span', 'question-tag', tag));
    }
    if (question.favorite) tags.prepend(createElement('span', 'question-tag question-favorite-tag', '★ Favori'));
    if (!question.active) tags.append(createElement('span', 'question-tag question-excluded-tag', 'Exclu du générateur'));
    card.append(tags, createElement('h4', '', question.title), createElement('p', '', question.prompt || 'Aucune consigne'));
    card.addEventListener('click', () => openQuestionEditor(question.id));
    fragment.append(card);
  }
  if (questions.length === 0) fragment.append(createElement('div', 'bank-empty-list', 'Aucun exercice ne correspond à ces filtres.'));
  elements.bankList.replaceChildren(fragment);
}

function updateQuestionUnitOptions(preferredValue) {
  const units = getUnits(elements.questionLevel.value);
  fillSelect(elements.questionUnit, units, preferredValue || units[0].id);
}

function updateQuestionCriteria(preferredValue, replaceIndicator = false) {
  const activity = getActivity(elements.questionActivity.value);
  fillSelect(elements.questionCriterion, activity.criteria.map((criterion) => ({
    id: criterion.id,
    label: `C${criterion.id} — ${criterion.label}`
  })), preferredValue || activity.criteria[0].id);
  if (replaceIndicator) {
    elements.questionIndicator.value = getCriterion(elements.questionActivity.value, elements.questionCriterion.value)?.indicator ?? '';
  }
}

function openQuestionEditor(questionId) {
  const question = state.questionBank.find((item) => item.id === questionId);
  if (!question) return;
  selectedQuestionId = question.id;
  elements.bankEditor.hidden = false;
  elements.bankEditorEmpty.hidden = true;
  fillSelect(elements.questionLevel, LEVELS, question.levelId);
  updateQuestionUnitOptions(question.unitId);
  fillSelect(elements.questionActivity, Object.values(ACTIVITY_DEFINITIONS), question.activityId);
  updateQuestionCriteria(question.criterionId);
  fillSelect(elements.questionDifficulty, DIFFICULTIES, question.difficulty);
  elements.questionModel.value = question.model;
  elements.questionSet.value = question.setId;
  elements.questionVisualType.value = question.visualType;
  elements.questionVisualTitle.value = question.visualTitle;
  elements.questionVisualData.value = question.visualData;
  elements.questionTitle.value = question.title;
  elements.questionIndicator.value = question.indicator;
  elements.questionSupport.value = question.support;
  elements.questionPrompt.value = question.prompt;
  elements.questionTaskType.value = question.task?.type || '';
  elements.questionExample.value = question.task?.example || '';
  elements.questionHint.value = question.task?.hint || '';
  elements.questionItems.value = taskItemsText(question.task);
  elements.questionAnswerLines.value = question.answerLines ?? '';
  elements.questionAnswer.value = question.answer;
  elements.questionSource.value = question.source;
  elements.questionActive.checked = question.active;
  elements.questionFavorite.checked = question.favorite;
  renderBankList();
}

function createQuestion() {
  const activity = getActivity(state.metadata.activityId);
  const id = globalThis.crypto?.randomUUID?.() || `question-${Date.now()}`;
  const question = normalizeQuestion({
    id,
    levelId: state.metadata.levelId,
    unitId: state.metadata.unitId,
    activityId: state.metadata.activityId,
    criterionId: activity.criteria[0].id,
    indicator: activity.criteria[0].indicator,
    title: 'Nouvel exercice',
    difficulty: 'consolidation',
    model: 'A',
    source: 'Création personnalisée'
  }, id);
  state.questionBank.unshift(question);
  persist();
  initializeBankFilters();
  openQuestionEditor(question.id);
  elements.questionTitle.focus();
}

function saveQuestion(event) {
  event.preventDefault();
  const index = state.questionBank.findIndex((question) => question.id === selectedQuestionId);
  if (index < 0) return;
  const current = state.questionBank[index];
  let task;
  try {
    task = taskFromText(elements.questionTaskType.value, elements.questionExample.value, elements.questionHint.value, elements.questionItems.value);
  } catch (error) {
    notify(error.message, 'error');
    return;
  }
  state.questionBank[index] = normalizeQuestion({
    ...current,
    levelId: elements.questionLevel.value,
    unitId: elements.questionUnit.value,
    activityId: elements.questionActivity.value,
    criterionId: Number(elements.questionCriterion.value),
    difficulty: elements.questionDifficulty.value,
    model: elements.questionModel.value,
    setId: elements.questionSet.value,
    title: elements.questionTitle.value,
    indicator: elements.questionIndicator.value,
    support: elements.questionSupport.value,
    prompt: elements.questionPrompt.value,
    task,
    answerLines: elements.questionAnswerLines.value === '' ? null : Number(elements.questionAnswerLines.value),
    answer: elements.questionAnswer.value,
    visualType: elements.questionVisualType.value,
    visualTitle: elements.questionVisualTitle.value,
    visualData: elements.questionVisualData.value,
    source: elements.questionSource.value,
    active: elements.questionActive.checked,
    favorite: elements.questionFavorite.checked
  }, current.id);
  persist();
  renderBankList();
  notify('L’exercice a été enregistré.');
}

function duplicateQuestion() {
  const source = state.questionBank.find((question) => question.id === selectedQuestionId);
  if (!source) return;
  const id = globalThis.crypto?.randomUUID?.() || `question-${Date.now()}`;
  const copy = normalizeQuestion({ ...source, id, title: `${source.title} — copie`, model: `${source.model} bis` }, id);
  state.questionBank.unshift(copy);
  persist();
  openQuestionEditor(copy.id);
  notify('Une copie entièrement modifiable a été créée.');
}

function deleteQuestion() {
  const question = state.questionBank.find((item) => item.id === selectedQuestionId);
  if (!question || !window.confirm(`Supprimer définitivement « ${question.title} » de la banque ?`)) return;
  state.questionBank = state.questionBank.filter((item) => item.id !== selectedQuestionId);
  selectedQuestionId = null;
  elements.bankEditor.hidden = true;
  elements.bankEditorEmpty.hidden = false;
  persist();
  renderBankList();
  notify('L’exercice a été supprimé.', 'warning');
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function keyValueRow(label, value) {
  const cells = [];
  appendCell(cells, label, true);
  appendCell(cells, String(value ?? ''));
  return new TableRow({ children: cells });
}

async function exportQuestionBank() {
  elements.bankExport.disabled = true;
  try {
    const children = [
      new Paragraph({ text: 'Banque d’exercices — modèle importable', heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER }),
      new Paragraph({ text: 'Un tableau correspond à un exercice. Vous pouvez modifier les valeurs ou dupliquer un tableau complet, puis réimporter ce document dans le logiciel.' })
    ];
    for (const question of state.questionBank) {
      children.push(
        new Paragraph({ text: `${question.title} — ${question.id}`, heading: HeadingLevel.HEADING_2 }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            keyValueRow('Identifiant', question.id),
            keyValueRow('Niveau', question.levelId),
            keyValueRow('Unité', question.unitId),
            keyValueRow('Activité', question.activityId),
            keyValueRow('Critère', question.criterionId),
            keyValueRow('Difficulté', question.difficulty),
            keyValueRow('Modèle', question.model),
            keyValueRow('Série', question.setId),
            keyValueRow('Titre', question.title),
            keyValueRow('Indicateur', question.indicator),
            keyValueRow('Support', question.support),
            keyValueRow('Consigne', question.prompt),
            keyValueRow('Forme', question.task?.type || ''),
            keyValueRow('Exemple', question.task?.example || ''),
            keyValueRow('Aide', question.task?.hint || ''),
            keyValueRow('Éléments', taskItemsText(question.task).replace(/\n/g, ' ;; ')),
            keyValueRow('Lignes de réponse', question.answerLines ?? ''),
            keyValueRow('Clé de contenu', question.contentKey || ''),
            keyValueRow('Correction', question.answer),
            keyValueRow('Type visuel', question.visualType),
            keyValueRow('Titre visuel', question.visualTitle),
            keyValueRow('Données visuelles', question.visualData),
            keyValueRow('Source', question.source),
            keyValueRow('Favori', question.favorite ? 'oui' : 'non'),
            keyValueRow('Actif', question.active ? 'oui' : 'non')
          ]
        }),
        new Paragraph({ text: '' })
      );
    }
    const documentFile = new Document({ sections: [{ children }] });
    downloadBlob(await Packer.toBlob(documentFile), `banque-exercices-${new Date().toISOString().slice(0, 10)}.docx`);
    notify('La banque Word modifiable a été générée.');
  } catch (error) {
    notify(`Export Word impossible : ${error.message}`, 'error');
  } finally {
    elements.bankExport.disabled = false;
  }
}

function normalizeHeader(value) {
  return String(value ?? '').trim().toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function questionsFromWordHtml(html) {
  const documentFile = new DOMParser().parseFromString(html, 'text/html');
  const questions = [];
  for (const [index, table] of [...documentFile.querySelectorAll('table')].entries()) {
    const data = {};
    const rows = [...table.querySelectorAll('tr')];
    if (rows[0]?.querySelectorAll('td,th').length > 2) {
      const headers = [...rows[0].querySelectorAll('td,th')].map((cell) => normalizeHeader(cell.textContent));
      for (const row of rows.slice(1)) {
        const values = [...row.querySelectorAll('td,th')].map((cell) => cell.textContent.trim());
        if (values.length !== headers.length) continue;
        const record = Object.fromEntries(headers.map((header, cellIndex) => [header, values[cellIndex]]));
        questions.push(record);
      }
      continue;
    }
    for (const row of rows) {
      const cells = row.querySelectorAll('td,th');
      if (cells.length >= 2) data[normalizeHeader(cells[0].textContent)] = cells[1].textContent.trim();
    }
    if (data.titre || data.consigne) questions.push(data);
  }
  return questions.map((data, index) => {
    const id = data.identifiant || globalThis.crypto?.randomUUID?.() || `word-${Date.now()}-${index}`;
    const activityValue = normalizeHeader(data.activite);
    const activityId = Object.values(ACTIVITY_DEFINITIONS).find((activity) =>
      normalizeHeader(activity.id) === activityValue || normalizeHeader(activity.label) === activityValue
    )?.id || activityValue;
    const difficultyValue = normalizeHeader(data.difficulte);
    const difficultyId = DIFFICULTIES.find((difficulty) =>
      normalizeHeader(difficulty.id) === difficultyValue || normalizeHeader(difficulty.label) === difficultyValue
    )?.id || difficultyValue;
    return normalizeQuestion({
      id,
      levelId: data.niveau,
      unitId: data.unite,
      activityId,
      criterionId: Number(String(data.critere || '').replace(/\D/g, '')),
      difficulty: difficultyId,
      model: data.modele,
      setId: data.serie,
      title: data.titre,
      indicator: data.indicateur,
      support: data.support,
      prompt: data.consigne,
      task: taskFromText(data.forme, data.exemple, data.aide, data.elements),
      answerLines: data['lignes de reponse'] ? Number(data['lignes de reponse']) : null,
      contentKey: data['cle de contenu'],
      answer: data.correction,
      visualType: normalizeHeader(data['type visuel']),
      visualTitle: data['titre visuel'],
      visualData: data['donnees visuelles'],
      source: data.source || 'Import Word',
      favorite: ['oui', 'true', '1'].includes(normalizeHeader(data.favori)),
      active: !['non', 'false', '0'].includes(normalizeHeader(data.actif))
    }, id);
  });
}

async function importQuestionBank(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    if (!file.name.toLowerCase().endsWith('.docx')) throw new Error('Sélectionnez un fichier Word .docx.');
    if (file.size > 20 * 1024 * 1024) throw new Error('Le fichier dépasse 20 Mo.');
    const converted = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
    const questions = questionsFromWordHtml(converted.value);
    if (questions.length === 0) throw new Error('Aucun tableau d’exercice valide n’a été trouvé. Exportez d’abord le modèle Word de la banque.');
    const normalized = normalizeQuestionBank(questions);
    if (!window.confirm(`Remplacer la banque actuelle par les ${normalized.length} exercices importés ?`)) return;
    state.questionBank = normalized;
    selectedQuestionId = null;
    persist();
    renderBankList();
    elements.bankEditor.hidden = true;
    elements.bankEditorEmpty.hidden = false;
    notify(`${normalized.length} exercices Word ont été importés.`);
  } catch (error) {
    notify(error.message || 'Import impossible.', 'error');
  } finally {
    event.target.value = '';
  }
}

function renderHomeworkCriteria() {
  const activityId = state.metadata.activityId;
  const configured = state.homeworkConfig.selectedCriteria[activityId];
  const selected = Array.isArray(configured) ? configured : displayedCriteria().filter((id) => !state.criteria[id].locked);
  const fragment = document.createDocumentFragment();
  for (const criterionId of displayedCriteria()) {
    const criterion = getCriterion(activityId, criterionId);
    const label = createElement('label', state.criteria[criterionId].locked ? 'builder-criterion criterion-disabled' : 'builder-criterion');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = String(criterionId);
    checkbox.checked = selected.includes(criterionId) && !state.criteria[criterionId].locked;
    checkbox.disabled = state.criteria[criterionId].locked;
    label.append(checkbox, document.createTextNode(` C${criterionId} — ${criterion.label}${checkbox.disabled ? ' (désactivé)' : ''}`));
    fragment.append(label);
  }
  elements.homeworkCriteria.replaceChildren(fragment);
}

function classStudents() {
  return namedStudents(state);
}

function assignmentsForClass() {
  const students = classStudents();
  const commonVersion = students.length ? assignmentOptions(students[0].id).version : 1;
  return students.map((student) => {
    const originalOptions = assignmentOptions(student.id);
    const version = state.homeworkConfig.mode === 'common' ? commonVersion : originalOptions.version;
    const options = {
      ...originalOptions,
      version,
      headerDraft: {
        ...originalOptions.headerDraft,
        teacher: state.metadata.teacherName.trim() || originalOptions.headerDraft.teacher || '........................................',
        student: student.name.trim()
      }
    };
    return { student, options, assignments: studentAssignments(student, options.version) };
  });
}

function renderBuilderValidation() {
  const plans = assignmentsForClass();
  const messages = plans.length ? validateAssignments(plans[0].assignments) : [{ tone: 'error', text: 'Ajoutez au moins un élève nommé avant l’export.' }];
  const fragment = document.createDocumentFragment();
  fragment.append(createElement('strong', '', `${plans.length} élève${plans.length > 1 ? 's' : ''} · ${state.homeworkConfig.mode === 'common' ? 'devoir commun' : 'parcours personnalisés'} · mise en page ${state.homeworkConfig.layoutMode}`));
  messages.forEach((message) => fragment.append(createElement('p', `validation-${message.tone}`, message.text)));
  elements.homeworkValidation.replaceChildren(fragment);
}

function syncHomeworkBuilder() {
  elements.homeworkTeacher.value = state.metadata.teacherName;
  elements.homeworkMode.value = state.homeworkConfig.mode;
  elements.homeworkLayout.value = state.homeworkConfig.layoutMode;
  elements.homeworkDuration.value = String(state.homeworkConfig.duration);
  elements.homeworkCount.value = String(state.homeworkConfig.exerciseCount);
  elements.homeworkCommonDifficulty.value = state.homeworkConfig.commonDifficulty;
  elements.homeworkCommonDifficulty.disabled = state.homeworkConfig.mode !== 'common';
  renderHomeworkCriteria();
  renderBuilderValidation();
}

function saveHomeworkBuilder() {
  state.metadata.teacherName = cleanText(elements.homeworkTeacher.value);
  elements.teacherName.value = state.metadata.teacherName;
  state.homeworkConfig.mode = elements.homeworkMode.value === 'common' ? 'common' : 'personalized';
  state.homeworkConfig.layoutMode = ['compact', 'comfortable', 'large'].includes(elements.homeworkLayout.value) ? elements.homeworkLayout.value : 'comfortable';
  state.homeworkConfig.duration = Math.min(180, Math.max(10, Number.parseInt(elements.homeworkDuration.value, 10) || 45));
  state.homeworkConfig.exerciseCount = Math.min(10, Math.max(1, Number.parseInt(elements.homeworkCount.value, 10) || 6));
  state.homeworkConfig.commonDifficulty = ['remediation', 'consolidation', 'approfondissement'].includes(elements.homeworkCommonDifficulty.value) ? elements.homeworkCommonDifficulty.value : 'consolidation';
  state.homeworkConfig.selectedCriteria[state.metadata.activityId] = [...elements.homeworkCriteria.querySelectorAll('input:checked')].map((input) => Number(input.value));
  elements.homeworkDuration.value = String(state.homeworkConfig.duration);
  elements.homeworkCount.value = String(state.homeworkConfig.exerciseCount);
  elements.homeworkCommonDifficulty.disabled = state.homeworkConfig.mode !== 'common';
  persist();
  renderBuilderValidation();
  const student = state.students.find((candidate) => candidate.id === selectedStudentId);
  if (student && elements.studentPlanDialog.open) renderStudentPlan(student);
}

function plansAreExportable(plans) {
  if (!plans.length) {
    notify('Ajoutez au moins un élève nommé avant l’export.', 'warning');
    return false;
  }
  if (plans.some((plan) => validateAssignments(plan.assignments).some((message) => message.tone === 'error'))) {
    notify('Export bloqué : corrigez les erreurs indiquées dans la validation.', 'error');
    return false;
  }
  return true;
}

function setClassExportDisabled(disabled) {
  for (const button of [elements.exportClassWord, elements.exportClassZip, elements.exportClassPdf]) button.disabled = disabled;
}

async function exportClassWord() {
  const plans = assignmentsForClass();
  if (!plansAreExportable(plans)) return;
  setClassExportDisabled(true);
  try {
    const children = plans.flatMap((plan, index) => wordChildrenForStudent(plan.student, plan.assignments, plan.options, index > 0));
    downloadBlob(await Packer.toBlob(wordDocument(children)), `devoirs-classe-${safeFileLabel(state.metadata.classe || '6e')}-u${state.metadata.unitId}-${state.metadata.activityId}.docx`);
    plans.forEach((plan) => recordAssignmentExport(plan.student, plan.assignments, plan.options, 'Word groupé'));
    notify(`${plans.length} devoirs ont été regroupés dans un seul Word.`);
  } catch (error) {
    notify(`Export Word groupé impossible : ${error.message}`, 'error');
  } finally {
    setClassExportDisabled(false);
  }
}

async function exportClassZip() {
  const plans = assignmentsForClass();
  if (!plansAreExportable(plans)) return;
  setClassExportDisabled(true);
  try {
    const zip = new JSZip();
    for (const [index, plan] of plans.entries()) {
      const blob = await Packer.toBlob(wordDocument(wordChildrenForStudent(plan.student, plan.assignments, plan.options)));
      zip.file(`${String(index + 1).padStart(2, '0')}-devoir-${safeFileLabel(plan.student.name)}-v${plan.options.version}.docx`, await blob.arrayBuffer());
    }
    downloadBlob(await zip.generateAsync({ type: 'blob' }), `devoirs-word-individuels-${safeFileLabel(state.metadata.classe || '6e')}.zip`);
    plans.forEach((plan) => recordAssignmentExport(plan.student, plan.assignments, plan.options, 'ZIP Word individuel'));
    notify(`${plans.length} fichiers Word individuels ont été préparés dans un ZIP.`);
  } catch (error) {
    notify(`Création du ZIP impossible : ${error.message}`, 'error');
  } finally {
    setClassExportDisabled(false);
  }
}

function renderBatchPrint(plans) {
  const fragment = document.createDocumentFragment();
  plans.forEach((plan) => {
    const wrapper = createElement('div', 'batch-student');
    wrapper.append(buildStudentPrintDocument(plan.student, plan.assignments, plan.options));
    fragment.append(wrapper);
  });
  elements.batchPrintDocument.replaceChildren(fragment);
}

async function exportClassPdf() {
  const plans = assignmentsForClass();
  if (!plansAreExportable(plans) || pdfExportRunning) return;
  renderBatchPrint(plans);
  pdfExportRunning = true;
  setClassExportDisabled(true);
  document.body.classList.add('printing-batch');
  try {
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const filename = `devoirs-classe-${safeFileLabel(state.metadata.classe || '6e')}-u${state.metadata.unitId}-${state.metadata.activityId}.pdf`;
    if (window.evaluationAPI?.exportPDF) {
      const result = await window.evaluationAPI.exportPDF({ landscape: false, defaultName: filename });
      if (result.ok) {
        plans.forEach((plan) => recordAssignmentExport(plan.student, plan.assignments, plan.options, 'PDF groupé'));
        notify(`${plans.length} devoirs ont été regroupés dans un PDF A4.`);
      } else if (!result.canceled) notify(`Création PDF impossible : ${result.error}`, 'error');
    } else {
      window.print();
    }
  } finally {
    document.body.classList.remove('printing-batch');
    pdfExportRunning = false;
    setClassExportDisabled(false);
  }
}

function renderHistory() {
  if (!state.assignmentHistory.length) {
    elements.historyContent.replaceChildren(createElement('div', 'notice notice-warning', 'Aucun devoir exporté pour le moment.'));
    return;
  }
  const table = createElement('table', 'history-table');
  const head = document.createElement('thead');
  const row = document.createElement('tr');
  ['Date', 'Élève', 'Base pédagogique', 'Version', 'Format', 'Exercices'].forEach((label) => row.append(createElement('th', '', label)));
  head.append(row);
  const body = document.createElement('tbody');
  [...state.assignmentHistory].reverse().forEach((item) => {
    const dataRow = document.createElement('tr');
    const [level, unit, activity] = item.context.split('|');
    const date = new Date(item.date);
    [Number.isNaN(date.getTime()) ? item.date : date.toLocaleString('fr-FR'), item.studentName, `${level}e · U${unit} · ${getActivity(activity).label}`, `V${item.version}`, item.format, String(item.questionIds.length)]
      .forEach((value) => dataRow.append(createElement('td', '', value)));
    body.append(dataRow);
  });
  table.append(head, body);
  elements.historyContent.replaceChildren(table);
}

function exportBackup() {
  const payload = { application: 'Suivi des évaluations', exportedAt: new Date().toISOString(), state };
  downloadBlob(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }), `sauvegarde-evaluations-${new Date().toISOString().slice(0, 10)}.suivi`);
  notify('La sauvegarde complète a été créée.');
}

async function importBackup(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    if (file.size > 50 * 1024 * 1024) throw new Error('La sauvegarde dépasse 50 Mo.');
    const payload = JSON.parse(await file.text());
    if (!window.confirm('Restaurer cette sauvegarde et remplacer les données actuelles ?')) return;
    state = normalizeState(payload.state || payload);
    if (!saveEvaluation(state).ok) throw new Error('Impossible d’enregistrer la sauvegarde restaurée.');
    window.location.reload();
  } catch (error) {
    notify(`Restauration impossible : ${error.message}`, 'error');
  } finally {
    event.target.value = '';
  }
}

function openDialog(dialog) {
  if (!dialog.open) dialog.showModal();
}

function renderPrintHeader() {
  const decorativeHeader = document.createElement('img');
  decorativeHeader.className = 'print-decorative-header';
  decorativeHeader.src = 'assets/tableau-recapitulatif-header.png';
  decorativeHeader.alt = 'Tableau récapitulatif';
  decorativeHeader.decoding = 'sync';
  const title = createElement('h1', '', 'Suivi des évaluations de la classe');
  const context = createElement('p', '', metadataSummary(' — '));
  elements.printHeader.replaceChildren(decorativeHeader, title, context);
  elements.printFooter.replaceChildren(createElement('p', '', `${metadataSummary(' · ')} · Suivi pédagogique de la classe`));
}

async function runPrint(target, landscape) {
  if (pdfExportRunning) return;
  pdfExportRunning = true;
  renderPrintHeader();
  const className = `printing-${target}`;
  document.body.classList.add(className);

  try {
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    if (window.evaluationAPI?.exportPDF) {
      const student = state.students.find((candidate) => candidate.id === selectedStudentId);
      const options = student ? assignmentOptions(student.id) : { version: 1 };
      const baseName = target === 'student-plan'
        ? `devoir-${safeFileLabel(student?.name)}-${state.metadata.levelId}e-u${state.metadata.unitId}-${state.metadata.activityId}-v${options.version}.pdf`
        : `${target}-${state.metadata.levelId}e-u${state.metadata.unitId}-${state.metadata.activityId}.pdf`;
      const result = await window.evaluationAPI.exportPDF({ landscape, defaultName: baseName });
      if (result.ok) {
        if (target === 'student-plan' && student) {
          recordAssignmentExport(student, studentAssignments(student, options.version), options, 'PDF individuel');
        }
        notify('Le PDF A4 a été créé sans lancer le pilote d’impression.');
      } else if (!result.canceled && result.error) {
        notify(`Création PDF impossible : ${result.error}`, 'error');
      }
    } else {
      window.print();
    }
  } finally {
    document.body.classList.remove(className);
    pdfExportRunning = false;
  }
}

elements.addStudent.addEventListener('click', addStudent);
elements.emptyAddStudent.addEventListener('click', addStudent);
elements.upload.addEventListener('change', importFromWord);
elements.exportWord.addEventListener('click', exportToDocx);
elements.showStats.addEventListener('click', () => {
  renderStats();
  openDialog(elements.statsDialog);
});
elements.showDecision.addEventListener('click', () => {
  renderDecision();
  openDialog(elements.decisionDialog);
});
elements.showBank.addEventListener('click', () => {
  initializeBankFilters();
  renderBankList();
  openDialog(elements.bankDialog);
});
elements.showHomeworkBuilder.addEventListener('click', () => {
  syncHomeworkBuilder();
  openDialog(elements.homeworkBuilderDialog);
});
elements.showHistory.addEventListener('click', () => {
  renderHistory();
  openDialog(elements.historyDialog);
});
elements.backupExport.addEventListener('click', exportBackup);
elements.backupImport.addEventListener('change', importBackup);
for (const control of [elements.homeworkTeacher, elements.homeworkMode, elements.homeworkLayout, elements.homeworkDuration, elements.homeworkCount, elements.homeworkCommonDifficulty]) {
  control.addEventListener('change', saveHomeworkBuilder);
}
elements.homeworkCriteria.addEventListener('change', saveHomeworkBuilder);
elements.exportClassWord.addEventListener('click', exportClassWord);
elements.exportClassZip.addEventListener('click', exportClassZip);
elements.exportClassPdf.addEventListener('click', exportClassPdf);
elements.bankAdd.addEventListener('click', createQuestion);
elements.bankExport.addEventListener('click', exportQuestionBank);
elements.bankImport.addEventListener('change', importQuestionBank);
elements.bankEditor.addEventListener('submit', saveQuestion);
elements.questionDuplicate.addEventListener('click', duplicateQuestion);
elements.questionDelete.addEventListener('click', deleteQuestion);
elements.questionLevel.addEventListener('change', () => updateQuestionUnitOptions());
elements.questionActivity.addEventListener('change', () => updateQuestionCriteria(null, true));
elements.questionCriterion.addEventListener('change', () => {
  elements.questionIndicator.value = getCriterion(elements.questionActivity.value, elements.questionCriterion.value)?.indicator ?? '';
});
elements.bankLevelFilter.addEventListener('change', () => {
  updateBankUnitFilter();
  renderBankList();
});
for (const filter of [elements.bankUnitFilter, elements.bankActivityFilter, elements.bankDifficultyFilter]) {
  filter.addEventListener('change', renderBankList);
}
elements.bankSearch.addEventListener('input', renderBankList);
elements.printPortrait.addEventListener('click', () => runPrint('table', false));
elements.printLandscape.addEventListener('click', () => runPrint('table', true));
elements.printStats.addEventListener('click', () => runPrint('stats', true));
elements.printDecision.addEventListener('click', () => runPrint('decision', true));
elements.printStudentPlan.addEventListener('click', () => runPrint('student-plan', false));
elements.exportStudentWord.addEventListener('click', exportStudentPlanWord);
elements.newStudentVersion.addEventListener('click', () => {
  const student = state.students.find((candidate) => candidate.id === selectedStudentId);
  if (!student) return;
  assignmentOptions(student.id).version += 1;
  persist();
  renderStudentPlan(student);
  notify(`Une nouvelle version du devoir de ${student.name.trim() || 'cet élève'} est prête.`);
});
elements.studentShowCorrection.addEventListener('change', () => {
  const student = state.students.find((candidate) => candidate.id === selectedStudentId);
  if (!student) return;
  assignmentOptions(student.id).showCorrection = elements.studentShowCorrection.checked;
  persist();
  renderStudentPlan(student);
});
elements.resetStudentLayout.addEventListener('click', () => {
  const student = state.students.find((candidate) => candidate.id === selectedStudentId);
  if (!student || !window.confirm('Rétablir les textes et l’en-tête d’origine pour ce devoir ?')) return;
  const options = assignmentOptions(student.id);
  options.headerDraft = {};
  options.exerciseDrafts = {};
  persist();
  renderStudentPlan(student);
  notify('La mise en page et les textes d’origine ont été rétablis.');
});

document.querySelectorAll('[data-close-dialog]').forEach((button) => {
  button.addEventListener('click', () => document.getElementById(button.dataset.closeDialog)?.close());
});

for (const dialog of [elements.statsDialog, elements.decisionDialog, elements.studentPlanDialog, elements.bankDialog, elements.homeworkBuilderDialog, elements.historyDialog]) {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
}

window.addEventListener('beforeunload', persist);

renderMetadata();
renderEvaluation();

if (loadedEvaluation.migrated) {
  persist();
  notify('Les données de l’ancienne version ont été migrées avec succès.');
} else if (loadedEvaluation.warning) {
  notify(loadedEvaluation.warning, 'warning');
}
