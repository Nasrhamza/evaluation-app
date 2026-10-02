// Original, finite practice sets: changing the scaffold never changes the content key.
// Correct pairs and ordered parts are stored in pedagogical order; the worksheet
// renderer is responsible for shuffling the right column and word strips.
const DIFFICULTIES = ['remediation', 'consolidation', 'approfondissement'];
const set = (type, title, example, hint, items) => ({ type, title, example, hint, items });
const match = (title, example, hint, pairs) => set('matching', title, example, hint, pairs.map(([left, right]) => ({ left, right })));
const choose = (title, example, hint, rows) => set('choice', title, example, hint, rows.map(([stem, ...options]) => ({ stem, options, correct: 0 })));
const fill = (title, example, hint, rows) => ({ ...choose(title, example, hint, rows), type: 'cloze' });
const order = (title, example, hint, rows) => set('order', title, example, hint, rows.map((parts) => ({ parts })));
const short = (title, example, hint, rows) => set('short', title, example, hint, rows.map(([stem, solution]) => ({ stem, solution })));

const GRAMMAR = {
  1: [
    match('Un déterminant pour chaque nom', 'une gomme', 'Regarde le genre et le nombre du nom.', [['un', 'journal'], ['une', 'imprimante'], ['des', 'ordinateurs']]),
    match('Les articles définis', 'les crayons', 'Le : masculin. La : féminin. Les : pluriel.', [['le', 'clavier'], ['la', 'souris'], ['les', 'écrans']]),
    match('Remplacer le sujet', 'Nour dessine. → Elle dessine.', 'Cherche qui fait l’action.', [['Le menuisier', 'Il travaille.'], ['Les journalistes', 'Ils écrivent.'], ['La photographe', 'Elle arrive.']]),
    match('Des sujets et leurs pronoms', 'Mon frère → il', 'Observe si le sujet est seul ou avec une autre personne.', [['Toi et moi', 'nous'], ['Toi et Sami', 'vous'], ['Mouna et Amira', 'elles']]),
    choose('Reconnaître le nom', 'Dans « un jardin vert », le nom est jardin.', 'Le nom désigne une personne, un animal ou une chose.', [['Quel mot est un nom ?', 'ordinateur', 'rapidement', 'écrit'], ['Quel mot désigne un métier ?', 'facteur', 'distribue', 'vite']]),
    choose('Choisir un article', 'Voici une image.', 'Regarde le nom placé après le blanc.', [['Le journaliste lit ____ message.', 'un', 'une', 'des'], ['Sami ouvre ____ enveloppes.', 'des', 'un', 'une']]),
    choose('Mon, ma ou mes', 'Ce vélo est à moi : c’est mon vélo.', 'Mon : masculin. Ma : féminin. Mes : pluriel.', [['Cette caméra est à moi : c’est ____ caméra.', 'ma', 'mon', 'mes'], ['Ces outils sont à moi : ce sont ____ outils.', 'mes', 'ma', 'mon']]),
    choose('Ton, ta ou tes', 'Ce cahier est à toi : c’est ton cahier.', 'Le déterminant s’accorde avec l’objet possédé.', [['Ce téléphone est à toi : c’est ____ téléphone.', 'ton', 'ta', 'tes'], ['Cette règle est à toi : c’est ____ règle.', 'ta', 'tes', 'ton']]),
    choose('Son, sa ou ses', 'Ce livre est à Lina : c’est son livre.', 'Regarde le genre et le nombre de l’objet.', [['Les crayons sont à Ali : ce sont ____ crayons.', 'ses', 'sa', 'son'], ['La trousse est à Ali : c’est ____ trousse.', 'sa', 'son', 'ses']]),
    choose('Ce, cette ou ces', 'cette table', 'Ce : masculin. Cette : féminin. Ces : pluriel.', [['____ facteur prépare sa tournée.', 'Ce', 'Cette', 'Ces'], ['____ affiches sont colorées.', 'Ces', 'Cette', 'Ce']]),
    choose('Cet devant une voyelle', 'cet arbre', 'Devant un nom masculin commençant par une voyelle, utilise cet.', [['Je regarde ____ écran.', 'cet', 'cette', 'ces'], ['Le technicien répare ____ appareil.', 'cet', 'ce', 'cette']]),
    choose('Choisir le pronom sujet', 'La fille parle. → Elle parle.', 'Remplace tout le groupe sujet.', [['Les ouvrières arrivent. → ____ arrivent.', 'Elles', 'Elle', 'Il'], ['Le médecin écoute. → ____ écoute.', 'Il', 'Ils', 'Elle']]),
    fill('Compléter les déterminants possessifs', 'Ces clés sont à moi : mes clés.', 'Repère d’abord à qui appartient l’objet.', [['Ce sac est à moi : ____ sac.', 'mon', 'ma', 'mes'], ['Ces photos sont à toi : ____ photos.', 'tes', 'ta', 'ton']]),
    fill('Compléter les déterminants démonstratifs', 'Je montre une fleur : cette fleur.', 'Accorde avec le nom qui suit.', [['Regarde ____ machine !', 'cette', 'ce', 'ces'], ['Regarde ____ bureaux !', 'ces', 'cette', 'cet']]),
    order('Remettre la phrase en ordre', 'une / photo / jolie → une jolie photo', 'Place le déterminant avant le nom.', [['Cette', 'journaliste', 'écrit', 'un article.'], ['Mon', 'frère', 'répare', 'son ordinateur.']]),
    short('Éviter de répéter le sujet', 'Le boulanger arrive. Le boulanger sourit. → Il sourit.', 'Réécris seulement la deuxième phrase avec il, elle, ils ou elles.', [['Le facteur arrive. Le facteur apporte une lettre.', 'Il apporte une lettre.'], ['Les infirmières entrent. Les infirmières parlent doucement.', 'Elles parlent doucement.']])
  ],
  2: [
    match('Accorder un adjectif simple', 'une amie gentille', 'Lis le nom et regarde sa terminaison.', [['un voisin', 'gentil'], ['une voisine', 'gentille'], ['des voisines', 'gentilles']]),
    match('Former des groupes avec un adjectif', 'un sac lourd', 'Observe le genre et le nombre.', [['un garçon', 'discret'], ['une fille', 'discrète'], ['des filles', 'discrètes']]),
    match('Reconnaître la place de l’adjectif', 'une jolie affiche → épithète', 'Près du nom : épithète. Après être : attribut.', [['une rue calme', 'calme : épithète'], ['La cour est propre.', 'propre : attribut'], ['un nouveau camarade', 'nouveau : épithète']]),
    match('Comprendre la phrase négative', 'Il ne court pas. → Il marche.', 'Lis toute la phrase.', [['Elle ne joue plus.', 'Elle a arrêté de jouer.'], ['Il ne ment jamais.', 'Il dit toujours la vérité.'], ['La porte n’est pas ouverte.', 'La porte est fermée.']]),
    choose('Repérer l’adjectif épithète', 'Dans « un petit sac », petit est l’adjectif.', 'L’adjectif apporte une précision sur le nom.', [['Quel est l’adjectif dans « un ami fidèle » ?', 'fidèle', 'ami', 'un'], ['Quel est l’adjectif dans « une belle action » ?', 'belle', 'action', 'une']]),
    choose('Repérer l’adjectif attribut', 'La salle est grande. → grande', 'Cherche le mot qui décrit le sujet après est ou sont.', [['Dans « Les enfants sont contents », l’adjectif est…', 'contents', 'enfants', 'sont'], ['Dans « Lina est patiente », l’adjectif est…', 'patiente', 'Lina', 'est']]),
    choose('Épithète ou attribut', 'Le jardin est joli. → attribut', 'Cherche le verbe être.', [['Dans « un élève poli », poli est…', 'épithète', 'attribut', 'un verbe'], ['Dans « Le voisin est généreux », généreux est…', 'attribut', 'épithète', 'un nom']]),
    choose('Choisir ne… plus', 'Avant, il criait. Maintenant, il ne crie plus.', 'Ne… plus indique qu’une action s’arrête.', [['Avant, Sami se moquait. Maintenant, il ne se moque ____.', 'plus', 'toujours', 'encore'], ['Elle a fini de pleurer. Elle ne pleure ____.', 'plus', 'toujours', 'encore']]),
    choose('Choisir ne… jamais', 'À aucun moment, je ne triche. → Je ne triche jamais.', 'Ne… jamais veut dire : à aucun moment.', [['Amira dit toujours la vérité. Elle ne ment ____.', 'jamais', 'encore', 'toujours'], ['Il aide à chaque fois. Il ne refuse ____ d’aider.', 'jamais', 'toujours', 'encore']]),
    choose('Placer la négation', 'Elle rit. → Elle ne rit pas.', 'Place ne avant le verbe et pas après.', [['Quelle phrase est bien écrite ?', 'Il ne pousse pas son ami.', 'Il pousse ne pas son ami.', 'Il pas ne pousse son ami.'], ['Quelle phrase est bien écrite ?', 'Nous ne crions plus.', 'Nous plus ne crions.', 'Nous ne plus crions.']]),
    choose('N’ devant une voyelle', 'Elle n’oublie jamais ses amis.', 'Ne devient n’ devant une voyelle.', [['Il ____ insulte jamais ses camarades.', 'n’', 'ne', 'pas'], ['Elle ____ abandonne plus son ami.', 'n’', 'ne', 'plus']]),
    choose('Choisir l’adjectif adapté', 'La voisine aide tout le monde : elle est serviable.', 'Utilise le sens de la phrase.', [['Il attend son tour sans se fâcher. Il est…', 'patient', 'impatient', 'absent'], ['Elle partage son goûter. Elle est…', 'généreuse', 'égoïste', 'bruyante']]),
    fill('Compléter ne… plus', 'Je ne cours plus.', 'Le verbe se place entre les deux mots de négation.', [['L’enfant ____ pleure plus.', 'ne', 'plus', 'jamais'], ['Nous ne nous disputons ____.', 'plus', 'ne', 'toujours']]),
    fill('Compléter les adjectifs', 'une équipe unie', 'Accorde l’adjectif avec le nom.', [['Les voisines sont ____.', 'solidaires', 'solidaire', 'solidair'], ['La petite fille est ____.', 'contente', 'content', 'contents']]),
    order('Construire une phrase négative', 'Il / ne / court / plus. → Il ne court plus.', 'Commence par le sujet.', [['Nous', 'ne', 'laissons', 'jamais', 'un ami seul.'], ['Elle', 'n’', 'oublie', 'plus', 'son cahier.']]),
    short('Décrire avec être', 'un garçon poli → Le garçon est poli.', 'Garde le même adjectif et ajoute est.', [['Transforme : une fille courageuse → La fille…', 'La fille est courageuse.'], ['Transforme : un voisin aimable → Le voisin…', 'Le voisin est aimable.']])
  ],
  3: [
    match('Des actions et leur complément', 'boire → de l’eau', 'Relie chaque action à ce qui convient.', [['arroser', 'les plantes'], ['se brosser', 'les dents'], ['ramasser', 'les déchets']]),
    match('Où va chaque personne ?', 'Le malade va → à l’hôpital.', 'Chaque fin de phrase donne un lieu.', [['Le nageur plonge', 'dans la piscine.'], ['Le jardinier travaille', 'dans le potager.'], ['Le pharmacien travaille', 'à la pharmacie.']]),
    match('Trouver la question du complément', 'Il joue dans la cour. → Où ?', 'Lis le groupe indiqué entre guillemets.', [['Elle boit « de l’eau ».', 'Elle boit quoi ?'], ['Il téléphone « à son père ».', 'Il téléphone à qui ?'], ['Elle court « au parc ».', 'Elle court où ?']]),
    match('Repérer les lieux', 'près du lac → lieu', 'Relie chaque début à son lieu habituel.', [['Les poissons nagent', 'dans la rivière.'], ['Le dentiste reçoit ses patients', 'dans son cabinet.'], ['Les oiseaux se posent', 'sur les branches.']]),
    choose('Reconnaître un complément de lieu', 'L’enfant joue au jardin. → au jardin', 'Pose la question : où ?', [['Dans « Le lapin dort dans son terrier », le lieu est…', 'dans son terrier', 'le lapin', 'dort'], ['Dans « Les enfants nagent à la piscine », le lieu est…', 'à la piscine', 'les enfants', 'nagent']]),
    choose('Trouver le complément du verbe', 'Elle lave les fruits. → les fruits', 'Pose la question quoi après le verbe.', [['Dans « Sami plante un arbre », Sami plante…', 'un arbre', 'Sami', 'plante'], ['Dans « Lina ferme le robinet », Lina ferme…', 'le robinet', 'Lina', 'ferme']]),
    choose('Un complément nécessaire au sens', 'Elle habite à Tunis. → à Tunis précise où elle habite.', 'Choisis la fin qui complète le verbe habiter.', [['La famille habite ____.', 'à Sousse', 'avec soin', 'hier'], ['Mon ami habite ____.', 'près du parc', 'lentement', 'toujours']]),
    choose('Retirer un complément non essentiel', 'Ce matin, il mange une pomme. → Il mange une pomme.', 'Retire le groupe de temps sans changer le reste.', [['Retire « chaque soir » : « Chaque soir, Lina lit un livre. »', 'Lina lit un livre.', 'Chaque soir lit un livre.', 'Lina lit chaque soir.'], ['Retire « aujourd’hui » : « Aujourd’hui, Sami lave son vélo. »', 'Sami lave son vélo.', 'Aujourd’hui lave son vélo.', 'Sami aujourd’hui.']]),
    choose('Ajouter un lieu précis', 'Il marche. → Il marche dans la forêt.', 'La réponse doit indiquer où se passe l’action.', [['Les enfants jouent ____.', 'dans la cour', 'demain', 'gentiment'], ['Les poissons vivent ____.', 'dans l’eau', 'hier', 'vite']]),
    choose('Le lieu dans la phrase', 'Dans la classe, nous lisons. → Dans la classe', 'Le lieu peut être au début ou à la fin.', [['Dans « Au dispensaire, le médecin travaille », le lieu est…', 'Au dispensaire', 'le médecin', 'travaille'], ['Dans « Sous l’arbre, le chat dort », le lieu est…', 'Sous l’arbre', 'le chat', 'dort']]),
    choose('Compléter une action', 'Il prend un verre.', 'Choisis un groupe qui répond à quoi.', [['Pour déjeuner, Amira prépare ____.', 'une salade', 'rapidement', 'à midi'], ['Le jardinier coupe ____.', 'les branches sèches', 'hier', 'dans le parc']]),
    choose('Déplacer un complément', 'Il court au parc. → Au parc, il court.', 'Garde les mêmes mots et le même sens.', [['Déplace « dans la forêt » au début : « Nous marchons dans la forêt. »', 'Dans la forêt, nous marchons.', 'Nous dans la forêt marchons dans.', 'La forêt marche.'], ['Déplace « près du lac » au début : « Les enfants jouent près du lac. »', 'Près du lac, les enfants jouent.', 'Les enfants près jouent du lac.', 'Le lac joue près des enfants.']]),
    fill('Compléter les lieux', 'Le bateau avance sur la mer.', 'Lis l’ensemble de la phrase.', [['Le médecin soigne les malades ____.', 'à l’hôpital', 'dans le ciel', 'sous la mer'], ['Les oiseaux construisent un nid ____.', 'dans l’arbre', 'au fond du puits', 'dans le cartable']]),
    fill('Compléter avec un objet', 'Je ferme la porte.', 'Choisis l’objet sur lequel porte l’action.', [['Pour se laver, Sami prend ____.', 'du savon', 'des cailloux', 'un cahier'], ['Pour boire, Lina remplit ____.', 'son verre', 'ses chaussures', 'son oreiller']]),
    order('Construire une phrase avec un lieu', 'Lina / joue / au parc. → Lina joue au parc.', 'Commence par le sujet et termine par le lieu.', [['Les enfants', 'ramassent', 'les papiers', 'dans la cour.'], ['Le médecin', 'écoute', 'le malade', 'dans son cabinet.']]),
    short('Répondre à où', 'Le chat dort sur le tapis. Où dort le chat ? → Sur le tapis.', 'Recopie seulement le groupe qui indique le lieu.', [['Nous plantons des fleurs dans le jardin. Où plantons-nous des fleurs ?', 'Dans le jardin.'], ['Amira attend devant la pharmacie. Où attend Amira ?', 'Devant la pharmacie.']])
  ],
  4: [
    match('Repérer le moment', 'ce soir → quand ?', 'Cherche un repère de temps.', [['le jour avant aujourd’hui', 'hier'], ['le jour après aujourd’hui', 'demain'], ['le jour où nous sommes', 'aujourd’hui']]),
    match('Comprendre la manière', 'avec joie → joyeusement', 'Les deux expressions disent comment on agit.', [['avec soin', 'soigneusement'], ['avec calme', 'calmement'], ['avec lenteur', 'lentement']]),
    match('Des actions et leur manière', 'chuchoter → à voix basse', 'Relie selon le sens.', [['Le musicien joue sans faire d’erreur.', 'Il joue correctement.'], ['L’enfant avance sans bruit.', 'Il avance silencieusement.'], ['La danseuse bouge avec grâce.', 'Elle bouge gracieusement.']]),
    match('Associer la question au groupe', 'en souriant → comment ?', 'Temps : quand ? Manière : comment ? Lieu : où ?', [['samedi prochain', 'Quand ?'], ['avec attention', 'Comment ?'], ['au musée', 'Où ?']]),
    choose('Trouver le complément de temps', 'Demain, nous voyagerons. → Demain', 'Pose la question quand.', [['Dans « Le train part à huit heures », le temps est…', 'à huit heures', 'le train', 'part'], ['Dans « Pendant les vacances, Lina dessine », le temps est…', 'Pendant les vacances', 'Lina', 'dessine']]),
    choose('Trouver le complément de manière', 'Elle lit avec soin. → avec soin', 'Pose la question comment.', [['Dans « Le guide parle lentement », la manière est…', 'lentement', 'le guide', 'parle'], ['Dans « Sami peint avec précision », la manière est…', 'avec précision', 'Sami', 'peint']]),
    choose('Choisir un moment', 'Nous partons demain.', 'Complète avec une réponse à quand.', [['Le spectacle commence ____.', 'ce soir', 'doucement', 'avec soin'], ['Nous visitons le musée ____.', 'dimanche prochain', 'lentement', 'avec joie']]),
    choose('Choisir une manière', 'Le train avance rapidement.', 'Complète avec une réponse à comment.', [['Le public écoute ____.', 'attentivement', 'demain', 'dimanche'], ['La fillette chante ____.', 'joyeusement', 'hier', 'ce matin']]),
    choose('Temps ou manière : avant le verbe', 'Avec patience, il attend. → manière', 'Demande quand ou comment.', [['Dans « Hier, nous avons visité Sfax », hier indique…', 'le temps', 'la manière', 'le lieu'], ['Dans « Sans bruit, Lina ouvre la porte », sans bruit indique…', 'la manière', 'le temps', 'le lieu']]),
    choose('Temps ou manière : après le verbe', 'Il marche avec prudence. → manière', 'Le groupe placé à la fin peut indiquer quand ou comment.', [['Dans « Le concert finit à midi », à midi indique…', 'le temps', 'la manière', 'le lieu'], ['Dans « Elle écrit soigneusement », soigneusement indique…', 'la manière', 'le temps', 'le lieu']]),
    choose('Garder le sens de la manière', 'avec rapidité → rapidement', 'Choisis le mot qui garde le même sens.', [['Le guide explique avec clarté. Il explique…', 'clairement', 'rarement', 'tristement'], ['Sami répond avec politesse. Il répond…', 'poliment', 'bruyamment', 'hier']]),
    choose('Déplacer le complément de temps', 'Elle part demain. → Demain, elle part.', 'Garde le même moment et la même action.', [['Déplace « chaque été » : « Nous voyageons chaque été. »', 'Chaque été, nous voyageons.', 'Nous chaque voyageons été.', 'Nous voyageons hier.'], ['Déplace « le matin » : « Amira dessine le matin. »', 'Le matin, Amira dessine.', 'Amira matin le dessine.', 'Le soir, Amira dessine.']]),
    fill('Compléter avec un temps', 'Le match commence à dix heures.', 'Regarde si la phrase parle du passé ou de l’avenir.', [['____, nous avons visité le musée.', 'Hier', 'Demain', 'L’année prochaine'], ['____, nous irons au cinéma.', 'Demain', 'Hier', 'La semaine dernière']]),
    fill('Compléter avec une manière', 'Elle range avec soin.', 'Choisis la manière adaptée à la situation.', [['À la bibliothèque, on parle ____.', 'à voix basse', 'en criant', 'bruyamment'], ['Pour traverser la route, on avance ____.', 'prudemment', 'sans regarder', 'les yeux fermés']]),
    order('Construire une phrase avec quand ou comment', 'Demain, / nous / partirons. → Demain, nous partirons.', 'Le premier groupe est le début de la phrase.', [['Ce soir,', 'les enfants', 'regarderont', 'un film.'], ['Le musicien', 'joue', 'avec douceur.']]),
    short('Répondre à quand ou comment', 'Elle arrive demain. Quand arrive-t-elle ? → Demain.', 'Recopie uniquement le groupe demandé.', [['Nous visiterons le musée samedi. Quand visiterons-nous le musée ?', 'Samedi.'], ['Le guide raconte l’histoire avec passion. Comment raconte-t-il l’histoire ?', 'Avec passion.']])
  ]
};

const VERBS = {
  travailler: { present: ['travaille', 'travailles', 'travaille', 'travaillons', 'travaillez', 'travaillent'], future: ['travaillerai', 'travailleras', 'travaillera', 'travaillerons', 'travaillerez', 'travailleront'], past: 'travaillé', imperative: ['travaille', 'travaillons', 'travaillez'] },
  parler: { present: ['parle', 'parles', 'parle', 'parlons', 'parlez', 'parlent'], past: 'parlé' },
  préparer: { present: ['prépare', 'prépares', 'prépare', 'préparons', 'préparez', 'préparent'], past: 'préparé', imperative: ['prépare', 'préparons', 'préparez'] },
  jouer: { present: ['joue', 'joues', 'joue', 'jouons', 'jouez', 'jouent'], past: 'joué' },
  regarder: { future: ['regarderai', 'regarderas', 'regardera', 'regarderons', 'regarderez', 'regarderont'], past: 'regardé' },
  envoyer: { past: 'envoyé' },
  utiliser: { future: ['utiliserai', 'utiliseras', 'utilisera', 'utiliserons', 'utiliserez', 'utiliseront'], imperative: ['utilise', 'utilisons', 'utilisez'] },
  aider: { future: ['aiderai', 'aideras', 'aidera', 'aiderons', 'aiderez', 'aideront'] },
  écouter: { imperative: ['écoute', 'écoutons', 'écoutez'] },
  être: { future: ['serai', 'seras', 'sera', 'serons', 'serez', 'seront'], past: 'été' },
  avoir: { future: ['aurai', 'auras', 'aura', 'aurons', 'aurez', 'auront'], past: 'eu' },
  finir: { future: ['finirai', 'finiras', 'finira', 'finirons', 'finirez', 'finiront'], past: 'fini' },
  choisir: { future: ['choisirai', 'choisiras', 'choisira', 'choisirons', 'choisirez', 'choisiront'], past: 'choisi' },
  grandir: { future: ['grandirai', 'grandiras', 'grandira', 'grandirons', 'grandirez', 'grandiront'], past: 'grandi' },
  réussir: { future: ['réussirai', 'réussiras', 'réussira', 'réussirons', 'réussirez', 'réussiront'], past: 'réussi' },
  remplir: { future: ['remplirai', 'rempliras', 'remplira', 'remplirons', 'remplirez', 'rempliront'], past: 'rempli' },
  applaudir: { future: ['applaudirai', 'applaudiras', 'applaudira', 'applaudirons', 'applaudirez', 'applaudiront'], past: 'applaudi' },
  prendre: { future: ['prendrai', 'prendras', 'prendra', 'prendrons', 'prendrez', 'prendront'], past: 'pris' },
  mettre: { future: ['mettrai', 'mettras', 'mettra', 'mettrons', 'mettrez', 'mettront'], past: 'mis' },
  aller: { future: ['irai', 'iras', 'ira', 'irons', 'irez', 'iront'], past: ['suis allé', 'es allé', 'est allé', 'sommes allés', 'êtes allés', 'sont allés'] },
  faire: { future: ['ferai', 'feras', 'fera', 'ferons', 'ferez', 'feront'], past: 'fait' },
  dire: { present: ['dis', 'dis', 'dit', 'disons', 'dites', 'disent'], future: ['dirai', 'diras', 'dira', 'dirons', 'direz', 'diront'], past: 'dit', imperative: ['dis', 'disons', 'dites'] },
  lire: { present: ['lis', 'lis', 'lit', 'lisons', 'lisez', 'lisent'], future: ['lirai', 'liras', 'lira', 'lirons', 'lirez', 'liront'], past: 'lu', imperative: ['lis', 'lisons', 'lisez'] },
  écrire: { present: ['écris', 'écris', 'écrit', 'écrivons', 'écrivez', 'écrivent'], future: ['écrirai', 'écriras', 'écrira', 'écrirons', 'écrirez', 'écriront'], past: 'écrit', imperative: ['écris', 'écrivons', 'écrivez'] },
  vouloir: { future: ['voudrai', 'voudras', 'voudra', 'voudrons', 'voudrez', 'voudront'], past: 'voulu' },
  pouvoir: { future: ['pourrai', 'pourras', 'pourra', 'pourrons', 'pourrez', 'pourront'], past: 'pu' }
};

const CONJUGATION_SPECS = {
  1: [
    ['travailler', 'present', 'dans un atelier'], ['parler', 'present', 'au téléphone'], ['préparer', 'present', 'un article'], ['jouer', 'present', 'le rôle du facteur'],
    ['travailler', 'past', 'avec soin'], ['préparer', 'past', 'une affiche'], ['regarder', 'past', 'un reportage'], ['envoyer', 'past', 'un message'],
    ['travailler', 'future', 'avec le technicien'], ['utiliser', 'future', 'un ordinateur'], ['regarder', 'future', 'les nouvelles'], ['aider', 'future', 'le photographe'],
    ['écouter', 'imperative', 'la consigne'], ['préparer', 'imperative', 'le matériel'], ['utiliser', 'imperative', 'la souris'], ['travailler', 'imperative', 'avec attention']
  ],
  2: [
    ['être', 'future', 'dans la même équipe'], ['avoir', 'future', 'un nouveau camarade'], ['finir', 'future', 'le travail ensemble'], ['choisir', 'future', 'un jeu collectif'],
    ['grandir', 'future', 'dans un quartier paisible'], ['réussir', 'future', 'ce projet solidaire'], ['remplir', 'future', 'un sac de vêtements'], ['applaudir', 'future', 'les bénévoles'],
    ['être', 'past', 'à la fête du quartier'], ['avoir', 'past', 'une bonne idée'], ['finir', 'past', 'la collecte'], ['choisir', 'past', 'un délégué'],
    ['grandir', 'past', 'avec des amis fidèles'], ['réussir', 'past', 'le travail en groupe'], ['remplir', 'past', 'une boîte de dons'], ['applaudir', 'past', 'les joueurs des deux équipes']
  ],
  3: [
    ['prendre', 'future', 'un fruit au goûter'], ['mettre', 'future', 'les déchets dans la poubelle'], ['aller', 'future', 'au jardin'], ['faire', 'future', 'une promenade'],
    ['prendre', 'past', 'une douche'], ['mettre', 'past', 'des gants de jardinage'], ['aller', 'past', 'au parc'], ['faire', 'past', 'du sport'],
    ['prendre', 'future', 'le bus pour moins polluer'], ['mettre', 'future', 'un chapeau au soleil'], ['aller', 'future', 'chez le dentiste'], ['faire', 'future', 'attention aux arbres'],
    ['prendre', 'past', 'le temps de se reposer'], ['mettre', 'past', 'les bouteilles dans le bac de tri'], ['aller', 'past', 'au dispensaire'], ['faire', 'past', 'un repas équilibré']
  ],
  4: [
    ['dire', 'present', 'bonjour au guide'], ['lire', 'present', 'un conte'], ['écrire', 'present', 'une carte postale'],
    ['dire', 'future', 'le titre du spectacle'], ['lire', 'future', 'un livre de voyage'], ['écrire', 'future', 'une lettre'], ['vouloir', 'future', 'visiter le musée'], ['pouvoir', 'future', 'partir en excursion'],
    ['dire', 'past', 'merci au guide'], ['lire', 'past', 'une histoire'], ['écrire', 'past', 'un récit de voyage'], ['vouloir', 'past', 'voir le concert'], ['pouvoir', 'past', 'découvrir une autre ville'],
    ['dire', 'imperative', 'le nom du monument'], ['lire', 'imperative', 'le programme'], ['écrire', 'imperative', 'une invitation']
  ]
};

function verbForms(verb, tense) {
  const entry = VERBS[verb];
  if (tense !== 'past') return entry[tense];
  if (Array.isArray(entry.past)) return entry.past;
  return ['ai', 'as', 'a', 'avons', 'avez', 'ont'].map((auxiliary) => `${auxiliary} ${entry.past}`);
}

const TENSE_LABELS = { present: 'au présent', future: 'au futur', past: 'au passé composé', imperative: 'à l’impératif' };
const EXAMPLE_COMPLEMENTS = {
  travailler: 'en classe', parler: 'avec la maîtresse', préparer: 'une fête', jouer: 'dans la cour', regarder: 'une photo', envoyer: 'une lettre', utiliser: 'une règle', aider: 'un ami', écouter: 'la radio',
  être: 'à la maison', avoir: 'un cahier', finir: 'un dessin', choisir: 'un livre', grandir: 'près de la mer', réussir: 'un exercice', remplir: 'une bouteille', applaudir: 'les artistes',
  prendre: 'un crayon', mettre: 'un pull', aller: 'à l’école', faire: 'un dessin', dire: 'la réponse', lire: 'une affiche', écrire: 'un message', vouloir: 'rester ici', pouvoir: 'jouer dehors'
};
function subjectFor(form, person, verb, tense) {
  if (verb === 'aller' && tense === 'past') return ['Sami', 'Sami', 'Sami', 'Sami et moi', 'Sami et toi', 'Sami et Ali'][person];
  if (person === 0 && /^[aeéiou]/i.test(form)) return 'J’';
  return ['Je', 'Tu', 'Il', 'Nous', 'Vous', 'Ils'][person];
}
function joinSubject(subject, end) { return `${subject}${subject.endsWith('’') ? '' : ' '}${end}`; }

function conjugationSets(unitId) {
  const formats = ['matching', 'choice', 'matching', 'choice', 'cloze', 'choice', 'matching', 'choice', 'matching', 'choice', 'cloze', 'matching', 'choice', 'order', 'short', 'matching'];
  return CONJUGATION_SPECS[unitId].map(([verb, tense, complement], index) => {
    const forms = verbForms(verb, tense);
    const imperative = tense === 'imperative';
    const persons = imperative ? [0, 1, 2] : verb === 'aller' && tense === 'past' ? [2, 3, 5] : [0, 3, 5];
    const title = `${verb.charAt(0).toUpperCase()}${verb.slice(1)} ${TENSE_LABELS[tense]} — ${complement}`;
    const exampleComplement = EXAMPLE_COMPLEMENTS[verb];
    const exampleSubject = verb === 'aller' && tense === 'past' ? 'Sami et moi' : 'Nous';
    const example = imperative
      ? `À un ami : ${verb} ${exampleComplement} → ${forms[0].charAt(0).toUpperCase()}${forms[0].slice(1)} ${exampleComplement} !`
      : `${exampleSubject} (${verb} ${TENSE_LABELS[tense]}) ${exampleComplement} → ${exampleSubject} ${forms[3]} ${exampleComplement}.`;
    const hint = imperative ? 'Un ami : forme de tu. Ensemble : forme de nous. Plusieurs amis : forme de vous.' : `Observe le sujet. Le verbe ${verb} doit être ${TENSE_LABELS[tense]}.${verb === 'aller' && tense === 'past' ? ' Ici, Sami parle avec des garçons : allé ou allés.' : ''}`;
    const labels = imperative ? ['À un ami', 'À notre groupe (nous)', 'À plusieurs amis'] : [];
    const rows = persons.map((person, rowIndex) => {
      const form = forms[person];
      const subject = imperative ? labels[rowIndex] : subjectFor(form, person, verb, tense);
      const otherForms = [...new Set(forms.filter((candidate) => candidate !== form))];
      // The complement never contains an unresolved reflexive infinitive.
      const tail = complement === 'le temps de se reposer' ? ['le temps de me reposer', 'le temps de te reposer', 'le temps de se reposer', 'le temps de nous reposer', 'le temps de vous reposer', 'le temps de se reposer'][person] : complement;
      return { subject, form, tail, options: [form, otherForms[0], otherForms[1]] };
    });
    const type = formats[index];
    if (type === 'matching') return match(title, example, hint, rows.map((row) => [row.subject, `${row.form} ${row.tail}${imperative ? ' !' : '.'}`]));
    if (type === 'order') return order(title, example, hint, rows.slice(0, 2).map((row) => imperative ? [`${row.form.charAt(0).toUpperCase()}${row.form.slice(1)}`, `${row.tail} !`] : [row.subject, row.form, `${row.tail}.`]));
    if (type === 'short') return short(title, example, hint, rows.slice(0, 2).map((row) => [imperative ? `À ${row.subject === 'À un ami' ? 'un ami' : 'notre groupe'} : ${verb} ${row.tail}. Écris la consigne.` : `${joinSubject(row.subject, `____ ${row.tail}.`)} (${verb} ${TENSE_LABELS[tense]})`, imperative ? `${row.form.charAt(0).toUpperCase()}${row.form.slice(1)} ${row.tail} !` : joinSubject(row.subject, `${row.form} ${row.tail}.`)]));
    const taskRows = rows.map((row) => [imperative ? `${row.subject} : ____ ${row.tail} !` : joinSubject(row.subject, `____ ${row.tail}.`), ...row.options]);
    return (type === 'cloze' ? fill : choose)(title, example, hint, taskRows);
  });
}

const SPELLING = {
  1: [
    match('Relier a et à', 'Il a un livre. / Il va à l’école.', 'On peut remplacer a par avait.', [['Le facteur ____ un colis.', 'a'], ['Le facteur va ____ Tunis.', 'à'], ['Il ____ rendez-vous ____ midi.', 'a / à']]),
    match('Reconstruire les mots du travail', 'bou / langer → boulanger', 'Assemble les deux morceaux du même mot.', [['jour', 'naliste'], ['méde', 'cin'], ['infir', 'mière']]),
    match('Reconstruire les mots des médias', 'ra / dio → radio', 'Lis les deux morceaux ensemble.', [['ordi', 'nateur'], ['télé', 'phone'], ['cla', 'vier']]),
    match('Retrouver les accents', 'ecole → école', 'Le mot de droite doit avoir les mêmes lettres et les bons accents.', [['ecran', 'écran'], ['metier', 'métier'], ['camera', 'caméra']]),
    choose('A ou à : avoir un objet', 'Elle a une règle : elle avait une règle.', 'Si avait convient, écris a.', [['Le journaliste ____ un carnet.', 'a', 'à', 'as'], ['L’infirmière ____ une blouse blanche.', 'a', 'à', 'as']]),
    choose('A ou à : aller quelque part', 'Je vais à la poste.', 'Devant un lieu, on utilise ici à.', [['Sami va ____ la bibliothèque.', 'à', 'a', 'as'], ['Le chauffeur arrive ____ Sfax.', 'à', 'a', 'as']]),
    choose('A ou à : préciser le moment', 'Le cours commence à huit heures.', 'Lis le groupe qui indique l’heure.', [['Le magasin ouvre ____ neuf heures.', 'à', 'a', 'as'], ['La journaliste termine ____ midi.', 'à', 'a', 'as']]),
    choose('A ou à : choisir dans la phrase', 'Lina a un rendez-vous à dix heures.', 'Essaie de remplacer le blanc par avait.', [['Le médecin ____ soigné un enfant.', 'a', 'à', 'as'], ['Ali écrit ____ son cousin.', 'à', 'a', 'as']]),
    choose('Bien écrire les métiers', 'un boulanger', 'Regarde toutes les lettres.', [['Le professionnel qui soigne les malades est un…', 'médecin', 'médeçin', 'médessin'], ['La personne qui distribue le courrier est un…', 'facteur', 'facteure', 'fakteur']]),
    choose('Bien écrire les outils numériques', 'une tablette', 'Lis lentement chaque proposition.', [['Pour écrire un message, je tape sur le…', 'clavier', 'clavié', 'claviet'], ['Le texte apparaît sur l’…', 'écran', 'écrant', 'écranss']]),
    choose('Bien écrire les mots de la presse', 'un journal', 'Observe les lettres muettes et les consonnes doubles.', [['Le journaliste prépare un…', 'article', 'articlle', 'artikle'], ['Le présentateur donne une…', 'information', 'informassion', 'informmation']]),
    choose('Bien écrire les communications', 'une lettre', 'Cherche l’orthographe habituelle du mot.', [['Je reçois un court…', 'message', 'mesage', 'messaje'], ['Je glisse la lettre dans une…', 'enveloppe', 'envelope', 'anveloppe']]),
    fill('Compléter un message avec a ou à', 'Elle a écrit à son amie.', 'A vient du verbe avoir ; à ne change pas.', [['Nour ____ envoyé une photo.', 'a', 'à', 'as'], ['Elle téléphone ____ sa tante.', 'à', 'a', 'as']]),
    fill('Compléter les mots du bureau', 'J’écris avec un stylo.', 'Choisis le mot bien écrit.', [['L’employé utilise une ____.', 'imprimante', 'imprimente', 'inprimante'], ['Le photographe prend une ____.', 'photographie', 'fotografie', 'photografye']]),
    order('Reconstituer une phrase avec a et à', 'Il / va / à la poste. → Il va à la poste.', 'Lis a comme le verbe avoir.', [['Le facteur', 'a', 'une lettre', 'à distribuer.'], ['La secrétaire', 'a', 'un rendez-vous', 'à midi.']]),
    short('Remplacer avait par a', 'Elle avait un sac. → Elle a un sac.', 'Change seulement avait en a.', [['Réécris : Le mécanicien avait une clé.', 'Le mécanicien a une clé.'], ['Réécris : La journaliste avait une caméra.', 'La journaliste a une caméra.']])
  ],
  2: [
    match('Son ou sont : choisir le groupe', 'Son ami arrive. / Ses amis sont là.', 'Son accompagne un nom ; sont vient du verbe être.', [['Il aide ____ voisin.', 'son'], ['Les voisins ____ unis.', 'sont'], ['____ frère et sa sœur ____ là.', 'son / sont']]),
    match('Et ou est : choisir le groupe', 'Lina et Sami. / Lina est gentille.', 'Et relie deux éléments ; est vient du verbe être.', [['Sami ____ poli.', 'est'], ['Lina ____ Sami jouent.', 'et'], ['Lina ____ ici avec Sami ____ Ali.', 'est / et']]),
    match('Remplacer par était ou étaient', 'est → était', 'Cherche la forme du même verbe au passé.', [['L’amie est contente.', 'L’amie était contente.'], ['Les amis sont contents.', 'Les amis étaient contents.'], ['Le garçon a un ballon.', 'Le garçon avait un ballon.']]),
    match('Son ou sont : comprendre la phrase', 'son sac → le sac à lui', 'Relie deux phrases qui ont le même sens.', [['C’est son cahier.', 'C’est le cahier qui lui appartient.'], ['Les enfants sont réunis.', 'Les enfants se trouvent ensemble.'], ['Son ami est gentil.', 'L’ami de cette personne est gentil.']]),
    choose('Son devant un nom', 'Il prend son sac.', 'Son peut se remplacer par mon ou ton.', [['Lina prête ____ crayon.', 'son', 'sont', 'sons'], ['Sami invite ____ ami.', 'son', 'sont', 'sons']]),
    choose('Sont après un sujet pluriel', 'Les élèves sont calmes.', 'Sont peut se remplacer par étaient.', [['Les voisins ____ solidaires.', 'sont', 'son', 'sons'], ['Les deux équipes ____ prêtes.', 'sont', 'son', 'sons']]),
    choose('Son ou sont dans l’entraide', 'Son voisin et lui sont amis.', 'Essaie mon ou étaient.', [['Il partage ____ goûter.', 'son', 'sont', 'sons'], ['Les bénévoles ____ nombreux.', 'sont', 'son', 'sons']]),
    choose('Son ou sont au quotidien', 'Elle retrouve son frère.', 'Regarde le mot placé après le blanc.', [['Sami range ____ ballon.', 'son', 'sont', 'sons'], ['Amira et Nour ____ ensemble.', 'sont', 'son', 'sons']]),
    choose('Et pour relier deux noms', 'un cahier et un crayon', 'Et signifie ici : et aussi.', [['J’invite Ali ____ Sami.', 'et', 'est', 'es'], ['Nous donnons du pain ____ du lait.', 'et', 'est', 'es']]),
    choose('Est pour décrire une personne', 'Mon ami est gentil.', 'Est peut se remplacer par était.', [['La voisine ____ généreuse.', 'est', 'et', 'es'], ['Le nouveau camarade ____ timide.', 'est', 'et', 'es']]),
    choose('Et ou est dans une action solidaire', 'Le colis est prêt : il contient des livres et des jeux.', 'Lis toute la phrase avant de choisir.', [['La collecte ____ terminée.', 'est', 'et', 'es'], ['Nous offrons des cahiers ____ des crayons.', 'et', 'est', 'es']]),
    choose('Et ou est dans le portrait', 'Il est poli et patient.', 'Essaie de remplacer par était.', [['Sami ____ serviable.', 'est', 'et', 'es'], ['Il est gentil ____ attentif.', 'et', 'est', 'es']]),
    fill('Compléter avec son ou sont', 'Son équipe gagne. Les joueurs sont contents.', 'Son précède un nom ; sont suit souvent un sujet pluriel.', [['Les amis ____ dans la cour.', 'sont', 'son', 'sons'], ['Lina cherche ____ frère.', 'son', 'sont', 'sons']]),
    fill('Compléter avec et ou est', 'Le garçon est calme et poli.', 'Cherche si le mot peut devenir était.', [['La salle ____ propre.', 'est', 'et', 'es'], ['Sami ____ Lina la rangent.', 'et', 'est', 'es']]),
    order('Construire une phrase avec les homophones', 'Son ami / est / gentil. → Son ami est gentil.', 'Garde ensemble les mots déjà groupés.', [['Son voisin', 'et', 'son frère', 'sont', 'amis.'], ['La fillette', 'est', 'calme', 'et', 'polie.']]),
    short('Remplacer était ou étaient', 'Elle était gentille. → Elle est gentille.', 'Remplace était par est et étaient par sont.', [['Réécris au présent : Le groupe était uni.', 'Le groupe est uni.'], ['Réécris au présent : Les amis étaient contents.', 'Les amis sont contents.']])
  ],
  3: [
    match('Accorder vert', 'un arbre vert', 'Regarde le genre et le nombre du nom.', [['un jardin', 'vert'], ['une feuille', 'verte'], ['des feuilles', 'vertes']]),
    match('Accorder petit', 'un petit chat', 'Au féminin, ajoute e. Au pluriel, ajoute s.', [['un arbre', 'petit'], ['une plante', 'petite'], ['des plantes', 'petites']]),
    match('Accorder le verbe planter', 'Je plante une fleur.', 'Regarde le sujet.', [['Tu', 'plantes des graines.'], ['Nous', 'plantons des graines.'], ['Les élèves', 'plantent des graines.']]),
    match('Accorder le verbe protéger', 'Tu protèges la nature.', 'Nous et vous ont des terminaisons différentes.', [['Il', 'protège les arbres.'], ['Nous', 'protégeons les arbres.'], ['Vous', 'protégez les arbres.']]),
    choose('Le sujet singulier', 'Le chat dort.', 'Un seul sujet : choisis le verbe au singulier.', [['Le jardinier ____ les fleurs.', 'arrose', 'arrosent', 'arroses'], ['L’enfant ____ une pomme.', 'mange', 'mangent', 'manges']]),
    choose('Le sujet pluriel', 'Les chats dorment.', 'Plusieurs personnes : le verbe change.', [['Les enfants ____ les déchets.', 'ramassent', 'ramasse', 'ramasses'], ['Les oiseaux ____ dans le ciel.', 'volent', 'vole', 'voles']]),
    choose('Deux sujets reliés par et', 'Sami et Ali jouent.', 'Deux sujets : utilise la forme de ils ou elles.', [['Lina et Amira ____ un arbre.', 'plantent', 'plante', 'plantes'], ['Le médecin et l’infirmière ____ ensemble.', 'travaillent', 'travaille', 'travailles']]),
    choose('Accorder avec nous et vous', 'Nous marchons. Vous marchez.', 'Nous : -ons. Vous : -ez.', [['Nous ____ les fruits.', 'lavons', 'lavez', 'lavent'], ['Vous ____ de l’eau.', 'buvez', 'buvons', 'boivent']]),
    choose('L’adjectif au féminin', 'un fruit mûr → une tomate mûre', 'Le nom est féminin.', [['une rivière ____', 'profonde', 'profond', 'profonds'], ['une alimentation ____', 'variée', 'varié', 'variés']]),
    choose('L’adjectif au pluriel', 'un parc propre → des parcs propres', 'Le nom est au pluriel.', [['des arbres ____', 'verts', 'vert', 'verte'], ['des fruits ____', 'mûrs', 'mûr', 'mûre']]),
    choose('L’adjectif au féminin pluriel', 'une fleur blanche → des fleurs blanches', 'Le nom est féminin et pluriel.', [['des feuilles ____', 'vertes', 'vert', 'verts'], ['des eaux ____', 'propres', 'propre', 'proprent']]),
    choose('Garder le bon accord', 'La pomme est rouge.', 'L’adjectif décrit le sujet.', [['Les carottes sont ____.', 'fraîches', 'frais', 'fraîche'], ['Le jardin est ____.', 'propre', 'propres', 'proprent']]),
    fill('Compléter les verbes accordés', 'La fleur pousse. Les fleurs poussent.', 'Repère si le sujet est singulier ou pluriel.', [['Les sportifs ____ chaque matin.', 'courent', 'court', 'cours'], ['Le malade ____ de l’eau.', 'boit', 'boivent', 'bois']]),
    fill('Compléter les adjectifs accordés', 'un petit arbre / une petite plante', 'Regarde le nom situé avant le blanc.', [['La salade est ____.', 'fraîche', 'frais', 'fraîches'], ['Les pommes sont ____.', 'mûres', 'mûr', 'mûre']]),
    order('Former des phrases bien accordées', 'Les enfants / jouent. → Les enfants jouent.', 'Chaque groupe est déjà accordé.', [['Les petites plantes', 'poussent', 'dans le jardin.'], ['La rivière', 'est', 'propre.']]),
    short('Passer un groupe nominal au pluriel', 'un arbre vert → des arbres verts', 'Remplace un ou une par des ; ajoute s au nom et à l’adjectif.', [['Mets au pluriel : une fleur rouge.', 'des fleurs rouges'], ['Mets au pluriel : un fruit mûr.', 'des fruits mûrs']])
  ],
  4: [
    match('Accorder arrivé avec être', 'Elle est arrivée.', 'Avec être, le participe passé s’accorde avec le sujet.', [['Sami est', 'arrivé.'], ['Lina est', 'arrivée.'], ['Lina et Amira sont', 'arrivées.']]),
    match('Accorder parti avec être', 'Ils sont partis.', 'Féminin : e. Pluriel : s.', [['Le voyageur est', 'parti.'], ['La voyageuse est', 'partie.'], ['Les voyageurs sont', 'partis.']]),
    match('Accorder revenu avec être', 'Elle est revenue.', 'Observe le sujet placé avant être.', [['Le garçon est', 'revenu.'], ['Les garçons sont', 'revenus.'], ['Les filles sont', 'revenues.']]),
    match('Accorder un adjectif de couleur', 'une porte bleue', 'Le nom donne le genre et le nombre.', [['un bateau', 'bleu'], ['une barque', 'bleue'], ['des barques', 'bleues']]),
    choose('Participe passé : une fille', 'Lina est entrée.', 'Le sujet est féminin singulier : ajoute e.', [['Amira est ____ au musée.', 'allée', 'allé', 'allés'], ['La touriste est ____ tôt.', 'arrivée', 'arrivé', 'arrivés']]),
    choose('Participe passé : un garçon', 'Sami est entré.', 'Le sujet est masculin singulier.', [['Ali est ____ à Tunis.', 'resté', 'restée', 'restés'], ['Le voyageur est ____.', 'parti', 'partie', 'parties']]),
    choose('Participe passé : plusieurs filles', 'Les filles sont entrées.', 'Féminin pluriel : -es.', [['Les danseuses sont ____.', 'arrivées', 'arrivé', 'arrivés'], ['Les voyageuses sont ____.', 'revenues', 'revenu', 'revenus']]),
    choose('Participe passé : plusieurs garçons', 'Les garçons sont entrés.', 'Masculin pluriel : -s.', [['Les touristes sont ____ au musée. (Ce sont des garçons.)', 'allés', 'allé', 'allées'], ['Sami et Ali sont ____.', 'sortis', 'sorti', 'sortie']]),
    choose('Accorder avec elle ou elles', 'Elle est tombée. Elles sont tombées.', 'Regarde si le pronom est singulier ou pluriel.', [['Elle est ____ de voyage.', 'rentrée', 'rentrées', 'rentré'], ['Elles sont ____ dans la salle.', 'entrées', 'entrée', 'entrés']]),
    choose('Accorder un adjectif au féminin', 'un costume élégant → une robe élégante', 'Regarde le nom féminin.', [['une visite ____', 'intéressante', 'intéressant', 'intéressants'], ['une ville ____', 'ancienne', 'ancien', 'anciens']]),
    choose('Accorder un adjectif au pluriel', 'un livre amusant → des livres amusants', 'Le nom est au pluriel.', [['des monuments ____', 'anciens', 'ancien', 'ancienne'], ['des costumes ____', 'colorés', 'coloré', 'colorée']]),
    choose('Accorder au féminin pluriel', 'une rue étroite → des rues étroites', 'Le nom est féminin pluriel.', [['des maisons ____', 'blanches', 'blanc', 'blancs'], ['des places ____', 'animées', 'animé', 'animés']]),
    fill('Compléter les participes avec être', 'Nour est allée au parc.', 'Accorde avec le sujet.', [['La fillette est ____ dans le train.', 'montée', 'monté', 'montés'], ['Les garçons sont ____ du bus.', 'descendus', 'descendu', 'descendues']]),
    fill('Compléter le portrait d’un lieu', 'une plage calme', 'Lis le nom avant de choisir.', [['Les rues sont ____.', 'étroites', 'étroit', 'étroits'], ['La porte est ____.', 'ouverte', 'ouvert', 'ouverts']]),
    order('Construire une phrase avec être', 'Lina / est / arrivée. → Lina est arrivée.', 'Place être avant le participe passé.', [['Les filles', 'sont', 'parties', 'en excursion.'], ['Le garçon', 'est', 'rentré', 'de voyage.']]),
    short('Changer le sujet en gardant l’accord', 'Il est arrivé. → Elle est arrivée.', 'Remplace il par elle et ajoute e au participe passé.', [['Réécris avec elle : Il est entré dans le musée.', 'Elle est entrée dans le musée.'], ['Réécris avec elle : Il est resté dans le jardin.', 'Elle est restée dans le jardin.']])
  ]
};

const DIRECTIONS = { matching: 'Relie par une flèche.', choice: 'Entoure la bonne réponse.', cloze: 'Complète avec le mot ou le groupe qui convient.', order: 'Remets les groupes de mots en ordre.', short: 'Écris la réponse demandée.' };

function solutionFor(task) {
  return task.items.map((item, index) => {
    let response;
    if (task.type === 'matching') response = `${item.left} → ${item.right}`;
    else if (task.type === 'order') response = item.parts.join(' ').replace(/’ /g, '’');
    else if (task.type === 'short') response = item.solution;
    else {
      const value = item.options[item.correct];
      response = item.stem.includes('____') ? item.stem.replace('____', value).replace(/’ /g, '’') : `${item.stem} → ${value}`;
    }
    return `${index + 1}. ${response}`;
  }).join('\n');
}

function questionFromSet(unitId, activityId, source, setIndex, difficulty, difficultyIndex) {
  const contentKey = `guided-language-6-${unitId}-${activityId}-${setIndex + 1}`;
  const task = {
    type: source.type,
    example: difficulty === 'remediation' ? source.example : '',
    hint: difficulty === 'approfondissement' ? '' : source.hint,
    items: source.items.map((item, itemIndex) => {
      if (!item.options) return { ...item, ...(item.parts ? { parts: [...item.parts] } : {}) };
      const options = item.options.slice(0, difficulty === 'remediation' ? 2 : 3);
      const rotation = (itemIndex + setIndex + difficultyIndex) % options.length;
      return { ...item, options: [...options.slice(rotation), ...options.slice(0, rotation)], correct: (options.length - rotation) % options.length };
    })
  };
  return {
    id: `guided-6-u${unitId}-${activityId}-${setIndex + 1}-${difficulty}`,
    levelId: '6', unitId: String(unitId), activityId, criterionId: activityId === 'orthographe' ? 4 : 3,
    title: source.title, prompt: DIRECTIONS[source.type], answer: solutionFor(task), difficulty,
    model: `${source.type === 'matching' ? 'Relier par une flèche' : source.type === 'choice' ? 'Entourer la bonne réponse' : source.type === 'cloze' ? 'Compléter avec choix' : source.type === 'order' ? 'Remettre en ordre' : 'Réponse courte guidée'} — ${source.title}`,
    support: '', source: 'Création originale — entraînement guidé, 6e année', active: true, visualType: 'none',
    task, contentKey, answerLines: ['matching', 'choice', 'cloze'].includes(source.type) ? 0 : 2
  };
}

function createGuidedLanguageBank() {
  return ['1', '2', '3', '4'].flatMap((unitId) => [
    ['grammaire', GRAMMAR[unitId]], ['conjugaison', conjugationSets(unitId)], ['orthographe', SPELLING[unitId]]
  ].flatMap(([activityId, sets]) => sets.flatMap((source, index) => DIFFICULTIES.map((difficulty, difficultyIndex) => questionFromSet(unitId, activityId, source, index, difficulty, difficultyIndex)))));
}

module.exports = { createGuidedLanguageBank };
