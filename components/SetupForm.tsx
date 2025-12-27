
import React, { useState } from 'react';
import { QuizConfig, Operator, DifficultyLevel } from '../types';
import { DIFFICULTY_PRESETS } from '../utils/mathUtils';
import Button from './Button';

interface SetupFormProps {
  initialConfig: QuizConfig;
  onStart: (config: QuizConfig) => void;
  onGenerateWorksheet: (config: QuizConfig) => void;
  onReviewMistakes: () => void;
  onOpenHistory: () => void;
  hasMistakes: boolean;
}

const SetupForm: React.FC<SetupFormProps> = ({ 
  initialConfig, 
  onStart, 
  onGenerateWorksheet,
  hasMistakes, 
  onReviewMistakes,
  onOpenHistory
}) => {
  const [config, setConfig] = useState<QuizConfig>(initialConfig);

  const toggleOperator = (op: Operator) => {
    setConfig(prev => {
      const ops = prev.operators.includes(op)
        ? prev.operators.filter(o => o !== op)
        : [...prev.operators, op];
      return ops.length > 0 ? { ...prev, operators: ops } : prev;
    });
  };

  const setDifficulty = (level: DifficultyLevel) => {
    if (level === 'custom') {
      setConfig(prev => ({ ...prev, difficulty: 'custom' }));
    } else {
      const { min, max, operandCount } = DIFFICULTY_PRESETS[level];
      setConfig(prev => ({ 
        ...prev, 
        difficulty: level, 
        min, 
        max, 
        operandCount, 
        mixedOperations: level !== 'easy' 
      }));
    }
  };

  const handleChange = (field: keyof QuizConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value, difficulty: 'custom' }));
  };

  const isValid = config.operators.length > 0 && config.max >= config.min;

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <span className="bg-indigo-100 text-indigo-600 w-7 h-7 rounded-full flex items-center justify-center text-xs">1</span>
          练习级别
        </h2>
        <div className="grid grid-cols-4 gap-2">
          {(['easy', 'medium', 'hard', 'custom'] as DifficultyLevel[]).map(level => (
            <button
              key={level}
              onClick={() => setDifficulty(level)}
              className={`p-2 rounded-lg border-2 text-sm font-bold transition-all ${
                config.difficulty === level
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
              }`}
            >
              {level === 'easy' ? '入门' : level === 'medium' ? '进阶' : level === 'hard' ? '挑战' : '自定义'}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <span className="bg-indigo-100 text-indigo-600 w-7 h-7 rounded-full flex items-center justify-center text-xs">2</span>
          运算规则
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {(['addition', 'subtraction', 'multiplication', 'division'] as Operator[]).map(op => (
              <button
                key={op}
                onClick={() => toggleOperator(op)}
                className={`p-2 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                  config.operators.includes(op)
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                }`}
              >
                <span className="text-xl font-bold">
                  {op === 'addition' ? '+' : op === 'subtraction' ? '-' : op === 'multiplication' ? '×' : '÷'}
                </span>
                <span className="text-[10px] uppercase font-bold">{op === 'addition' ? '加' : op === 'subtraction' ? '减' : op === 'multiplication' ? '乘' : '除'}</span>
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <input 
                type="checkbox" 
                checked={config.mixedOperations} 
                onChange={(e) => handleChange('mixedOperations', e.target.checked)}
                className="w-4 h-4 accent-indigo-600"
              />
              <span className="text-sm font-bold text-slate-600">混合运算</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <input 
                type="checkbox" 
                checked={config.allowNegative} 
                onChange={(e) => handleChange('allowNegative', e.target.checked)}
                className="w-4 h-4 accent-indigo-600"
              />
              <span className="text-sm font-bold text-slate-600">允许负数结果</span>
            </label>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-600 w-7 h-7 rounded-full flex items-center justify-center text-xs">3</span>
            数值范围
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={config.min}
              placeholder="Min"
              onChange={(e) => handleChange('min', parseInt(e.target.value) || 0)}
              className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
            <input
              type="number"
              value={config.max}
              placeholder="Max"
              onChange={(e) => handleChange('max', parseInt(e.target.value) || 1)}
              className="w-full p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-600 w-7 h-7 rounded-full flex items-center justify-center text-xs">4</span>
            运算项个数
          </h2>
          <div className="flex gap-2">
            {[2, 3, 4].map(num => (
              <button
                key={num}
                onClick={() => handleChange('operandCount', num)}
                className={`flex-1 p-2 rounded-lg border-2 font-black transition-all ${
                  config.operandCount === num
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-600 w-7 h-7 rounded-full flex items-center justify-center text-xs">5</span>
            题目数量
          </h2>
          <span className="font-black text-indigo-600 text-lg">{config.quantity}</span>
        </div>
        <input
          type="range"
          min="5"
          max="100"
          step="5"
          value={config.quantity}
          onChange={(e) => handleChange('quantity', parseInt(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
      </section>

      <div className="pt-4 flex flex-col gap-3">
        <Button 
          onClick={() => onStart(config)} 
          disabled={!isValid}
          className="w-full py-4 text-xl font-black shadow-lg shadow-indigo-200"
        >
          开始在线练习
        </Button>
        <Button 
          variant="secondary"
          onClick={() => onGenerateWorksheet(config)} 
          disabled={!isValid}
          className="w-full py-3 text-md font-bold"
        >
          一键生成练习卷并导出
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={onOpenHistory} className="font-bold text-xs">历史错题</Button>
          <Button 
            variant="outline" 
            onClick={onReviewMistakes} 
            disabled={!hasMistakes}
            className="font-bold text-xs text-rose-500 border-rose-100 hover:bg-rose-50"
          >
            错题针对练习
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SetupForm;
