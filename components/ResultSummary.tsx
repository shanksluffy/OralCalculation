
import React from 'react';
import { QuizSession } from '../types';
import { calculateRating } from '../utils/mathUtils';
import Button from './Button';

interface ResultSummaryProps {
  session: QuizSession;
  onRestart: () => void;
  onReviewMode: () => void;
}

const ResultSummary: React.FC<ResultSummaryProps> = ({ session, onRestart, onReviewMode }) => {
  const duration = Math.floor((session.endTime! - session.startTime) / 1000);
  const mistakes = session.problems.filter(p => !p.isCorrect);
  const accuracy = Math.round((session.score / session.problems.length) * 100);
  const rating = calculateRating(session.score, session.problems.length, duration);

  return (
    <div className="space-y-6 animate-in zoom-in-95 duration-500">
      <div className="flex flex-col items-center text-center space-y-2 py-2">
        <div className={`text-8xl font-black mb-1 tracking-tighter drop-shadow-sm ${rating.color}`}>
          {rating.grade}
        </div>
        <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest">练习等级</h2>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white p-3 rounded-2xl text-center border border-slate-100 shadow-sm">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">得分</div>
          <div className="text-2xl font-black text-indigo-600">{session.score}</div>
        </div>
        <div className="bg-white p-3 rounded-2xl text-center border border-slate-100 shadow-sm">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">准确率</div>
          <div className="text-2xl font-black text-emerald-500">{accuracy}%</div>
        </div>
        <div className="bg-white p-3 rounded-2xl text-center border border-slate-100 shadow-sm">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">耗时</div>
          <div className="text-2xl font-black text-orange-500">{duration}s</div>
        </div>
      </div>

      {mistakes.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-black flex items-center gap-2 text-rose-500 uppercase tracking-widest">
            错题回顾 ({mistakes.length})
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
            {mistakes.map((p, i) => (
              <div key={i} className="flex flex-col p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="font-bold text-slate-700 text-sm mb-1">{p.expression} = ?</div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 bg-rose-50 text-rose-500 rounded font-bold line-through">
                    答: {p.userAnswer}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded font-black">
                    正确: {p.correctAnswer}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 pt-2">
        <Button onClick={onRestart} size="lg" className="font-black rounded-2xl shadow-md">回到主页</Button>
        {mistakes.length > 0 && (
          <Button variant="secondary" onClick={onReviewMode} className="font-bold rounded-2xl">
            重做这些错题
          </Button>
        )}
      </div>
    </div>
  );
};

export default ResultSummary;
