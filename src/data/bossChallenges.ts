import { Minigame } from "@/types";

// Défis Phase 1 : Tentacules (un par langage)
export const phase1Challenges: Record<string, Minigame[]> = {
  html: [
    {
      type: "html-builder",
      starter: "<!DOCTYPE html>\n<html>\n  <head>\n    <title>Défi</title>\n  </head>\n  <body>\n    <!-- TODO -->\n  </body>\n</html>",
      goals: [
        { id: "g1", description: "Ajoute un titre h1", selector: "h1", minTextLength: 3 },
        { id: "g2", description: "Ajoute un paragraphe p", selector: "p", minTextLength: 5 },
      ],
    },
  ],
  javascript: [
    {
      type: "code-fill",
      language: "javascript",
      snippet: "fetch('/api/data')\n  {{1}}\n  .then(data => console.log(data));",
      blanks: [
        {
          id: "1",
          answer: ".then(response => response.json())",
          placeholder: "Complète la chaîne",
          explanation: "Il faut transformer la réponse en JSON",
        },
      ],
    },
  ],
  python: [
    {
      type: "code-fill",
      language: "python",
      snippet: "def greet(name):\n    {{1}}\n    return message",
      blanks: [
        {
          id: "1",
          answer: "message = f\"Hello, {name}!\"",
          placeholder: "Crée le message",
          explanation: "Utilise une f-string pour formater",
        },
      ],
    },
  ],
  php: [
    {
      type: "code-fill",
      language: "php",
      snippet: "<?php\n$name = 'World';\n{{1}}\necho $greeting;",
      blanks: [
        {
          id: "1",
          answer: "$greeting = \"Hello, $name!\";",
          placeholder: "Crée la variable",
          explanation: "Utilise l'interpolation de chaîne PHP",
        },
      ],
    },
  ],
  sql: [
    {
      type: "code-fill",
      language: "sql",
      snippet: "SELECT {{1}} FROM users WHERE id = 1;",
      blanks: [
        {
          id: "1",
          answer: "*",
          placeholder: "Sélectionne tout",
          explanation: "Utilise * pour sélectionner toutes les colonnes",
        },
      ],
    },
  ],
  java: [
    {
      type: "code-fill",
      language: "java",
      snippet: "public class Main {\n    public static void {{1}}(String[] args) {\n        System.out.println(\"Hello\");\n    }\n}",
      blanks: [
        {
          id: "1",
          answer: "main",
          placeholder: "Nom de la méthode",
          explanation: "La méthode principale s'appelle main",
        },
      ],
    },
  ],
  csharp: [
    {
      type: "code-fill",
      language: "csharp",
      snippet: "using System;\n\nclass Program {\n    static void {{1}}(string[] args) {\n        Console.WriteLine(\"Hello\");\n    }\n}",
      blanks: [
        {
          id: "1",
          answer: "Main",
          placeholder: "Nom de la méthode",
          explanation: "La méthode principale s'appelle Main",
        },
      ],
    },
  ],
  cpp: [
    {
      type: "code-fill",
      language: "cpp",
      snippet: "#include <iostream>\n\nint {{1}}() {\n    std::cout << \"Hello\";\n    return 0;\n}",
      blanks: [
        {
          id: "1",
          answer: "main",
          placeholder: "Nom de la fonction",
          explanation: "La fonction principale s'appelle main",
        },
      ],
    },
  ],
};

// Nouveaux types de défis originaux pour le boss battle
export const originalBossChallenges = {
  // Défis de reconnaissance de pattern
  codePattern: [
    {
      id: "pattern-1",
      pattern: "for (let i = 0; i < 3; i++) {\n  console.log(i);\n}\n// Output: 0, 1, 2\n\nfor (let i = 0; i < 5; i++) {\n  console.log(i);\n}\n// Output: ?",
      options: [
        "0, 1, 2, 3, 4",
        "1, 2, 3, 4, 5",
        "0, 1, 2, 3",
        "5, 4, 3, 2, 1"
      ],
      correctIndex: 0,
      explanation: "La boucle commence à 0 et s'arrête avant 5, donc elle affiche 0, 1, 2, 3, 4"
    },
    {
      id: "pattern-2",
      pattern: "const arr = [1, 2, 3];\narr.map(x => x * 2); // [2, 4, 6]\n\nconst arr2 = [2, 4, 6];\narr2.map(x => ?); // [4, 8, 12]",
      options: [
        "x * 2",
        "x + 2",
        "x ** 2",
        "x / 2"
      ],
      correctIndex: 0,
      explanation: "Le pattern est de multiplier chaque élément par 2"
    }
  ],
  
  // Défis de chasse aux bugs
  bugHunter: [
    {
      id: "bug-1",
      code: `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i <= items.length; i++) {
    total += items[i].price;
  }
  return total;
}`,
      bugs: [
        { line: 3, description: "Index out of bounds: i <= items.length devrait être i < items.length" }
      ],
      correctBugs: [3]
    },
    {
      id: "bug-2",
      code: `function findMax(numbers) {
  let max = 0;
  for (let num of numbers) {
    if (num > max) {
      max = num;
    }
  }
  return max;
}`,
      bugs: [
        { line: 2, description: "Initialisation incorrecte: max devrait être -Infinity ou numbers[0] pour gérer les nombres négatifs" }
      ],
      correctBugs: [2]
    },
    {
      id: "bug-3",
      code: `function divide(a, b) {
  return a / b;
}

function safeDivide(a, b) {
  if (b = 0) {
    return null;
  }
  return divide(a, b);
}`,
      bugs: [
        { line: 5, description: "Erreur d'assignation: b = 0 devrait être b === 0" }
      ],
      correctBugs: [5]
    }
  ],
  
  // Défis de frappe rapide
  speedTyping: [
    {
      id: "typing-1",
      targetCode: "const greet = (name) => `Hello, ${name}!`;",
      description: "Tape cette fonction arrow ES6"
    },
    {
      id: "typing-2",
      targetCode: "const sum = arr => arr.reduce((a, b) => a + b, 0);",
      description: "Tape cette fonction de somme avec reduce"
    },
    {
      id: "typing-3",
      targetCode: "const isEven = n => n % 2 === 0;",
      description: "Tape cette fonction de vérification paire"
    }
  ],
  
  // Défis de puzzle logique
  logicPuzzle: [
    {
      id: "logic-1",
      question: "Quelle est la complexité temporelle de cette fonction ?\n\nfunction search(arr, target) {\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) return i;\n  }\n  return -1;\n}",
      options: [
        "O(1) - Temps constant",
        "O(log n) - Logarithmique",
        "O(n) - Linéaire",
        "O(n²) - Quadratique"
      ],
      correctIndex: 2,
      explanation: "La fonction parcourt chaque élément du tableau une fois, donc O(n)"
    },
    {
      id: "logic-2",
      question: "Quel est le résultat de :\n\nconst x = [1, 2, 3];\nconst y = x;\ny.push(4);\nconsole.log(x);",
      options: [
        "[1, 2, 3]",
        "[1, 2, 3, 4]",
        "[4, 3, 2, 1]",
        "Erreur"
      ],
      correctIndex: 1,
      explanation: "Les tableaux sont passés par référence, donc x et y pointent vers le même tableau"
    },
    {
      id: "logic-3",
      question: "Quelle méthode JavaScript retourne un nouveau tableau sans modifier l'original ?",
      options: [
        "push()",
        "pop()",
        "map()",
        "sort()"
      ],
      correctIndex: 2,
      explanation: "map() retourne un nouveau tableau, les autres modifient le tableau original"
    }
  ]
};

// Défis Phase 2 : Multi-langages (débogage)
export const phase2Challenges: Array<{
  id: string;
  title: string;
  description: string;
  codeBlocks: Array<{ language: string; code: string; errorLine?: number }>;
  correctAnswer: { blockIndex: number; lineIndex: number };
  explanation: string;
}> = [
  {
    id: "bug-1",
    title: "Bug Full-Stack",
    description: "Trouve l'incohérence entre les langages",
    codeBlocks: [
      {
        language: "html",
        code: '<div id="data-container"></div>',
      },
      {
        language: "javascript",
        code: `fetch('/api/user.php')
  .then(r => r.json())
  .then(data => {
    document.getElementById('data-container').innerText = data.username;
  });`,
        errorLine: 3, // data.username
      },
      {
        language: "php",
        code: `$sql = "SELECT user_name FROM users WHERE id = 1";
$result = mysqli_query($conn, $sql);
$row = mysqli_fetch_assoc($result);
echo json_encode(['username' => $row['user_name']]);`,
        errorLine: 4, // 'username' => $row['user_name']
      },
    ],
    correctAnswer: { blockIndex: 1, lineIndex: 3 }, // JS attend username mais SQL a user_name
    explanation: "Le JavaScript attend 'username' mais le SQL sélectionne 'user_name'. Il faut harmoniser les noms.",
  },
  {
    id: "bug-2",
    title: "Bug API",
    description: "Trouve l'erreur dans la communication API",
    codeBlocks: [
      {
        language: "javascript",
        code: `fetch('/api/data.php', {
  method: 'POST',
  body: JSON.stringify({ id: 1 })
});`,
      },
      {
        language: "php",
        code: `<?php
$data = $_GET['id'];
$sql = "SELECT * FROM users WHERE id = $data";
?>`,
        errorLine: 2, // Utilise $_GET au lieu de $_POST
      },
    ],
    correctAnswer: { blockIndex: 1, lineIndex: 2 },
    explanation: "Le JavaScript envoie en POST mais le PHP lit en GET. Il faut utiliser $_POST.",
  },
  {
    id: "bug-3",
    title: "Bug SQL Injection",
    description: "Trouve la faille de sécurité",
    codeBlocks: [
      {
        language: "javascript",
        code: `const userId = document.getElementById('user-id').value;
fetch(\`/api/user.php?id=\${userId}\`);`,
      },
      {
        language: "php",
        code: `<?php
$id = $_GET['id'];
$sql = "SELECT * FROM users WHERE id = $id";
$result = mysqli_query($conn, $sql);
?>`,
        errorLine: 3, // Injection SQL possible
      },
    ],
    correctAnswer: { blockIndex: 1, lineIndex: 3 },
    explanation: "L'ID utilisateur est directement inséré dans la requête SQL sans échappement, ce qui permet une injection SQL.",
  },
];

