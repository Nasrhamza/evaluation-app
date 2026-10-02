const LEVELS = Object.freeze([
  { id: '4', label: '4ème année', configured: false },
  { id: '5', label: '5ème année', configured: false },
  { id: '6', label: '6ème année', configured: true }
]);

const ACTIVITY_DEFINITIONS = Object.freeze({
  oral: {
    id: 'oral', label: 'Oral', criteria: [
      { id: 1, label: 'Adéquation à la situation', indicator: 'Comprend la tâche, emploie le vocabulaire adapté et respecte les règles de communication.' },
      { id: 2, label: 'Correction phonétique', indicator: 'Prononce, articule et emploie une intonation intelligible.' },
      { id: 3, label: 'Correction linguistique', indicator: 'Agence correctement les mots et utilise les formes verbales étudiées.' },
      { id: 4, label: 'Cohérence de l’énoncé', indicator: 'Organise son énoncé et justifie correctement son avis.' },
      { id: 5, label: 'Originalité des idées', indicator: 'Fait preuve d’imagination et utilise un vocabulaire varié.' },
      { id: 6, label: 'Fluidité de l’expression', indicator: 'S’exprime avec aisance, expressivité et une attitude adaptée.' }
    ]
  },
  lecture: {
    id: 'lecture', label: 'Lecture-compréhension', criteria: [
      { id: 1, label: 'Qualité de la lecture vocale', indicator: 'Prononce correctement, respecte la ponctuation, les liaisons et l’intonation.' },
      { id: 2, label: 'Compréhension globale', indicator: 'Repère les événements, les personnages, les lieux et le type de texte.' },
      { id: 3, label: 'Compréhension du vocabulaire', indicator: 'Explique les mots par le contexte, les synonymes ou les contraires.' },
      { id: 4, label: 'Justification d’une réponse', indicator: 'Justifie avec un indice explicite ou implicite du texte.' },
      { id: 5, label: 'Fluidité de la lecture', indicator: 'Lit rapidement et de façon expressive.' },
      { id: 6, label: 'Dépassement du texte', indicator: 'Donne un avis, dégage une valeur ou imagine un prolongement.' }
    ]
  },
  grammaire: {
    id: 'grammaire', label: 'Grammaire', criteria: [
      { id: 3, label: 'Correction linguistique', indicator: 'Reconnaît et utilise correctement les structures grammaticales de l’unité.' }
    ]
  },
  conjugaison: {
    id: 'conjugaison', label: 'Conjugaison', criteria: [
      { id: 3, label: 'Correction linguistique', indicator: 'Conjugue correctement les verbes et emploie le temps demandé.' }
    ]
  },
  orthographe: {
    id: 'orthographe', label: 'Orthographe', criteria: [
      { id: 4, label: 'Correction orthographique', indicator: 'Écrit correctement le lexique, les homophones, les accords et les mots-outils étudiés.' }
    ]
  },
  production: {
    id: 'production', label: 'Production écrite', criteria: [
      { id: 1, label: 'Adéquation à la situation', indicator: 'Respecte la consigne, la situation et le nombre de phrases demandé.' },
      { id: 2, label: 'Lisibilité de l’écriture', indicator: 'Respecte les normes des lettres minuscules et majuscules.' },
      { id: 3, label: 'Correction linguistique', indicator: 'Construit correctement les phrases, les accords et les formes verbales.' },
      { id: 4, label: 'Correction orthographique', indicator: 'Écrit correctement le lexique et les mots-outils étudiés.' },
      { id: 5, label: 'Cohérence du texte', indicator: 'Fait progresser les événements sans contradiction et évite les répétitions.' },
      { id: 6, label: 'Originalité des idées', indicator: 'Fait preuve de créativité et utilise un vocabulaire riche.' },
      { id: 7, label: 'Présentation matérielle', indicator: 'Présente une copie propre et respecte la forme du texte demandé.' }
    ]
  }
});

const SIXTH_UNITS = Object.freeze([
  {
    id: '1', label: 'Unité 1', modules: ['Module 1', 'Module 2'],
    themes: ['Travail — Travailler pour s’épanouir', 'Médias et nouvelles technologies — Communiquer avec les autres'],
    targets: {
      lecture: 'Comprendre des récits liés au travail, aux métiers, aux médias et aux technologies.',
      grammaire: 'Déterminants, noms, pronoms personnels, déterminants possessifs et démonstratifs.',
      conjugaison: 'Présent, passé composé, futur et impératif des verbes étudiés.',
      orthographe: 'Homophones a / à et lexique des modules 1 et 2.',
      production: 'Raconter un événement lié au travail ou aux nouvelles technologies.',
      oral: 'Informer, raconter, décrire, situer, donner un point de vue et justifier un choix.'
    }
  },
  {
    id: '2', label: 'Unité 2', modules: ['Module 3', 'Module 4'],
    themes: ['Paix et tolérance — Accepter les autres', 'Solidarité et citoyenneté — S’entraider pour mieux réussir'],
    targets: {
      lecture: 'Comprendre des récits liés à la tolérance, l’entraide et la citoyenneté.',
      grammaire: 'Adjectif épithète/attribut et phrase négative ne… plus / ne… jamais.',
      conjugaison: 'Être, avoir et verbes usuels en -ir au futur et au passé composé.',
      orthographe: 'Homophones son / sont et et / est.',
      production: 'Écrire un récit cohérent intégrant un court dialogue.',
      oral: 'Décrire, raconter, prendre position, porter un jugement et justifier son avis.'
    }
  },
  {
    id: '3', label: 'Unité 3', modules: ['Module 5', 'Module 6'],
    themes: ['Environnement — Sauver la nature', 'Santé et bien-être — Être en forme et mieux se porter'],
    targets: {
      lecture: 'Comprendre des textes liés à l’environnement, la santé et le bien-être.',
      grammaire: 'Compléments essentiels/non essentiels et complément de lieu.',
      conjugaison: 'Prendre, mettre, aller et faire au futur et au passé composé.',
      orthographe: 'Accord sujet-verbe et accord en genre/nombre de l’adjectif.',
      production: 'Rédiger un récit sur l’environnement ou la santé avec description ou dialogue.',
      oral: 'Décrire, raconter, informer, donner un conseil et justifier un avis.'
    }
  },
  {
    id: '4', label: 'Unité 4', modules: ['Module 7', 'Module 8'],
    themes: ['Loisirs — Profiter de son temps libre', 'Culture et découverte du monde — Découvrir d’autres modes de vie'],
    targets: {
      lecture: 'Comprendre des textes liés aux loisirs, aux voyages et aux modes de vie.',
      grammaire: 'Compléments de temps et de manière.',
      conjugaison: 'Dire, lire, écrire, vouloir et pouvoir aux temps étudiés et à l’impératif.',
      orthographe: 'Accord des adjectifs étudiés et du participe passé employé avec être.',
      production: 'Écrire une lettre ou un récit intégrant un passage descriptif.',
      oral: 'Raconter, décrire, exprimer un sentiment, une préférence et émettre une hypothèse.'
    }
  }
]);

function placeholderUnits(levelId) {
  return [1, 2, 3, 4].map((unit) => ({
    id: String(unit), label: `Unité ${unit}`, modules: [], themes: [],
    targets: Object.fromEntries(Object.keys(ACTIVITY_DEFINITIONS).map((activity) => [activity, `Référentiel de ${LEVELS.find((level) => level.id === levelId)?.label ?? 'ce niveau'} à configurer.`]))
  }));
}

function getLevel(levelId) {
  return LEVELS.find((level) => level.id === String(levelId)) ?? LEVELS[2];
}

function getUnits(levelId) {
  return String(levelId) === '6' ? SIXTH_UNITS : placeholderUnits(String(levelId));
}

function getUnit(levelId, unitId) {
  return getUnits(levelId).find((unit) => unit.id === String(unitId)) ?? getUnits(levelId)[0];
}

function getActivity(activityId) {
  return ACTIVITY_DEFINITIONS[activityId] ?? ACTIVITY_DEFINITIONS.lecture;
}

function getCriterion(activityId, criterionId) {
  return getActivity(activityId).criteria.find((criterion) => criterion.id === Number(criterionId));
}

module.exports = {
  LEVELS,
  ACTIVITY_DEFINITIONS,
  SIXTH_UNITS,
  getLevel,
  getUnits,
  getUnit,
  getActivity,
  getCriterion
};
