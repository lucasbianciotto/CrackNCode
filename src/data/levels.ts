import {Level} from "@/types";

export const levels: Record<string, Level[]> = {
  python: [
    {
      id: "py-lvl-1",
      languageId: "python",
      levelNumber: 1,
      title: "Variables et Types",
      description: "Découvre les bases des variables Python et les différents types de données.",
      difficulty: "beginner",
      xpReward: 100,
      isCompleted: true,
      isLocked: false,
      minigame: {
        type: "quiz",
        shuffleOptions: true,
        timeLimitSeconds: 90,
        passingScorePercent: 70,
        questions: [
          {
            id: "q1",
            question: "Quel est le type de la valeur 3.14 en Python ?",
            options: [
              { id: "a", text: "int" },
              { id: "b", text: "float" },
              { id: "c", text: "str" },
              { id: "d", text: "bool" }
            ],
            correctOptionId: "b",
            explanation: "3.14 est un nombre à virgule flottante, donc de type float."
          },
          {
            id: "q2",
            question: "Après l'instruction x = \"5\", quel est le type de x ?",
            options: [
              { id: "a", text: "int" },
              { id: "b", text: "float" },
              { id: "c", text: "str" },
              { id: "d", text: "bool" }
            ],
            correctOptionId: "c",
            explanation: "Les guillemets créent une chaîne de caractères, donc str."
          },
          {
            id: "q3",
            question: "Quel symbole démarre un commentaire en Python ?",
            options: [
              { id: "a", text: "//" },
              { id: "b", text: "#" },
              { id: "c", text: "/* */" },
              { id: "d", text: "<!-- -->" }
            ],
            correctOptionId: "b",
            explanation: "Les commentaires Python commencent par le symbole #."
          }
        ]
      }
    },
    {
      id: "py-lvl-2",
      languageId: "python",
      levelNumber: 2,
      title: "Boucles et Conditions",
      description: "Maîtrise le contrôle du flux de ton code avec les boucles et conditions.",
      difficulty: "beginner",
      xpReward: 150,
      isCompleted: true,
      isLocked: false,
      minigame: {
        type: "quiz",
        shuffleOptions: true,
        timeLimitSeconds: 90,
        passingScorePercent: 70,
        questions: [
          {
            id: "q1",
            question: "Quel mot-clé correspond à 'else if' en Python ?",
            options: [
              { id: "a", text: "elseif" },
              { id: "b", text: "elif" },
              { id: "c", text: "else if" },
              { id: "d", text: "elifelse" }
            ],
            correctOptionId: "b",
            explanation: "La forme correcte est elif."
          },
          {
            id: "q2",
            question: "Quel opérateur logique représente 'ET' en Python ?",
            options: [
              { id: "a", text: "&&" },
              { id: "b", text: "and" },
              { id: "c", text: "&" },
              { id: "d", text: "plus" }
            ],
            correctOptionId: "b",
            explanation: "Les opérateurs logiques sont and, or, not."
          },
          {
            id: "q3",
            question: "Combien d’itérations effectue range(3) dans une boucle for ?",
            options: [
              { id: "a", text: "2 (0 et 1)" },
              { id: "b", text: "3 (0, 1 et 2)" },
              { id: "c", text: "4 (0 à 3)" },
              { id: "d", text: "Indéfini" }
            ],
            correctOptionId: "b",
            explanation: "range(3) génère 0, 1, 2."
          }
        ]
      }
    },
    {
      id: "py-lvl-3",
      languageId: "python",
      levelNumber: 3,
      title: "Fonctions",
      description: "Apprends à créer et utiliser des fonctions pour organiser ton code.",
      difficulty: "intermediate",
      xpReward: 200,
      isCompleted: true,
      isLocked: false,
      minigame: {
        type: "quiz",
        shuffleOptions: true,
        timeLimitSeconds: 90,
        passingScorePercent: 70,
        questions: [
          {
            id: "q1",
            question: "Quel mot-clé permet de définir une fonction en Python ?",
            options: [
              { id: "a", text: "func" },
              { id: "b", text: "def" },
              { id: "c", text: "function" },
              { id: "d", text: "lambda" }
            ],
            correctOptionId: "b",
            explanation: "On définit une fonction nommée avec def."
          },
          {
            id: "q2",
            question: "Que fait l'instruction return dans une fonction ?",
            options: [
              { id: "a", text: "Affiche un texte" },
              { id: "b", text: "Arrête le programme" },
              { id: "c", text: "Renvoie une valeur au code appelant" },
              { id: "d", text: "Crée une variable globale" }
            ],
            correctOptionId: "c",
            explanation: "return renvoie une valeur et termine l'exécution de la fonction."
          },
          {
            id: "q3",
            question: "Quelle est la syntaxe correcte pour un paramètre par défaut ?",
            options: [
              { id: "a", text: "def f(x: 10)" },
              { id: "b", text: "def f(x = 10)" },
              { id: "c", text: "def f(x := 10)" },
              { id: "d", text: "def f(x <- 10)" }
            ],
            correctOptionId: "b",
            explanation: "On utilise x = 10 dans la signature."
          }
        ]
      }
    },
    {
      id: "py-lvl-4",
      languageId: "python",
      levelNumber: 4,
      title: "Listes et Tuples",
      description: "Manipule les structures de données essentielles de Python.",
      difficulty: "intermediate",
      xpReward: 250,
      isCompleted: false,
      isLocked: false,
      minigame: {
        type: "quiz",
        shuffleOptions: true,
        timeLimitSeconds: 90,
        passingScorePercent: 70,
        questions: [
          {
            id: "q1",
            question: "Quelle affirmation est vraie ?",
            options: [
              { id: "a", text: "Les listes sont immuables, les tuples sont muables" },
              { id: "b", text: "Les listes et tuples sont immuables" },
              { id: "c", text: "Les listes sont muables, les tuples sont immuables" },
              { id: "d", text: "Les deux sont muables" }
            ],
            correctOptionId: "c",
            explanation: "Les listes sont modifiables, les tuples ne le sont pas."
          },
          {
            id: "q2",
            question: "Quel résultat pour [1,2,3,4][1:3] ?",
            options: [
              { id: "a", text: "[1, 2, 3]" },
              { id: "b", text: "[2, 3]" },
              { id: "c", text: "[2, 3, 4]" },
              { id: "d", text: "[1, 2]" }
            ],
            correctOptionId: "b",
            explanation: "Le slice 1:3 prend les éléments d’indice 1 et 2."
          },
          {
            id: "q3",
            question: "Que renvoie [x*2 for x in [1,2,3]] ?",
            options: [
              { id: "a", text: "[1, 2, 3]" },
              { id: "b", text: "[1, 4, 9]" },
              { id: "c", text: "[2, 4, 6]" },
              { id: "d", text: "[(1,2), (2,4), (3,6)]" }
            ],
            correctOptionId: "c",
            explanation: "Compréhension de liste qui double chaque élément."
          }
        ]
      }
    },
    {
      id: "py-lvl-5",
      languageId: "python",
      levelNumber: 5,
      title: "Dictionnaires",
      description: "Travaille avec des paires clé-valeur pour structurer tes données.",
      difficulty: "intermediate",
      xpReward: 300,
      isCompleted: false,
      isLocked: false,
      minigame: {
        type: "quiz",
        shuffleOptions: true,
        timeLimitSeconds: 90,
        passingScorePercent: 70,
        questions: [
          {
            id: "q1",
            question: "Comment accéder à la valeur associée à la clé 'k' dans d = {'k': 1} ?",
            options: [
              { id: "a", text: "d.k" },
              { id: "b", text: "d['k']" },
              { id: "c", text: "d.getKey('k')" },
              { id: "d", text: "d(k)" }
            ],
            correctOptionId: "b",
            explanation: "On utilise la notation d['k'] ou d.get('k')."
          },
          {
            id: "q2",
            question: "Quelle méthode permet de récupérer clé et valeur en même temps ?",
            options: [
              { id: "a", text: "d.keys()" },
              { id: "b", text: "d.values()" },
              { id: "c", text: "d.items()" },
              { id: "d", text: "d.all()" }
            ],
            correctOptionId: "c",
            explanation: "d.items() renvoie des paires (clé, valeur)."
          },
          {
            id: "q3",
            question: "Comment ajouter une nouvelle entrée à un dictionnaire ?",
            options: [
              { id: "a", text: "d.append('k', 1)" },
              { id: "b", text: "d['k'] = 1" },
              { id: "c", text: "d.add('k', 1)" },
              { id: "d", text: "d.push(['k', 1])" }
            ],
            correctOptionId: "b",
            explanation: "On assigne directement la valeur à la clé."
          }
        ]
      }
    },
    // Nouveau niveau "code-fill"
    {
      id: "py-lvl-6",
      languageId: "python",
      levelNumber: 6,
      title: "Compléter le code: Somme des éléments",
      description: "Renseigne les bonnes parties manquantes pour compléter la fonction de somme.",
      difficulty: "beginner",
      xpReward: 180,
      isCompleted: false,
      isLocked: false,
      minigame: {
        type: "code-fill",
        language: "python",
        timeLimitSeconds: 120,
        passingScorePercent: 100,
        snippet: `def somme(liste):
    total = {{1}}
    for x in {{2}}:
        total += x
    {{3}} total`,
        blanks: [
          {
            id: "1",
            answer: "0",
            placeholder: "valeur initiale",
            explanation: "On initialise l'accumulateur à 0 pour additionner des nombres.",
          },
          {
            id: "2",
            answer: ["liste", "list"], // accepte "liste" (nom du paramètre) ou "list" si l'apprenant se trompe légèrement
            placeholder: "séquence",
            explanation: "On itère sur la séquence passée en paramètre (ici 'liste').",
            caseSensitive: false,
            trim: true
          },
          {
            id: "3",
            answer: "return",
            placeholder: "mot-clé",
            explanation: "Le mot-clé return permet de renvoyer le résultat.",
            choices: ["print", "yield", "return"]
          }
        ]
      }
    }
  ],
  javascript: [
    {
      id: "js-lvl-1",
      languageId: "javascript",
      levelNumber: 1,
      title: "Variables ES6",
      description: "Let, const et var expliqués en détail.",
      difficulty: "beginner",
      xpReward: 100,
      isCompleted: true,
      isLocked: false,
      minigame: {
        type: "quiz",
        shuffleOptions: true,
        timeLimitSeconds: 90,
        passingScorePercent: 70,
        questions: [
          {
            id: "q1",
            question: "Quelle déclaration est à portée de bloc (block scope) ?",
            options: [
              { id: "a", text: "var" },
              { id: "b", text: "let" },
              { id: "c", text: "function" },
              { id: "d", text: "classique" }
            ],
            correctOptionId: "b",
            explanation: "let et const sont block-scoped, var est function-scoped."
          },
          {
            id: "q2",
            question: "Peut-on redéclarer la même variable dans le même scope avec let ?",
            options: [
              { id: "a", text: "Oui" },
              { id: "b", text: "Non" },
              { id: "c", text: "Seulement en mode strict" },
              { id: "d", text: "Seulement dans une fonction" }
            ],
            correctOptionId: "b",
            explanation: "La redéclaration avec let dans le même scope provoque une erreur."
          },
          {
            id: "q3",
            question: "Qu'est-ce que la 'Temporal Dead Zone' (TDZ) ?",
            options: [
              { id: "a", text: "Une zone mémoire réservée aux closures" },
              { id: "b", text: "Période avant l'initialisation où let/const ne sont pas accessibles" },
              { id: "c", text: "Un bug lié à var" },
              { id: "d", text: "Une optimisation du moteur JS" }
            ],
            correctOptionId: "b",
            explanation: "La TDZ rend l'accès à let/const impossible avant leur initialisation."
          }
        ]
      }
    },
    {
      id: "js-lvl-2",
      languageId: "javascript",
      levelNumber: 2,
      title: "Fonctions Fléchées",
      description: "Découvre la syntaxe moderne des fonctions JavaScript.",
      difficulty: "beginner",
      xpReward: 150,
      isCompleted: true,
      isLocked: false,
      minigame: {
        type: "quiz",
        shuffleOptions: true,
        timeLimitSeconds: 90,
        passingScorePercent: 70,
        questions: [
          {
            id: "q1",
            question: "Quelle est la bonne syntaxe d'une fonction fléchée additionnant a et b ?",
            options: [
              { id: "a", text: "const add = (a, b) => a + b" },
              { id: "b", text: "const add = (a, b) -> a + b" },
              { id: "c", text: "function add(a, b) => a + b" },
              { id: "d", text: "let add: (a, b) => { return a + b }" }
            ],
            correctOptionId: "a",
            explanation: "=> est l'opérateur des fonctions fléchées."
          },
          {
            id: "q2",
            question: "Comment le mot-clé this se comporte-t-il dans une fonction fléchée ?",
            options: [
              { id: "a", text: "Il est lié dynamiquement au moment de l'appel" },
              { id: "b", text: "Il est lié lexicalement au contexte englobant" },
              { id: "c", text: "Il est toujours undefined" },
              { id: "d", text: "Il référence toujours window" }
            ],
            correctOptionId: "b",
            explanation: "Les fonctions fléchées n'ont pas leur propre this ; elles capturent celui du contexte."
          },
          {
            id: "q3",
            question: "Peut-on utiliser new avec une fonction fléchée ?",
            options: [
              { id: "a", text: "Oui, toujours" },
              { id: "b", text: "Non" },
              { id: "c", text: "Oui, si elle retourne un objet" },
              { id: "d", text: "Seulement en mode strict" }
            ],
            correctOptionId: "b",
            explanation: "Les fonctions fléchées ne peuvent pas être des constructeurs."
          }
        ]
      }
    }
  ],
  cpp: [
    {
      id: "cpp-lvl-1",
      languageId: "cpp",
      levelNumber: 1,
      title: "Syntaxe de Base",
      description: "Premiers pas dans le monde du C++.",
      difficulty: "beginner",
      xpReward: 100,
      isCompleted: true,
      isLocked: false,
      minigame: {
        type: "quiz",
        shuffleOptions: true,
        timeLimitSeconds: 90,
        passingScorePercent: 70,
        questions: [
          {
            id: "q1",
            question: "Quel en-tête faut-il inclure pour utiliser std::cout ?",
            options: [
              { id: "a", text: "<cstdio>" },
              { id: "b", text: "<iostream>" },
              { id: "c", text: "<string>" },
              { id: "d", text: "<cstdlib>" }
            ],
            correctOptionId: "b",
            explanation: "std::cout est défini dans <iostream>."
          },
          {
            id: "q2",
            question: "Quel est le point d'entrée standard d'un programme C++ ?",
            options: [
              { id: "a", text: "void start()" },
              { id: "b", text: "int main()" },
              { id: "c", text: "auto run() -> int" },
              { id: "d", text: "entry()" }
            ],
            correctOptionId: "b",
            explanation: "La fonction main doit retourner un int."
          },
          {
            id: "q3",
            question: "Comment accéder à cout sans using namespace std; ?",
            options: [
              { id: "a", text: "cout << \"Hello\";" },
              { id: "b", text: "std::cout << \"Hello\";" },
              { id: "c", text: "namespace::cout << \"Hello\";" },
              { id: "d", text: "system::cout << \"Hello\";" }
            ],
            correctOptionId: "b",
            explanation: "On préfixe cout par l'espace de noms std::."
          }
        ]
      }
    }
  ]
};