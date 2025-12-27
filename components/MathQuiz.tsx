
import React, { useState, useEffect, useRef } from 'react';
import { QuizSession } from '../types';
import Button from './Button';

interface MathQuizProps {
  session: QuizSession;
  onAnswer: (answer: string) => void;
  onQuit: () => void;
}

const MathQuiz: React.FC<MathQuizProps> = ({ session, onAnswer, onQuit }) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { problems, currentIndex } = session;
  const currentProblem = problems[currentIndex];

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentIndex]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputValue.trim() === '') return;
    onAnswer(inputValue);
    setInputValue('');
  };

  const progress = ((currentIndex) / problems.length) * 100;

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-6">
        <div className="text-slate-500 font-bold text-sm">
          题目 {currentIndex + 1} / {problems.length}
        </div>
        <button onClick={onQuit} className="text-rose-500 hover:text-rose-600 text-xs font-black uppercase tracking-widest">
          退出
        </button>
      </div>

      <div className="w-full h-1.5 bg-slate-100 rounded-full mb-12 overflow-hidden">
        <div 
          className="h-full bg-indigo-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex flex-col items-center gap-8 py-4 w-full text-center">
        <div className="text-4xl md:text-6xl font-black text-slate-800 tracking-tight leading-relaxed break-words w-full px-4">
          {currentProblem.expression} <span className="text-indigo-300 ml-2">=</span>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-sm relative mt-4">
          <input
            ref={inputRef}
            type="number"
            step="any"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="?"
            className="w-full text-center text-5xl p-6 rounded-[2rem] border-4 border-slate-50 bg-slate-50/30 focus:bg-white focus:border-indigo-500 focus:ring-0 focus:outline-none transition-all placeholder:text-slate-200 font-black shadow-inner"
          />
          <div className="mt-8">
            <Button 
              type="submit" 
              className="w-full py-4 text-xl font-black rounded-3xl"
              disabled={inputValue.trim() === ''}
            >
              确定 (Enter)
            </Button>
          </div>
        </form>
      </div>

      {/* Numerical Keypad for Mobile Convenience */}
      <div className="grid grid-cols-3 gap-3 mt-10 md:hidden">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '-', 0, '.'].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => setInputValue(prev => {
              if (n === '-' && prev !== '') return prev; // '-' only at start
              return prev + n.toString();
            })}
            className="w-16 h-16 rounded-2xl bg-slate-50 active:bg-indigo-100 active:text-indigo-600 flex items-center justify-center text-2xl font-black text-slate-700 transition-colors shadow-sm"
          >
            {n}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setInputValue(prev => prev.slice(0, -1))}
          className="w-full col-span-3 mt-2 h-12 rounded-xl bg-rose-50 active:bg-rose-100 flex items-center justify-center text-lg font-black text-rose-500 transition-colors"
        >
          退格 (Back)
        </button>
      </div>
    </div>
  );
};

export default MathQuiz;
