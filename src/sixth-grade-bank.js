const { getCriterion } = require('./curriculum');

const OFFICIAL_ALIGNMENT = 'Création originale alignée sur le guide méthodologique tunisien de 6ème année';

const READING_SETS = Object.freeze({
  1: [
    ['La boulangerie de quartier', 'récit', 'Avant le lever du soleil, Amira rejoint sa tante dans la boulangerie du quartier. Elle pèse la farine, prépare les plaques et observe la pâte qui gonfle. À sept heures, les premiers clients arrivent. Une panne coupe soudain le four. Amira téléphone au technicien puis propose de terminer les petits pains dans le four voisin. Grâce à son calme, toutes les commandes sont prêtes à temps.', 'Pourquoi Amira rejoint-elle sa tante et quel problème survient ?', 'Elle l’aide à la boulangerie ; une panne coupe le four.', 'gonfle', 'augmente de volume', 'Amira sait-elle réagir devant une difficulté ? Justifie.', 'Oui : elle appelle le technicien et trouve un four voisin.', 'Quelle qualité professionnelle montre Amira ?', 'Le calme, l’initiative ou le sens des responsabilités.'],
    ['Le reportage de Youssef', 'article', 'Pour le journal de l’école, Youssef interviewe une vétérinaire. Il prépare ses questions, vérifie le fonctionnement de l’enregistreur et demande l’autorisation avant de prendre une photo. Après la rencontre, il compare ses notes avec l’enregistrement. Une information lui paraît imprécise : il rappelle la vétérinaire au lieu de l’inventer. Son article explique enfin comment protéger les animaux abandonnés.', 'Quel travail réalise Youssef et pour quel support ?', 'Il réalise une interview et un article pour le journal de l’école.', 'imprécise', 'qui manque de précision ou de clarté', 'Pourquoi peut-on dire que Youssef est sérieux ?', 'Il vérifie l’information auprès de la vétérinaire au lieu de l’inventer.', 'Pourquoi faut-il vérifier une information avant de la publier ?', 'Pour éviter les erreurs et informer les lecteurs correctement.'],
    ['Le robot de la serre', 'documentaire', 'Dans une serre expérimentale, un petit robot mesure l’humidité de la terre toutes les deux heures. Quand le sol devient trop sec, il envoie un message au jardinier. Celui-ci décide alors de la quantité d’eau nécessaire. Le robot facilite la surveillance des plantes, mais il ne remplace pas le professionnel : le jardinier observe les feuilles, contrôle les maladies et répare les tuyaux.', 'À quoi sert le robot et qui prend la décision finale ?', 'Il mesure l’humidité et alerte ; le jardinier décide de l’arrosage.', 'surveillance', 'action d’observer régulièrement pour contrôler', 'Le robot remplace-t-il complètement le jardinier ? Justifie.', 'Non : le jardinier observe, décide, contrôle les maladies et répare.', 'Cite un avantage et une limite de cette technologie.', 'Elle facilite le contrôle, mais elle dépend du jugement et de l’entretien humains.'],
    ['Une émission bien préparée', 'dialogue', '— Notre émission commence dans dix minutes, annonce Rania.\n— Le micro fonctionne, mais il manque le témoignage du bibliothécaire, répond Mehdi.\nRania consulte aussitôt le message reçu le matin et retrouve l’enregistrement. Les deux élèves l’écoutent, coupent un passage trop long puis notent l’ordre des rubriques. Quand le voyant rouge s’allume, ils saluent les auditeurs et présentent calmement leur sujet sur les métiers du livre.', 'Que préparent Rania et Mehdi et quel élément manquait ?', 'Ils préparent une émission ; le témoignage du bibliothécaire manquait.', 'rubriques', 'parties régulières d’une émission ou d’un journal', 'Comment sait-on que les élèves se sont organisés ?', 'Ils vérifient le micro, retrouvent l’enregistrement et notent l’ordre des rubriques.', 'Quelle règle faut-il respecter pendant une émission ?', 'Parler clairement, respecter l’ordre prévu et vérifier les informations.'],
    ['La jeune réparatrice', 'récit', 'Meriem aime comprendre le fonctionnement des objets. Quand la lampe de bureau ne s’allume plus, elle commence par la débrancher. Avec son père, elle vérifie l’ampoule puis le câble. Le fil est abîmé. Son père lui montre comment le remplacer sans danger. La lampe fonctionne de nouveau. Meriem note les étapes dans un carnet afin de pouvoir expliquer la réparation à ses camarades.', 'Quel objet est en panne et quelle en est la cause ?', 'La lampe de bureau ; son fil est abîmé.', 'abîmé', 'endommagé ou détérioré', 'Meriem agit-elle prudemment ? Relève deux indices.', 'Oui : elle débranche la lampe et travaille avec son père.', 'Que faut-il faire avant de réparer un appareil électrique ?', 'Le débrancher et demander l’aide d’un adulte compétent.'],
    ['Le message trompeur', 'récit', 'Sami reçoit sur son téléphone un message annonçant la fermeture de l’école. Il veut aussitôt le transmettre à toute la classe. Leïla lui conseille d’en vérifier l’origine. Le message ne porte ni signature ni date. Ils consultent alors la page officielle de l’établissement : les cours sont maintenus. Sami efface le faux message et prévient ses amis de ne pas le partager.', 'Quelle information reçoit Sami et comment découvre-t-il qu’elle est fausse ?', 'Il reçoit une annonce de fermeture ; la page officielle indique que les cours sont maintenus.', 'origine', 'source ou endroit d’où vient une information', 'Pourquoi Leïla doute-t-elle du message ?', 'Il ne porte ni signature ni date.', 'Quel conseil donnerais-tu avant de partager un message ?', 'Vérifier la source, la date et confirmer auprès d’un canal officiel.'],
    ['Au centre de tri postal', 'documentaire', 'Au centre de tri, les lettres arrivent dans de grands sacs. Une machine lit les adresses et les range selon leur destination. Les enveloppes mal écrites sont confiées à des agents qui les examinent une à une. Avant le départ des camions, chaque bac est contrôlé. La technologie accélère le travail, tandis que l’attention des employés permet de résoudre les cas difficiles.', 'Comment les lettres sont-elles triées et qui traite les cas difficiles ?', 'Une machine lit et classe les adresses ; les agents examinent les enveloppes mal écrites.', 'destination', 'lieu où une lettre doit arriver', 'Pourquoi les employés restent-ils indispensables ?', 'Ils contrôlent les bacs et résolvent les adresses difficiles.', 'Quel détail faut-il soigner quand on écrit une adresse ?', 'Écrire lisiblement le nom, la rue, la ville et le code postal.'],
    ['Le métier de demain', 'interview', '— Quel métier aimerais-tu exercer ? demande la journaliste.\n— Je voudrais concevoir des maisons qui consomment peu d’énergie, répond Aziz.\n— Une machine fera-t-elle tout le travail ?\n— Non. Les logiciels aideront à dessiner et à calculer, mais il faudra écouter les familles, choisir des matériaux adaptés et contrôler le chantier. Pour Aziz, la technologie est un outil : les décisions responsables appartiennent toujours aux personnes.', 'Quel métier Aziz imagine-t-il et dans quel but ?', 'Il veut concevoir des maisons économes en énergie.', 'concevoir', 'imaginer et préparer la réalisation de quelque chose', 'La technologie décidera-t-elle seule ? Justifie.', 'Non : il faudra écouter, choisir et contrôler ; les décisions restent humaines.', 'Quel métier de demain imagines-tu et à quel besoin répond-il ?', 'Réponse personnelle cohérente avec un besoin réel.']
  ],
  2: [
    ['Le banc partagé', 'récit', 'À la récréation, Nour voit un nouvel élève assis seul. Il parle encore difficilement français et n’ose pas rejoindre les jeux. Nour lui montre les règles avec des gestes puis lui confie le ballon. Peu à peu, les autres enfants l’encouragent. À la fin de la partie, le garçon sourit et apprend à ses camarades un jeu de son pays.', 'Pourquoi le nouvel élève reste-t-il seul et que fait Nour ?', 'Il parle difficilement français ; Nour lui explique le jeu et lui donne le ballon.', 'n’ose pas', 'ne trouve pas encore le courage de faire quelque chose', 'Comment les élèves montrent-ils qu’ils l’acceptent ?', 'Ils l’encouragent et jouent avec lui.', 'Qu’apporte la différence dans cette histoire ?', 'Elle permet de découvrir un nouveau jeu et d’enrichir le groupe.'],
    ['Une collecte bien organisée', 'article', 'Après un incendie, le conseil des élèves organise une collecte pour trois familles. Une équipe prépare la liste des besoins ; une autre classe les vêtements par taille. Pour respecter les personnes aidées, les élèves nettoient les objets et les emballent soigneusement. Ils remettent ensuite les dons à une association, sans photographier les familles. La solidarité s’accompagne ainsi de discrétion et de respect.', 'Pourquoi la collecte est-elle organisée et comment les tâches sont-elles réparties ?', 'Pour aider trois familles après un incendie ; les équipes listent, trient et emballent.', 'discrétion', 'attitude de celui qui n’expose pas la vie des autres', 'Pourquoi les élèves ne photographient-ils pas les familles ?', 'Pour respecter leur dignité et leur vie privée.', 'Une aide utile doit-elle seulement être généreuse ?', 'Non, elle doit aussi répondre aux besoins et respecter les personnes.'],
    ['Le désaccord du jardin', 'dialogue', 'Deux groupes veulent utiliser le même coin de la cour : l’un pour jardiner, l’autre pour lire. Le ton monte. La déléguée demande à chacun d’expliquer son projet sans interruption. Après l’écoute, une solution apparaît : le jardin occupera la partie ensoleillée et un banc de lecture sera installé sous l’arbre. Les élèves rédigent ensemble un calendrier pour entretenir les deux espaces.', 'Sur quoi porte le désaccord et quelle solution est choisie ?', 'Sur l’usage d’un coin de cour ; ils partagent l’espace entre jardin et lecture.', 'le ton monte', 'la discussion devient plus vive ou agressive', 'Quel geste de la déléguée permet d’avancer ?', 'Elle fait parler chaque groupe sans interruption.', 'Quelle règle de dialogue a permis de résoudre le conflit ?', 'Écouter chacun, reformuler les besoins et chercher une solution équitable.'],
    ['Un passage accessible', 'article', 'Devant la bibliothèque, une marche empêche Hatem, qui se déplace en fauteuil roulant, d’entrer seul. Ses camarades proposent de le porter, mais il explique qu’il préfère être autonome. La classe écrit à la municipalité et joint un dessin d’une rampe. Quelques semaines plus tard, les travaux commencent. Désormais, les poussettes et les chariots profitent aussi du nouveau passage.', 'Quel obstacle rencontre Hatem et quelle solution obtient la classe ?', 'Une marche bloque l’entrée ; une rampe est construite.', 'autonome', 'capable d’agir sans dépendre constamment d’une autre personne', 'Pourquoi la rampe est-elle préférable au fait de porter Hatem ?', 'Elle respecte son autonomie et sert à d’autres usagers.', 'Cite un autre aménagement qui rend un lieu accessible.', 'Une porte large, un ascenseur, un passage abaissé ou une signalisation adaptée.'],
    ['Le portefeuille retrouvé', 'récit', 'En rentrant de l’école, Malek trouve un portefeuille près de l’arrêt d’autobus. Il contient de l’argent et une carte au nom d’une dame âgée. Son ami lui conseille de garder les billets, mais Malek refuse. Les deux enfants se rendent au poste de police. Le soir, la propriétaire vient remercier Malek : cet argent devait servir à acheter ses médicaments.', 'Que trouve Malek et à qui remet-il l’objet ?', 'Il trouve un portefeuille et le remet à la police.', 'propriétaire', 'personne à qui appartient un objet', 'Quelle action prouve l’honnêteté de Malek ?', 'Il refuse de garder l’argent et rapporte le portefeuille.', 'Qu’aurais-tu fait dans la même situation ? Pourquoi ?', 'Réponse personnelle conforme à l’honnêteté et à la sécurité.'],
    ['Le défi des équipes', 'récit', 'Pour construire une maquette, l’équipe de Salma possède le carton tandis que celle d’Anis a les outils. Au début, chaque groupe veut travailler seul. Les deux maquettes restent inachevées. L’enseignante leur demande de comparer leurs besoins. Les élèves décident alors de partager le matériel et les idées. Ensemble, ils terminent une maquette solide et comprennent que coopérer ne diminue pas le mérite de chacun.', 'Pourquoi les maquettes restent-elles inachevées et que décident les élèves ?', 'Chaque groupe manque d’une ressource ; ils décident de partager matériel et idées.', 'coopérer', 'agir ensemble pour atteindre un même but', 'Quelle phrase montre que la coopération réussit ?', 'Ensemble, ils terminent une maquette solide.', 'Comment répartir équitablement un travail de groupe ?', 'Donner une responsabilité à chacun et partager les ressources.'],
    ['La parole au conseil', 'compte rendu', 'Au conseil de classe, plusieurs élèves se plaignent du bruit à la cantine. La présidente note chaque proposition : parler moins fort, déplacer les chaises sans les traîner et afficher un rappel. Même les élèves qui ne sont pas d’accord peuvent expliquer leur opinion. Après un vote, deux mesures sont choisies pour une semaine d’essai. Le conseil vérifiera ensuite si le bruit a diminué.', 'Quel problème traite le conseil et comment choisit-il les mesures ?', 'Le bruit à la cantine ; il écoute les avis puis vote.', 'mesure', 'action décidée pour améliorer une situation', 'Qu’est-ce qui montre que chacun peut participer ?', 'Même les élèves en désaccord peuvent expliquer leur opinion.', 'Pourquoi faut-il évaluer les mesures après une semaine ?', 'Pour vérifier leur efficacité et les modifier si nécessaire.'],
    ['Le match sans exclusion', 'récit', 'Pendant un match, l’équipe refuse le but de Farès parce qu’il est plus jeune. Farès proteste et le jeu s’arrête. Inès relit la règle affichée : tous les joueurs inscrits ont les mêmes droits. Le capitaine reconnaît l’erreur, valide le but et présente ses excuses. La partie reprend dans une ambiance plus calme. À la fin, les joueurs décident de désigner un arbitre pour les prochains matchs.', 'Pourquoi le jeu s’arrête-t-il et comment reprend-il ?', 'Le but de Farès est refusé injustement ; la règle est relue, le but validé et des excuses présentées.', 'valide', 'reconnaît comme valable', 'Le capitaine répare-t-il son erreur ? Justifie.', 'Oui : il valide le but et présente ses excuses.', 'À quoi sert une règle commune dans un jeu ?', 'À protéger les droits de chacun et résoudre les désaccords équitablement.']
  ],
  3: [
    ['La cour sans déchets', 'récit', 'Après la récréation, la cour est couverte d’emballages. La classe de 6e observe les déchets pendant une semaine : les sachets de goûter sont les plus nombreux. Les élèves installent des boîtes de tri et proposent des fruits dans des boîtes réutilisables. Vendredi, ils comptent deux fois moins de papiers. Ils décident de poursuivre l’action et d’expliquer leurs résultats aux autres classes.', 'Quel problème les élèves observent-ils et quelle amélioration mesurent-ils ?', 'Des emballages couvrent la cour ; le nombre de papiers est divisé par deux.', 'réutilisables', 'que l’on peut utiliser plusieurs fois', 'Comment sait-on que leur action est efficace ?', 'Vendredi, ils comptent deux fois moins de papiers.', 'Pourquoi observer avant d’agir est-il utile ?', 'Cela permet d’identifier la cause principale et de mesurer le progrès.'],
    ['Le robinet du parc', 'article', 'Dans le parc, un robinet coule sans arrêt. Yasmine place un seau dessous et constate qu’il se remplit en dix minutes. Elle ne se contente pas de fermer la poignée, car la fuite continue. Avec le gardien, elle signale le problème au service municipal. Le joint est remplacé le jour même. L’eau recueillie sert à arroser les jeunes arbres.', 'Quel problème Yasmine constate-t-elle et comment est-il réparé ?', 'Un robinet fuit ; le service municipal remplace le joint.', 'signale', 'fait connaître un problème à la personne responsable', 'Pourquoi place-t-elle un seau sous le robinet ?', 'Pour mesurer/récupérer l’eau au lieu de la gaspiller.', 'Cite deux gestes contre le gaspillage de l’eau.', 'Réparer les fuites, fermer le robinet, récupérer l’eau ou arroser raisonnablement.'],
    ['Le petit déjeuner de Walid', 'récit', 'Walid arrive souvent fatigué en classe. Il se couche tard et part sans prendre de petit déjeuner. L’infirmière lui propose un essai pendant une semaine : dormir à heure régulière, boire de l’eau et manger du pain, un produit laitier et un fruit le matin. Vendredi, Walid participe davantage et reste attentif jusqu’à midi. Il décide de conserver ces nouvelles habitudes.', 'Quelles habitudes fatiguent Walid et quel changement observe-t-il ?', 'Il se couche tard et ne déjeune pas ; il devient plus attentif et actif.', 'conserver', 'garder ou continuer', 'Quel indice montre que les conseils sont utiles ?', 'Vendredi, il participe davantage et reste attentif jusqu’à midi.', 'Compose un petit déjeuner équilibré avec trois éléments.', 'Par exemple : pain, lait/yaourt et fruit, avec de l’eau.'],
    ['Une tortue en danger', 'récit', 'Sur la plage, Lina aperçoit une petite tortue prise dans un morceau de filet. Elle empêche les enfants de tirer sur l’animal et appelle un adulte du centre de protection. Le spécialiste coupe doucement le filet, examine la tortue puis la libère près de l’eau. Avant de partir, le groupe ramasse les cordes abandonnées qui pourraient blesser d’autres animaux.', 'Que découvre Lina et qui intervient ?', 'Une tortue prise dans un filet ; un spécialiste du centre de protection intervient.', 'aperçoit', 'voit ou remarque', 'Pourquoi Lina empêche-t-elle les enfants de tirer ?', 'Pour ne pas blesser davantage la tortue.', 'Que peut-on faire pour protéger les animaux marins ?', 'Ne pas abandonner de déchets, les ramasser et prévenir un spécialiste.'],
    ['Le trajet actif', 'documentaire', 'L’école se trouve à huit cents mètres de la maison de Rami. Deux fois par semaine, il y va à pied avec son voisin au lieu de prendre la voiture. Ils choisissent les passages protégés et portent des vêtements visibles. Ce trajet leur permet de bouger, de discuter et de réduire la pollution. Quand il pleut fortement, un adulte les accompagne en autobus.', 'Quelle distance parcourt Rami et quels avantages tire-t-il de la marche ?', 'Huit cents mètres ; il bouge, discute et réduit la pollution.', 'visibles', 'faciles à voir', 'Rami néglige-t-il la sécurité ? Justifie.', 'Non : il utilise les passages protégés, des vêtements visibles et un accompagnement adapté.', 'Quel déplacement actif et sûr peux-tu proposer près de chez toi ?', 'Marche ou vélo sur un trajet adapté, avec les règles de sécurité.'],
    ['Le compost de l’école', 'notice', 'Dans un coin ombragé du jardin, les élèves installent un bac à compost. Ils y déposent les épluchures de fruits et les feuilles sèches, mais jamais de plastique. Chaque semaine, ils mélangent le contenu et vérifient qu’il reste légèrement humide. Après plusieurs mois, les déchets se transforment en une terre sombre qui nourrit les plantes du potager.', 'Que met-on dans le compost et que devient-il ?', 'Des épluchures et feuilles sèches ; elles deviennent une terre qui nourrit les plantes.', 'ombragé', 'protégé du soleil direct', 'Pourquoi le plastique est-il refusé ?', 'Il ne se décompose pas comme les déchets organiques et pollue le compost.', 'Quel avantage le compost apporte-t-il à l’école ?', 'Il réduit les déchets et produit un amendement pour le jardin.'],
    ['La pause des écrans', 'dialogue', '— J’ai mal aux yeux et je n’arrive plus à dormir, dit Aya.\n— Combien de temps gardes-tu la tablette le soir ? demande le médecin.\nAya reconnaît qu’elle l’utilise jusque dans son lit. Le médecin lui conseille d’arrêter une heure avant le coucher, d’éloigner l’écran et de faire de courtes pauses. Une semaine plus tard, Aya s’endort plus vite et se réveille reposée.', 'De quoi souffre Aya et quels conseils reçoit-elle ?', 'Elle a mal aux yeux et dort mal ; elle doit arrêter plus tôt, éloigner l’écran et faire des pauses.', 'reconnaît', 'admet que quelque chose est vrai', 'Quel résultat montre une amélioration ?', 'Elle s’endort plus vite et se réveille reposée.', 'Propose une activité calme sans écran avant de dormir.', 'Lecture, dessin, discussion ou préparation du cartable.'],
    ['Les arbres de la rue', 'article', 'En été, la rue de l’école devient très chaude. Les habitants proposent de planter des arbres, mais ils doivent choisir des espèces adaptées au climat et aux trottoirs. Un jardinier mesure l’espace, vérifie les conduites d’eau puis prépare les fosses. Les familles s’engagent à arroser les jeunes plants. À long terme, leur ombre rendra le trajet plus agréable et abritera des oiseaux.', 'Pourquoi veut-on planter des arbres et quelles précautions sont prises ?', 'Pour apporter de l’ombre ; on choisit des espèces adaptées et on vérifie l’espace et les conduites.', 's’engagent', 'promettent de participer et d’assumer une responsabilité', 'Pourquoi le jardinier mesure-t-il l’espace ?', 'Pour que les racines et les arbres n’abîment pas le trottoir ou les conduites.', 'Quels bénéfices un arbre apporte-t-il en ville ?', 'Ombre, air plus agréable, refuge pour les animaux et embellissement.']
  ],
  4: [
    ['La lettre de Djerba', 'lettre', 'Djerba, le 12 juillet\nChère Inès,\nHier, nous avons visité un atelier de poterie. L’artisane a fait tourner l’argile avec patience puis m’a laissé décorer un petit bol. Cet après-midi, je lirai sous l’olivier avant de rejoindre mes cousins à la plage. J’aime ces vacances parce que je découvre un savoir-faire et que je partage du temps avec ma famille.\nAmitiés,\nMaya', 'D’où Maya écrit-elle et quelles activités raconte-t-elle ?', 'Elle écrit de Djerba ; elle visite un atelier, décore un bol, lit et va à la plage.', 'savoir-faire', 'habileté acquise pour réaliser un travail', 'Pourquoi Maya apprécie-t-elle ses vacances ?', 'Elle découvre un savoir-faire et passe du temps en famille.', 'Rédige une phrase de réponse à Maya.', 'Phrase personnelle respectant la forme d’une réponse amicale.'],
    ['Le club de photographie', 'récit', 'Pour sa première séance, Adam apporte un appareil mais photographie tout très vite. L’animatrice lui demande de choisir un sujet, d’observer la lumière et de cadrer avant d’appuyer. Adam s’accroupit près d’une fleur et attend qu’un papillon se pose. Sa seconde photo est plus nette et raconte mieux la scène. Il comprend qu’un loisir demande aussi de la patience.', 'Quel loisir découvre Adam et quel conseil améliore sa photo ?', 'La photographie ; observer la lumière et cadrer avant de déclencher.', 'cadrer', 'choisir ce qui apparaîtra dans l’image', 'Quelle action montre la patience d’Adam ?', 'Il attend qu’un papillon se pose.', 'Quelle qualité ton loisir préféré développe-t-il ?', 'Réponse personnelle justifiée.'],
    ['Une journée à Matmata', 'reportage', 'La classe visite une habitation troglodyte à Matmata. Depuis la cour creusée dans le sol, des portes conduisent vers des pièces fraîches. Le guide explique que cette architecture protège les habitants de la chaleur. Les élèves comparent les matériaux, dessinent le plan et posent des questions. Ils comprennent qu’un mode de vie répond souvent au climat et aux ressources d’une région.', 'Quel lieu la classe visite-t-elle et pourquoi les pièces restent-elles fraîches ?', 'Une habitation troglodyte ; son architecture creusée protège de la chaleur.', 'architecture', 'manière de concevoir et construire un bâtiment', 'Comment les élèves étudient-ils le lieu ?', 'Ils comparent, dessinent et posent des questions.', 'Pourquoi faut-il éviter de juger trop vite un mode de vie différent ?', 'Il peut être adapté au climat, aux ressources et à l’histoire du lieu.'],
    ['Le tournoi de cerfs-volants', 'article', 'Dimanche, des familles se retrouvent sur une grande plage pour un tournoi de cerfs-volants. Les participants vérifient la direction du vent et gardent une distance de sécurité. Sana choisit un modèle léger fabriqué avec du papier coloré. Au premier essai, le fil s’emmêle ; elle le déroule calmement puis relance son cerf-volant. Il monte enfin au-dessus des autres.', 'Où se déroule le tournoi et quelle difficulté Sana surmonte-t-elle ?', 'Sur une plage ; elle démêle le fil et relance le cerf-volant.', 's’emmêle', 'forme des nœuds et ne se déroule plus correctement', 'Sana abandonne-t-elle après l’échec ? Justifie.', 'Non : elle déroule calmement le fil puis recommence.', 'Quelle règle de sécurité faut-il respecter dans ce loisir ?', 'Garder ses distances, observer le vent et choisir un espace dégagé.'],
    ['Le carnet du musée', 'récit', 'Au musée, Sami choisit trois objets à observer : une fibule, un ancien métier à tisser et un tambour. Il note leur matière, leur usage et la région dont ils proviennent. Au lieu de toucher les pièces, il réalise des croquis. De retour en classe, son carnet l’aide à expliquer comment les objets témoignent de la vie quotidienne d’autrefois.', 'Quels objets Sami observe-t-il et comment garde-t-il une trace ?', 'Une fibule, un métier à tisser et un tambour ; il prend des notes et fait des croquis.', 'témoignent', 'apportent des informations ou des preuves sur une époque', 'Pourquoi Sami ne touche-t-il pas les objets ?', 'Pour respecter les règles et protéger les pièces du musée.', 'Quel objet actuel aimerais-tu présenter à un musée du futur ?', 'Réponse personnelle avec choix et justification.'],
    ['Des correspondants au Japon', 'courriel', 'Bonjour les amis,\nDans notre école, nous retirons nos chaussures à l’entrée et rangeons nos chaussons dans un casier. À midi, plusieurs élèves aident à servir le repas puis chacun nettoie son espace. Nous aimerions savoir comment se déroule une journée dans votre école. Envoyez-nous un emploi du temps et quelques règles de votre classe.\nLa classe de Haru', 'Quelles habitudes scolaires sont présentées et que demandent les correspondants ?', 'Retirer les chaussures, aider au repas et nettoyer ; ils demandent un emploi du temps et des règles.', 'casier', 'petit compartiment où l’on range ses affaires', 'Les élèves participent-ils à la vie collective ? Justifie.', 'Oui : ils servent le repas et nettoient leur espace.', 'Cite une ressemblance ou une différence avec ton école.', 'Réponse comparative et respectueuse.'],
    ['La randonnée préparée', 'notice', 'Pour une randonnée de deux heures, Leïla consulte la météo et trace l’itinéraire avec un adulte. Elle remplit sa gourde, prend une casquette et glisse une petite trousse de secours dans le sac. Au départ, le groupe reste sur le sentier balisé et adapte son allure au plus jeune marcheur. À la pause, chacun remporte ses déchets.', 'Comment Leïla prépare-t-elle la randonnée et quelle règle suit le groupe ?', 'Elle vérifie météo, trajet et matériel ; le groupe reste sur le sentier et adapte son allure.', 'balisé', 'indiqué par des marques pour guider les marcheurs', 'Quel geste protège la nature ?', 'Chacun remporte ses déchets.', 'Ajoute un objet utile dans le sac et explique son utilité.', 'Réponse cohérente : carte, téléphone chargé, vêtement, nourriture, etc.'],
    ['Le repas des deux régions', 'dialogue', 'Chez son correspondant, Yanis découvre un plat qu’il ne connaît pas. Il demande poliment quels ingrédients le composent et goûte une petite portion. Son ami explique que la recette accompagne les fêtes familiales de sa région. Yanis présente ensuite un plat tunisien préparé chez lui. Les deux enfants remarquent des épices différentes, mais la même joie de cuisiner ensemble.', 'Que découvrent les deux enfants et quel point commun trouvent-ils ?', 'Ils découvrent des plats régionaux ; les deux traditions aiment cuisiner et partager en famille.', 'portion', 'quantité de nourriture servie à une personne', 'Yanis respecte-t-il la tradition de son ami ? Justifie.', 'Oui : il demande poliment, écoute et goûte.', 'Comment réagir devant une coutume inconnue ?', 'Questionner avec respect, écouter et éviter de se moquer.']
  ]
});

const VISUAL_SEQUENCES = Object.freeze({
  1: [['Préparer', 'Vérifier', 'Réaliser'], ['Source', 'Contrôle', 'Publication'], ['Mesurer', 'Décider', 'Arroser'], ['Micro', 'Rubriques', 'Émission']],
  2: [['Écouter', 'Partager', 'Coopérer'], ['Besoins', 'Tri', 'Dons'], ['Désaccord', 'Dialogue', 'Accord'], ['Obstacle', 'Projet', 'Accès']],
  3: [['Observer', 'Agir', 'Mesurer'], ['Fuite', 'Signalement', 'Réparation'], ['Sommeil', 'Repas', 'Énergie'], ['Alerter', 'Soigner', 'Protéger']],
  4: [['Lieu', 'Découverte', 'Souvenir'], ['Observer', 'Cadrer', 'Photographier'], ['Habitat', 'Climat', 'Usage'], ['Essai', 'Patience', 'Réussite']]
});

function difficultyFor(index) {
  return ['remediation', 'consolidation', 'approfondissement'][index % 3];
}

function questionId(...parts) {
  return parts.join('-').replace(/[^a-zA-Z0-9-]+/g, '-').toLowerCase();
}

function readingPrompt(set, criterionId, difficulty) {
  const prefix = difficulty === 'remediation'
    ? 'Relis le texte et réponds avec les indices utiles. '
    : difficulty === 'approfondissement'
      ? 'Réponds précisément et explique ton raisonnement. '
      : '';
  const prompts = {
    1: `Prépare silencieusement le texte, puis lis à voix haute le passage choisi par l’enseignant. Respecte les groupes de souffle, les liaisons et l’intonation du ${set[1]}.`,
    2: set[3],
    3: `Dans ce texte, que signifie « ${set[5]} » ? Donne ensuite un synonyme ou une courte explication.`,
    4: `${set[7]} Recopie ensuite un indice précis du texte.`,
    5: 'Lis silencieusement pendant une minute. Marque le dernier mot lu, puis reprends la lecture en corrigeant les hésitations.',
    6: set[9]
  };
  return `${prefix}${prompts[criterionId]}`;
}

function readingAnswer(set, criterionId) {
  return ({
    1: 'Lecture intelligible : articulation correcte, ponctuation respectée et intonation adaptée au type de texte.',
    2: set[4],
    3: `${set[5]} : ${set[6]}.`,
    4: set[8],
    5: 'La lecture devient plus régulière ; les erreurs repérées sont corrigées lors de la seconde lecture.',
    6: set[10]
  })[criterionId];
}

function createReadingBank() {
  const questions = [];
  for (const [unitId, sets] of Object.entries(READING_SETS)) {
    sets.forEach((set, setIndex) => {
      const setId = `6-u${unitId}-lecture-serie-${setIndex + 1}`;
      for (const criterionId of [1, 2, 3, 4, 5, 6]) {
        for (const difficulty of ['remediation', 'consolidation', 'approfondissement']) {
          questions.push({
            id: questionId(setId, `c${criterionId}`, difficulty),
            setId,
            levelId: '6', unitId, activityId: 'lecture', criterionId,
            indicator: getCriterion('lecture', criterionId)?.indicator || '',
            title: `${set[0]} — C${criterionId}`,
            support: set[2],
            prompt: readingPrompt(set, criterionId, difficulty),
            answer: readingAnswer(set, criterionId),
            difficulty,
            model: `${String.fromCharCode(65 + setIndex)}-${difficulty[0].toUpperCase()}`,
            active: true,
            source: OFFICIAL_ALIGNMENT,
            visualType: setIndex % 2 === 0 ? 'image' : 'table',
            visualTitle: setIndex % 2 === 0 ? `Les étapes — ${set[0]}` : `Fiche de repérage — ${set[0]}`,
            visualData: setIndex % 2 === 0
              ? VISUAL_SEQUENCES[unitId][setIndex % 4].join('|')
              : `Élément|Information\nType de texte|${set[1]}\nThème|${set[0]}\nIndice à relever|Une phrase du texte`
          });
        }
      }
    });
  }
  return questions;
}

const THEMES = Object.freeze({
  1: ['la boulangère', 'le facteur', 'la journaliste', 'la mécanicienne', 'le jardinier', 'la photographe', 'le technicien', 'la bibliothécaire', 'le robot', 'la radio', 'le journal', 'la tablette'],
  2: ['Nour', 'les voisins', 'les bénévoles', 'le nouvel élève', 'la déléguée', 'les citoyens', 'les deux équipes', 'la famille', 'les camarades', 'l’association', 'le conseil', 'les joueurs'],
  3: ['les élèves', 'la tortue', 'le jardin', 'les arbres', 'Walid', 'l’infirmière', 'les cyclistes', 'la plage', 'le robinet', 'les déchets', 'les fruits', 'la forêt'],
  4: ['les voyageurs', 'la guide', 'Maya', 'le musée', 'les correspondants', 'la randonnée', 'les artistes', 'la lettre', 'le village', 'le train', 'les loisirs', 'les traditions']
});

function baseQuestion(unitId, activityId, index, title, prompt, answer, criterionId, extras = {}) {
  return {
    id: questionId('6', unitId, activityId, 'enrichi', index + 1),
    levelId: '6', unitId: String(unitId), activityId, criterionId,
    indicator: getCriterion(activityId, criterionId)?.indicator || '',
    title, prompt, answer,
    support: extras.support || '',
    difficulty: extras.difficulty || difficultyFor(index),
    model: `S${index + 1}`,
    active: true,
    source: OFFICIAL_ALIGNMENT,
    visualType: extras.visualType || (index % 5 === 0 ? 'table' : index % 4 === 0 ? 'image' : 'none'),
    visualTitle: extras.visualTitle || 'Support visuel',
    visualData: extras.visualData || (index % 5 === 0 ? 'Étape|Action\n1|Observer\n2|Répondre\n3|Vérifier' : 'Observer|Choisir|Expliquer')
  };
}

function createOralQuestions(unitId) {
  const contexts = THEMES[unitId];
  const purposes = {
    1: ['présenter un métier ou une technologie', 'raconter une journée de travail', 'expliquer l’usage responsable d’un média'],
    2: ['raconter une action solidaire', 'résoudre un désaccord par le dialogue', 'défendre le respect d’une différence'],
    3: ['présenter une action écologique', 'donner des conseils de santé', 'expliquer un choix favorable au bien-être'],
    4: ['raconter un loisir ou un voyage', 'présenter une découverte culturelle', 'comparer deux habitudes avec respect']
  }[unitId];
  return Array.from({ length: 18 }, (_, index) => {
    const criterionId = [1, 2, 3, 4, 5, 6][index % 6];
    const task = purposes[index % purposes.length];
    const support = `Situation : ${contexts[index % contexts.length]} intervient dans une scène liée à l’unité. Prépare trois idées clés avant de parler.`;
    return baseQuestion(unitId, 'oral', index, `Prise de parole ${index + 1} — ${task}`, `Pendant une à deux minutes, ${task}. Emploie un vocabulaire précis, organise tes idées et ajoute ${index % 2 ? 'une justification' : 'un court échange de deux répliques'}.`, 'Réponse orale cohérente avec la situation ; idées ordonnées, langue intelligible et justification ou échange adapté.', criterionId, { difficulty: ['remediation', 'consolidation', 'approfondissement'][Math.floor(index / 6)], support, visualType: index % 3 === 0 ? 'image' : 'none', visualTitle: 'Carte de prise de parole', visualData: `${contexts[index % contexts.length]}|Action|Résultat` });
  });
}

function createGrammarQuestions(unitId) {
  const subjects = THEMES[unitId];
  return Array.from({ length: 12 }, (_, index) => {
    let prompt; let answer; let title;
    if (unitId === '1') {
      const rows = [
        ['Complète par un déterminant qui convient : … journaliste vérifie … informations.', 'La/Une journaliste vérifie les/des informations.'],
        ['Remplace « la tablette de Lina » par un groupe avec déterminant possessif.', 'sa tablette'],
        ['Complète par ce, cet, cette ou ces : … appareil, … émission, … messages.', 'cet appareil, cette émission, ces messages'],
        ['Évite les répétitions : « Le facteur prend les lettres. Le facteur distribue les lettres. »', 'Le facteur prend les lettres. Il les distribue.']
      ][index % 4]; [prompt, answer] = rows; title = 'Déterminants, noms et pronoms';
    } else if (unitId === '2') {
      const rows = [
        ['Souligne l’adjectif épithète et entoure le nom : « La généreuse voisine apporte un repas chaud. »', 'généreuse → voisine ; chaud → repas'],
        ['Complète par un adjectif attribut accordé : « Les bénévoles semblent … »', 'Par exemple : disponibles / courageux / organisés.'],
        ['Mets à la forme négative avec ne… plus : « Les voisins se disputent encore. »', 'Les voisins ne se disputent plus.'],
        ['Réécris avec ne… jamais : « Il refuse toujours de partager. »', 'Il ne refuse jamais de partager.']
      ][index % 4]; [prompt, answer] = rows; title = 'Adjectifs et phrase négative';
    } else if (unitId === '3') {
      const rows = [
        ['Sépare le complément essentiel du complément non essentiel : « Chaque samedi, les élèves nettoient la plage. »', 'la plage : essentiel ; Chaque samedi : non essentiel de temps'],
        ['Supprime le complément non essentiel : « Dans le parc, les enfants plantent deux arbres. »', 'Les enfants plantent deux arbres.'],
        ['Ajoute un complément de lieu : « L’infirmière accueille les élèves … »', 'Par exemple : à l’infirmerie.'],
        ['Déplace le complément de lieu : « Les cyclistes roulent sur la piste. »', 'Sur la piste, les cyclistes roulent.']
      ][index % 4]; [prompt, answer] = rows; title = 'Compléments de phrase';
    } else {
      const rows = [
        ['Repère le complément de temps : « Demain matin, la classe visitera le musée. »', 'Demain matin'],
        ['Repère le complément de manière : « La guide répond avec patience. »', 'avec patience'],
        ['Enrichis « Les voyageurs avancent » par un complément de temps et un complément de manière.', 'Par exemple : Ce matin, les voyageurs avancent prudemment.'],
        ['Classe les compléments : « Après le repas, Maya écrit soigneusement dans son carnet. »', 'Après le repas : temps ; soigneusement : manière ; dans son carnet : lieu']
      ][index % 4]; [prompt, answer] = rows; title = 'Compléments de temps et de manière';
    }
    const extra = index >= 4 ? ` Utilise ensuite ${subjects[index]} dans une nouvelle phrase du même type.` : '';
    return baseQuestion(unitId, 'grammaire', index, `${title} — série ${index + 1}`, `${prompt}${extra}`, `${answer}${index >= 4 ? ' Une phrase personnelle correcte est aussi attendue.' : ''}`, 3);
  });
}

function createConjugationQuestions(unitId) {
  return Array.from({ length: 12 }, (_, index) => {
    const forms = {
      1: [
        ['Classe les verbes puis donne leur infinitif : « Hier, Sami a réparé la radio ; aujourd’hui il écoute ; demain il présentera son travail. »', 'a réparé → passé composé/réparer ; écoute → présent/écouter ; présentera → futur/présenter'],
        ['Mets à l’impératif : « Tu dois cliquer, choisir le dossier puis ouvrir le fichier. »', 'Clique, choisis le dossier puis ouvre le fichier.'],
        ['Conjugue selon les repères : Hier nous (finir) l’article ; demain nous (faire) une interview.', 'avons fini ; ferons']
      ],
      2: [
        ['Conjugue être et avoir : Hier ils (être) solidaires et ils (avoir) une bonne idée ; demain ils (être) fiers.', 'ont été ; ont eu ; seront'],
        ['Mets au futur : « Nous finissons le projet et nous avons le temps de le présenter. »', 'Nous finirons le projet et nous aurons le temps de le présenter.'],
        ['Mets au passé composé : « Elle est attentive et elle finit son travail. »', 'Elle a été attentive et elle a fini son travail.']
      ],
      3: [
        ['Conjugue au passé composé : Nous (prendre) des sacs et nous (aller) nettoyer la plage.', 'avons pris ; sommes allés'],
        ['Conjugue au futur : Tu (mettre) une gourde dans ton sac et tu (faire) le trajet à pied.', 'mettras ; feras'],
        ['Réécris au passé composé : « Elles vont au dispensaire et font un contrôle. »', 'Elles sont allées au dispensaire et ont fait un contrôle.']
      ],
      4: [
        ['Conjugue au passé composé : Maya (lire) la lettre, puis elle (écrire) une réponse et la (dire) à voix haute.', 'a lu ; a écrit ; l’a dite'],
        ['Mets au futur : Nous (lire) le programme, nous (écrire) au guide et nous lui (dire) notre choix.', 'lirons ; écrirons ; dirons'],
        ['Conjugue au présent : Je (vouloir) visiter le musée et mes amis (pouvoir) venir.', 'veux ; peuvent']
      ]
    }[unitId];
    const [prompt, answer] = forms[index % forms.length];
    return baseQuestion(unitId, 'conjugaison', index, `Temps et verbes de l’unité — série ${index + 1}`, prompt, answer, 3);
  });
}

function createSpellingQuestions(unitId) {
  return Array.from({ length: 12 }, (_, index) => {
    const forms = {
      1: [
        ['Complète par l’infinitif : La journaliste commence à (rédiger) puis finit par (relire) son article.', 'rédiger ; relire'],
        ['Complète par a ou à : Sami … un message … transmettre … ses camarades.', 'a ; à ; à'],
        ['Corrige : « Le technicien commence a réparé la machine. »', 'Le technicien commence à réparer la machine.']
      ],
      2: [
        ['Complète par son ou sont : Les bénévoles … prêts ; chacun prend … sac.', 'sont ; son'],
        ['Complète par et ou est : Le quartier … propre … calme.', 'est ; et'],
        ['Corrige : « Lina et Sami son généreux ; chacun apporte sont aide. »', 'Lina et Sami sont généreux ; chacun apporte son aide.']
      ],
      3: [
        ['Accorde le verbe : Les déchets de la plage (menacer) les tortues.', 'menacent'],
        ['Accorde les adjectifs : une alimentation (équilibré), des habitudes (sain).', 'équilibrée ; saines'],
        ['Corrige : « Les jeune plantes pousse rapidement. »', 'Les jeunes plantes poussent rapidement.']
      ],
      4: [
        ['Mets au féminin pluriel : « Le nouveau voyageur est heureux et attentif. »', 'Les nouvelles voyageuses sont heureuses et attentives.'],
        ['Accorde le participe passé avec être : Lina et Maya sont (aller) au musée puis sont (revenir) satisfaites.', 'allées ; revenues'],
        ['Corrige : « Les filles sont arrivé dans une beau ville et sont reparti enchanté. »', 'Les filles sont arrivées dans une belle ville et sont reparties enchantées.']
      ]
    }[unitId];
    const [prompt, answer] = forms[index % forms.length];
    return baseQuestion(unitId, 'orthographe', index, `Orthographe contextualisée — série ${index + 1}`, prompt, answer, 4);
  });
}

function createProductionQuestions(unitId) {
  const tasks = {
    1: [
      'Raconte la journée d’un professionnel que tu admires. Présente le lieu, trois actions et une difficulté surmontée.',
      'Une machine tombe en panne pendant un travail. Raconte le problème, les recherches et la solution.',
      'Écris un article court sur un événement de ton école : titre, faits essentiels et conclusion.',
      'Raconte comment un enfant vérifie une information reçue sur un média avant de la partager.'
    ],
    2: [
      'Raconte l’accueil d’un nouvel élève et insère un dialogue de quatre répliques.',
      'Deux camarades se disputent. Raconte comment ils s’écoutent et trouvent une solution équitable.',
      'Raconte une action solidaire organisée par la classe, de l’idée jusqu’au bilan.',
      'Un enfant est exclu d’un jeu. Raconte comment la règle et le dialogue rétablissent la justice.'
    ],
    3: [
      'Raconte une action de nettoyage et décris le lieu avant puis après l’intervention.',
      'Un ami dort mal. Raconte la visite chez un professionnel et insère trois conseils dans un dialogue.',
      'Raconte le sauvetage prudent d’un animal et décris son état au moment de la découverte.',
      'Imagine une semaine sans gaspillage à l’école et raconte les changements observés.'
    ],
    4: [
      'Écris une lettre à un ami pour raconter un loisir et expliquer pourquoi tu l’apprécies.',
      'Raconte une visite culturelle et intègre la description précise d’un lieu ou d’un objet.',
      'Raconte la rencontre avec un enfant ayant un autre mode de vie et compare deux habitudes avec respect.',
      'Écris une lettre de voyage avec lieu/date, formule d’appel, récit, sentiments et formule finale.'
    ]
  }[unitId];
  return Array.from({ length: 12 }, (_, index) => {
    const task = tasks[index % tasks.length];
    const scaffold = difficultyFor(index) === 'remediation'
      ? ' Aide : prépare Qui ? Où ? Quand ? Problème ? Actions ? Fin ?'
      : difficultyFor(index) === 'approfondissement'
        ? ' Enrichis le texte avec des connecteurs variés, des détails précis et une fin personnelle.'
        : ' Organise le texte en au moins huit phrases et utilise des connecteurs.';
    return baseQuestion(unitId, 'production', index, `Projet d’écriture — version ${index + 1}`, `${task}${scaffold}`, 'Production évaluée selon les critères actifs : respect de la consigne, cohérence, correction linguistique et orthographique, richesse des idées et présentation.', [1, 5, 6][index % 3], { visualType: index % 3 === 0 ? 'table' : 'none', visualTitle: 'Plan du récit', visualData: 'Partie|Idées\nDébut|Personnages, lieu, moment\nMilieu|Événement et actions\nFin|Résultat et sentiment' });
  });
}

function createExpandedSixthGradeBank() {
  const questions = createReadingBank();
  for (const unitId of ['1', '2', '3', '4']) {
    questions.push(
      ...createOralQuestions(unitId),
      ...createGrammarQuestions(unitId),
      ...createConjugationQuestions(unitId),
      ...createSpellingQuestions(unitId),
      ...createProductionQuestions(unitId)
    );
  }
  return questions;
}

module.exports = {
  OFFICIAL_ALIGNMENT,
  READING_SETS,
  createExpandedSixthGradeBank
};
