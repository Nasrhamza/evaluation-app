const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const JSZip = require('jszip');
const { createDefaultQuestionBank } = require('../src/question-bank');

async function run() {
  const window = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      partition: `smoke-${Date.now()}`
    }
  });
  const errors = [];
  window.webContents.on('console-message', (_event, level, message) => {
    if (level >= 2) errors.push(message);
  });
  await window.loadFile(path.join(__dirname, '..', 'index.html'));
  const result = await window.webContents.executeJavaScript(`(async () => {
    document.querySelector('#add-student').click();
    const nameInput = document.querySelector('.student-name-input');
    nameInput.value = 'Élève Test';
    nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('#add-student').click();
    const secondNameInput = document.querySelectorAll('.student-name-input')[1];
    secondNameInput.value = 'Deuxième Élève';
    secondNameInput.dispatchEvent(new Event('input', { bubbles: true }));
    const teacherInput = document.querySelector('#teacher-name');
    teacherInput.value = 'Jamel Naser';
    teacherInput.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('.student-plan-button').click();
    await new Promise((resolve) => setTimeout(resolve, 30));
    const studentPlanOpen = document.querySelector('#student-plan-dialog').open;
    const needCards = document.querySelectorAll('#student-plan-content .student-need-card').length;
    const readyExercises = document.querySelectorAll('#student-plan-content .student-exercise').length;
    const supportTexts = document.querySelectorAll('#student-plan-content .exercise-support').length;
    const printableExercises = document.querySelectorAll('#student-plan-content .student-print-document .print-exercise-block').length;
    const firstVersion = [...document.querySelectorAll('.print-exercise-block')].map((item) => item.dataset.exerciseId).join(',');
    document.querySelector('#new-student-version').click();
    const secondVersion = [...document.querySelectorAll('.print-exercise-block')].map((item) => item.dataset.exerciseId).join(',');
    const previewVisible = getComputedStyle(document.querySelector('.student-preview-document')).display !== 'none';
    const teacherInHeader = document.querySelector('.worksheet-identities').textContent.includes('Jamel Naser');
    const decorativeHeader = document.querySelector('.student-preview-document .worksheet-decorative-header');
    const decorativeHeaderReady = decorativeHeader?.complete && decorativeHeader.naturalWidth > 500 && decorativeHeader.src.endsWith('/assets/premier-trimestre-header.png');
    const versionChanged = firstVersion !== secondVersion && document.querySelector('#student-version-label').textContent === 'Version 2';
    const visualCount = document.querySelectorAll('.student-preview-document .exercise-visual').length;
    const visualToggleRemoved = !document.querySelector('#student-include-visuals');
    const editableTeacher = document.querySelector('.worksheet-identities p:first-child .editable-preview-field');
    editableTeacher.textContent = 'Professeur Modifié';
    editableTeacher.dispatchEvent(new Event('input', { bubbles: true }));
    const editableInstruction = document.querySelector('.student-preview-document .exercise-instruction');
    editableInstruction.textContent = 'Consigne personnalisée avant export.';
    editableInstruction.dispatchEvent(new Event('input', { bubbles: true }));
    const correctionToggle = document.querySelector('#student-show-correction');
    correctionToggle.checked = true;
    correctionToggle.dispatchEvent(new Event('change', { bubbles: true }));
    const manualEditsPersist = document.querySelector('.worksheet-identities').textContent.includes('Professeur Modifié')
      && document.querySelector('.student-preview-document .exercise-instruction').textContent.includes('Consigne personnalisée');
    const previewUsesMastery = document.querySelector('.student-preview-document').textContent.includes('Niveau de maîtrise')
      && !document.querySelector('.student-preview-document').textContent.includes('Note :')
      && !document.querySelector('.student-preview-document').textContent.includes(' pts');
    const stickyHeader = getComputedStyle(document.querySelector('#student-table thead')).position === 'sticky';
    const initialCriteria = document.querySelectorAll('#student-table-head .criterion-header').length;
    document.querySelector('#student-plan-dialog').close();
    document.querySelector('#show-bank').click();
    await new Promise((resolve) => setTimeout(resolve, 30));
    const cards = document.querySelectorAll('#bank-list .question-card').length;
    document.querySelector('#bank-list .question-card')?.click();
    const editorVisible = !document.querySelector('#bank-editor').hidden;
    const favoriteControl = Boolean(document.querySelector('#question-favorite'));
    document.querySelector('#bank-dialog').close();
    document.querySelector('#show-homework-builder').click();
    const builderOpen = document.querySelector('#homework-builder-dialog').open;
    const builderCriteria = document.querySelectorAll('#homework-criteria input').length;
    const builderValidated = document.querySelector('#homework-validation').textContent.includes('Devoir de remédiation prêt');
    const numericScoreRemoved = !document.querySelector('#homework-score');
    document.querySelector('#homework-layout').value = 'large';
    document.querySelector('#homework-layout').dispatchEvent(new Event('change', { bubbles: true }));
    document.querySelector('#homework-mode').value = 'common';
    document.querySelector('#homework-mode').dispatchEvent(new Event('change', { bubbles: true }));
    document.querySelector('#homework-teacher').value = 'Mme Générateur';
    document.querySelector('#homework-teacher').dispatchEvent(new Event('change', { bubbles: true }));
    const commonDifficultyEnabled = !document.querySelector('#homework-common-difficulty').disabled;
    const builderTeacherSynced = document.querySelector('#teacher-name').value === 'Mme Générateur';
    document.querySelector('#homework-builder-dialog').close();
    const tableScroll = document.querySelector('.table-scroll');
    tableScroll.scrollTop = 260;
    tableScroll.scrollLeft = 180;
    document.querySelector('#activity-select').value = 'conjugaison';
    document.querySelector('#activity-select').dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const adaptiveSingleCriterion = document.querySelector('#student-table').dataset.criteriaCount === '1'
      && document.querySelectorAll('#student-table-head .criterion-header').length === 1
      && getComputedStyle(document.querySelector('#student-table')).tableLayout === 'fixed';
    const contextScrollReset = tableScroll.scrollTop === 0 && tableScroll.scrollLeft === 0;
    return {
      title: document.title,
      levels: document.querySelectorAll('#level-select option').length,
      units: document.querySelectorAll('#unit-select option').length,
      activities: document.querySelectorAll('#activity-select option').length,
      criteria: initialCriteria,
      base: document.querySelector('#curriculum-context')?.textContent,
      bankButton: Boolean(document.querySelector('#show-bank')),
      cards,
      editorVisible,
      studentPlanOpen,
      needCards,
      readyExercises,
      supportTexts,
      printableExercises
      ,previewVisible, teacherInHeader, decorativeHeaderReady, versionChanged, visualCount, visualToggleRemoved, manualEditsPersist, previewUsesMastery, stickyHeader,
      favoriteControl, builderOpen, builderCriteria, builderValidated, commonDifficultyEnabled, builderTeacherSynced,
      adaptiveSingleCriterion, contextScrollReset, numericScoreRemoved
    };
  })()`);
  if (errors.length) throw new Error(`Renderer console errors: ${errors.join(' | ')}`);
  const expectedCards = createDefaultQuestionBank().filter((item) => item.unitId === '1' && item.activityId === 'lecture').length;
  if (result.levels !== 3 || result.units !== 4 || result.activities !== 6 || result.criteria !== 6 || !result.bankButton || result.cards !== expectedCards || !result.editorVisible || !result.studentPlanOpen || result.needCards !== 6 || result.readyExercises < 6 || result.supportTexts < 2 || result.printableExercises !== 6 || !result.previewVisible || !result.teacherInHeader || !result.decorativeHeaderReady || !result.versionChanged || result.visualCount !== 0 || !result.visualToggleRemoved || !result.manualEditsPersist || !result.previewUsesMastery || !result.stickyHeader || !result.favoriteControl || !result.builderOpen || result.builderCriteria !== 6 || !result.builderValidated || !result.commonDifficultyEnabled || !result.builderTeacherSynced || !result.adaptiveSingleCriterion || !result.contextScrollReset || !result.numericScoreRemoved) {
    throw new Error(`Unexpected UI state: ${JSON.stringify(result)}`);
  }
  const guidedResult = await window.webContents.executeJavaScript(`(() => {
    document.querySelector('.student-plan-button').click();
    const preview = document.querySelector('.student-preview-document');
    const tasks = [...preview.querySelectorAll('.guided-task')];
    const firstChoice = preview.querySelector('.task-option.editable-preview-field');
    if (firstChoice) {
      firstChoice.textContent = 'Choix modifié pour le test';
      firstChoice.dispatchEvent(new Event('input', { bubbles: true }));
      firstChoice.dispatchEvent(new Event('blur'));
    }
    document.querySelector('#student-show-correction').checked = false;
    document.querySelector('#student-show-correction').dispatchEvent(new Event('change', { bubbles: true }));
    return { tasks: tasks.length, types: [...new Set(tasks.map((task) => task.className))],
      matching: preview.querySelectorAll('.task-matching tbody tr').length,
      choices: preview.querySelectorAll('.task-options').length,
      editPersisted: document.querySelector('.student-preview-document').textContent.includes('Choix modifié pour le test'),
      ids: [...document.querySelectorAll('.student-preview-document .print-exercise-block')].map((node) => node.dataset.exerciseId)
    };
  })()`);
  if (guidedResult.tasks !== 6 || guidedResult.types.length < 3 || !guidedResult.matching || !guidedResult.choices || !guidedResult.editPersisted) throw new Error(`Guided preview failed: ${JSON.stringify(guidedResult)}`);
  result.guided = guidedResult;
  await window.webContents.executeJavaScript(`document.body.classList.add('printing-student-plan')`);
  const pdf = await window.webContents.printToPDF({ printBackground: true, pageSize: 'A4' });
  await window.webContents.executeJavaScript(`document.body.classList.remove('printing-student-plan')`);
  if (pdf.subarray(0, 4).toString() !== '%PDF') throw new Error('Invalid PDF output');
  result.pdfBytes = pdf.length;
  const captureDownload = (action, savePath = '') => new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('DOCX download timeout')), 60000);
    window.webContents.session.once('will-download', (_event, item) => {
      const filename = item.getFilename();
      if (savePath) {
        item.setSavePath(savePath);
        item.once('done', (_doneEvent, state) => {
          clearTimeout(timer);
          if (state !== 'completed') reject(new Error(`Download failed: ${state}`));
          else resolve(filename);
        });
      } else {
        clearTimeout(timer);
        item.cancel();
        setTimeout(() => resolve(filename), 80);
      }
    });
    window.webContents.executeJavaScript(action).catch(reject);
  });
  const studentWordPath = path.join(app.getPath('temp'), `evaluation-guided-${Date.now()}.docx`);
  const studentWord = await captureDownload(`document.querySelector('#export-student-word').click()`, studentWordPath);
  const exportedDocument = await JSZip.loadAsync(fs.readFileSync(studentWordPath));
  const documentXml = await exportedDocument.file('word/document.xml').async('string');
  if (!documentXml.includes('Choix modifié pour le test') || !documentXml.includes('●') || documentXml.includes('Corrigé enseignant')) throw new Error('Guided Word content or manual edits are missing / correction leaked.');
  result.guidedWordPath = studentWordPath;
  const idsAfterExport = await window.webContents.executeJavaScript(`(() => {
    document.querySelector('#student-plan-dialog').close(); document.querySelector('.student-plan-button').click();
    return [...document.querySelectorAll('.student-preview-document .print-exercise-block')].map((node) => node.dataset.exerciseId);
  })()`);
  if (JSON.stringify(idsAfterExport) !== JSON.stringify(guidedResult.ids)) throw new Error('Export changed the preview selection');
  const bankWord = await captureDownload(`document.querySelector('#bank-export').click()`);
  const classWord = await captureDownload(`document.querySelector('#show-homework-builder').click(); document.querySelector('#export-class-word').click()`);
  const savedZipPath = path.join(app.getPath('temp'), `evaluation-smoke-${Date.now()}.zip`);
  const classZip = await captureDownload(`document.querySelector('#export-class-zip').click()`, savedZipPath);
  const zip = await JSZip.loadAsync(fs.readFileSync(savedZipPath));
  const zipNames = Object.keys(zip.files).filter((name) => name.endsWith('.docx'));
  const zipNamesValid = zipNames.some((name) => name.includes('eleve-test')) && zipNames.some((name) => name.includes('deuxieme-eleve'));
  const zipDocumentsHaveNames = (await Promise.all(zipNames.map(async (name) => {
    const docx = await JSZip.loadAsync(await zip.file(name).async('nodebuffer'));
    const xml = await docx.file('word/document.xml').async('string');
    const expectedName = name.includes('deuxieme-eleve') ? 'Deuxième Élève' : 'Élève Test';
    const otherName = name.includes('deuxieme-eleve') ? 'Élève Test' : 'Deuxième Élève';
    return xml.includes(expectedName) && !xml.includes(otherName) && xml.includes('Mme Générateur') && xml.includes('●');
  }))).every(Boolean);
  const zipDocumentsUseMastery = (await Promise.all(zipNames.map(async (name) => {
    const docx = await JSZip.loadAsync(await zip.file(name).async('nodebuffer'));
    const xml = await docx.file('word/document.xml').async('string');
    return xml.includes('Niveau de maîtrise') && !xml.includes('Note :') && !xml.includes(' pts');
  }))).every(Boolean);
  const backup = await captureDownload(`document.querySelector('#backup-export').click()`);
  const historyRows = await window.webContents.executeJavaScript(`(() => { document.querySelector('#show-history').click(); return document.querySelectorAll('#history-content tbody tr').length; })()`);
  if (!studentWord.endsWith('.docx') || !bankWord.endsWith('.docx') || !classWord.endsWith('.docx') || !classZip.endsWith('.zip') || !backup.endsWith('.suivi') || historyRows < 5 || !zipNamesValid || !zipDocumentsHaveNames || !zipDocumentsUseMastery) {
    throw new Error(`Unexpected exports/history: ${studentWord}, ${bankWord}, ${classWord}, ${classZip}, ${backup}, ${historyRows}`);
  }
  result.studentWord = studentWord;
  result.bankWord = bankWord;
  result.classWord = classWord;
  result.classZip = classZip;
  result.backup = backup;
  result.historyRows = historyRows;
  result.zipNames = zipNames;
  result.zipDocumentsHaveNames = zipDocumentsHaveNames;
  result.zipDocumentsUseMastery = zipDocumentsUseMastery;
  if (errors.length) throw new Error(`Renderer errors during exports: ${errors.join(' | ')}`);
  if (process.env.CAPTURE_SMOKE_UI === '1') {
    const outputDirectory = path.join(__dirname, '..', 'artifacts');
    fs.mkdirSync(outputDirectory, { recursive: true });
    fs.writeFileSync(path.join(outputDirectory, 'guided-worksheet.pdf'), pdf);
    window.setSize(1600, 1000);
    await window.webContents.executeJavaScript(`document.querySelector('#history-dialog').close(); document.querySelector('#homework-builder-dialog').close(); document.querySelector('.evaluation-panel').scrollIntoView()`);
    await new Promise((resolve) => setTimeout(resolve, 100));
    fs.writeFileSync(path.join(outputDirectory, 'v5-single-criterion-table.png'), (await window.webContents.capturePage()).toPNG());
    await window.webContents.executeJavaScript(`document.querySelector('.student-plan-button').click(); document.querySelector('.student-preview-document').scrollIntoView()`);
    await new Promise((resolve) => setTimeout(resolve, 100));
    fs.writeFileSync(path.join(outputDirectory, 'v5-student-preview.png'), (await window.webContents.capturePage()).toPNG());
    await window.webContents.executeJavaScript(`document.querySelector('#student-plan-dialog').close(); document.querySelector('#show-homework-builder').click()`);
    await new Promise((resolve) => setTimeout(resolve, 100));
    fs.writeFileSync(path.join(outputDirectory, 'v5-homework-builder.png'), (await window.webContents.capturePage()).toPNG());
  }
  console.log(JSON.stringify(result));
  window.destroy();
  app.quit();
}

app.whenReady().then(run).catch((error) => {
  console.error(error);
  app.exit(1);
});
