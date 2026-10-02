const { ACTIVITY_DEFINITIONS, getCriterion } = require('./curriculum');
const { createExpandedSixthGradeBank } = require('./sixth-grade-bank');
const { createGuidedLanguageBank } = require('./guided-language-bank');
const { createGuidedReadingBank, createGuidedExpressionBank } = require('./guided-reading-bank');
const { normalizeTask } = require('./exercise-tasks');

const DIFFICULTIES = Object.freeze([
  { id: 'remediation', label: 'Remédiation' },
  { id: 'consolidation', label: 'Consolidation' },
  { id: 'approfondissement', label: 'Approfondissement' }
]);

const QUESTION_BANK_VERSION = 4;

const READING_SUPPORTS = Object.freeze({
  1: [
    'Chaque matin, Mme Salma ouvre la petite boulangerie du quartier avant sept heures. Dans le laboratoire, elle pétrit la pâte, prépare les plateaux et surveille la cuisson. Son jeune apprenti range les pains dans les corbeilles. Salma aime ce métier car elle est heureuse de servir du pain chaud aux habitants.',
    'Pour préparer son reportage, Nour visite un atelier moderne. Elle observe les ouvriers, leurs outils et une machine commandée par ordinateur. Le chef d’atelier lui explique que cette technologie facilite le travail, mais qu’elle doit être utilisée avec attention. Nour note toutes les informations dans son carnet.',
    'Mourad est facteur dans un village de montagne. Malgré les longues distances, il distribue chaque lettre avec soin. « J’aime mon métier parce qu’il me permet de rendre service aux familles », répète-t-il souvent. Quand la route est difficile, il prend son vélo et poursuit courageusement sa tournée.',
    'La classe reçoit une tablette numérique pour réaliser un journal scolaire. Les élèves photographient leurs travaux, rédigent des articles et enregistrent des interviews. Avant de publier le journal, ils vérifient les informations et corrigent les erreurs. Leur maîtresse leur rappelle qu’un outil numérique doit être utilisé de manière responsable.'
  ],
  2: [
    'À la sortie de l’école, Lina remarque qu’un nouveau camarade ne retrouve plus son chemin. Elle s’approche, le rassure puis l’accompagne jusqu’à la bibliothèque où sa mère l’attend. Le lendemain, le garçon remercie Lina devant toute la classe. Grâce à ce geste simple, il se sent désormais bien accueilli.',
    'Après une forte pluie, plusieurs maisons du village sont inondées. Les habitants se rassemblent pour venir en aide aux familles. Les uns apportent des couvertures, d’autres préparent des repas. Même les enfants participent en rangeant les dons. Cette entraide redonne du courage à tout le quartier.',
    'Pendant la récréation, Sami refuse d’abord de laisser jouer le nouvel élève. Inès lui rappelle que chacun a le droit de participer. Sami hésite, puis tend le ballon au garçon. Quelques minutes plus tard, toute l’équipe rit et joue ensemble. Sami comprend qu’accueillir l’autre rend le jeu plus agréable.',
    'Deux voisins se disputaient souvent à cause du bruit. Un soir, ils ont décidé de parler calmement. Chacun a écouté les difficultés de l’autre et ils ont fixé ensemble des horaires raisonnables. Depuis ce jour, ils se saluent avec respect. Le dialogue leur a permis de retrouver la paix.'
  ],
  3: [
    'Près de l’école, un petit jardin était couvert de papiers et de bouteilles. Les élèves ont compris que ces déchets empêchaient les plantes de pousser. Avec leurs enseignants, ils ont nettoyé le terrain, placé des poubelles et planté de jeunes arbres. Quelques semaines plus tard, le jardin est redevenu agréable.',
    'Le dimanche, Yasmine accompagne son père au marché. Ils choisissent un panier réutilisable et refusent les sacs en plastique. À la maison, ils trient le verre, le papier et les restes de nourriture. Yasmine explique à son frère que ces habitudes réduisent les déchets et protègent la nature.',
    'Depuis plusieurs jours, Walid se sent fatigué en classe. Le médecin lui conseille de dormir suffisamment, de boire de l’eau et de prendre un petit déjeuner équilibré. Walid suit ces recommandations et limite le temps passé devant les écrans. Peu à peu, il retrouve son énergie.',
    'Sur la plage, Mariem découvre une tortue blessée près d’un morceau de filet. Elle appelle un adulte au lieu de toucher l’animal. Une équipe spécialisée arrive, libère la tortue et la transporte dans un centre de soins. Mariem décide alors de sensibiliser ses camarades aux dangers des déchets en mer.'
  ],
  4: [
    'Pendant les vacances, Liliane voyage avec sa famille vers le sud tunisien. Après un long trajet, ils arrivent à Tozeur et découvrent la palmeraie. Un guide leur montre les anciennes maisons et raconte l’histoire de la ville. Liliane écrit chaque soir ses découvertes dans un carnet.',
    'Dans un musée, Adam observe des vêtements, des outils et des instruments de musique venus de plusieurs régions. La guide explique comment les familles les utilisaient autrefois. Adam pose beaucoup de questions et compare ces objets avec ceux de son quotidien. Cette visite lui donne envie de mieux connaître les traditions.',
    'Pour la première fois, Maya prend l’avion seule afin de rejoindre sa tante. Au début, elle est inquiète et serre fort son sac. Une hôtesse lui parle gentiment et lui explique le déroulement du voyage. En regardant les nuages par le hublot, Maya se détend et commence à sourire.',
    'Dans le village de son correspondant, Karim découvre que les habitants se déplacent surtout à vélo. Les enfants vont à l’école ensemble et les commerces ferment plus tôt que dans sa ville. Karim est surpris, mais il respecte ces habitudes. Il comprend qu’il existe plusieurs façons d’organiser la vie quotidienne.'
  ]
});

const UNIT_BANKS = Object.freeze({
  1: {
    oral: [
      ['Présenter un métier', 'Présente un métier de ton choix, ses tâches, son lieu de travail et les qualités nécessaires.', 'Présentation adaptée avec vocabulaire professionnel et énoncé compréhensible.', 1],
      ['Raconter une journée de travail', 'Raconte oralement la journée d’un professionnel en respectant l’ordre des actions.', 'Récit oral chronologique et formes verbales correctes.', 3],
      ['Donner son avis sur la technologie', 'Une nouvelle technologie est-elle toujours utile ? Donne ton avis et justifie-le.', 'Point de vue clair accompagné d’au moins une justification.', 4],
      ['Dialogue téléphonique', 'Joue un court dialogue pour demander puis transmettre une information par téléphone.', 'Expression fluide, politesse et intonation adaptées.', 6]
    ],
    lecture: [
      ['Compréhension globale — métier', 'Relève le personnage principal, son métier et deux lieux où elle travaille.', 'Personnage : Mme Salma. Métier : boulangère. Lieux : la boulangerie et le laboratoire.', 2],
      ['Vocabulaire du travail', 'Relève deux mots du champ lexical du travail et explique l’un d’eux à l’aide du contexte.', 'Deux mots pertinents et une explication cohérente.', 3],
      ['Justifier avec un indice', 'Mourad aime-t-il son métier ? Réponds puis recopie la phrase qui justifie ta réponse.', 'Oui. Indice : « J’aime mon métier parce qu’il me permet de rendre service aux familles. »', 4],
      ['Dépasser le texte', 'Quel métier présenté dans le texte choisirais-tu ? Donne ton avis et une raison.', 'Avis personnel formulé et justifié.', 6]
    ],
    grammaire: [
      ['Les déterminants', 'Complète les noms suivants par un déterminant qui convient : … métier, … machines, … journaliste.', 'Exemples : un métier, des machines, le journaliste.', 3],
      ['Déterminant possessif', 'Remplace le groupe souligné par un déterminant possessif : « le téléphone de Sami ».', 'son téléphone', 3],
      ['Déterminant démonstratif', 'Complète par ce, cet, cette ou ces : … ordinateur, … émission, … appareils.', 'cet ordinateur, cette émission, ces appareils', 3],
      ['Pronoms personnels', 'Évite les répétitions : « Salma prépare le pain. Salma range le pain. Les clients achètent le pain. »', 'Salma prépare le pain. Elle le range. Les clients l’achètent.', 3]
    ],
    conjugaison: [
      ['Présent des verbes usuels', 'Conjugue les verbes entre parenthèses au présent : Le facteur (faire) sa tournée et (remettre) les lettres.', 'fait ; remet', 3],
      ['Passé composé', 'Mets au passé composé : « Le journaliste prépare son reportage. »', 'Le journaliste a préparé son reportage.', 3],
      ['Futur', 'Mets au futur : « Nous utilisons une nouvelle machine. »', 'Nous utiliserons une nouvelle machine.', 3],
      ['Impératif', 'Transforme le conseil à l’impératif : « Tu dois allumer l’ordinateur puis ouvrir le fichier. »', 'Allume l’ordinateur puis ouvre le fichier.', 3]
    ],
    orthographe: [
      ['Choisir a ou à', 'Complète : Le journaliste … un article … terminer.', 'a ; à', 4],
      ['Phrase avec a / à', 'Complète : Sami … appris … utiliser cette machine.', 'a ; à', 4],
      ['Transformer a', 'Réécris la phrase au passé pour vérifier « a » : « Il a un ordinateur. »', 'Il avait un ordinateur.', 4],
      ['Révision a / à', 'Recopie en choisissant : « Le journaliste (a / à) un reportage (a / à) terminer. Il commence (a / à) travailler. »', 'Le journaliste a un reportage à terminer. Il commence à travailler.', 4]
    ],
    production: [
      ['Un métier passionnant', 'Raconte en au moins six phrases une journée d’un professionnel que tu admires.', 'Le récit respecte la consigne, suit un ordre logique et emploie le vocabulaire du travail.', 1],
      ['Une machine en panne', 'Tu reçois un appareil qui ne fonctionne pas. Raconte le problème et la solution en au moins six phrases.', 'Situation initiale, problème, actions et solution cohérente.', 5],
      ['Reporter à l’école', 'Imagine que tu es journaliste. Raconte un événement de ton école et donne un titre à ton texte.', 'Titre pertinent, récit structuré et informations compréhensibles.', 6],
      ['Le métier de demain', 'Imagine un métier qui utilisera une nouvelle technologie et présente-le dans un court récit.', 'Production créative, vocabulaire riche et formes verbales correctes.', 6]
    ]
  },
  2: {
    oral: [
      ['Décrire une scène d’entraide', 'Observe une scène d’entraide puis décris les personnages, le lieu et leurs actions.', 'Description précise avec vocabulaire adapté.', 1],
      ['Raconter une action solidaire', 'Raconte une action solidaire vécue ou imaginée en respectant l’ordre des événements.', 'Récit oral cohérent et correction linguistique suffisante.', 3],
      ['Prendre position', 'Un camarade est exclu d’un jeu. Que penses-tu de cette situation ? Justifie ton avis.', 'Prise de position respectueuse et justification claire.', 4],
      ['Dialogue de réconciliation', 'Joue avec un camarade un dialogue qui permet de résoudre un conflit.', 'Échange fluide, ton adapté et solution pacifique.', 6]
    ],
    lecture: [
      ['Comprendre une action solidaire', 'Après lecture du texte, indique qui aide, qui reçoit l’aide, où et pourquoi.', 'Les quatre informations doivent correspondre au texte.', 2],
      ['Vocabulaire de l’entraide', 'Trouve dans le texte un synonyme de « aider » puis emploie-le dans une phrase.', 'Un synonyme contextuellement correct et une phrase juste.', 3],
      ['Justification', 'Le personnage a-t-il agi avec tolérance ? Réponds et relève un indice.', 'Réponse cohérente appuyée par un indice textuel.', 4],
      ['Valeur du texte', 'Quelle valeur retiens-tu de cette histoire : paix, tolérance ou solidarité ? Explique.', 'Une valeur pertinente et une justification personnelle.', 6]
    ],
    grammaire: [
      ['Adjectif épithète', 'Souligne l’adjectif épithète : « La généreuse voisine aide l’enfant. »', 'généreuse', 3],
      ['Adjectif attribut', 'Complète avec un adjectif attribut : « Les deux amis sont … »', 'Toute réponse correcte accordée avec « amis ».', 3],
      ['Ne… plus', 'Mets à la forme négative avec ne… plus : « Il se dispute encore avec son voisin. »', 'Il ne se dispute plus avec son voisin.', 3],
      ['Ne… jamais', 'Réécris avec ne… jamais : « Elle refuse toujours d’aider. »', 'Elle ne refuse jamais d’aider.', 3]
    ],
    conjugaison: [
      ['Être au futur', 'Conjugue être au futur : Demain, nous … plus solidaires.', 'serons', 3],
      ['Avoir au passé composé', 'Mets au passé composé : « Les élèves ont une bonne idée. »', 'Les élèves ont eu une bonne idée.', 3],
      ['Finir au futur', 'Complète au futur : Vous (finir) ce travail ensemble.', 'finirez', 3],
      ['Temps mélangés', 'Conjugue selon le repère : Hier ils (finir) le projet ; demain ils (être) fiers.', 'ont fini ; seront', 3]
    ],
    orthographe: [
      ['Son ou sont', 'Complète : Ils … heureux d’aider … camarade.', 'sont ; son', 4],
      ['Et ou est', 'Complète : Le directeur … satisfait … félicite les élèves.', 'est ; et', 4],
      ['Homophones mélangés', 'Complète par son, sont, et ou est : Ali … Sami … prêts ; chacun prend … sac.', 'et ; sont ; son', 4],
      ['Réécriture contrôlée', 'Écris deux phrases sur l’entraide : l’une avec son/sont et l’autre avec et/est.', 'Phrases correctes permettant de distinguer chaque homophone.', 4]
    ],
    production: [
      ['Une aide inattendue', 'Raconte en au moins sept phrases une situation où un élève aide un camarade. Intègre deux répliques.', 'Récit cohérent avec dialogue correctement introduit.', 1],
      ['Résoudre un conflit', 'Deux enfants se disputent puis trouvent une solution pacifique. Raconte la scène.', 'Progression logique du conflit vers une solution.', 5],
      ['Nouvel élève', 'Un nouvel élève arrive dans la classe. Raconte comment il est accueilli et fais parler deux personnages.', 'Tolérance, dialogue et vocabulaire adapté.', 6],
      ['Projet solidaire', 'Imagine et raconte un projet solidaire réalisé par ta classe.', 'Projet compréhensible, étapes organisées et idées originales.', 6]
    ]
  },
  3: {
    oral: [
      ['Décrire un lieu pollué', 'Décris un lieu pollué puis explique ce qu’il faut faire pour le nettoyer.', 'Description compréhensible et vocabulaire environnemental.', 1],
      ['Donner des conseils de santé', 'Donne trois conseils à un camarade qui veut rester en bonne santé.', 'Conseils formulés correctement avec les structures étudiées.', 3],
      ['Justifier un geste écologique', 'Choisis un geste écologique important et explique pourquoi il est utile.', 'Choix clair et justification cohérente.', 4],
      ['Interview santé', 'Joue une courte interview entre un journaliste et un professionnel de la santé.', 'Échange fluide, questions compréhensibles et réponses expressives.', 6]
    ],
    lecture: [
      ['Comprendre un problème écologique', 'Relève le problème présenté, sa cause et la solution proposée dans le texte.', 'Problème, cause et solution conformes au texte.', 2],
      ['Vocabulaire de l’environnement', 'Explique dans le contexte les mots « déchets » et « protéger ».', 'Explications simples et cohérentes avec le texte.', 3],
      ['Justifier un conseil', 'Le conseil donné est-il utile ? Réponds et justifie avec un passage du texte.', 'Réponse appuyée par un indice pertinent.', 4],
      ['Donner son avis', 'Propose une autre action pour protéger la nature ou rester en bonne santé.', 'Proposition personnelle réalisable et clairement formulée.', 6]
    ],
    grammaire: [
      ['Complément essentiel', 'Repère le complément essentiel : « Les élèves ramassent les déchets. »', 'les déchets', 3],
      ['Complément non essentiel', 'Supprime le complément non essentiel : « Chaque matin, Lina fait du sport. »', 'Lina fait du sport.', 3],
      ['Complément de lieu', 'Complète par un complément de lieu : « Les enfants plantent des arbres … »', 'Exemple : dans le jardin de l’école.', 3],
      ['Classer les compléments', 'Classe les groupes entre crochets : « [Chaque matin], Lina fait [du sport] [dans le parc]. »', 'Chaque matin : complément non essentiel de temps ; du sport : complément essentiel ; dans le parc : complément de lieu.', 3]
    ],
    conjugaison: [
      ['Prendre au passé composé', 'Conjugue au passé composé : Nous (prendre) soin du jardin.', 'avons pris', 3],
      ['Mettre au futur', 'Conjugue au futur : Tu (mettre) les déchets dans la poubelle.', 'mettras', 3],
      ['Aller au passé composé', 'Mets au passé composé : « Elles vont chez le médecin. »', 'Elles sont allées chez le médecin.', 3],
      ['Faire au futur', 'Complète au futur : Pour rester en forme, vous (faire) du sport.', 'ferez', 3]
    ],
    orthographe: [
      ['Accord sujet-verbe', 'Choisis : Les enfants protège / protègent la forêt.', 'protègent', 4],
      ['Accord de l’adjectif', 'Accorde : des fruits (mûr) et une enfant (heureux).', 'mûrs ; heureuse', 4],
      ['Genre et nombre', 'Mets au pluriel : « La plante verte est fragile. »', 'Les plantes vertes sont fragiles.', 4],
      ['Correction d’erreurs', 'Corrige : « Les élèves courageux ramasse les bouteilles vide. »', 'Les élèves courageux ramassent les bouteilles vides.', 4]
    ],
    production: [
      ['Nettoyer le quartier', 'Raconte une action de nettoyage organisée dans ton quartier. Décris le lieu avant et après.', 'Récit organisé avec un passage descriptif.', 1],
      ['Conseil de santé', 'Un ami adopte une mauvaise habitude. Raconte la situation et intègre les conseils que tu lui donnes.', 'Situation, dialogue ou conseils, puis amélioration attendue.', 5],
      ['Sauver un animal', 'Raconte comment des enfants découvrent puis sauvent un animal en danger.', 'Actions ordonnées, descriptions pertinentes et fin cohérente.', 6],
      ['École écologique', 'Imagine une journée dans une école sans déchets et raconte ce que font les élèves.', 'Idées originales, lexique thématique et cohérence du récit.', 6]
    ]
  },
  4: {
    oral: [
      ['Présenter son loisir préféré', 'Présente ton loisir préféré, le moment où tu le pratiques et les raisons de ton choix.', 'Présentation adaptée et préférence clairement exprimée.', 1],
      ['Raconter un voyage', 'Raconte oralement un voyage réel ou imaginaire en utilisant des repères de temps.', 'Récit organisé avec formes verbales correctes.', 3],
      ['Comparer deux modes de vie', 'Présente une ressemblance et une différence entre deux modes de vie.', 'Comparaison cohérente et respectueuse.', 4],
      ['Guide touristique', 'Joue le rôle d’un guide qui présente un lieu culturel à des visiteurs.', 'Expression fluide, vocabulaire riche et attitude adaptée.', 6]
    ],
    lecture: [
      ['Comprendre un voyage', 'Relève le lieu de départ, la destination, les voyageurs et deux événements du voyage.', 'Informations correctement relevées dans le texte.', 2],
      ['Vocabulaire culturel', 'Explique deux mots liés au voyage ou à la culture à partir du contexte.', 'Explications cohérentes avec le contexte.', 3],
      ['Justifier une émotion', 'Quel sentiment éprouve le personnage ? Justifie par une phrase du texte.', 'Sentiment pertinent et indice textuel.', 4],
      ['Comparer les modes de vie', 'Quelle différence remarques-tu entre le mode de vie décrit et le tien ?', 'Comparaison respectueuse et clairement expliquée.', 6]
    ],
    grammaire: [
      ['Complément de temps', 'Repère le complément de temps : « Pendant les vacances, nous visitons Tunis. »', 'Pendant les vacances', 3],
      ['Complément de manière', 'Repère le complément de manière : « Le guide parle calmement. »', 'calmement', 3],
      ['Enrichir une phrase', 'Ajoute un complément de temps et un complément de manière : « Les touristes avancent. »', 'Toute phrase correcte contenant les deux compléments.', 3],
      ['Temps ou manière', 'Classe dans deux colonnes : demain, avec prudence, pendant les vacances, rapidement, chaque soir, en silence.', 'Temps : demain, pendant les vacances, chaque soir. Manière : avec prudence, rapidement, en silence.', 3]
    ],
    conjugaison: [
      ['Dire et lire', 'Conjugue au présent : Vous (dire) la vérité et vous (lire) la lettre.', 'dites ; lisez', 3],
      ['Écrire au passé composé', 'Mets au passé composé : « Elle écrit une carte postale. »', 'Elle a écrit une carte postale.', 3],
      ['Vouloir et pouvoir', 'Conjugue au présent : Nous (vouloir) voyager mais nous ne (pouvoir) pas partir.', 'voulons ; pouvons', 3],
      ['Impératif', 'Mets à l’impératif : « Tu lis le guide puis tu écris à tes parents. »', 'Lis le guide puis écris à tes parents.', 3]
    ],
    orthographe: [
      ['Accord de l’adjectif', 'Accorde : une (beau) ville, une guide (gentil), des vêtements (neuf).', 'belle ; gentille ; neufs', 4],
      ['Participe passé avec être', 'Accorde : Elles sont (arriver) puis sont (partir) en excursion.', 'arrivées ; parties', 4],
      ['Transformer au féminin', 'Mets au féminin : « Le nouveau voyageur est heureux. »', 'La nouvelle voyageuse est heureuse.', 4],
      ['Correction d’accords', 'Corrige : « Les filles sont arrivé dans une beau ville. »', 'Les filles sont arrivées dans une belle ville.', 4]
    ],
    production: [
      ['Lettre de vacances', 'Écris une lettre à un ami pour raconter tes vacances et décrire un lieu visité.', 'Forme de la lettre, récit compréhensible et description du lieu.', 1],
      ['Un loisir découvert', 'Raconte comment tu as découvert un nouveau loisir et explique pourquoi tu l’apprécies.', 'Récit ordonné et préférence justifiée.', 5],
      ['Voyage culturel', 'Raconte une visite dans une région ou un pays et décris une tradition découverte.', 'Description respectueuse intégrée à un récit cohérent.', 6],
      ['Autre mode de vie', 'Imagine la journée d’un enfant vivant dans un autre milieu et rédige un récit descriptif.', 'Créativité, cohérence et vocabulaire culturel approprié.', 6]
    ]
  }
});

function createDefaultQuestionBank() {
  return [...createGuidedReadingBank(), ...createGuidedLanguageBank(), ...createGuidedExpressionBank()];
}

function clean(value, max = 4000) {
  return String(value ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').slice(0, max);
}

function normalizeQuestion(source, fallbackId) {
  const activityId = ACTIVITY_DEFINITIONS[source?.activityId] ? source.activityId : 'lecture';
  const activity = ACTIVITY_DEFINITIONS[activityId];
  const requestedCriterion = Number(source?.criterionId);
  const criterionId = activity.criteria.some((criterion) => criterion.id === requestedCriterion)
    ? requestedCriterion : activity.criteria[0].id;
  return {
    id: clean(source?.id, 120) || fallbackId,
    setId: clean(source?.setId, 120),
    contentKey: clean(source?.contentKey, 200),
    task: normalizeTask(source?.task),
    answerLines: Number.isInteger(source?.answerLines) ? Math.max(0, Math.min(24, source.answerLines)) : null,
    levelId: /^[4-6]$/.test(String(source?.levelId)) ? String(source.levelId) : '6',
    unitId: /^[1-9][0-9]*$/.test(String(source?.unitId)) ? String(source.unitId) : '1',
    activityId,
    criterionId,
    indicator: clean(source?.indicator, 1000),
    support: clean(source?.support),
    title: clean(source?.title, 200) || 'Nouvel exercice',
    prompt: clean(source?.prompt),
    answer: clean(source?.answer),
    difficulty: DIFFICULTIES.some((item) => item.id === source?.difficulty) ? source.difficulty : 'consolidation',
    model: clean(source?.model, 30) || 'A',
    active: source?.active !== false,
    favorite: source?.favorite === true,
    source: clean(source?.source, 200) || 'Création personnalisée',
    visualType: ['none', 'image', 'table'].includes(source?.visualType) ? source.visualType : 'none',
    visualTitle: clean(source?.visualTitle, 200),
    visualData: clean(source?.visualData, 4000)
  };
}

function normalizeQuestionBank(candidate) {
  const source = Array.isArray(candidate) ? candidate : createDefaultQuestionBank();
  const ids = new Set();
  return source.slice(0, 5000).map((question, index) => {
    let id = clean(question?.id, 120) || `question-${Date.now()}-${index}`;
    while (ids.has(id)) id = `${id}-${index + 1}`;
    ids.add(id);
    return normalizeQuestion({ ...question, id }, id);
  });
}

function upgradeQuestionBank(candidate, version = 0) {
  if (Number(version) >= QUESTION_BANK_VERSION) return normalizeQuestionBank(candidate);
  const defaults = normalizeQuestionBank(createDefaultQuestionBank());
  const defaultIds = new Set(defaults.map((question) => question.id));
  const previousDefaults = new Map(normalizeQuestionBank(createExpandedSixthGradeBank()).map((question) => [question.id, question]));
  // Retire only untouched bundled exercises. Teacher edits, favorites and
  // exclusions are personal data and must survive this content upgrade.
  const custom = Array.isArray(candidate)
    ? normalizeQuestionBank(candidate).filter((question) => {
      if (defaultIds.has(question.id)) {
        defaults[defaults.findIndex((item) => item.id === question.id)] = question;
        return false;
      }
      const previous = previousDefaults.get(question.id);
      return !previous || JSON.stringify(previous) !== JSON.stringify(question);
    })
    : [];
  return [...defaults, ...custom];
}

module.exports = {
  DIFFICULTIES,
  QUESTION_BANK_VERSION,
  UNIT_BANKS,
  createDefaultQuestionBank,
  normalizeQuestion,
  normalizeQuestionBank,
  upgradeQuestionBank
};
