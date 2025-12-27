
export type Operator = 'addition' | 'subtraction' | 'multiplication' | 'division';
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'custom';

export interface MathProblem {
  id: string;
  expression: string; // e.g., "12 + 5 * 2"
  correctAnswer: number;
  userAnswer: string;
  isCorrect: boolean | null;
  timestamp: number;
}

export interface QuizConfig {
  difficulty: DifficultyLevel;
  operators: Operator[];
  min: number;
  max: number;
  quantity: number;
  operandCount: number; // Number of values in the equation (2-4)
  mixedOperations: boolean; // Allow different operators in one problem
  allowNegative: boolean; // Whether the final result can be negative
  integerDivisionOnly: boolean;
}

export interface QuizSession {
  problems: MathProblem[];
  currentIndex: number;
  startTime: number;
  endTime: number | null;
  score: number;
}

export interface AppState {
  view: 'setup' | 'practice' | 'result' | 'review' | 'worksheet';
  config: QuizConfig;
  session: QuizSession | null;
  mistakeBank: MathProblem[];
}
