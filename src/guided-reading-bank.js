const { READING_SETS } = require('./sixth-grade-bank');
const { getCriterion } = require('./curriculum');

const SOURCE = 'Création originale — entraînement guidé, 6e année';
const DIFFICULTIES = ['remediation', 'consolidation', 'approfondissement'];

// Each short support is shared by every criterion and every level of help in
// its series. Facts, vocabulary and evidence below refer to that exact support.
const READING_GUIDES = {
  1: [
    {
      text: 'Amira aide sa tante dans la boulangerie. Elle prépare le pain. La pâte gonfle : elle devient plus grosse. Soudain, le four tombe en panne. Amira appelle un technicien. Elle utilise ensuite le four du voisin. Les pains sont prêts à temps.',
      facts: [['Qui aide sa tante ?', 'Amira', 'Nour', 'Youssef'], ['Où travaille sa tante ?', 'Dans une boulangerie', 'Dans une école', 'Dans un musée'], ['Quel appareil tombe en panne ?', 'Le four', 'La radio', 'Le téléphone']],
      words: [['gonfle', 'devient plus grosse', 'devient plus petite', 'reste de la même taille'], ['en panne', 'ne fonctionne plus', 'fonctionne très bien', 'vient d’être nettoyé']],
      evidence: [['Amira demande de l’aide.', 'Amira appelle un technicien.'], ['Amira trouve un autre four.', 'Elle utilise ensuite le four du voisin.']],
      transfer: ['Ton appareil ne fonctionne plus. Quel geste est prudent ?', 'Demander l’aide d’un adulte.', 'Toucher les fils électriques.', 'Démonter seul l’appareil.'],
      starter: 'Pour travailler prudemment, je peux…', suggestion: 'Pour travailler prudemment, je peux demander de l’aide à un adulte.'
    },
    {
      text: 'Youssef prépare un article pour le journal de l’école. Il pose des questions à une vétérinaire. Il écrit ses réponses dans un carnet. Une information est imprécise : Youssef ne la comprend pas bien. Il rappelle la vétérinaire pour vérifier. Son article donne des conseils pour protéger les animaux.',
      facts: [['Qui prépare un article ?', 'Youssef', 'Amira', 'Sami'], ['À qui pose-t-il des questions ?', 'À une vétérinaire', 'À une boulangère', 'À une photographe'], ['Où écrit-il les réponses ?', 'Dans un carnet', 'Sur une vitre', 'Sur un ballon']],
      words: [['imprécise', 'pas assez claire', 'très claire', 'très courte'], ['vérifier', 's’assurer que c’est juste', 'inventer une réponse', 'effacer sans lire']],
      evidence: [['Youssef garde une trace des réponses.', 'Il écrit ses réponses dans un carnet.'], ['Youssef contrôle son information.', 'Il rappelle la vétérinaire pour vérifier.']],
      transfer: ['Tu n’es pas sûr d’une information. Que fais-tu avant de la publier ?', 'Je la vérifie.', 'Je l’invente.', 'Je la partage sans vérifier.'],
      starter: 'Avant de partager une information, je…', suggestion: 'Avant de partager une information, je vérifie qu’elle est juste.'
    },
    {
      text: 'Un petit robot travaille dans une serre. Il mesure l’humidité de la terre. Quand la terre est sèche, il envoie un message au jardinier. Le jardinier décide alors d’arroser les plantes. Il observe aussi les feuilles et répare les tuyaux. Le robot aide le jardinier, mais ne fait pas tout son travail.',
      facts: [['Où se trouve le robot ?', 'Dans une serre', 'Dans une cuisine', 'Dans une gare'], ['Que mesure le robot ?', 'L’humidité de la terre', 'Le bruit de la rue', 'La taille du jardinier'], ['Qui décide d’arroser ?', 'Le jardinier', 'Le facteur', 'Le vétérinaire']],
      words: [['sèche', 'sans assez d’eau', 'pleine d’eau', 'couverte de neige'], ['répare', 'remet en bon état', 'abîme', 'cache']],
      evidence: [['Le robot prévient une personne.', 'Il envoie un message au jardinier.'], ['Le jardinier s’occupe aussi du matériel.', 'Il observe aussi les feuilles et répare les tuyaux.']],
      transfer: ['Un robot t’aide à arroser. Quel rôle garde le jardinier ?', 'Observer les plantes et décider.', 'Ne plus jamais regarder les plantes.', 'Arroser même si la terre est pleine d’eau.'],
      starter: 'Une machine peut m’aider à…', suggestion: 'Une machine peut m’aider à arroser, mais je dois surveiller les plantes.'
    },
    {
      text: 'Rania et Mehdi préparent une émission de radio sur les métiers du livre. Mehdi vérifie le micro. Rania retrouve l’enregistrement du bibliothécaire. Ensemble, ils notent l’ordre des rubriques, les parties de l’émission. Le voyant rouge s’allume. Les deux élèves saluent les auditeurs et parlent calmement.',
      facts: [['Que préparent Rania et Mehdi ?', 'Une émission de radio', 'Un match', 'Un repas'], ['Que vérifie Mehdi ?', 'Le micro', 'Le four', 'Le vélo'], ['À qui parlent les élèves ?', 'Aux auditeurs', 'Aux joueurs', 'Aux jardiniers']],
      words: [['rubriques', 'parties de l’émission', 'chaises du studio', 'photos des élèves'], ['auditeurs', 'personnes qui écoutent', 'personnes qui cuisinent', 'personnes qui courent']],
      evidence: [['Les élèves préparent un ordre.', 'Ils notent l’ordre des rubriques.'], ['Les élèves sont polis avec leur public.', 'Les deux élèves saluent les auditeurs.']],
      transfer: ['Tu présentes une émission avec un ami. Comment vous organiser ?', 'Préparer l’ordre des sujets.', 'Parler tous les deux en même temps.', 'Commencer sans connaître le sujet.'],
      starter: 'Avant de parler à la radio, je…', suggestion: 'Avant de parler à la radio, je prépare ce que je vais dire.'
    },
    {
      text: 'La lampe de Meriem ne s’allume plus. Avant de la toucher, Meriem la débranche. Elle demande de l’aide à son père. Ensemble, ils trouvent un fil abîmé. Son père remplace le fil. La lampe fonctionne de nouveau. Meriem note les étapes de la réparation dans son carnet.',
      facts: [['Quel objet ne fonctionne plus ?', 'La lampe', 'Le four', 'La tablette'], ['Qui aide Meriem ?', 'Son père', 'Son voisin', 'Son frère'], ['Où note-t-elle les étapes ?', 'Dans son carnet', 'Sur le mur', 'Sur le fil']],
      words: [['abîmé', 'en mauvais état', 'tout neuf', 'bien rangé'], ['débranche', 'retire la fiche de la prise', 'allume la lampe', 'change la couleur']],
      evidence: [['Meriem se protège avant la réparation.', 'Meriem la débranche.'], ['Meriem veut se souvenir de la réparation.', 'Meriem note les étapes de la réparation dans son carnet.']],
      transfer: ['Une lampe est cassée chez toi. À qui peux-tu demander de l’aide ?', 'À un adulte compétent.', 'À un bébé.', 'À personne : je répare seul les fils.'],
      starter: 'Si un appareil est abîmé, je…', suggestion: 'Si un appareil est abîmé, je préviens un adulte et je ne le touche pas.'
    },
    {
      text: 'Sami reçoit un message : « L’école sera fermée. » Le message n’a ni date ni signature. Leïla lui conseille de vérifier son origine, c’est-à-dire sa source. Ils lisent la page officielle de l’école : les cours auront lieu. Sami efface le faux message. Il prévient ses amis de ne pas le partager.',
      facts: [['Qui reçoit le message ?', 'Sami', 'Meriem', 'Youssef'], ['Où les enfants vérifient-ils l’information ?', 'Sur la page officielle de l’école', 'Dans un jeu vidéo', 'Sur une affiche de cinéma'], ['Que fait Sami du faux message ?', 'Il l’efface', 'Il l’imprime pour toute la classe', 'Il le partage']],
      words: [['origine', 'source du message', 'couleur du téléphone', 'longueur du texte'], ['faux', 'qui n’est pas vrai', 'qui est certain', 'qui est très ancien']],
      evidence: [['On ne sait pas qui a écrit le message.', 'Le message n’a ni date ni signature.'], ['Sami protège ses amis de la fausse information.', 'Il prévient ses amis de ne pas le partager.']],
      transfer: ['Tu reçois une nouvelle sans signature. Que fais-tu ?', 'Je vérifie sa source.', 'Je l’envoie immédiatement à tout le monde.', 'Je la considère forcément comme vraie.'],
      starter: 'Pour vérifier une nouvelle, je peux…', suggestion: 'Pour vérifier une nouvelle, je peux consulter une source officielle.'
    },
    {
      text: 'Au centre de tri, une machine lit les adresses des lettres. Elle classe les lettres selon leur destination, le lieu où elles doivent arriver. Certaines adresses sont mal écrites. Des agents les lisent avec attention. Avant le départ des camions, les employés contrôlent chaque bac. Les lettres peuvent ensuite partir.',
      facts: [['Que lit la machine ?', 'Les adresses', 'Les recettes', 'Les chansons'], ['Qui lit les adresses difficiles ?', 'Des agents', 'Des joueurs', 'Des enfants'], ['Quel véhicule emporte les lettres ?', 'Le camion', 'Le vélo de Rami', 'Le bateau de Lina']],
      words: [['destination', 'lieu où la lettre doit arriver', 'nom de la machine', 'taille de l’enveloppe'], ['contrôlent', 'vérifient', 'déchirent', 'oublient']],
      evidence: [['Les personnes aident quand la machine ne peut pas tout lire.', 'Des agents les lisent avec attention.'], ['Les employés vérifient les bacs avant le départ.', 'Les employés contrôlent chaque bac.']],
      transfer: ['Tu écris une adresse sur une enveloppe. Comment aider le facteur ?', 'Écrire les mots bien lisiblement.', 'Cacher le nom de la ville.', 'Écrire des lettres impossibles à lire.'],
      starter: 'Sur mon enveloppe, j’écris clairement…', suggestion: 'Sur mon enveloppe, j’écris clairement le nom et l’adresse.'
    },
    {
      text: 'Aziz parle de son futur métier à une journaliste. Il veut concevoir des maisons : il souhaite les imaginer et les dessiner. Ces maisons utiliseront peu d’énergie. Les logiciels l’aideront à faire les plans. Aziz écoutera les familles et choisira les matériaux. Pour lui, une machine aide, mais une personne décide.',
      facts: [['Qui présente son futur métier ?', 'Aziz', 'Mehdi', 'Walid'], ['Que veut-il concevoir ?', 'Des maisons', 'Des bateaux', 'Des chaussures'], ['Qui veut-il écouter ?', 'Les familles', 'Les touristes du musée', 'Les joueurs']],
      words: [['concevoir', 'imaginer et préparer un projet', 'détruire un objet', 'fermer une porte'], ['matériaux', 'matières utilisées pour construire', 'personnes qui habitent', 'questions de la journaliste']],
      evidence: [['Aziz veut économiser l’énergie.', 'Ces maisons utiliseront peu d’énergie.'], ['Aziz veut connaître les besoins des habitants.', 'Aziz écoutera les familles.']],
      transfer: ['Tu imagines une maison pour une famille. Que fais-tu d’abord ?', 'J’écoute ses besoins.', 'Je refuse de lui parler.', 'Je choisis sans penser aux habitants.'],
      starter: 'Plus tard, j’aimerais créer… pour…', suggestion: 'Réponse personnelle : un objet ou un projet et une utilité simple.'
    }
  ],
  2: [
    {
      text: 'À la récréation, un nouvel élève reste seul sur un banc. Il parle encore peu français. Nour lui montre les règles du jeu avec des gestes. Elle lui donne le ballon. Les autres enfants l’encouragent. À la fin, il sourit et leur apprend un jeu de son pays.',
      facts: [['Qui aide le nouvel élève ?', 'Nour', 'Salma', 'Inès'], ['Où est-il au début ?', 'Sur un banc', 'Dans un autobus', 'Au musée'], ['Que lui donne Nour ?', 'Le ballon', 'Un livre', 'Un repas']],
      words: [['encouragent', 'donnent du courage', 'font peur', 'se moquent'], ['règles', 'consignes du jeu', 'vêtements des joueurs', 'noms des pays']],
      evidence: [['Nour explique sans utiliser seulement des mots.', 'Nour lui montre les règles du jeu avec des gestes.'], ['Le nouvel élève se sent mieux.', 'À la fin, il sourit.']],
      transfer: ['Un nouveau camarade ne comprend pas ton jeu. Que peux-tu faire ?', 'Lui montrer les gestes.', 'Le laisser seul.', 'Me moquer de lui.'],
      starter: 'Pour accueillir un nouvel élève, je…', suggestion: 'Pour accueillir un nouvel élève, je lui propose de jouer avec moi.'
    },
    {
      text: 'Après un incendie, trois familles ont besoin d’aide. Les élèves organisent une collecte. Une équipe trie les vêtements par taille. Une autre nettoie les objets. Les dons sont remis à une association. Les élèves restent discrets : ils ne photographient pas les familles aidées.',
      facts: [['Combien de familles ont besoin d’aide ?', 'Trois', 'Deux', 'Dix'], ['Que trie une équipe ?', 'Les vêtements', 'Les lettres', 'Les feuilles'], ['Qui reçoit les dons ?', 'Une association', 'Un magasin de jouets', 'Une équipe de football']],
      words: [['collecte', 'réunion d’objets pour aider', 'vente de billets de cinéma', 'course dans la cour'], ['discrets', 'qui respectent la vie des autres', 'qui montrent tout à tout le monde', 'qui font beaucoup de bruit']],
      evidence: [['Les vêtements sont rangés de façon utile.', 'Une équipe trie les vêtements par taille.'], ['Les élèves respectent la vie privée des familles.', 'Ils ne photographient pas les familles aidées.']],
      transfer: ['Tu donnes un vêtement pour aider une famille. Que faut-il choisir ?', 'Un vêtement propre et en bon état.', 'Un vêtement très sale.', 'Un vêtement inutilisable.'],
      starter: 'Pour aider avec respect, je peux…', suggestion: 'Pour aider avec respect, je peux donner un objet propre sans me moquer.'
    },
    {
      text: 'Dans la cour, un groupe veut faire un jardin. Un autre veut un coin de lecture. Les élèves se disputent. La déléguée demande à chacun de parler à son tour. Ils trouvent un accord : le jardin sera au soleil et le banc sous l’arbre. Les deux groupes acceptent de partager l’espace.',
      facts: [['Où les élèves veulent-ils installer leurs projets ?', 'Dans la cour', 'Dans la cantine', 'Dans la rue'], ['Qui organise la discussion ?', 'La déléguée', 'Le facteur', 'Le jardinier'], ['Où sera le banc ?', 'Sous l’arbre', 'Dans le jardin au soleil', 'Devant la gare']],
      words: [['accord', 'solution acceptée ensemble', 'nouvelle dispute', 'départ d’un élève'], ['partager', 'utiliser ensemble en laissant une part à chacun', 'tout garder pour soi', 'jeter ce qui reste']],
      evidence: [['La déléguée fait respecter la parole de chacun.', 'La déléguée demande à chacun de parler à son tour.'], ['Les deux projets trouvent leur place.', 'Le jardin sera au soleil et le banc sous l’arbre.']],
      transfer: ['Deux amis veulent le même matériel. Quel conseil leur donner ?', 'Chercher un partage juste.', 'Crier plus fort.', 'Cacher le matériel.'],
      starter: 'Quand nous ne sommes pas d’accord, nous pouvons…', suggestion: 'Quand nous ne sommes pas d’accord, nous pouvons parler chacun à notre tour.'
    },
    {
      text: 'Hatem se déplace en fauteuil roulant. Une marche l’empêche d’entrer seul dans la bibliothèque. Il veut être autonome : il souhaite entrer sans être porté. Sa classe demande une rampe à la municipalité. La rampe est construite. Hatem entre seul. Les personnes avec une poussette utilisent aussi ce passage.',
      facts: [['Qui utilise un fauteuil roulant ?', 'Hatem', 'Malek', 'Anis'], ['Quel lieu est difficile à atteindre ?', 'La bibliothèque', 'Le parc', 'La plage'], ['Quel aménagement est construit ?', 'Une rampe', 'Un mur', 'Une nouvelle marche']],
      words: [['autonome', 'capable d’agir sans être toujours aidé', 'obligé d’attendre toute la journée', 'incapable de choisir'], ['rampe', 'passage en pente', 'porte fermée', 'mur élevé']],
      evidence: [['L’aménagement donne de l’autonomie à Hatem.', 'Hatem entre seul.'], ['Le passage sert à plusieurs personnes.', 'Les personnes avec une poussette utilisent aussi ce passage.']],
      transfer: ['Tu veux aider un camarade en fauteuil. Que fais-tu d’abord ?', 'Je lui demande de quelle aide il a besoin.', 'Je le déplace sans lui parler.', 'Je décide toujours à sa place.'],
      starter: 'Pour rendre notre école plus accessible, on peut…', suggestion: 'Pour rendre notre école plus accessible, on peut garder les passages libres.'
    },
    {
      text: 'Malek trouve un portefeuille près de l’arrêt d’autobus. Il voit de l’argent et une carte avec un nom. Son ami propose de garder l’argent. Malek refuse. Il remet le portefeuille à la police. La propriétaire vient le remercier. Elle peut enfin acheter ses médicaments.',
      facts: [['Que trouve Malek ?', 'Un portefeuille', 'Un téléphone', 'Un cartable'], ['Où le trouve-t-il ?', 'Près de l’arrêt d’autobus', 'Dans sa chambre', 'Au centre de tri'], ['À qui le remet-il ?', 'À la police', 'À son ami', 'À un vendeur']],
      words: [['propriétaire', 'personne à qui l’objet appartient', 'personne qui fabrique un objet', 'personne qui passe dans la rue'], ['refuse', 'dit non', 'dit oui', 'demande le prix']],
      evidence: [['Malek ne garde pas l’objet trouvé.', 'Il remet le portefeuille à la police.'], ['La dame est reconnaissante.', 'La propriétaire vient le remercier.']],
      transfer: ['Tu trouves une trousse dans la classe. Que fais-tu ?', 'Je cherche à la rendre à son propriétaire.', 'Je la cache dans mon sac.', 'Je jette le nom écrit dessus.'],
      starter: 'Quand je trouve un objet qui n’est pas à moi, je…', suggestion: 'Quand je trouve un objet qui n’est pas à moi, je le signale à l’enseignant.'
    },
    {
      text: 'L’équipe de Salma a du carton. Celle d’Anis a les outils. Chaque équipe veut construire seule une maquette. Mais les deux maquettes restent inachevées. Les élèves décident de coopérer : ils partagent les outils et le carton. Ensemble, ils terminent une belle maquette.',
      facts: [['Que possède l’équipe de Salma ?', 'Du carton', 'Des outils', 'Des vêtements'], ['Que construisent les élèves ?', 'Une maquette', 'Une rampe', 'Un four'], ['Que possède l’équipe d’Anis ?', 'Les outils', 'Le carton', 'Les médicaments']],
      words: [['inachevées', 'pas terminées', 'déjà finies', 'très anciennes'], ['coopérer', 'travailler ensemble', 'refuser toute aide', 'travailler contre les autres']],
      evidence: [['Les équipes mettent leur matériel en commun.', 'Ils partagent les outils et le carton.'], ['Le travail commun réussit.', 'Ensemble, ils terminent une belle maquette.']],
      transfer: ['Ton groupe manque de colle, un autre manque de papier. Que proposer ?', 'Partager le matériel.', 'Cacher notre papier.', 'Arrêter tout travail sans discuter.'],
      starter: 'Dans un travail de groupe, je peux aider en…', suggestion: 'Dans un travail de groupe, je peux aider en partageant mon matériel.'
    },
    {
      text: 'Au conseil de classe, les élèves parlent du bruit à la cantine. Chacun peut proposer une solution. La présidente note les idées. Les élèves votent et choisissent deux mesures : parler moins fort et déplacer les chaises doucement. Après une semaine, ils vérifieront si la cantine est plus calme.',
      facts: [['De quel problème parlent les élèves ?', 'Du bruit', 'Du froid', 'Du manque de livres'], ['Où se trouve le problème ?', 'À la cantine', 'Au musée', 'Dans la serre'], ['Comment choisissent-ils les mesures ?', 'Ils votent', 'Ils tirent au ballon', 'Ils attendent un message']],
      words: [['mesures', 'actions choisies pour améliorer la situation', 'règles pour compter des mètres', 'objets de la cantine'], ['calme', 'avec peu de bruit', 'très bruyante', 'très sombre']],
      evidence: [['Tous les élèves peuvent participer.', 'Chacun peut proposer une solution.'], ['Le conseil veut connaître le résultat des actions.', 'Après une semaine, ils vérifieront si la cantine est plus calme.']],
      transfer: ['Un camarade propose une idée différente de la tienne. Comment réagir ?', 'L’écouter jusqu’au bout.', 'L’interrompre tout de suite.', 'Se moquer de son idée.'],
      starter: 'Au conseil de classe, je peux proposer de…', suggestion: 'Réponse personnelle : une action simple pour améliorer la vie de la classe.'
    },
    {
      text: 'Pendant le match, Farès marque un but. Le capitaine le refuse parce que Farès est plus jeune. Inès relit la règle : tous les joueurs ont les mêmes droits. Le capitaine reconnaît son erreur. Il accepte le but et présente ses excuses. Le match reprend dans le calme.',
      facts: [['Qui marque le but ?', 'Farès', 'Inès', 'Nour'], ['Qui relit la règle ?', 'Inès', 'Farès', 'Malek'], ['Que fait le capitaine à la fin ?', 'Il présente ses excuses', 'Il déchire la règle', 'Il interdit le match']],
      words: [['droits', 'ce qui est permis à chacun', 'couleurs des équipes', 'âges des joueurs'], ['excuses', 'paroles pour reconnaître une erreur', 'ordres pour exclure un joueur', 'noms des gagnants']],
      evidence: [['La règle est la même pour tous.', 'Tous les joueurs ont les mêmes droits.'], ['Le capitaine corrige sa décision.', 'Il accepte le but et présente ses excuses.']],
      transfer: ['Tu as refusé injustement le tour d’un ami. Que faire ?', 'Reconnaître mon erreur et lui rendre son tour.', 'Refuser de lui parler.', 'Inventer une nouvelle règle pour l’exclure.'],
      starter: 'Pour que notre jeu soit juste, il faut…', suggestion: 'Pour que notre jeu soit juste, il faut respecter les mêmes règles pour tous.'
    }
  ],
  3: [
    {
      text: 'Après la récréation, des emballages couvrent la cour. Les élèves les comptent. Ils installent des boîtes de tri. Ils apportent leur goûter dans des boîtes réutilisables. Vendredi, ils trouvent deux fois moins de papiers. La classe continue son action pour garder la cour propre.',
      facts: [['Quel lieu est sale ?', 'La cour', 'La bibliothèque', 'La plage'], ['Que mettent les élèves pour trier ?', 'Des boîtes de tri', 'Des bancs', 'Des lampes'], ['Quand comptent-ils moins de papiers ?', 'Vendredi', 'Dimanche', 'Pendant les vacances']],
      words: [['réutilisables', 'qui servent plusieurs fois', 'qui servent une seule fois', 'qui sont toujours jetées'], ['emballages', 'objets qui entourent et protègent un produit', 'arbres de la cour', 'règles du jeu']],
      evidence: [['Les élèves utilisent moins d’emballages jetables.', 'Ils apportent leur goûter dans des boîtes réutilisables.'], ['L’action réduit les déchets.', 'Vendredi, ils trouvent deux fois moins de papiers.']],
      transfer: ['Pour ton goûter, quel objet produit moins de déchets ?', 'Une boîte que je réutilise.', 'Un nouveau sachet jetable chaque jour.', 'Deux emballages au lieu d’un.'],
      starter: 'Pour garder ma cour propre, je…', suggestion: 'Pour garder ma cour propre, je mets les déchets dans les poubelles adaptées.'
    },
    {
      text: 'Au parc, Yasmine voit un robinet qui fuit. Elle place un seau dessous pour récupérer l’eau. Avec le gardien, elle signale la fuite à la municipalité. Un agent remplace le joint abîmé. Le robinet ne fuit plus. Yasmine utilise l’eau du seau pour arroser les arbres.',
      facts: [['Qui remarque la fuite ?', 'Yasmine', 'Lina', 'Aya'], ['Que place-t-elle sous le robinet ?', 'Un seau', 'Un livre', 'Un ballon'], ['Que fait-elle de l’eau récupérée ?', 'Elle arrose les arbres', 'Elle la jette dans la rue', 'Elle lave le tableau']],
      words: [['signale', 'fait connaître un problème', 'cache un problème', 'oublie un problème'], ['récupérer', 'recueillir pour utiliser', 'laisser perdre', 'salir volontairement']],
      evidence: [['Yasmine évite de perdre toute l’eau.', 'Elle place un seau dessous pour récupérer l’eau.'], ['La réparation réussit.', 'Le robinet ne fuit plus.']],
      transfer: ['Un robinet de l’école fuit. Quel geste est utile ?', 'Prévenir un adulte.', 'Laisser couler sans rien dire.', 'Ouvrir encore plus le robinet.'],
      starter: 'Pour économiser l’eau, je peux…', suggestion: 'Pour économiser l’eau, je peux fermer le robinet après usage.'
    },
    {
      text: 'Walid est souvent fatigué en classe. Il se couche tard et ne prend pas de petit déjeuner. L’infirmière lui conseille de dormir plus tôt. Le matin, il mange du pain, un yaourt et un fruit. Après une semaine, il est plus attentif. Il décide de conserver ces bonnes habitudes.',
      facts: [['Qui est fatigué ?', 'Walid', 'Rami', 'Sami'], ['Qui lui donne des conseils ?', 'L’infirmière', 'La bibliothécaire', 'La photographe'], ['Que mange-t-il avec le pain et le fruit ?', 'Un yaourt', 'Des bonbons', 'Un gâteau']],
      words: [['conserver', 'garder', 'abandonner', 'perdre'], ['attentif', 'qui écoute et suit bien', 'qui s’endort', 'qui ne regarde jamais']],
      evidence: [['Walid mange le matin.', 'Le matin, il mange du pain, un yaourt et un fruit.'], ['Les changements l’aident en classe.', 'Après une semaine, il est plus attentif.']],
      transfer: ['Tu prépares ton petit déjeuner. Quel choix est varié ?', 'Du pain, un yaourt et un fruit.', 'Seulement des bonbons.', 'Seulement un soda.'],
      starter: 'Pour être en forme en classe, je peux…', suggestion: 'Pour être en forme en classe, je peux dormir à une heure régulière.'
    },
    {
      text: 'Sur la plage, Lina aperçoit une tortue prise dans un filet. Des enfants veulent tirer sur l’animal. Lina les arrête et appelle un adulte du centre de protection. Le spécialiste coupe doucement le filet. Il examine la tortue et la libère. Le groupe ramasse les cordes abandonnées sur la plage.',
      facts: [['Quel animal est pris dans un filet ?', 'Une tortue', 'Un chat', 'Un oiseau'], ['Où se trouve Lina ?', 'Sur la plage', 'Dans une serre', 'Dans la rue'], ['Qui coupe le filet ?', 'Le spécialiste', 'Lina seule', 'Un enfant']],
      words: [['aperçoit', 'voit', 'cache', 'fabrique'], ['libère', 'rend libre', 'enferme', 'attache']],
      evidence: [['Lina cherche une aide compétente.', 'Lina les arrête et appelle un adulte du centre de protection.'], ['Le groupe enlève des objets dangereux pour les animaux.', 'Le groupe ramasse les cordes abandonnées sur la plage.']],
      transfer: ['Tu trouves un animal sauvage blessé. Quel geste est prudent ?', 'Prévenir un adulte ou un spécialiste.', 'Le tirer de force.', 'L’enfermer sans demander conseil.'],
      starter: 'Pour protéger les animaux de la plage, je…', suggestion: 'Pour protéger les animaux de la plage, je ne laisse pas de déchets.'
    },
    {
      text: 'Rami habite près de son école. Deux fois par semaine, il y va à pied avec son voisin. Ils traversent sur les passages protégés. Ils portent des vêtements visibles. La marche leur permet de bouger et de moins utiliser la voiture. Quand il pleut très fort, un adulte les accompagne en autobus.',
      facts: [['Avec qui Rami marche-t-il ?', 'Son voisin', 'Sa cousine', 'Sa tante'], ['Combien de fois par semaine marche-t-il vers l’école ?', 'Deux fois', 'Une fois', 'Sept fois'], ['Que prennent-ils quand il pleut très fort ?', 'L’autobus', 'Un bateau', 'Une moto']],
      words: [['visibles', 'faciles à voir', 'cachés', 'impossibles à voir'], ['accompagne', 'fait le trajet avec eux', 'les laisse toujours seuls', 'leur ferme la porte']],
      evidence: [['Les enfants choisissent un endroit sûr pour traverser.', 'Ils traversent sur les passages protégés.'], ['Un adulte les aide en cas de forte pluie.', 'Un adulte les accompagne en autobus.']],
      transfer: ['Tu dois traverser une route pour aller à l’école. Où traverser ?', 'Sur un passage protégé en restant attentif.', 'En courant sans regarder.', 'Entre deux voitures sans visibilité.'],
      starter: 'Pour marcher en sécurité, je…', suggestion: 'Pour marcher en sécurité, je respecte les passages protégés.'
    },
    {
      text: 'Les élèves placent un bac à compost dans un coin ombragé du jardin. Ils y mettent des épluchures de fruits et des feuilles sèches. Ils ne mettent jamais de plastique. Chaque semaine, ils mélangent le contenu. Après plusieurs mois, les déchets deviennent une terre sombre. Cette terre nourrit les plantes.',
      facts: [['Où se trouve le bac ?', 'Dans le jardin', 'Dans la cantine', 'Dans le musée'], ['Que met-on dans le compost ?', 'Des épluchures de fruits', 'Des sacs en plastique', 'Des bouteilles en verre'], ['Que devient le contenu après plusieurs mois ?', 'Une terre sombre', 'Du plastique neuf', 'Du sable de plage']],
      words: [['ombragé', 'à l’ombre', 'en plein soleil', 'sans aucun arbre'], ['épluchures', 'peaux retirées des fruits', 'sacs en plastique', 'outils du jardin']],
      evidence: [['Les élèves évitent le plastique dans le compost.', 'Ils ne mettent jamais de plastique.'], ['Le compost est utile au jardin.', 'Cette terre nourrit les plantes.']],
      transfer: ['Tu tries les restes de ton goûter pour le compost. Que choisis-tu ?', 'Une peau de banane.', 'Un sachet en plastique.', 'Une bouteille en verre.'],
      starter: 'Le compost est utile parce que…', suggestion: 'Le compost est utile parce qu’il transforme certains déchets en matière pour les plantes.'
    },
    {
      text: 'Aya utilise sa tablette jusque dans son lit. Elle a mal aux yeux et dort mal. Le médecin lui conseille de faire des pauses. Il lui demande aussi d’arrêter l’écran une heure avant le coucher. Aya suit ces conseils. Une semaine plus tard, elle s’endort plus vite et se réveille reposée.',
      facts: [['Quel appareil utilise Aya ?', 'Une tablette', 'Une radio', 'Un robot'], ['Qui donne les conseils ?', 'Le médecin', 'Le facteur', 'Le guide'], ['Quand doit-elle arrêter l’écran ?', 'Une heure avant le coucher', 'Après toute une nuit d’écran', 'Seulement après le réveil']],
      words: [['pauses', 'petits moments d’arrêt', 'heures sans aucun arrêt', 'nouveaux jeux'], ['reposée', 'qui a retrouvé ses forces', 'très fatiguée', 'inquiète']],
      evidence: [['Aya avait un problème de sommeil.', 'Elle a mal aux yeux et dort mal.'], ['Les nouvelles habitudes améliorent son repos.', 'Elle s’endort plus vite et se réveille reposée.']],
      transfer: ['Avant de dormir, quelle activité permet une pause sans écran ?', 'Lire un livre en papier.', 'Jouer sur une tablette.', 'Regarder un film sur le téléphone.'],
      starter: 'Avant de dormir, je peux remplacer l’écran par…', suggestion: 'Avant de dormir, je peux remplacer l’écran par la lecture d’un livre.'
    },
    {
      text: 'En été, la rue de l’école est très chaude. Les habitants veulent planter des arbres. Le jardinier choisit des espèces adaptées au climat. Il vérifie aussi la place pour les racines. Les familles s’engagent à arroser les jeunes arbres. Plus tard, les arbres donneront de l’ombre et abriteront des oiseaux.',
      facts: [['Pourquoi planter des arbres dans la rue ?', 'Pour apporter de l’ombre', 'Pour rendre la rue plus chaude', 'Pour fermer l’école'], ['Qui choisit les espèces ?', 'Le jardinier', 'Le facteur', 'Le médecin'], ['Qui promet d’arroser ?', 'Les familles', 'Les touristes', 'Les journalistes']],
      words: [['s’engagent', 'promettent de participer', 'refusent toute aide', 'oublient le projet'], ['abriteront', 'offriront un refuge', 'feront partir', 'empêcheront de vivre']],
      evidence: [['Le jardinier tient compte du temps qu’il fait dans la région.', 'Le jardinier choisit des espèces adaptées au climat.'], ['Les arbres aideront aussi les oiseaux.', 'Les arbres donneront de l’ombre et abriteront des oiseaux.']],
      transfer: ['Tu aides à planter un jeune arbre. Que faudra-t-il faire ensuite ?', 'L’arroser selon ses besoins.', 'L’oublier complètement.', 'Casser ses petites branches.'],
      starter: 'Dans ma rue, un arbre peut…', suggestion: 'Dans ma rue, un arbre peut donner de l’ombre et abriter des oiseaux.'
    }
  ],
  4: [
    {
      text: 'Djerba, le 12 juillet\nChère Inès,\nHier, j’ai visité un atelier de poterie. Une artisane m’a montré son savoir-faire : elle sait transformer l’argile en objets. J’ai décoré un petit bol. Aujourd’hui, je lis sous un olivier puis je rejoins mes cousins à la plage. J’aime découvrir et passer du temps en famille.\nAmitiés,\nMaya',
      facts: [['Qui écrit la lettre ?', 'Maya', 'Inès', 'Leïla'], ['À qui écrit-elle ?', 'À Inès', 'À Maya', 'À Sana'], ['Quel objet a-t-elle décoré ?', 'Un bol', 'Une chaise', 'Un cerf-volant']],
      words: [['savoir-faire', 'habileté pour réaliser un travail', 'envie de dormir', 'nom d’un village'], ['artisane', 'personne qui fabrique des objets avec son habileté', 'personne qui conduit un autobus', 'personne qui soigne les animaux']],
      evidence: [['Maya a participé à une activité manuelle.', 'J’ai décoré un petit bol.'], ['Maya apprécie la compagnie de ses proches.', 'J’aime découvrir et passer du temps en famille.']],
      transfer: ['Tu écris à un ami pour raconter tes vacances. Quelle phrase convient ?', 'Chère amie, je découvre un joli village.', 'Fermez immédiatement ce courrier.', 'Avis de fermeture du magasin.'],
      starter: 'Chère Maya, pendant mes vacances, je…', suggestion: 'Une phrase amicale qui raconte une activité personnelle.'
    },
    {
      text: 'Adam rejoint un club de photographie. Au début, il prend ses photos trop vite. L’animatrice lui demande d’observer la lumière et de cadrer, c’est-à-dire de choisir ce qui sera dans l’image. Adam attend qu’un papillon se pose sur une fleur. Sa nouvelle photo est nette. Il comprend l’utilité de la patience.',
      facts: [['Quel loisir découvre Adam ?', 'La photographie', 'La natation', 'La cuisine'], ['Qui lui donne un conseil ?', 'L’animatrice', 'La vétérinaire', 'La boulangère'], ['Quel animal attend-il ?', 'Un papillon', 'Une tortue', 'Un chat']],
      words: [['cadrer', 'choisir ce qui sera dans l’image', 'jeter l’appareil', 'courir après le sujet'], ['nette', 'bien claire', 'floue', 'cachée']],
      evidence: [['Adam apprend à attendre.', 'Adam attend qu’un papillon se pose sur une fleur.'], ['Le résultat de son travail s’améliore.', 'Sa nouvelle photo est nette.']],
      transfer: ['Tu apprends un nouveau loisir et ton premier essai est raté. Que faire ?', 'Écouter un conseil et recommencer.', 'Tout casser.', 'Refuser d’essayer une seconde fois.'],
      starter: 'Pour réussir dans mon loisir préféré, je peux…', suggestion: 'Pour réussir dans mon loisir préféré, je peux m’entraîner avec patience.'
    },
    {
      text: 'La classe visite une maison à Matmata. Sa cour est creusée dans le sol. Les pièces restent fraîches. Le guide explique que cette architecture protège de la chaleur. Les élèves dessinent le plan et posent des questions. Ils découvrent une habitation adaptée au climat de la région.',
      facts: [['Où la classe fait-elle sa visite ?', 'À Matmata', 'À Djerba', 'Au Japon'], ['Comment sont les pièces ?', 'Fraîches', 'Brûlantes', 'Sans porte'], ['Qui explique la construction ?', 'Le guide', 'Le médecin', 'Le capitaine']],
      words: [['architecture', 'manière de construire un bâtiment', 'manière de jouer au ballon', 'façon de servir un repas'], ['habitation', 'lieu où l’on vit', 'outil pour jardiner', 'objet pour photographier']],
      evidence: [['La maison aide à supporter la chaleur.', 'Cette architecture protège de la chaleur.'], ['Les élèves cherchent à comprendre le lieu.', 'Les élèves dessinent le plan et posent des questions.']],
      transfer: ['Tu découvres une maison très différente de la tienne. Quelle attitude choisir ?', 'Poser des questions avec respect.', 'Se moquer des habitants.', 'Dire qu’une seule façon d’habiter est valable.'],
      starter: 'J’aimerais visiter… pour découvrir…', suggestion: 'Réponse personnelle : un lieu et une découverte possible.'
    },
    {
      text: 'Sur une plage, des familles participent à un tournoi de cerfs-volants. Elles vérifient le vent et gardent une distance entre les joueurs. Sana lance son cerf-volant, mais le fil s’emmêle. Elle le déroule calmement et recommence. Cette fois, son cerf-volant monte très haut. Sana est heureuse.',
      facts: [['Où se déroule le tournoi ?', 'Sur une plage', 'Dans une classe', 'Dans un musée'], ['Qui lance le cerf-volant ?', 'Sana', 'Maya', 'Lina'], ['Quel problème arrive au premier essai ?', 'Le fil s’emmêle', 'La plage disparaît', 'Le cerf-volant tombe en panne électrique']],
      words: [['s’emmêle', 'fait des nœuds', 'se déroule bien', 'devient plus court tout seul'], ['calmement', 'sans s’énerver', 'en criant', 'en se disputant']],
      evidence: [['Les participants pensent à la sécurité.', 'Elles vérifient le vent et gardent une distance entre les joueurs.'], ['Sana n’abandonne pas après un échec.', 'Elle le déroule calmement et recommence.']],
      transfer: ['Ton cerf-volant ne monte pas au premier essai. Quelle réaction t’aide ?', 'Chercher le problème et réessayer calmement.', 'Déchirer le cerf-volant.', 'Pousser les autres joueurs.'],
      starter: 'Quand je ne réussis pas tout de suite, je peux…', suggestion: 'Quand je ne réussis pas tout de suite, je peux demander un conseil et recommencer.'
    },
    {
      text: 'Au musée, Sami observe une fibule, un métier à tisser et un tambour. Il note leur matière et leur usage. Il ne touche pas les objets. Il fait des croquis dans son carnet. En classe, ses dessins l’aident à raconter la visite. Ces objets témoignent de la vie d’autrefois.',
      facts: [['Qui visite le musée ?', 'Sami', 'Adam', 'Rami'], ['Combien d’objets observe-t-il ?', 'Trois', 'Deux', 'Cinq'], ['Où fait-il ses croquis ?', 'Dans son carnet', 'Sur les objets', 'Sur le mur']],
      words: [['croquis', 'dessins rapides', 'longues chansons', 'objets anciens'], ['témoignent', 'donnent des informations', 'cachent toute information', 'font beaucoup de bruit']],
      evidence: [['Sami protège les objets du musée.', 'Il ne touche pas les objets.'], ['Sami garde une trace de sa visite.', 'Il fait des croquis dans son carnet.']],
      transfer: ['Tu visites un musée. Comment garder un souvenir sans abîmer les objets ?', 'Faire un dessin dans mon carnet.', 'Écrire mon nom sur un objet.', 'Emporter un objet chez moi.'],
      starter: 'Au musée, j’aimerais découvrir…', suggestion: 'Une phrase personnelle sur un objet ou un thème de musée.'
    },
    {
      text: 'Bonjour les amis,\nDans notre école au Japon, nous retirons nos chaussures à l’entrée. Nous rangeons nos chaussons dans un casier. À midi, des élèves aident à servir le repas. Ensuite, chacun nettoie son espace. Comment se passe une journée dans votre école ? Envoyez-nous votre emploi du temps.\nLa classe de Haru',
      facts: [['Dans quel pays se trouve cette école ?', 'Au Japon', 'En Tunisie', 'En France'], ['Où les élèves rangent-ils leurs chaussons ?', 'Dans un casier', 'Sur la route', 'Dans le jardin'], ['Que demandent les correspondants ?', 'Un emploi du temps', 'Un ballon neuf', 'Une recette de pain']],
      words: [['casier', 'petit espace pour ranger ses affaires', 'grand terrain de sport', 'vêtement de pluie'], ['emploi du temps', 'organisation des activités selon les heures', 'liste des courses', 'nom du directeur']],
      evidence: [['Les élèves participent au repas.', 'Des élèves aident à servir le repas.'], ['Les correspondants veulent découvrir une autre école.', 'Comment se passe une journée dans votre école ?']],
      transfer: ['Une habitude de tes correspondants est différente. Comment leur répondre ?', 'Décrire la mienne avec respect.', 'Se moquer de leur habitude.', 'Refuser de les écouter.'],
      starter: 'Dans mon école, nous…', suggestion: 'Une phrase décrivant une habitude réelle de son école.'
    },
    {
      text: 'Leïla prépare une randonnée avec un adulte. Elle regarde la météo. Dans son sac, elle met une gourde et une casquette. Le groupe marche sur un sentier balisé, indiqué par des marques. Il avance au rythme du plus jeune. À la pause, chacun garde ses déchets pour les jeter dans une poubelle.',
      facts: [['Qui prépare la randonnée ?', 'Leïla', 'Sana', 'Nour'], ['Que met-elle dans son sac pour boire ?', 'Une gourde', 'Un tambour', 'Un carnet'], ['Quel chemin suit le groupe ?', 'Un sentier balisé', 'Une route inconnue sans marques', 'Un chemin interdit']],
      words: [['balisé', 'indiqué par des marques', 'sans aucun repère', 'interdit aux marcheurs'], ['rythme', 'vitesse à laquelle on avance', 'couleur du sac', 'heure du repas']],
      evidence: [['Le groupe pense au plus jeune marcheur.', 'Il avance au rythme du plus jeune.'], ['Les marcheurs respectent la nature.', 'Chacun garde ses déchets pour les jeter dans une poubelle.']],
      transfer: ['Pendant une promenade, un ami marche plus lentement. Que faire ?', 'Adapter notre allure pour rester ensemble.', 'Le laisser seul loin derrière.', 'Le forcer à courir sans pause.'],
      starter: 'Avant une randonnée, je prépare…', suggestion: 'Avant une randonnée, je prépare une gourde et des affaires adaptées.'
    },
    {
      text: 'Chez son correspondant, Yanis découvre un plat inconnu. Il demande poliment quels ingrédients il contient. Il goûte une petite portion. Son ami raconte que ce plat est servi pendant les fêtes. Yanis présente ensuite un plat tunisien. Les deux enfants aiment cuisiner et partager leurs traditions.',
      facts: [['Qui découvre un plat inconnu ?', 'Yanis', 'Aziz', 'Hatem'], ['Quelle quantité goûte-t-il ?', 'Une petite portion', 'Tout le plat', 'Aucune quantité'], ['Que présente Yanis à son tour ?', 'Un plat tunisien', 'Un robot', 'Une maquette']],
      words: [['portion', 'quantité servie à une personne', 'recette écrite', 'nom d’une fête'], ['ingrédients', 'aliments utilisés dans la recette', 'personnes invitées', 'assiettes de la table']],
      evidence: [['Yanis s’intéresse au contenu du plat.', 'Il demande poliment quels ingrédients il contient.'], ['Les enfants échangent sur leurs cultures.', 'Les deux enfants aiment cuisiner et partager leurs traditions.']],
      transfer: ['Un ami te présente une coutume que tu ne connais pas. Comment réagir ?', 'L’écouter et poser une question respectueuse.', 'Rire de sa famille.', 'Affirmer que sa coutume ne vaut rien.'],
      starter: 'Une tradition que j’aimerais présenter est…', suggestion: 'Une phrase personnelle qui présente une tradition avec respect.'
    }
  ]
};

const EXAMPLES = {
  choice: 'Exemple : Le chat miaule. Qui miaule ? → le chat (et non le chien).',
  matching: 'Exemple : « Qui miaule ? » se relie à « le chat ».',
  vocabulary: 'Exemple : « joyeux » veut dire « content ».',
  evidence: 'Exemple : « Lina aide son frère. » prouve que Lina est serviable.',
  short: 'Exemple : Pour remercier quelqu’un, je dis « merci ».',
  oral: 'Exemple : « Bonjour, les amis ! » → je marque une petite pause après « Bonjour ».',
  order: 'Exemple : « joue. / Lina » → « Lina joue. »'
};

function question(base, criterionId, difficulty, variant, spec) {
  return {
    ...base,
    id: `${base.setId}-c${criterionId}-${difficulty}-${variant}`,
    criterionId,
    indicator: getCriterion(base.activityId, criterionId)?.indicator || '',
    difficulty,
    title: `${base.title} — ${spec.label}`,
    model: `${variant}-${difficulty}`,
    source: SOURCE,
    active: true,
    visualType: 'none',
    prompt: spec.prompt,
    answer: spec.answer,
    contentKey: `${base.setId}-c${criterionId}`,
    answerLines: spec.answerLines ?? (['short', 'order'].includes(spec.type) ? 3 : 0),
    task: {
      type: spec.type,
      example: difficulty === 'remediation' ? (spec.example || EXAMPLES[spec.type] || '') : '',
      hint: difficulty === 'remediation' ? (spec.hint || '') : difficulty === 'consolidation' ? (spec.lightHint || '') : '',
      items: spec.items
    }
  };
}

function choiceItem(stem, correct, incorrect, difficulty) {
  return { stem, options: [correct, ...incorrect].slice(0, difficulty === 'remediation' ? 2 : 3), correct: 0 };
}

function createGuidedReadingBank() {
  const output = [];
  for (const [unitId, guides] of Object.entries(READING_GUIDES)) {
    guides.forEach((guide, index) => {
      const base = {
        setId: `guided-6-u${unitId}-reading-${index + 1}`,
        levelId: '6', unitId, activityId: 'lecture',
        title: READING_SETS[unitId][index][0], support: guide.text
      };
      const sentences = guide.text.split(/(?<=[.!?])\s+/).filter(Boolean);
      for (const difficulty of DIFFICULTIES) {
        const facts = guide.facts.slice(0, difficulty === 'remediation' ? 2 : 3);
        const add = (criterionId, variant, spec) => output.push(question(base, criterionId, difficulty, variant, spec));
        add(1, 'lecture-vocale', {
          label: 'Je lis deux phrases', type: 'oral',
          prompt: 'Lis ce court passage à voix haute en respectant les points.',
          items: [{ stem: sentences.slice(0, difficulty === 'approfondissement' ? 3 : 2).join(' ') }],
          hint: 'Prépare les mots en silence. Arrête-toi un peu à chaque point. Tu peux écouter le modèle de l’enseignant.',
          answer: 'Observation de l’enseignant : mots prononcés clairement, ponctuation et groupes de sens respectés. La réponse attendue est une lecture orale, pas un choix écrit.'
        });
        add(2, 'entoure', {
          label: 'J’entoure la bonne réponse', type: 'choice',
          prompt: 'Entoure la bonne réponse pour chaque question.',
          items: facts.map(([stem, correct, ...incorrect]) => choiceItem(stem, correct, incorrect, difficulty)),
          hint: 'Relis le début du texte. Cherche les personnes, les lieux et les actions.',
          answer: facts.map(([stem, correct]) => `${stem} ${correct}`).join('\n')
        });
        add(2, 'relie', {
          label: 'Je relie la question à sa réponse', type: 'matching',
          prompt: 'Relie chaque question à sa réponse par une flèche.',
          items: facts.map(([left, right]) => ({ left, right })),
          hint: 'Lis une question puis retrouve l’information dans le texte. Chaque réponse sert une fois.',
          answer: facts.map(([left, right]) => `${left} → ${right}`).join('\n')
        });
        add(3, 'sens', {
          label: 'J’entoure le sens du mot', type: 'choice',
          prompt: 'Entoure le sens de chaque mot dans le texte.', example: EXAMPLES.vocabulary,
          items: guide.words.map(([word, correct, ...incorrect]) => choiceItem(`« ${word} » veut dire :`, correct, incorrect, difficulty)),
          hint: 'Relis la phrase qui contient le mot. Elle t’aide à comprendre son sens.',
          answer: guide.words.map(([word, meaning]) => `${word} : ${meaning}`).join('\n')
        });
        add(3, 'relie-mots', {
          label: 'Je relie les mots à leur sens', type: 'matching',
          prompt: 'Relie chaque mot à son sens dans le texte.', example: EXAMPLES.vocabulary,
          items: guide.words.map(([left, right]) => ({ left, right })),
          hint: 'Chaque explication correspond à un seul mot. Relis les phrases du texte.',
          answer: guide.words.map(([word, meaning]) => `${word} → ${meaning}`).join('\n')
        });
        add(4, 'indice', {
          label: 'Je choisis l’indice qui prouve', type: 'choice',
          prompt: 'Entoure l’indice du texte qui prouve chaque idée.', example: EXAMPLES.evidence,
          items: guide.evidence.map(([claim, proof], proofIndex) => choiceItem(claim, proof, [guide.evidence[1 - proofIndex][1], sentences[0]], difficulty)),
          hint: 'L’indice doit expliquer précisément l’idée. Une autre phrase du texte ne suffit pas.',
          answer: guide.evidence.map(([claim, proof]) => `${claim} Indice : « ${proof} »`).join('\n')
        });
        add(4, 'relie-indices', {
          label: 'Je relie l’idée à sa preuve', type: 'matching',
          prompt: 'Relie chaque idée à l’indice du texte qui la prouve.', example: EXAMPLES.evidence,
          items: guide.evidence.map(([left, right]) => ({ left, right })),
          hint: 'Cherche le lien entre ce que l’on affirme et ce que fait le personnage.',
          answer: guide.evidence.map(([left, right]) => `${left} → « ${right} »`).join('\n')
        });
        add(5, 'lecture-fluide', {
          label: 'Je relis sans couper les mots', type: 'oral',
          prompt: 'Prépare le passage en silence puis lis-le à voix haute sans couper les mots.',
          items: [{ stem: sentences.slice(-2).join(' ') }],
          hint: 'Lis une première fois doucement. Reprends les mots difficiles, puis relis avec une voix régulière.',
          answer: 'Observation de l’enseignant : lecture continue, mots regroupés selon le sens, hésitations progressivement corrigées. Aucun questionnaire écrit ne remplace cette lecture.'
        });
        add(6, 'choix-situation', {
          label: 'Je choisis dans une nouvelle situation', type: 'choice',
          prompt: 'Entoure la réponse qui convient dans cette nouvelle situation.', example: EXAMPLES.short,
          items: [choiceItem(guide.transfer[0], guide.transfer[1], guide.transfer.slice(2), difficulty)],
          hint: 'Pense à ce que tu as appris avec le personnage, puis applique-le à la nouvelle situation.',
          answer: `${guide.transfer[0]} ${guide.transfer[1]}`
        });
        add(6, 'mon-avis', {
          label: 'Je complète avec mon idée', type: 'short',
          prompt: difficulty === 'approfondissement' ? 'Complète la phrase avec ton idée et ajoute une raison courte.' : 'Complète la phrase avec ton idée.',
          items: [{ stem: guide.starter }],
          hint: 'Une seule petite phrase suffit. Tu peux d’abord dire ton idée à l’enseignant.',
          answer: `${guide.suggestion} Accepter toute réponse personnelle pertinente.`,
          answerLines: difficulty === 'approfondissement' ? 3 : 2
        });
      }
    });
  }
  return output;
}

const EXPRESSION_CONTEXTS = {
  1: [
    {
      title: 'Un matin à la boulangerie',
      support: 'Le boulanger prépare la pâte. Il met le pain au four. À midi, le pain est prêt.',
      situation: 'Tu expliques à un camarade ce que fait le boulanger.',
      start: 'Le boulanger prépare…', finish: 'la pâte pour faire du pain.',
      words: ['boulanger', 'pâte', 'pain'],
      sentence: 'Le boulanger prépare du pain.',
      parts: ['Le boulanger', 'prépare', 'du pain.'],
      actions: ['Le boulanger prépare la pâte.', 'Il met le pain au four.', 'Il sort le pain cuit.'],
      opinion: 'Le travail du boulanger est utile parce que…', reason: 'nous avons du pain pour manger.',
      imagination: 'Imagine un pain de fête. Décris sa forme dans une phrase.',
      creativeStart: 'Mon pain de fête ressemble à…',
      writingPrompt: 'Raconte le travail du boulanger en deux phrases.',
      writingStarts: ['D’abord, le boulanger…', 'Ensuite, il…'],
      spelling: 'Le boulanger ___ une pelle pour mettre le pain ___ cuire.',
      spellingWords: ['a', 'à'], spellingAnswer: 'Le boulanger a une pelle pour mettre le pain à cuire.',
      presentation: 'Recopie le titre « À la boulangerie », puis écris les deux phrases sur deux lignes.',
      format: 'Un titre isolé et deux phrases bien séparées.'
    },
    {
      title: 'Un appel en famille',
      support: 'Lina allume sa tablette. Elle appelle sa grand-mère. Elles discutent et sourient.',
      situation: 'Tu racontes à un ami comment Lina parle à sa grand-mère.',
      start: 'Lina utilise sa tablette pour…', finish: 'parler à sa grand-mère.',
      words: ['tablette', 'appelle', 'grand-mère'],
      sentence: 'Lina appelle sa grand-mère.',
      parts: ['Lina', 'appelle', 'sa grand-mère.'],
      actions: ['Lina allume sa tablette.', 'Elle appelle sa grand-mère.', 'Elles discutent ensemble.'],
      opinion: 'Cet appel est agréable parce que…', reason: 'Lina peut parler à sa grand-mère.',
      imagination: 'Imagine une question gentille à poser à un grand-parent.',
      creativeStart: 'J’aimerais te demander…',
      writingPrompt: 'Raconte l’appel de Lina en deux phrases.',
      writingStarts: ['D’abord, Lina…', 'Ensuite, elle…'],
      spelling: 'Lina ___ une tablette. Elle parle ___ sa grand-mère.',
      spellingWords: ['a', 'à'], spellingAnswer: 'Lina a une tablette. Elle parle à sa grand-mère.',
      presentation: 'Recopie le titre « Un appel en famille », puis écris les deux phrases sur deux lignes.',
      format: 'Un titre isolé et deux phrases bien séparées.'
    }
  ],
  2: [
    {
      title: 'Bienvenue dans notre jeu',
      support: 'Un nouvel élève reste seul dans la cour. Nour lui propose de jouer avec elle. Il accepte et sourit.',
      situation: 'Tu invites un nouveau camarade à jouer avec toi.',
      start: 'Bonjour, veux-tu…', finish: 'jouer avec nous ?',
      words: ['bonjour', 'jouer', 'ensemble'],
      sentence: 'Nour invite son camarade à jouer.',
      parts: ['Nour', 'invite', 'son camarade à jouer.'],
      actions: ['Le nouvel élève est seul.', 'Nour l’invite à jouer.', 'Les enfants jouent ensemble.'],
      opinion: 'J’invite le nouvel élève parce que…', reason: 'je veux qu’il se sente bien avec nous.',
      imagination: 'Imagine un petit jeu que tu pourrais proposer au nouveau camarade.',
      creativeStart: 'Je te propose un jeu où…',
      writingPrompt: 'Complète les deux répliques pour accueillir le nouvel élève.',
      writingStarts: ['— Bonjour, veux-tu… ?', '— Oui, merci, je…'],
      spelling: 'Nour ___ gentille. Elle invite le garçon ___ les autres enfants.',
      spellingWords: ['est', 'et'], spellingAnswer: 'Nour est gentille. Elle invite le garçon et les autres enfants.',
      presentation: 'Recopie les deux répliques. Commence chaque réplique sur une nouvelle ligne avec un tiret.',
      format: 'Deux répliques distinctes, chacune précédée d’un tiret.'
    },
    {
      title: 'Le crayon partagé',
      support: 'Sami n’a plus de crayon. Inès en a deux. Elle lui en prête un. Sami la remercie.',
      situation: 'Tu proposes de prêter un crayon à un camarade.',
      start: 'Tu peux prendre…', finish: 'mon crayon.',
      words: ['crayon', 'prête', 'merci'],
      sentence: 'Inès prête un crayon à Sami.',
      parts: ['Inès', 'prête', 'un crayon à Sami.'],
      actions: ['Sami cherche un crayon.', 'Inès lui prête un crayon.', 'Sami remercie Inès.'],
      opinion: 'Je prête mon crayon parce que…', reason: 'mon camarade en a besoin pour travailler.',
      imagination: 'Imagine une autre petite aide à proposer à un camarade.',
      creativeStart: 'Je peux aussi t’aider à…',
      writingPrompt: 'Complète les deux répliques pour demander puis remercier.',
      writingStarts: ['— Peux-tu me prêter… ?', '— Merci, je peux maintenant…'],
      spelling: 'Inès prête ___ crayon. Les deux élèves ___ contents.',
      spellingWords: ['son', 'sont'], spellingAnswer: 'Inès prête son crayon. Les deux élèves sont contents.',
      presentation: 'Recopie les deux répliques. Commence chaque réplique sur une nouvelle ligne avec un tiret.',
      format: 'Deux répliques distinctes, chacune précédée d’un tiret.'
    }
  ],
  3: [
    {
      title: 'Un parc plus propre',
      support: 'Lina voit des papiers dans le parc. Avec ses amis, elle les ramasse. Ils les mettent dans une poubelle. Le parc devient propre.',
      situation: 'Tu proposes à un ami un geste pour garder le parc propre.',
      start: 'Pour garder le parc propre, nous pouvons…', finish: 'mettre les papiers dans la poubelle.',
      words: ['papiers', 'poubelle', 'propre'],
      sentence: 'Les enfants ramassent les papiers.',
      parts: ['Les enfants', 'ramassent', 'les papiers.'],
      actions: ['Lina voit les papiers.', 'Les enfants les ramassent.', 'Le parc devient propre.'],
      opinion: 'Il faut utiliser la poubelle parce que…', reason: 'les déchets salissent le parc.',
      imagination: 'Imagine un message court pour inviter les promeneurs à protéger le parc.',
      creativeStart: 'Dans notre parc, pensons à…',
      writingPrompt: 'Raconte l’action des enfants et décris le parc à la fin.',
      writingStarts: ['Les enfants…', 'Maintenant, le parc est…'],
      spelling: 'Les enfants ___ les papiers. La cour est ___.',
      spellingWords: ['ramassent', 'propre'], spellingAnswer: 'Les enfants ramassent les papiers. La cour est propre.',
      presentation: 'Recopie le titre « Un parc plus propre », puis présente les deux phrases avec un petit espace entre elles.',
      format: 'Un titre lisible et deux phrases sans rature gênante.'
    },
    {
      title: 'Un matin en forme',
      support: 'Walid prépare son petit déjeuner. Il prend du pain, un yaourt et un fruit. Il boit de l’eau. Il part à l’école en forme.',
      situation: 'Tu proposes à un ami un petit déjeuner varié.',
      start: 'Le matin, tu peux manger…', finish: 'du pain, un yaourt et un fruit.',
      words: ['déjeuner', 'yaourt', 'fruit'],
      sentence: 'Walid prépare un petit déjeuner varié.',
      parts: ['Walid', 'prépare', 'un petit déjeuner varié.'],
      actions: ['Walid prépare son repas.', 'Il mange son petit déjeuner.', 'Il part à l’école.'],
      opinion: 'Je prends mon petit déjeuner parce que…', reason: 'je veux avoir de l’énergie le matin.',
      imagination: 'Imagine un petit déjeuner varié avec un fruit de ton choix.',
      creativeStart: 'Dans mon petit déjeuner, je choisis…',
      writingPrompt: 'Raconte le petit déjeuner de Walid en deux phrases.',
      writingStarts: ['Le matin, Walid…', 'Après ce repas, il…'],
      spelling: 'Walid ___ du pain. Les pommes sont ___.',
      spellingWords: ['mange', 'fraîches'], spellingAnswer: 'Walid mange du pain. Les pommes sont fraîches.',
      presentation: 'Recopie le titre « Un matin en forme », puis écris les deux phrases sur deux lignes.',
      format: 'Un titre isolé et deux phrases bien espacées.'
    }
  ],
  4: [
    {
      title: 'Une visite au musée',
      support: 'Maya entre dans un musée avec sa classe. Elle observe un grand vase bleu. Elle le dessine dans son carnet. Elle raconte sa découverte à sa famille.',
      situation: 'Tu décris à ta famille un objet observé au musée.',
      start: 'Au musée, j’ai vu…', finish: 'un grand vase bleu.',
      words: ['musée', 'vase', 'découverte'],
      sentence: 'Maya dessine un grand vase bleu.',
      parts: ['Maya', 'dessine', 'un grand vase bleu.'],
      actions: ['Maya entre au musée.', 'Elle observe le vase.', 'Elle le dessine dans son carnet.'],
      opinion: 'J’aime visiter un musée parce que…', reason: 'je découvre des objets que je ne connais pas.',
      imagination: 'Imagine un objet à présenter dans un musée du futur.',
      creativeStart: 'Dans le musée du futur, je présenterais…',
      writingPrompt: 'Raconte la visite de Maya et décris le vase.',
      writingStarts: ['Maya visite…', 'Elle voit un vase…'],
      spelling: 'Maya est ___ au musée. Les poteries sont ___.',
      spellingWords: ['allée', 'colorées'], spellingAnswer: 'Maya est allée au musée. Les poteries sont colorées.',
      presentation: 'Recopie le titre « Ma visite au musée », puis écris les deux phrases sur deux lignes.',
      format: 'Un titre lisible, des phrases séparées et une copie propre.'
    },
    {
      title: 'Un petit mot de vacances',
      support: 'Yanis passe ses vacances à Djerba. Il découvre une plage calme. Il écrit à son ami Sami pour lui raconter sa promenade.',
      situation: 'Tu racontes une promenade à un ami.',
      start: 'Pendant ma promenade, j’ai découvert…', finish: 'une plage calme.',
      words: ['vacances', 'plage', 'promenade'],
      sentence: 'Yanis écrit une lettre à Sami.',
      parts: ['Yanis', 'écrit', 'une lettre à Sami.'],
      actions: ['Yanis arrive à Djerba.', 'Il se promène sur la plage.', 'Il écrit à son ami.'],
      opinion: 'J’aimerais découvrir Djerba parce que…', reason: 'je veux voir ses plages et ses villages.',
      imagination: 'Imagine un lieu que tu aimerais montrer à un ami en vacances.',
      creativeStart: 'J’aimerais te montrer…',
      writingPrompt: 'Complète ces deux phrases pour écrire à Sami.',
      writingStarts: ['Cher Sami, je suis…', 'Hier, j’ai découvert…'],
      spelling: 'Les filles sont ___ à la plage. Les maisons sont ___.',
      spellingWords: ['allées', 'blanches'], spellingAnswer: 'Les filles sont allées à la plage. Les maisons sont blanches.',
      presentation: 'Présente une petite lettre : « Cher Sami, » sur la première ligne, une phrase de vacances ensuite, puis ta signature en bas.',
      format: 'Formule d’appel, message et signature sur des lignes distinctes.'
    }
  ]
};

function createGuidedExpressionBank() {
  const output = [];
  for (const [unitId, contexts] of Object.entries(EXPRESSION_CONTEXTS)) {
    contexts.forEach((context, index) => {
      for (const difficulty of DIFFICULTIES) {
        const helped = difficulty === 'remediation';
        const advanced = difficulty === 'approfondissement';
        const oralBase = { setId: `guided-6-u${unitId}-oral-${index + 1}`, levelId: '6', unitId, activityId: 'oral', title: context.title, support: context.support };
        const writingBase = { ...oralBase, setId: `guided-6-u${unitId}-production-${index + 1}`, activityId: 'production' };
        const oral = (criterionId, spec) => output.push(question(oralBase, criterionId, difficulty, `parole-${index + 1}`, { type: 'oral', ...spec }));
        const writing = (criterionId, spec) => output.push(question(writingBase, criterionId, difficulty, `ecriture-${index + 1}`, { type: 'short', answerLines: advanced ? 6 : 4, ...spec }));
        oral(1, {
          label: 'Je dis une phrase adaptée',
          prompt: 'Dis une phrase qui convient à cette situation.',
          items: [{ stem: `${context.situation}${helped ? ` Tu peux commencer par : « ${context.start} »` : ''}` }],
          example: 'Exemple : Pour demander une gomme, je dis « Peux-tu me prêter ta gomme ? ».',
          hint: 'Pense à la personne à qui tu parles et à ce que tu veux lui dire.',
          answer: `Une phrase orale adaptée à la situation. Exemple possible : ${context.start.replace(/…$/, '')} ${context.finish}`
        });
        oral(2, {
          label: 'J’articule quelques mots',
          prompt: 'Prononce les mots, puis dis la phrase en articulant.',
          items: [{ stem: context.words.join(' — ') }, { stem: context.sentence }],
          example: 'Exemple : « chocolat » → cho-co-lat, puis je redis le mot entier.',
          hint: 'Écoute le modèle de l’enseignant. Répète lentement, puis prononce les mots normalement.',
          answer: 'Observation orale : sons reconnaissables, syllabes audibles, phrase intelligible. Reprendre les sons difficiles avec l’élève.'
        });
        oral(3, {
          label: 'Je construis une phrase à l’oral',
          prompt: 'Dis une phrase complète à partir de ces groupes de mots.',
          items: [{ stem: [context.parts[2], context.parts[0], context.parts[1]].join(' / ') }],
          example: 'Exemple : « chante / Lina » → je dis « Lina chante. ».',
          hint: 'Commence par la personne, puis dis son action et complète.',
          answer: context.sentence
        });
        oral(4, {
          label: 'Je donne une raison simple',
          prompt: advanced ? 'Donne ton avis et une raison dans une ou deux phrases orales.' : 'Complète la phrase à l’oral avec une raison.',
          items: [{ stem: context.opinion }],
          example: 'Exemple : « J’emporte un parapluie parce qu’il pleut. ».',
          hint: 'Les mots « parce que » servent à expliquer pourquoi. Appuie-toi sur la situation.',
          answer: `${context.opinion.replace(/…$/, '')} ${context.reason} Accepter une autre raison cohérente.`
        });
        oral(5, {
          label: 'J’invente une petite idée',
          prompt: 'Propose une idée personnelle à l’oral.',
          items: [{ stem: `${context.imagination}${helped ? ` Tu peux dire : « ${context.creativeStart} »` : ''}` }],
          example: 'Exemple : Pour inventer un cadeau, je dis « Je dessine un soleil qui sourit. ».',
          hint: 'Une idée simple suffit. Tu peux choisir une couleur, un lieu ou une action.',
          answer: 'Une idée personnelle compréhensible et en rapport avec la situation ; ne pas imposer une réponse unique.'
        });
        oral(6, {
          label: 'Je parle avec une voix régulière',
          prompt: 'Raconte la situation à voix haute avec tes mots.',
          items: [{ stem: helped ? `Prépare une phrase avec ces mots : ${context.words.join(', ')}.` : `Dis ${advanced ? 'deux ou trois' : 'deux'} petites phrases sur la situation.` }],
          example: 'Exemple : « Ce matin, je vais au jardin. » → je dis la phrase sans arrêter ma voix après chaque mot.',
          hint: 'Prépare ton idée, respire, puis parle doucement. Tu peux recommencer une fois.',
          answer: 'Observation de la prise de parole réelle : débit régulier, pauses naturelles, voix audible. L’aisance se juge pendant la parole, pas sur une réponse écrite.'
        });
        writing(1, {
          label: 'J’écris pour la situation',
          prompt: context.writingPrompt,
          items: [{ stem: context.writingStarts.join('\n') }],
          example: 'Exemple : Pour raconter un jeu, j’écris « Lina prend le ballon. Elle joue avec son frère. ».',
          hint: `Aide-mots : ${context.words.join(', ')}. Termine chaque petite phrase.`,
          answer: 'Deux courtes phrases répondant à la consigne et à la situation. Accepter les formulations personnelles cohérentes.'
        });
        writing(2, {
          label: 'Je copie lisiblement',
          prompt: 'Recopie la phrase en formant bien les lettres.',
          items: [{ stem: advanced ? `${context.sentence} ${context.actions[2]}` : context.sentence }],
          example: 'Exemple : « Lili lit. » → je forme la majuscule L, je sépare les mots et je termine par un point.',
          hint: 'Écris lentement. Laisse un espace entre les mots et garde les lettres sur la ligne.',
          answer: 'La phrase est réellement écrite : lettres reconnaissables, majuscule formée, mots espacés. Observer l’écriture de l’élève.'
        });
        writing(3, {
          label: 'Je remets les mots en ordre', type: 'order',
          prompt: advanced ? 'Remets les groupes de mots en ordre et écris la phrase. Ajoute ensuite une petite phrase sur le même sujet.' : 'Remets les groupes de mots en ordre et écris la phrase.',
          items: [{ parts: context.parts }],
          hint: 'Cherche d’abord qui fait l’action. Mets un point à la fin.',
          answer: `${context.sentence}${advanced ? ' Accepter une deuxième phrase correctement construite sur le même sujet.' : ''}`
        });
        writing(4, {
          label: 'Je complète puis je recopie',
          prompt: 'Complète avec les mots proposés puis recopie les phrases.',
          items: [{ stem: `Mots proposés : ${[...context.spellingWords].reverse().join(' / ')}\n${context.spelling}` }],
          example: 'Exemple : « La ___ est bleue. » avec le mot « mer » → « La mer est bleue. ».',
          hint: 'Chaque mot sert une fois. Regarde bien toutes ses lettres avant de le recopier.',
          answer: context.spellingAnswer
        });
        writing(5, {
          label: 'Je raconte dans l’ordre', type: 'order',
          prompt: 'Numérote les phrases dans l’ordre de l’histoire, puis recopie-les.',
          items: [{ parts: context.actions.slice(0, helped ? 2 : 3) }],
          example: 'Exemple : « Je mange. / Je prépare le repas. » → 1. Je prépare le repas. 2. Je mange.',
          hint: 'Demande-toi ce qui arrive d’abord, puis ensuite.',
          answer: context.actions.slice(0, helped ? 2 : 3).map((sentence, i) => `${i + 1}. ${sentence}`).join('\n'),
          answerLines: helped ? 4 : 6
        });
        writing(6, {
          label: 'J’ajoute mon idée',
          prompt: advanced ? 'Écris ton idée et ajoute un détail dans une deuxième phrase.' : 'Écris une phrase avec ton idée personnelle.',
          items: [{ stem: `${context.imagination}\n${context.creativeStart}` }],
          example: 'Exemple : Pour décorer mon cahier, j’imagine « une étoile dorée au milieu de la couverture ».',
          hint: 'Tu peux dire ta phrase avant de l’écrire. Choisis un détail qui te plaît.',
          answer: 'Accepter une phrase personnelle pertinente ; pour l’approfondissement, un détail supplémentaire cohérent.'
        });
        writing(7, {
          label: 'Je présente une petite copie',
          prompt: context.presentation,
          items: [{ stem: context.writingStarts.join('\n') }],
          example: 'Exemple : Je place le titre « Mon jardin » seul sur une ligne et je commence mon texte en dessous.',
          hint: 'Laisse les espaces demandés. Vérifie les débuts de ligne et évite les ratures gênantes.',
          answer: `${context.format} Observer la copie produite par l’élève.`,
          answerLines: 6
        });
      }
    });
  }
  return output;
}

module.exports = { createGuidedReadingBank, createGuidedExpressionBank };
