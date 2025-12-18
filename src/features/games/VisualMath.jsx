import React, { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import { playSound } from '../../utils/audio';
import ModernAsset from '../../components/ui/ModernAsset';

const VisualMath = ({ onComplete, isDaily, dailyTarget = 5 }) => {
    const [streak, setStreak] = useState(0);
    const [problem, setProblem] = useState(null);
    const [difficulty, setDifficulty] = useState(null); // 'easy', 'medium', 'hard'

    const generateProblem = () => {
        let maxNum, ops;

        switch (difficulty) {
            case 'easy': maxNum = 5; ops = ['+']; break;
            case 'medium': maxNum = 10; ops = ['+', '-']; break;
            case 'hard': maxNum = 20; ops = ['+', '-']; break;
            default: maxNum = 5; ops = ['+'];
        }

        // Increase difficulty slightly with streak even within mode
        const levelBonus = Math.floor(streak / 5);
        if (difficulty === 'hard') maxNum += levelBonus * 2;

        const op = ops[Math.floor(Math.random() * ops.length)];
        let a, b, ans;

        if (op === '+') {
            a = Math.floor(Math.random() * maxNum) + 1;
            b = Math.floor(Math.random() * (maxNum - a)) + 1; // Ensure sum approx maxNum
            // Adjust hard mode sum to be potentially larger
            if (difficulty === 'hard') {
                a = Math.floor(Math.random() * maxNum) + 1;
                b = Math.floor(Math.random() * maxNum) + 1;
            }
            ans = a + b;
        } else {
            // Subtraction
            a = Math.floor(Math.random() * maxNum) + 1;
            b = Math.floor(Math.random() * a); // Ensure positive result
            ans = a - b;
        }

        let opts = new Set([ans]);
        while (opts.size < 3) {
            const offset = Math.floor(Math.random() * 5) - 2;
            const fake = ans + offset;
            if (fake >= 0 && fake !== ans) opts.add(fake); // Allow 0, no negatives
            if (opts.size < 3 && Math.random() > 0.5) opts.add(Math.floor(Math.random() * (ans + 5))); // Random fallback
        }

        setProblem({ a, b, ans, op, opts: Array.from(opts).sort(() => Math.random() - 0.5) });
    };

    useEffect(() => {
        if (difficulty) generateProblem();
    }, [streak, difficulty]);

    const handleAns = (val) => {
        if (val === problem.ans) {
            playSound('correct');
            const newStreak = streak + 1;
            setStreak(newStreak);
            if (isDaily && newStreak >= dailyTarget) {
                playSound('win');
                onComplete(newStreak * 10);
            }
        } else {
            playSound('wrong');
            if (difficulty === 'easy') {
                // Easy mode is forgiving, just reset streak? 
                // Or "Minecraft logic": You die, you restart? 
                // Let's keep arcade logic: Wrong answer ends run in standard, continues in daily
                if (!isDaily) onComplete(streak * 10);
            } else {
                if (!isDaily) onComplete(streak * 10);
            }
        }
    };

    if (!difficulty && !isDaily) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-6">
                <h2 className="text-3xl font-black text-slate-700 mb-8">Elige tu Dificultad</h2>
                <div className="flex flex-col gap-4 w-64">
                    <button onClick={() => setDifficulty('easy')} className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-2xl font-bold shadow-lg transition-transform hover:scale-105">
                        🌱 BÁSICO (1-5)
                    </button>
                    <button onClick={() => setDifficulty('medium')} className="bg-yellow-500 hover:bg-yellow-600 text-white p-4 rounded-2xl font-bold shadow-lg transition-transform hover:scale-105">
                        ⚔️ INTERMEDIO (1-10)
                    </button>
                    <button onClick={() => setDifficulty('hard')} className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-2xl font-bold shadow-lg transition-transform hover:scale-105">
                        🔥 DIFÍCIL (20+)
                    </button>
                </div>
            </div>
        )
    }

    // Auto-set for daily if needed, or ask too? Let's default daily to easy/medium based on day
    if (!difficulty && isDaily) setDifficulty('medium');

    if (!problem) return null;

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="absolute top-4 flex justify-between w-full px-8 items-center">
                <div className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-bold text-sm uppercase">
                    {difficulty === 'easy' ? '🌱 Básico' : difficulty === 'medium' ? '⚔️ Intermedio' : '🔥 Difícil'}
                </div>
                {isDaily && (
                    <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                        <Target size={20} /> Problema: {streak} / {dailyTarget}
                    </div>
                )}
                <div className="text-2xl font-bold text-green-600">Racha: {streak}</div>
            </div>

            <div key={problem.ans + streak} className="flex items-center gap-2 md:gap-4 mb-12 bg-white p-4 md:p-8 rounded-3xl shadow-xl border-b-8 border-slate-200 animate-pop">
                {/* Left Operand */}
                <div className="flex flex-col items-center">
                    {difficulty === 'hard' || problem.a > 5
                        ? <span className="text-5xl md:text-7xl font-black text-slate-700">{problem.a}</span>
                        : <ModernAsset type="apple" count={problem.a} />
                    }
                </div>

                {/* Operator */}
                <span className="text-4xl md:text-6xl font-black text-blue-400">{problem.op}</span>

                {/* Right Operand */}
                <div className="flex flex-col items-center">
                    {difficulty === 'hard' || problem.b > 5
                        ? <span className="text-5xl md:text-7xl font-black text-slate-700">{problem.b}</span>
                        : <ModernAsset type="apple" count={problem.b} />
                    }
                </div>

                <span className="text-4xl md:text-6xl font-black text-slate-400">=</span>

                {/* Result Box */}
                <div className="w-20 h-20 md:w-24 md:h-24 border-4 border-dashed border-slate-300 bg-slate-50 rounded-2xl flex items-center justify-center text-4xl text-slate-400">?</div>
            </div>

            <div className="flex gap-4 md:gap-8">
                {problem.opts.map((opt, i) => (
                    <button key={i} onClick={() => handleAns(opt)} className="w-20 h-20 md:w-28 md:h-28 bg-gradient-to-b from-indigo-400 to-indigo-600 border-b-8 border-indigo-800 text-white text-4xl md:text-6xl font-black rounded-2xl shadow-lg hover:scale-110 active:scale-95 active:border-b-0 active:translate-y-2 transition-all">
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default VisualMath;
