export type LevelDifficulty = "beginner" | "intermediate" | "advanced" | "expert";

export interface QuizQuestionOption {
  id: string;       // ex: "a", "b", "c", "d"
  text: string;     // libellé affiché
  imageUrl?: string;
}

export interface QuizQuestion {
  id: string;                     // ex: "q1"
  question: string;               // libellé de la question
  options: QuizQuestionOption[];  // liste d'options
  correctOptionId: string;        // l'ID de la bonne réponse
  explanation?: string;           // explication (affichée après réponse)
  imageUrl?: string;              // image pour illustrer la question
}

export interface QuizMiniggame {
  type: "quiz";
  questions: QuizQuestion[];
  shuffleOptions?: boolean;
  timeLimitSeconds?: number;
  passingScorePercent?: number; // % requis pour valider
}

export interface CodeFillBlank {
  id: string;                 // Correspond au placeholder dans le code, ex: "1", "2"
  answer: string | string[];  // Réponse(s) acceptée(s)
  placeholder?: string;       // Indice dans l'input (ex: "mot-clé")
  explanation?: string;       // Explication affichée après correction
  caseSensitive?: boolean;    // Par défaut false
  trim?: boolean;             // Par défaut true
  choices?: string[];         // Si présent, on affiche un <select> au lieu d'un input
}

export interface CodeFillMinigame {
  type: "code-fill";
  language: "python" | "javascript" | "cpp" | string; // pour affichage / highlight éventuel
  snippet: string;     // Code avec placeholders {{1}}, {{2}}, etc.
  blanks: CodeFillBlank[];
  timeLimitSeconds?: number;
  passingScorePercent?: number; // % de réponses justes requis (défaut 100%)
}

// Union extensible
export type Minigame = QuizMiniggame | CodeFillMinigame;

// Modèle Level
export interface Level {
  id: string;
  languageId: string;
  levelNumber: number;
  title: string;
  description: string;
  difficulty: LevelDifficulty;
  xpReward: number;
  imageUrl?: string;
  isCompleted: boolean;
  isLocked: boolean;
  prerequisites?: string[];

  // Mini‑jeu associé (quiz, code-fill, …)
  minigame?: Minigame;
}

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