// Profil utilisateur principal
export interface UserProfile {
  id: string;
  username: string;
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  completedChallenges: number;
  achievements: string[];
}

// Difficulté des niveaux
export type LevelDifficulty = "beginner" | "intermediate" | "advanced" | "expert";

// Bloc de code pour les mini-jeux
export interface CodeBlock {
  id: string;       // Identifiant unique du bloc
  content: string;  // Contenu du bloc de code
}

// Mini-jeu Code Assembly
export interface CodeAssemblyMinigame {
  type: "code-assembly";
  language: "javascript" | "python" | "cpp" | string;
  blocks: CodeBlock[];       // Liste des blocs de code
  solutionOrder: string[];   // Ordre attendu des blocs (par id)
}

// Option pour les questions de quiz
export interface QuizQuestionOption {
  id: string;       // ex: "a", "b", "c", "d"
  text: string;     // Libellé affiché
  imageUrl?: string;
}

// Question de quiz
export interface QuizQuestion {
  id: string;                     // ex: "q1"
  question: string;               // Libellé de la question
  options: QuizQuestionOption[];  // Liste d'options
  correctOptionId: string;        // ID de la bonne réponse
  explanation?: string;           // Explication (affichée après réponse)
  imageUrl?: string;              // Image pour illustrer la question
}

// Mini-jeu Quiz
export interface QuizMiniggame {
  type: "quiz";
  questions: QuizQuestion[];
  shuffleOptions?: boolean;
  timeLimitSeconds?: number;
  passingScorePercent?: number; // % requis pour valider
}

// Blank pour le mini-jeu Code Fill
export interface CodeFillBlank {
  id: string;                 // Correspond au placeholder dans le code, ex: "1", "2"
  answer: string | string[];  // Réponse(s) acceptée(s)
  placeholder?: string;       // Indice dans l'input (ex: "mot-clé")
  explanation?: string;       // Explication affichée après correction
  caseSensitive?: boolean;    // Par défaut false
  trim?: boolean;             // Par défaut true
  choices?: string[];         // Si présent, on affiche un <select> au lieu d'un input
}

// Mini-jeu Code Fill
export interface CodeFillMinigame {
  type: "code-fill";
  language: "python" | "javascript" | "cpp" | string; // Pour affichage / highlight éventuel
  snippet: string;     // Code avec placeholders {{1}}, {{2}}, etc.
  blanks: CodeFillBlank[];
  timeLimitSeconds?: number;
  passingScorePercent?: number; // % de réponses justes requis (défaut 100%)
}

// Objectif pour le mini-jeu HTML Builder
export interface HtmlBuilderMinigameGoal {
  id: string;
  description: string;
  selector: string;
  minTextLength?: number;
  requireAttr?: string;
}

// Mini-jeu HTML Builder
export interface HtmlBuilderMinigame {
  type: "html-builder";
  starter: string;
  goals: HtmlBuilderMinigameGoal[];
}

// Mini-jeu Boss Battle
export interface BossBattleMinigame {
  type: "boss-battle";
  boss: {
    name: string;
    imageUrl: string;
    maxHealth: number;
  };
  questions: {
    id: string;
    question: string;
    choices: string[];
    correctAnswer: string;
    timeLimitSeconds: number;
  }[];
  playerHealth: number;
}

// Union des types de mini-jeux
export type Minigame =
    | QuizMiniggame
    | CodeFillMinigame
    | HtmlBuilderMinigame
    | CodeAssemblyMinigame
    | BossBattleMinigame;

// Modèle Level
export interface Level {
  id: string;
  languageId: string;
  levelNumber: number;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "hard";
  xpReward: number;
  isCompleted: boolean;
  isLocked: boolean;
  minigame: Minigame;
}

// Modèle Language
export interface Language {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  currentLevel: number;
  completedLevels: number;
  totalXP: number;
  earnedXP: number;
}