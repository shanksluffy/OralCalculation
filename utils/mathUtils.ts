
import { Operator, MathProblem, QuizConfig, DifficultyLevel } from '../types';

export const DIFFICULTY_PRESETS: Record<Exclude<DifficultyLevel, 'custom'>, { min: number; max: number; operandCount: number }> = {
  easy: { min: 1, max: 10, operandCount: 2 },
  medium: { min: 10, max: 50, operandCount: 2 },
  hard: { min: 10, max: 100, operandCount: 3 },
};

export const getOperatorSymbol = (op: Operator): string => {
  switch (op) {
    case 'addition': return '+';
    case 'subtraction': return '-';
    case 'multiplication': return '×';
    case 'division': return '÷';
  }
};

const evaluateExpression = (numbers: number[], operators: Operator[]): number => {
  let currentNumbers = [...numbers];
  let currentOps = [...operators];

  // Pass 1: Multiplication and Division (MD)
  for (let i = 0; i < currentOps.length; i++) {
    if (currentOps[i] === 'multiplication' || currentOps[i] === 'division') {
      const op = currentOps[i];
      const n1 = currentNumbers[i];
      const n2 = currentNumbers[i + 1];
      let res = 0;
      if (op === 'multiplication') res = n1 * n2;
      else res = n2 !== 0 ? n1 / n2 : 0;

      currentNumbers.splice(i, 2, res);
      currentOps.splice(i, 1);
      i--; 
    }
  }

  // Pass 2: Addition and Subtraction (AS)
  let result = currentNumbers[0];
  for (let i = 0; i < currentOps.length; i++) {
    const op = currentOps[i];
    const n2 = currentNumbers[i + 1];
    if (op === 'addition') result += n2;
    else if (op === 'subtraction') result -= n2;
  }

  return Math.round(result * 100) / 100;
};

const generateSingleProblem = (config: QuizConfig): MathProblem => {
  let attempts = 0;
  while (attempts < 100) {
    attempts++;
    const numbers: number[] = [];
    const ops: Operator[] = [];
    const count = config.operandCount;

    // Generate numbers
    for (let i = 0; i < count; i++) {
      numbers.push(Math.floor(Math.random() * (config.max - config.min + 1)) + config.min);
    }

    // Generate operators
    const selectedOps = config.operators;
    const baseOp = selectedOps[Math.floor(Math.random() * selectedOps.length)];
    let mixedPool = [...selectedOps].sort(() => Math.random() - 0.5);

    for (let i = 0; i < count - 1; i++) {
      if (config.mixedOperations) {
        const nextOp = mixedPool.length > 0 ? mixedPool.pop()! : selectedOps[Math.floor(Math.random() * selectedOps.length)];
        ops.push(nextOp);
      } else {
        ops.push(baseOp);
      }
    }

    // Division handling: adjust for integer results if needed
    if (config.integerDivisionOnly) {
      for (let i = 0; i < ops.length; i++) {
        if (ops[i] === 'division') {
          if (numbers[i + 1] === 0) numbers[i + 1] = 1;
          const multiplier = Math.floor(Math.random() * 10) + 1;
          numbers[i] = numbers[i+1] * multiplier;
        }
      }
    }

    const correctAnswer = evaluateExpression(numbers, ops);

    if (!config.allowNegative && correctAnswer < 0) continue;
    if (config.integerDivisionOnly && !Number.isInteger(correctAnswer)) continue;
    
    let expression = "";
    for (let i = 0; i < numbers.length; i++) {
      expression += numbers[i];
      if (i < ops.length) {
        expression += ` ${getOperatorSymbol(ops[i])} `;
      }
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      expression,
      correctAnswer,
      userAnswer: '',
      isCorrect: null,
      timestamp: Date.now()
    };
  }

  return { id: 'fallback', expression: "1 + 1", correctAnswer: 2, userAnswer: '', isCorrect: null, timestamp: Date.now() };
};

export const generateProblemSet = (config: QuizConfig): MathProblem[] => {
  const problems: MathProblem[] = [];
  const seen = new Set<string>();
  let attempts = 0;
  const maxAttempts = config.quantity * 30;

  while (problems.length < config.quantity && attempts < maxAttempts) {
    const problem = generateSingleProblem(config);
    if (!seen.has(problem.expression)) {
      seen.add(problem.expression);
      problems.push(problem);
    }
    attempts++;
  }

  while (problems.length < config.quantity) {
    problems.push(generateSingleProblem(config));
  }

  return problems;
};

export const calculateRating = (score: number, total: number, timeInSeconds: number) => {
  const accuracy = (score / total) * 100;
  const avgTime = timeInSeconds / total;

  if (accuracy === 100) {
    if (avgTime < 4) return { grade: 'SSS', color: 'text-yellow-500' };
    if (avgTime < 7) return { grade: 'S', color: 'text-orange-500' };
    return { grade: 'A+', color: 'text-indigo-500' };
  }
  if (accuracy >= 90) {
    if (avgTime < 8) return { grade: 'A', color: 'text-indigo-400' };
    return { grade: 'B+', color: 'text-emerald-500' };
  }
  if (accuracy >= 80) return { grade: 'B', color: 'text-emerald-400' };
  if (accuracy >= 60) return { grade: 'C', color: 'text-slate-400' };
  return { grade: 'D', color: 'text-rose-400' };
};
