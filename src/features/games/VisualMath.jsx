import React, { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import { playSound } from '../../utils/audio';
import ModernAsset from '../../components/ui/ModernAsset';

const VisualMath = ({ onComplete, isDaily, dailyTarget = 5 }) => {
    const [streak, setStreak] = useState(0);
    const [problem, setProblem] = useState(null);

    const generateProblem = () => {
        const level = Math.floor(streak / 10);
        const maxNum = level === 0 ? 5 : level === 1 ? 10 : 20;
        const a = Math.floor(Math.random() * (maxNum - 1)) + 1;
        const b = Math.floor(Math.random() * (maxNum - a)) + 1;
        const ans = a + b;
        let opts = new Set([ans]);
        while (opts.size < 3) {
            const offset = Math.floor(Math.random() * 5) - 2;
            const fake = ans + offset;
            if (fake > 0 && fake !== ans) opts.add(fake);
        }
        setProblem({ a, b, ans, opts: Array.from(opts).sort(() => Math.random() - 0.5) });
    };

    useEffect(() => { generateProblem(); }, [streak]);

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
            if (!isDaily) onComplete(streak * 10);
        }
    };

    if (!problem) return null;

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="absolute top-4 flex justify-between w-full px-8 items-center">
                {isDaily ? (
                    <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                        <Target size={20} /> Problema: {streak} / {dailyTarget}
                    </div>
                ) : (
                    <div className="text-xl font-bold text-slate-500">Nivel {Math.floor(streak / 10) + 1}</div>
                )}
                <div className="text-2xl font-bold text-green-600">Racha: {streak}</div>
            </div>
            <div className="flex items-center gap-4 mb-12 bg-white p-6 rounded-2xl shadow-lg border-2 border-slate-100">
                {problem.a <= 5 ? <ModernAsset type="apple" count={problem.a} /> : <span className="text-6xl font-bold text-red-500">{problem.a}</span>}
                <span className="text-4xl font-bold text-slate-400">+</span>
                {problem.b <= 5 ? <ModernAsset type="apple" count={problem.b} /> : <span className="text-6xl font-bold text-red-500">{problem.b}</span>}
                <span className="text-4xl font-bold text-slate-400">=</span>
                <div className="w-20 h-20 border-b-4 border-slate-300 bg-slate-50 rounded-lg flex items-center justify-center text-4xl text-slate-400">?</div>
            </div>
            <div className="flex gap-6">
                {problem.opts.map(opt => (
                    <button key={opt} onClick={() => handleAns(opt)} className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-4xl font-bold rounded-2xl shadow-lg hover:scale-110 active:scale-95 transition-transform">
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default VisualMath;
