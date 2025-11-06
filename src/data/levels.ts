import {Level} from "@/types";

export const levels: Record<string, Level[]> = {
  html: [
    {
      id: "html-lvl-1",
      languageId: "html",
      levelNumber: 1,
      title: "Structure des pages web",
      description: "Découvrez les balises HTML fondamentales et la sémantique pour créer la structure de base d'une page web. Apprenez à utiliser les balises essentielles comme <html>, <head>, <body>, <header>, <nav>, <main>, <section>, <article>, <footer> et comprenez leur rôle dans la structure sémantique d'un document.",
      difficulty: "beginner",
      xpReward: 100,
      isCompleted: false,
      isLocked: false,
      prerequisites: [],
      minigame: {
        type: "html-builder",
        starter: "<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset=\"utf-8\" />\n    <title>Mon premier document</title>\n  </head>\n  <body>\n    <!-- TODO: Ajoute un titre h1, un paragraphe p et un lien a -->\n  </body>\n</html>",
        goals: [
          { id: "g1", description: "Un titre h1 avec du texte", selector: "h1", minTextLength: 3 },
          { id: "g2", description: "Un paragraphe p avec du texte", selector: "p", minTextLength: 5 },
          { id: "g3", description: "Un lien a avec un href", selector: "a[href]", requireAttr: "href" },
        ],
      },
    },
    {
      id: "html-lvl-2",
      languageId: "html",
      levelNumber: 2,
      title: "Layouts modernes avec Flexbox",
      description: "Maîtrisez Flexbox pour créer des layouts flexibles et modernes. Apprenez les propriétés CSS essentielles : display: flex, flex-direction, justify-content, align-items, flex-wrap, gap. Comprenez comment Flexbox permet de créer des mises en page responsives sans utiliser de floats ou de positionnement complexe.",
      difficulty: "beginner",
      xpReward: 150,
      isCompleted: false,
      isLocked: true,
      prerequisites: ["html-lvl-1"],
      // JEU À INTÉGRER : Mini-jeu où l'utilisateur doit créer un layout avec Flexbox
      // Notions attendues : display: flex, flex-direction (row/column), justify-content, align-items, gap
      // Exemple de défi : Créer une barre de navigation horizontale, un header avec logo à gauche et menu à droite, ou un card layout avec espacement uniforme
    },
    {
      id: "html-lvl-3",
      languageId: "html",
      levelNumber: 3,
      title: "CSS Grid pour layouts complexes",
      description: "Explorez CSS Grid pour créer des grilles bidimensionnelles puissantes. Découvrez grid-template-columns, grid-template-rows, grid-area, grid-gap, et les fonctions repeat() et minmax(). Apprenez à combiner Grid avec Flexbox pour des layouts professionnels.",
      difficulty: "intermediate",
      xpReward: 200,
      isCompleted: false,
      isLocked: true,
      prerequisites: ["html-lvl-2"],
      // JEU À INTÉGRER : Mini-jeu où l'utilisateur doit créer un layout avec CSS Grid
      // Notions attendues : grid-template-columns, grid-template-rows, grid-area, grid-gap, repeat(), minmax()
      // Exemple de défi : Créer un dashboard avec sidebar, header, main content et footer, ou une galerie d'images responsive
    },
    {
      id: "html-lvl-4",
      languageId: "html",
      levelNumber: 4,
      title: "Responsive Design & Media Queries",
      description: "Apprenez à rendre vos pages adaptatives pour tous les écrans. Maîtrisez les media queries (@media), les unités relatives (rem, em, %, vw, vh), les breakpoints, et les techniques mobile-first. Comprenez l'importance du viewport meta tag et comment tester sur différents appareils.",
      difficulty: "intermediate",
      xpReward: 200,
      isCompleted: false,
      isLocked: true,
      prerequisites: ["html-lvl-3"],
      // JEU À INTÉGRER : Mini-jeu où l'utilisateur doit rendre une page responsive
      // Notions attendues : @media queries, breakpoints (mobile, tablet, desktop), unités relatives, mobile-first approach
      // Exemple de défi : Adapter un layout desktop pour mobile, créer un menu hamburger responsive, ajuster les tailles de police et espacements
    },
    {
      id: "html-lvl-5",
      languageId: "html",
      levelNumber: 5,
      title: "Animations CSS & Accessibilité",
      description: "Créez des animations fluides avec CSS (transitions, @keyframes, transform, animation). Apprenez les bonnes pratiques d'accessibilité : attributs ARIA, navigation au clavier, contraste des couleurs, alt text. Découvrez les bases du SEO : métadonnées, sémantique HTML, performance (lazy loading, optimisations).",
      difficulty: "advanced",
      xpReward: 250,
      isCompleted: false,
      isLocked: true,
      prerequisites: ["html-lvl-4"],
      // JEU À INTÉGRER : Mini-jeu combinant animations et accessibilité
      // Notions attendues : transitions, @keyframes, transform, animation, attributs ARIA (aria-label, aria-hidden), navigation clavier, meta tags SEO
      // Exemple de défi : Créer un bouton animé accessible, ajouter des transitions sur hover, implémenter un menu accessible avec ARIA, optimiser les métadonnées SEO
    },
  ],
  javascript: [
    {
      id: "js-lvl-1",
      languageId: "javascript",
      levelNumber: 1,
      title: "Manipulation du DOM",
      description: "Apprenez à interagir avec le Document Object Model (DOM) pour modifier dynamiquement le contenu d'une page web. Découvrez les méthodes essentielles : getElementById, querySelector, createElement, appendChild, innerHTML, textContent, classList. Comprenez comment JavaScript peut changer le style, le contenu et la structure d'une page en temps réel.",
      difficulty: "beginner",
      xpReward: 100,
      isCompleted: false,
      isLocked: false,
      prerequisites: [],
      // JEU À INTÉGRER : Mini-jeu de manipulation DOM
      // Notions attendues : getElementById, querySelector, createElement, appendChild, innerHTML, textContent, classList.add/remove/toggle
      // Exemple de défi : Créer une liste dynamique, modifier le contenu d'un élément, ajouter/supprimer des classes CSS, créer des éléments HTML via JavaScript
    },
    {
      id: "js-lvl-2",
      languageId: "javascript",
      levelNumber: 2,
      title: "Gestion des événements",
      description: "Maîtrisez la gestion des événements utilisateur pour créer des interfaces interactives. Apprenez addEventListener, les types d'événements (click, submit, input, keydown, mouseover), event.preventDefault(), event.stopPropagation(), et la délégation d'événements. Comprenez le cycle de vie des événements et comment éviter les fuites mémoire.",
      difficulty: "beginner",
      xpReward: 150,
      isCompleted: false,
      isLocked: true,
      prerequisites: ["js-lvl-1"],
      // JEU À INTÉGRER : Mini-jeu de gestion d'événements
      // Notions attendues : addEventListener, types d'événements (click, submit, input, keydown), preventDefault(), stopPropagation(), event delegation
      // Exemple de défi : Créer un formulaire interactif, gérer les clics sur des boutons, créer un système de validation en temps réel, implémenter un drag & drop basique
    },
    {
      id: "js-lvl-3",
      languageId: "javascript",
      levelNumber: 3,
      title: "Fonctions asynchrones (Fetch & Async/Await)",
      description: "Découvrez la programmation asynchrone en JavaScript pour communiquer avec des APIs. Apprenez les Promises, fetch(), async/await, try/catch pour la gestion d'erreurs, et comment traiter les réponses JSON. Comprenez la différence entre code synchrone et asynchrone, et pourquoi c'est essentiel pour les applications web modernes.",
      difficulty: "intermediate",
      xpReward: 200,
      isCompleted: false,
      isLocked: true,
      prerequisites: ["js-lvl-2"],
      // JEU À INTÉGRER : Mini-jeu avec Fetch API
      // Notions attendues : Promises, fetch(), async/await, try/catch, .then()/.catch(), response.json(), gestion d'erreurs asynchrones
      // Exemple de défi : Faire une requête GET vers une API, afficher les données reçues, gérer les erreurs de réseau, créer un loader pendant le chargement
    },
    {
      id: "js-lvl-4",
      languageId: "javascript",
      levelNumber: 4,
      title: "ES6+ et Modules",
      description: "Explorez les fonctionnalités modernes de JavaScript ES6+ : const/let, arrow functions, template literals, destructuring, spread operator, default parameters. Découvrez les modules ES6 (import/export) pour organiser votre code, et comprenez la différence entre modules et scripts classiques.",
      difficulty: "intermediate",
      xpReward: 200,
      isCompleted: false,
      isLocked: true,
      prerequisites: ["js-lvl-3"],
      // JEU À INTÉGRER : Mini-jeu utilisant ES6+ et modules
      // Notions attendues : const/let, arrow functions, template literals, destructuring, spread operator (...), default parameters, import/export
      // Exemple de défi : Refactoriser du code avec ES6+, utiliser des arrow functions, créer et importer des modules, utiliser le destructuring pour extraire des données
    },
    {
      id: "js-lvl-5",
      languageId: "javascript",
      levelNumber: 5,
      title: "Stockage côté client (localStorage, sessionStorage)",
      description: "Apprenez à stocker des données dans le navigateur pour créer des applications persistantes. Découvrez localStorage (données permanentes), sessionStorage (données de session), leurs méthodes (setItem, getItem, removeItem, clear), et leurs limitations. Explorez IndexedDB pour des besoins plus complexes et comprenez quand utiliser chaque solution.",
      difficulty: "advanced",
      xpReward: 250,
      isCompleted: false,
      isLocked: true,
      prerequisites: ["js-lvl-4"],
      // JEU À INTÉGRER : Mini-jeu avec stockage local
      // Notions attendues : localStorage.setItem/getItem/removeItem/clear, sessionStorage, JSON.stringify/parse, IndexedDB (bases), gestion des quotas
      // Exemple de défi : Créer un système de préférences utilisateur sauvegardé, implémenter un panier de shopping persistant, créer une application de notes locale
    },
  ],
  php: [
    {
      id: "php-lvl-1",
      languageId: "php",
      levelNumber: 1,
      title: "Formulaires & Sessions",
      description: "Découvrez comment traiter les données des formulaires HTML avec PHP. Apprenez $_GET, $_POST, $_REQUEST, la validation et le nettoyage des données (filter_var, htmlspecialchars). Maîtrisez les sessions PHP (session_start, $_SESSION) pour maintenir l'état entre les pages et créer des systèmes d'authentification basiques.",
      difficulty: "beginner",
      xpReward: 100,
      isCompleted: false,
      isLocked: false,
      prerequisites: [],
      // JEU À INTÉGRER : Mini-jeu de traitement de formulaire et sessions
      // Notions attendues : $_GET, $_POST, $_REQUEST, filter_var(), htmlspecialchars(), session_start(), $_SESSION, validation de données
      // Exemple de défi : Créer un formulaire de contact, traiter les données, valider les champs, créer un système de login basique avec sessions
    },
    {
      id: "php-lvl-2",
      languageId: "php",
      levelNumber: 2,
      title: "Programmation Orientée Objet",
      description: "Explorez la POO en PHP pour structurer votre code de manière professionnelle. Apprenez les classes, objets, propriétés, méthodes, constructeurs, $this, visibilité (public, private, protected), héritage (extends), et les méthodes statiques. Comprenez les avantages de la POO pour la réutilisabilité et la maintenabilité du code.",
      difficulty: "beginner",
      xpReward: 150,
      isCompleted: false,
      isLocked: true,
      prerequisites: ["php-lvl-1"],
      // JEU À INTÉGRER : Mini-jeu de POO PHP
      // Notions attendues : class, new, $this, public/private/protected, __construct(), extends, méthodes statiques, propriétés
      // Exemple de défi : Créer une classe User, une classe Product avec héritage, implémenter des méthodes getter/setter, créer une classe utilitaire statique
    },
    {
      id: "php-lvl-3",
      languageId: "php",
      levelNumber: 3,
      title: "Connexion MySQL avec PDO",
      description: "Apprenez à interagir avec une base de données MySQL en utilisant PDO (PHP Data Objects). Découvrez la connexion à la base, les requêtes préparées (prepare, execute, bindParam), fetch() et fetchAll(), les transactions, et la gestion d'erreurs. Comprenez pourquoi les requêtes préparées sont essentielles pour la sécurité.",
      difficulty: "intermediate",
      xpReward: 200,
      isCompleted: false,
      isLocked: true,
      prerequisites: ["php-lvl-2"],
      // JEU À INTÉGRER : Mini-jeu avec PDO et MySQL
      // Notions attendues : new PDO(), prepare(), execute(), bindParam(), fetch(), fetchAll(), transactions (beginTransaction, commit, rollback), gestion d'erreurs PDO
      // Exemple de défi : Se connecter à une base, créer une table, insérer des données, récupérer des données, utiliser des requêtes préparées, gérer une transaction
    },
    {
      id: "php-lvl-4",
      languageId: "php",
      levelNumber: 4,
      title: "Framework Laravel (Bases)",
      description: "Découvrez les concepts fondamentaux de Laravel, le framework PHP moderne. Apprenez la structure MVC (Models, Views, Controllers), les routes, les migrations, Eloquent ORM, les vues Blade, et l'injection de dépendances. Comprenez comment Laravel simplifie le développement web et accélère la création d'applications.",
      difficulty: "intermediate",
      xpReward: 200,
      isCompleted: false,
      isLocked: true,
      prerequisites: ["php-lvl-3"],
      // JEU À INTÉGRER : Mini-jeu avec Laravel (concepts de base)
      // Notions attendues : Structure MVC, routes (web.php), migrations, Eloquent models, Blade templates, controllers, artisan commands
      // Exemple de défi : Créer une route, un contrôleur, une migration, un modèle Eloquent, une vue Blade, comprendre la structure de dossiers Laravel
    },
    {
      id: "php-lvl-5",
      languageId: "php",
      levelNumber: 5,
      title: "Sécurité & Authentification",
      description: "Maîtrisez les concepts de sécurité web essentiels en PHP. Apprenez à protéger contre les attaques XSS (Cross-Site Scripting), CSRF (Cross-Site Request Forgery), SQL Injection, et les failles de session. Découvrez password_hash() et password_verify() pour le hachage sécurisé des mots de passe, et implémentez un système d'authentification robuste.",
      difficulty: "advanced",
      xpReward: 250,
      isCompleted: false,
      isLocked: true,
      prerequisites: ["php-lvl-4"],
      // JEU À INTÉGRER : Mini-jeu de sécurité PHP
      // Notions attendues : password_hash()/password_verify(), protection CSRF (tokens), protection XSS (htmlspecialchars, filter_var), requêtes préparées (protection SQL injection), sécurisation des sessions
      // Exemple de défi : Créer un système de login sécurisé, implémenter des tokens CSRF, valider et nettoyer les entrées utilisateur, protéger contre SQL injection
    },
  ],
  sql: [
    {
      id: "sql-lvl-1",
      languageId: "sql",
      levelNumber: 1,
      title: "Requêtes de base (CRUD)",
      description: "Apprenez les opérations fondamentales sur les bases de données : CREATE (créer des tables), SELECT (lire des données), INSERT (insérer), UPDATE (modifier), DELETE (supprimer). Découvrez les clauses WHERE, ORDER BY, LIMIT, et les opérateurs de comparaison. Comprenez la structure d'une base de données relationnelle et les types de données courants.",
      difficulty: "beginner",
      xpReward: 100,
      isCompleted: false,
      isLocked: false,
      prerequisites: [],
      // JEU À INTÉGRER : Mini-jeu de requêtes SQL CRUD
      // Notions attendues : CREATE TABLE, SELECT, INSERT, UPDATE, DELETE, WHERE, ORDER BY, LIMIT, opérateurs (=, <, >, LIKE, IN)
      // Exemple de défi : Créer une table, insérer des données, récupérer des données avec conditions, modifier des enregistrements, supprimer des données
    },
    {
      id: "sql-lvl-2",
      languageId: "sql",
      levelNumber: 2,
      title: "Jointures multiples",
      description: "Maîtrisez les jointures SQL pour combiner des données de plusieurs tables. Apprenez INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN, et comprenez quand utiliser chaque type. Découvrez les jointures multiples, les alias de tables, et comment éviter les résultats dupliqués. Explorez les relations un-à-plusieurs et plusieurs-à-plusieurs.",
      difficulty: "beginner",
      xpReward: 150,
      isCompleted: false,
      isLocked: true,
      prerequisites: ["sql-lvl-1"],
      // JEU À INTÉGRER : Mini-jeu de jointures SQL
      // Notions attendues : INNER JOIN, LEFT JOIN, RIGHT JOIN, alias de tables (AS), jointures multiples, clés primaires/étrangères
      // Exemple de défi : Joindre deux tables, récupérer des données liées, utiliser LEFT JOIN pour inclure tous les enregistrements d'une table, créer des requêtes avec plusieurs jointures
    },
    {
      id: "sql-lvl-3",
      languageId: "sql",
      levelNumber: 3,
      title: "Index & Optimisation",
      description: "Découvrez comment améliorer les performances de vos requêtes SQL. Apprenez à créer des index (CREATE INDEX), comprendre leur impact sur les performances, utiliser EXPLAIN pour analyser les requêtes, et identifier les requêtes lentes. Explorez les bonnes pratiques d'optimisation : éviter SELECT *, utiliser LIMIT, et optimiser les WHERE clauses.",
      difficulty: "intermediate",
      xpReward: 200,
      isCompleted: false,
      isLocked: true,
      prerequisites: ["sql-lvl-2"],
      // JEU À INTÉGRER : Mini-jeu d'optimisation SQL
      // Notions attendues : CREATE INDEX, EXPLAIN, analyse de performance, optimisation de requêtes, éviter SELECT *, utiliser LIMIT
      // Exemple de défi : Créer des index sur des colonnes fréquemment utilisées, analyser une requête avec EXPLAIN, optimiser une requête lente, comprendre l'impact des index
    },
    {
      id: "sql-lvl-4",
      languageId: "sql",
      levelNumber: 4,
      title: "Transactions & ACID",
      description: "Explorez les transactions SQL pour garantir l'intégrité des données. Apprenez BEGIN TRANSACTION, COMMIT, ROLLBACK, et les propriétés ACID (Atomicité, Cohérence, Isolation, Durabilité). Découvrez les niveaux d'isolation, les verrous, et comment gérer les transactions dans des applications réelles. Comprenez pourquoi les transactions sont essentielles pour les opérations critiques.",
      difficulty: "intermediate",
      xpReward: 200,
      isCompleted: false,
      isLocked: true,
      prerequisites: ["sql-lvl-3"],
      // JEU À INTÉGRER : Mini-jeu de transactions SQL
      // Notions attendues : BEGIN TRANSACTION, COMMIT, ROLLBACK, propriétés ACID, gestion d'erreurs dans les transactions, isolation levels
      // Exemple de défi : Créer une transaction, gérer un rollback en cas d'erreur, comprendre l'atomicité, implémenter une transaction multi-étapes
    },
    {
      id: "sql-lvl-5",
      languageId: "sql",
      levelNumber: 5,
      title: "Modélisation & Normalisation",
      description: "Maîtrisez la conception de bases de données relationnelles. Apprenez les formes normales (1NF, 2NF, 3NF), comment identifier et éliminer la redondance, créer des schémas de base de données efficaces, et comprendre les relations (un-à-un, un-à-plusieurs, plusieurs-à-plusieurs). Découvrez les clés primaires, étrangères, et les contraintes d'intégrité référentielle.",
      difficulty: "advanced",
      xpReward: 250,
      isCompleted: false,
      isLocked: true,
      prerequisites: ["sql-lvl-4"],
      // JEU À INTÉGRER : Mini-jeu de modélisation de base de données
      // Notions attendues : 1NF, 2NF, 3NF, clés primaires/étrangères, relations (1-1, 1-N, N-N), élimination de redondance, schémas de base de données
      // Exemple de défi : Normaliser une table, créer un schéma de base de données pour une application, identifier les relations entre tables, éliminer la redondance
    },
  ],
  python: [
    {
      id: "py-lvl-1",
      languageId: "python",
      levelNumber: 1,
      title: "Bases de la syntaxe Python",
      description: "Découvrez les fondamentaux de Python : variables, types de données (int, float, str, bool, list, dict), opérateurs, structures conditionnelles (if/elif/else), boucles (for, while), et les fonctions de base. Apprenez l'indentation Python, les commentaires, et les conventions de nommage (PEP 8). Comprenez pourquoi Python est réputé pour sa lisibilité.",
      difficulty: "beginner",
      xpReward: 100,
      isCompleted: false,
      isLocked: false,
      prerequisites: [],
      // JEU À INTÉGRER : Mini-jeu de syntaxe Python de base
      // Notions attendues : variables, types (int, str, list, dict), if/elif/else, for/while, fonctions (def), indentation, opérateurs
      // Exemple de défi : Créer des variables, utiliser des listes et dictionnaires, écrire des conditions et boucles, créer des fonctions simples
    },
    {
      id: "py-lvl-2",
      languageId: "python",
      levelNumber: 2,
      title: "Programmation Orientée Objet",
      description: "Explorez la POO en Python pour structurer votre code. Apprenez les classes (class), objets, méthodes, __init__ (constructeur), self, héritage, méthodes spéciales (__str__, __repr__), et les propriétés. Découvrez les concepts de encapsulation, polymorphisme, et abstraction. Comprenez comment la POO améliore la réutilisabilité du code.",
      difficulty: "beginner",
      xpReward: 150,
      isCompleted: false,
      isLocked: true,
      prerequisites: ["py-lvl-1"],
      // JEU À INTÉGRER : Mini-jeu de POO Python
      // Notions attendues : class, __init__, self, méthodes, héritage, __str__, propriétés, encapsulation
      // Exemple de défi : Créer une classe, instancier des objets, implémenter l'héritage, utiliser des méthodes spéciales, créer des propriétés
    },
    {
      id: "py-lvl-3",
      languageId: "python",
      levelNumber: 3,
      title: "Analyse de données (NumPy/Pandas)",
      description: "Découvrez les bibliothèques essentielles pour l'analyse de données. Apprenez NumPy pour les tableaux multidimensionnels et opérations mathématiques, et Pandas pour manipuler des DataFrames (lire CSV, filtrer, grouper, agréger). Explorez les opérations de base : sélection de colonnes, filtrage, tri, et calculs statistiques simples.",
      difficulty: "intermediate",
      xpReward: 200,
      isCompleted: false,
      isLocked: true,
      prerequisites: ["py-lvl-2"],
      // JEU À INTÉGRER : Mini-jeu avec NumPy/Pandas
      // Notions attendues : import numpy/pandas, arrays NumPy, DataFrames Pandas, read_csv(), filtrage (.loc, .iloc), groupby(), opérations statistiques
      // Exemple de défi : Créer un array NumPy, lire un fichier CSV avec Pandas, filtrer des données, calculer des statistiques, grouper des données
    },
    {
      id: "py-lvl-4",
      languageId: "python",
      levelNumber: 4,
      title: "Développement web (Django/FastAPI)",
      description: "Explorez le développement web avec Python. Découvrez Django (framework full-stack) ou FastAPI (API moderne) : création de projets, modèles, vues, routes, templates, et gestion des requêtes HTTP. Apprenez les concepts MVC/MVT, les migrations, et comment créer une API REST basique. Comprenez la différence entre framework full-stack et micro-framework.",
      difficulty: "intermediate",
      xpReward: 200,
      isCompleted: false,
      isLocked: true,
      prerequisites: ["py-lvl-3"],
      // JEU À INTÉGRER : Mini-jeu avec Django ou FastAPI (concepts de base)
      // Notions attendues : Structure de projet, modèles, vues/routes, templates (Django) ou endpoints (FastAPI), requêtes HTTP, migrations
      // Exemple de défi : Créer un projet, définir un modèle, créer une route/vue, gérer une requête GET/POST, comprendre la structure MVC
    },
    {
      id: "py-lvl-5",
      languageId: "python",
      levelNumber: 5,
      title: "Scripts & Automatisation",
      description: "Maîtrisez l'automatisation avec Python. Apprenez à créer des scripts CLI (argparse), utiliser des environnements virtuels (venv), gérer les dépendances (requirements.txt), et automatiser des tâches répétitives. Découvrez le scheduling de tâches, la manipulation de fichiers, et les bonnes pratiques pour créer des scripts robustes et réutilisables.",
      difficulty: "advanced",
      xpReward: 250,
      isCompleted: false,
      isLocked: true,
      prerequisites: ["py-lvl-4"],
      // JEU À INTÉGRER : Mini-jeu de scripts et automatisation
      // Notions attendues : argparse, venv, requirements.txt, manipulation de fichiers (open, read, write), scheduling basique, scripts CLI
      // Exemple de défi : Créer un script avec arguments en ligne de commande, utiliser un venv, créer un script qui automatise une tâche, manipuler des fichiers
    },
  ],
  java: [
    {
      id: "java-lvl-1",
      languageId: "java",
      levelNumber: 1,
      title: "POO et Collections",
      description: "Découvrez les bases de Java orienté objet : classes, objets, méthodes, constructeurs, encapsulation (private/public), et l'héritage. Explorez les collections Java essentielles : ArrayList, HashMap, HashSet, et leurs méthodes courantes (add, get, remove, contains). Comprenez les génériques (<T>) et pourquoi ils sont importants pour la sécurité des types.",
      difficulty: "beginner",
      xpReward: 100,
      isCompleted: false,
      isLocked: false,
      prerequisites: [],
      // JEU À INTÉGRER : Mini-jeu de POO et Collections Java
      // Notions attendues : class, new, méthodes, constructeurs, private/public, ArrayList, HashMap, génériques <T>, méthodes de collections
      // Exemple de défi : Créer une classe, utiliser ArrayList et HashMap, implémenter des getters/setters, utiliser des génériques
    },
    {
      id: "java-lvl-2",
      languageId: "java",
      levelNumber: 2,
      title: "Lambda & Streams",
      description: "Explorez la programmation fonctionnelle en Java avec les expressions lambda et l'API Stream. Apprenez les lambdas (->), les interfaces fonctionnelles (Function, Predicate, Consumer), et les opérations Stream (map, filter, reduce, collect). Découvrez comment les Streams simplifient la manipulation de collections et rendent le code plus lisible et expressif.",
      difficulty: "beginner",
      xpReward: 150,
      isCompleted: false,
      isLocked: true,
      prerequisites: ["java-lvl-1"],
      // JEU À INTÉGRER : Mini-jeu avec Lambda et Streams
      // Notions attendues : expressions lambda (->), interfaces fonctionnelles, Stream API (map, filter, reduce, collect, forEach)
      // Exemple de défi : Utiliser des lambdas, filtrer une liste avec Stream, transformer des données avec map, réduire une collection avec reduce
    },
    {
      id: "java-lvl-3",
      languageId: "java",
      levelNumber: 3,
      title: "JDBC et Hibernate",
      description: "Apprenez à interagir avec des bases de données en Java. Découvrez JDBC (Java Database Connectivity) : connexion, Statement, PreparedStatement, ResultSet. Explorez Hibernate ORM pour mapper des objets Java vers des tables SQL : entités (@Entity), annotations (@Id, @Column), sessions, et requêtes HQL. Comprenez les avantages d'un ORM.",
      difficulty: "intermediate",
      xpReward: 200,
      isCompleted: false,
      isLocked: true,
      prerequisites: ["java-lvl-2"],
      // JEU À INTÉGRER : Mini-jeu avec JDBC ou Hibernate
      // Notions attendues : JDBC (Connection, Statement, PreparedStatement, ResultSet) ou Hibernate (@Entity, Session, HQL, annotations)
      // Exemple de défi : Se connecter à une base avec JDBC, exécuter des requêtes, créer une entité Hibernate, utiliser des sessions Hibernate
    },
    {
      id: "java-lvl-4",
      languageId: "java",
      levelNumber: 4,
      title: "Framework Spring Boot",
      description: "Découvrez Spring Boot, le framework Java moderne pour créer des applications. Apprenez la structure d'un projet Spring Boot, les annotations (@RestController, @Service, @Repository, @Autowired), la configuration (application.properties), et la création d'APIs REST. Explorez l'injection de dépendances et comment Spring simplifie le développement d'applications d'entreprise.",
      difficulty: "intermediate",
      xpReward: 200,
      isCompleted: false,
      isLocked: true,
      prerequisites: ["java-lvl-3"],
      // JEU À INTÉGRER : Mini-jeu avec Spring Boot (concepts de base)
      // Notions attendues : Structure Spring Boot, @RestController, @Service, @Autowired, application.properties, endpoints REST, injection de dépendances
      // Exemple de défi : Créer un projet Spring Boot, créer un contrôleur REST, utiliser l'injection de dépendances, configurer l'application
    },
    {
      id: "java-lvl-5",
      languageId: "java",
      levelNumber: 5,
      title: "Concurrence & Parallélisme",
      description: "Maîtrisez la programmation concurrente en Java. Apprenez les threads (Thread, Runnable), ExecutorService, CompletableFuture pour la programmation asynchrone, et les collections thread-safe (ConcurrentHashMap). Découvrez les problèmes de concurrence (race conditions, deadlocks) et comment les éviter avec synchronized et les verrous. Comprenez quand et pourquoi utiliser la concurrence.",
      difficulty: "advanced",
      xpReward: 250,
      isCompleted: false,
      isLocked: true,
      prerequisites: ["java-lvl-4"],
      // JEU À INTÉGRER : Mini-jeu de concurrence Java
      // Notions attendues : Thread, Runnable, ExecutorService, CompletableFuture, synchronized, collections thread-safe, gestion de la concurrence
      // Exemple de défi : Créer des threads, utiliser ExecutorService, implémenter CompletableFuture, gérer la synchronisation, éviter les race conditions
    },
  ],
  csharp: [
    {
      id: "csharp-lvl-1",
      languageId: "csharp",
      levelNumber: 1,
      title: "Syntaxe et .NET",
      description: "Découvrez les bases de C# et l'écosystème .NET. Apprenez la syntaxe C# : variables, types (int, string, bool, List, Dictionary), structures conditionnelles, boucles, et méthodes. Explorez les namespaces, using, et la structure d'un projet .NET. Comprenez la différence entre .NET Framework, .NET Core, et .NET, et découvrez les outils essentiels (dotnet CLI).",
      difficulty: "beginner",
      xpReward: 100,
      isCompleted: false,
      isLocked: false,
      prerequisites: [],
      // JEU À INTÉGRER : Mini-jeu de syntaxe C# et .NET
      // Notions attendues : variables, types, if/else, for/foreach, méthodes, namespaces, using, structure projet .NET
      // Exemple de défi : Créer des variables, utiliser des listes et dictionnaires, écrire des méthodes, comprendre la structure d'un projet .NET
    },
    {
      id: "csharp-lvl-2",
      languageId: "csharp",
      levelNumber: 2,
      title: "LINQ & Lambda",
      description: "Explorez LINQ (Language Integrated Query) et les expressions lambda en C#. Apprenez les requêtes LINQ (from, where, select), les méthodes d'extension (Where, Select, OrderBy, GroupBy), et les expressions lambda (=>). Découvrez comment LINQ simplifie la manipulation de collections et permet d'écrire du code déclaratif et expressif.",
      difficulty: "beginner",
      xpReward: 150,
      isCompleted: false,
      isLocked: true,
      prerequisites: ["csharp-lvl-1"],
      // JEU À INTÉGRER : Mini-jeu avec LINQ et Lambda
      // Notions attendues : LINQ (from, where, select), méthodes d'extension (Where, Select, OrderBy, GroupBy), expressions lambda (=>)
      // Exemple de défi : Filtrer une collection avec LINQ, transformer des données, utiliser des lambdas, grouper des données
    },
    {
      id: "csharp-lvl-3",
      languageId: "csharp",
      levelNumber: 3,
      title: "ASP.NET Core",
      description: "Découvrez ASP.NET Core pour créer des applications web et APIs. Apprenez la structure d'un projet ASP.NET Core, les contrôleurs ([ApiController]), les routes, la gestion des requêtes HTTP (GET, POST, PUT, DELETE), et la configuration (appsettings.json). Explorez l'injection de dépendances intégrée et comment créer une API REST moderne.",
      difficulty: "intermediate",
      xpReward: 200,
      isCompleted: false,
      isLocked: true,
      prerequisites: ["csharp-lvl-2"],
      // JEU À INTÉGRER : Mini-jeu avec ASP.NET Core (concepts de base)
      // Notions attendues : Structure projet ASP.NET Core, contrôleurs, routes, requêtes HTTP, appsettings.json, injection de dépendances
      // Exemple de défi : Créer un projet ASP.NET Core, créer un contrôleur API, gérer des requêtes HTTP, configurer l'application
    },
    {
      id: "csharp-lvl-4",
      languageId: "csharp",
      levelNumber: 4,
      title: "Applications Desktop (MAUI, WPF)",
      description: "Explorez le développement d'applications desktop avec C#. Découvrez .NET MAUI (Multi-platform App UI) pour créer des applications cross-platform, ou WPF (Windows Presentation Foundation) pour Windows. Apprenez les concepts de base : XAML, binding, événements, layouts, et la séparation entre interface et logique métier (MVVM pattern).",
      difficulty: "intermediate",
      xpReward: 200,
      isCompleted: false,
      isLocked: true,
      prerequisites: ["csharp-lvl-3"],
      // JEU À INTÉGRER : Mini-jeu avec MAUI ou WPF (concepts de base)
      // Notions attendues : XAML, binding, événements, layouts, MVVM pattern, création d'interfaces desktop
      // Exemple de défi : Créer une interface XAML, utiliser le data binding, gérer des événements, comprendre le pattern MVVM
    },
    {
      id: "csharp-lvl-5",
      languageId: "csharp",
      levelNumber: 5,
      title: "Asynchronisme & TPL",
      description: "Maîtrisez la programmation asynchrone en C#. Apprenez async/await, Task, Task<T>, les méthodes asynchrones, et la Task Parallel Library (TPL). Découvrez Parallel.ForEach, Task.Run, et comment gérer les exceptions dans le code asynchrone. Comprenez pourquoi l'asynchronisme est essentiel pour les applications performantes et réactives.",
      difficulty: "advanced",
      xpReward: 250,
      isCompleted: false,
      isLocked: true,
      prerequisites: ["csharp-lvl-4"],
      // JEU À INTÉGRER : Mini-jeu d'asynchronisme C#
      // Notions attendues : async/await, Task, Task<T>, méthodes asynchrones, TPL, Parallel.ForEach, gestion d'exceptions asynchrones
      // Exemple de défi : Créer des méthodes async, utiliser await, gérer des tâches parallèles, comprendre le flux d'exécution asynchrone
    },
  ],
  cpp: [
    {
      id: "cpp-lvl-1",
      languageId: "cpp",
      levelNumber: 1,
      title: "STL (Standard Template Library)",
      description: "Découvrez la bibliothèque standard de C++ et ses conteneurs puissants. Apprenez les vecteurs (vector), listes (list), maps (map, unordered_map), et leurs méthodes essentielles (push_back, insert, find, erase). Explorez les itérateurs, les algorithmes STL (sort, find, transform), et comprenez pourquoi la STL est au cœur de la programmation C++ moderne.",
      difficulty: "beginner",
      xpReward: 100,
      isCompleted: false,
      isLocked: false,
      prerequisites: [],
      // JEU À INTÉGRER : Mini-jeu avec STL C++
      // Notions attendues : vector, list, map, unordered_map, itérateurs, algorithmes STL (sort, find), méthodes des conteneurs
      // Exemple de défi : Utiliser vector et map, parcourir avec des itérateurs, utiliser des algorithmes STL, manipuler des conteneurs
    },
    {
      id: "cpp-lvl-2",
      languageId: "cpp",
      levelNumber: 2,
      title: "Pointeurs & Gestion mémoire",
      description: "Maîtrisez la gestion de la mémoire en C++, un aspect fondamental du langage. Apprenez les pointeurs (*, &), les références, new/delete, et comprenez la différence entre la pile (stack) et le tas (heap). Découvrez les fuites mémoire et comment les éviter. Explorez les bases de la gestion manuelle de la mémoire et pourquoi c'est important en C++.",
      difficulty: "beginner",
      xpReward: 150,
      isCompleted: false,
      isLocked: true,
      prerequisites: ["cpp-lvl-1"],
      // JEU À INTÉGRER : Mini-jeu de pointeurs et mémoire C++
      // Notions attendues : pointeurs (*, &), références, new/delete, stack vs heap, gestion de mémoire, éviter les fuites
      // Exemple de défi : Utiliser des pointeurs, allouer/désallouer de la mémoire, comprendre les références, éviter les fuites mémoire
    },
    {
      id: "cpp-lvl-3",
      languageId: "cpp",
      levelNumber: 3,
      title: "Templates & Métaprogrammation",
      description: "Explorez les templates C++ pour créer du code générique et réutilisable. Apprenez les templates de fonctions et de classes (template<typename T>), la spécialisation de templates, et les concepts de base de la métaprogrammation. Découvrez comment les templates permettent d'écrire du code efficace et type-safe sans sacrifier les performances.",
      difficulty: "intermediate",
      xpReward: 200,
      isCompleted: false,
      isLocked: true,
      prerequisites: ["cpp-lvl-2"],
      // JEU À INTÉGRER : Mini-jeu avec Templates C++
      // Notions attendues : template<typename T>, templates de fonctions/classes, spécialisation, généricité, type safety
      // Exemple de défi : Créer des templates de fonctions, créer des templates de classes, utiliser la spécialisation, comprendre la généricité
    },
    {
      id: "cpp-lvl-4",
      languageId: "cpp",
      levelNumber: 4,
      title: "Concurrence (Threads)",
      description: "Découvrez la programmation concurrente en C++ moderne. Apprenez std::thread, std::mutex pour la synchronisation, std::lock_guard, et les bases de la gestion des threads. Explorez les problèmes de concurrence (race conditions, deadlocks) et comment les résoudre. Comprenez quand utiliser la concurrence pour améliorer les performances.",
      difficulty: "intermediate",
      xpReward: 200,
      isCompleted: false,
      isLocked: true,
      prerequisites: ["cpp-lvl-3"],
      // JEU À INTÉGRER : Mini-jeu de concurrence C++
      // Notions attendues : std::thread, std::mutex, std::lock_guard, synchronisation, gestion des threads, éviter les race conditions
      // Exemple de défi : Créer des threads, utiliser des mutex, synchroniser l'accès aux données partagées, comprendre la concurrence
    },
    {
      id: "cpp-lvl-5",
      languageId: "cpp",
      levelNumber: 5,
      title: "Modern C++ (RAII, Smart Pointers)",
      description: "Maîtrisez les pratiques modernes de C++ pour écrire du code sûr et efficace. Apprenez RAII (Resource Acquisition Is Initialization), les smart pointers (unique_ptr, shared_ptr, weak_ptr), move semantics (std::move), et les bases de C++11/14/17. Découvrez comment ces fonctionnalités modernes simplifient la gestion de la mémoire et rendent le code plus sûr sans sacrifier les performances.",
      difficulty: "advanced",
      xpReward: 250,
      isCompleted: false,
      isLocked: true,
      prerequisites: ["cpp-lvl-4"],
      // JEU À INTÉGRER : Mini-jeu Modern C++
      // Notions attendues : RAII, unique_ptr, shared_ptr, weak_ptr, std::move, move semantics, pratiques modernes C++
      // Exemple de défi : Utiliser des smart pointers, implémenter RAII, comprendre move semantics, écrire du code C++ moderne
    },
  ],
};
