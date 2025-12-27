
import React from 'react';
import { MathProblem } from '../types';
import Button from './Button';

interface ReviewBoardProps {
  mistakes: MathProblem[];
  onBack: () => void;
  onClear: () => void;
}

const ReviewBoard: React.FC<ReviewBoardProps> = ({ mistakes, onBack, onClear }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">错题库</h2>
        <button onClick={onBack} className="text-indigo-600 hover:text-indigo-700 font-bold text-xs uppercase tracking-widest">
          返回
        </button>
      </div>

      {mistakes.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold">目前还没有错题，继续保持！</p>
        </div>
      ) : (
        <>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            累计错题: <span className="text-rose-500">{mistakes.length}</span>
          </p>
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {[...mistakes].reverse().map((p, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-indigo-100 transition-colors">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-300 mb-1">{new Date(p.timestamp).toLocaleDateString()}</span>
                  <div className="font-black text-slate-700">
                    {p.expression} = {p.correctAnswer}
                  </div>
                </div>
                <div className="text-[10px] px-2 py-1 bg-rose-50 text-rose-600 rounded-lg font-black uppercase">
                  需巩固
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 pt-4">
            <Button variant="outline" className="flex-1 font-bold text-xs" onClick={onClear}>清空记录</Button>
            <Button className="flex-1 font-black text-xs" onClick={onBack}>确认</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewBoard;
