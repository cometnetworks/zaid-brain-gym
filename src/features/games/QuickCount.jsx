import React, { useState, useEffect } from 'react';
import { playSound } from '../../utils/audio';
import ModernAsset from '../../components/ui/ModernAsset';

const QuickCount = ({ onComplete, isDaily, dailyTarget = 5 }) => {
    const [streak, setStreak] = useState(0);
    const [count, setCount] = useState(0);
    const [show, setShow] = useState(true);
    const [options, setOptions] = useState([]);

    const nextRound = () => {
        setShow(true);
        const level = Math.floor(streak / 10);
        const min = 3 + level;
        const max = 6 + level * 2;
        const n = Math.floor(Math.random() * (max - min + 1)) + min;
        setCount(n);
        const opts = new Set([n]);
        while (opts.size < 3) { opts.add(n + Math.floor(Math.random() * 5) - 2); }
        setOptions(Array.from(opts).filter(x => x > 0).sort(() => Math.random() - 0.5).slice(0, 3));
        setTimeout(() => setShow(false), 2000);
    };

    useEffect(() => { nextRound(); }, [streak]);

    const handleAns = (val) => {
        if (val === count) {
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

    if (show) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                {isDaily && <div className="absolute top-4 left-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold">Misión: {streak}/{dailyTarget}</div>}
                <h2 className="text-2xl mb-8 font-bold text-slate-600">¡CUENTA RÁPIDO!</h2>
                <div className="flex flex-wrap gap-4 justify-center max-w-xs animate-pulse">
                    {Array.from({ length: count }).map((_, i) => <ModernAsset key={i} type="star" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="absolute top-4 right-4 text-2xl font-bold text-green-600">Racha: {streak}</div>
            <h2 className="text-2xl mb-8 font-bold text-slate-600">¿CUÁNTOS HABÍA?</h2>
            <div className="flex gap-4">
                {options.map(n => (
                    <button key={n} onClick={() => handleAns(n)} className="w-24 h-24 bg-yellow-400 text-white font-bold text-5xl rounded-2xl border-b-8 border-yellow-600 active:border-b-0 active:translate-y-2 transition-all">
                        {n}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuickCount;
