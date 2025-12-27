
import React, { useState, useEffect } from 'react';
import { QuizConfig, AppState, QuizSession } from './types';
import { generateProblemSet } from './utils/mathUtils';
import SetupForm from './components/SetupForm';
import MathQuiz from './components/MathQuiz';
import ResultSummary from './components/ResultSummary';
import ReviewBoard from './components/ReviewBoard';
import WorksheetView from './components/WorksheetView';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    view: 'setup',
    config: {
      difficulty: 'easy',
      operators: ['addition'],
      min: 1,
      max: 10,
      quantity: 10,
      operandCount: 2,
      mixedOperations: false,
      allowNegative: false,
      integerDivisionOnly: true
    },
    session: null,
    mistakeBank: JSON.parse(localStorage.getItem('math_mistakes') || '[]')
  });

  useEffect(() => {
    localStorage.setItem('math_mistakes', JSON.stringify(state.mistakeBank));
  }, [state.mistakeBank]);

  const handleStartQuiz = (config: QuizConfig) => {
    const problems = generateProblemSet(config);
    setState(prev => ({
      ...prev,
      config,
      view: 'practice',
      session: {
        problems,
        currentIndex: 0,
        startTime: Date.now(),
        endTime: null,
        score: 0
      }
    }));
  };

  const handleGenerateWorksheet = (config: QuizConfig) => {
    const problems = generateProblemSet(config);
    setState(prev => ({
      ...prev,
      config,
      view: 'worksheet',
      session: {
        problems,
        currentIndex: 0,
        startTime: Date.now(),
        endTime: null,
        score: 0
      }
    }));
  };

  const handleReviewMistakes = () => {
    if (state.mistakeBank.length === 0) return;
    const problems = [...state.mistakeBank]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10)
      .map(p => ({
        ...p,
        userAnswer: '',
        isCorrect: null,
        id: Math.random().toString(36).substr(2, 9)
      }));
    
    setState(prev => ({
      ...prev,
      view: 'practice',
      session: {
        problems,
        currentIndex: 0,
        startTime: Date.now(),
        endTime: null,
        score: 0
      }
    }));
  };

  const handleFinishProblem = (answer: string) => {
    if (!state.session) return;
    const { problems, currentIndex } = state.session;
    const currentProblem = problems[currentIndex];
    const userAnswerNum = parseFloat(answer);
    const isCorrect = userAnswerNum === currentProblem.correctAnswer;

    const updatedProblems = problems.map((p, idx) => 
      idx === currentIndex ? { ...p, userAnswer: answer, isCorrect } : p
    );

    const isLast = currentIndex === problems.length - 1;
    const nextSession: QuizSession = {
      ...state.session,
      problems: updatedProblems,
      currentIndex: isLast ? currentIndex : currentIndex + 1,
      score: state.session.score + (isCorrect ? 1 : 0),
      endTime: isLast ? Date.now() : null
    };

    if (isLast) {
      const newMistakes = updatedProblems.filter(p => !p.isCorrect);
      setState(prev => ({
        ...prev,
        view: 'result',
        session: nextSession,
        mistakeBank: [...prev.mistakeBank, ...newMistakes].slice(-100)
      }));
    } else {
      setState(prev => ({ ...prev, session: nextSession }));
    }
  };

  const resetToSetup = () => {
    setState(prev => ({ ...prev, view: 'setup', session: null }));
  };

  const goToReview = () => {
    setState(prev => ({ ...prev, view: 'review' }));
  };

  return (
    <div className="min-h-screen bg-[#fcfdff] text-slate-900 p-4 md:p-8 flex flex-col items-center print:bg-white print:p-0">
      <header className="mb-6 text-center max-w-2xl w-full print:hidden">
        <h1 className="text-4xl font-black text-indigo-600 mb-1 tracking-tight">
          MathMaster
        </h1>
        <p className="text-slate-400 font-black uppercase text-[10px] tracking-[0.3em]">口算达人 · 智慧大脑的起点</p>
      </header>

      <main className={`w-full max-w-2xl bg-white shadow-[0_32px_64px_-16px_rgba(79,70,229,0.1)] rounded-[3rem] p-6 md:p-10 border border-slate-50 relative overflow-hidden print:shadow-none print:border-none print:p-0 print:max-w-none`}>
        {state.view === 'setup' && (
          <SetupForm 
            initialConfig={state.config} 
            onStart={handleStartQuiz} 
            onGenerateWorksheet={handleGenerateWorksheet}
            hasMistakes={state.mistakeBank.length > 0}
            onReviewMistakes={handleReviewMistakes}
            onOpenHistory={goToReview}
          />
        )}
        {state.view === 'practice' && state.session && (
          <MathQuiz 
            session={state.session} 
            onAnswer={handleFinishProblem}
            onQuit={resetToSetup}
          />
        )}
        {state.view === 'result' && state.session && (
          <ResultSummary 
            session={state.session} 
            onRestart={resetToSetup}
            onReviewMode={handleReviewMistakes}
          />
        )}
        {state.view === 'review' && (
          <ReviewBoard 
            mistakes={state.mistakeBank} 
            onBack={resetToSetup}
            onClear={() => setState(prev => ({ ...prev, mistakeBank: [] }))}
          />
        )}
        {state.view === 'worksheet' && state.session && (
          <WorksheetView 
            problems={state.session.problems} 
            onBack={resetToSetup} 
          />
        )}
      </main>

      <footer className="mt-8 text-slate-300 text-[10px] font-black tracking-widest uppercase print:hidden">
        &copy; 2024 MathMaster 口算达人
      </footer>
    </div>
  );
};

export default App;
