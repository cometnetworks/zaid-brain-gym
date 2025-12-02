import React, { useState, useEffect } from 'react';
import { playSound } from '../../utils/audio';

const NumberSequence = ({ onComplete, isDaily, dailyTarget = 5 }) => {
    const [streak, setStreak] = useState(0);
    const [seq, setSeq] = useState([]);
    const [ans, setAns] = useState(0);
    const [opts, setOpts] = useState([]);
    const [missingIndex, setMissingIndex] = useState(0);

    const nextSeq = () => {
        const level = Math.floor(streak / 10);
        const step = level + 1;
        const start = Math.floor(Math.random() * 10) + 1;
        const fullSeq = [start, start + step, start + step * 2, start + step * 3];
        const hiddenIdx = Math.floor(Math.random() * 4);
        setMissingIndex(hiddenIdx);
        setAns(fullSeq[hiddenIdx]);
        setSeq(fullSeq);
        const correctAnswer = fullSeq[hiddenIdx];
        const o = [correctAnswer, correctAnswer + Math.floor(Math.random() * 3) + 1, correctAnswer - Math.floor(Math.random() * 3) - 1];
        setOpts(o.sort(() => Math.random() - 0.5));
    };

    useEffect(() => { nextSeq(); }, [streak]);

    const handleAns = (val) => {
        if (val === ans) {
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

    return (
        <div className="flex flex-col items-center justify-center h-full gap-8">
            <div className="absolute top-4 flex justify-between w-full px-8 items-center">
                {isDaily && <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold">Misión: {streak}/{dailyTarget}</div>}
                <div className="text-2xl font-bold text-green-600">Racha: {streak}</div>
            </div>
            <h2 className="text-2xl font-bold text-slate-600">¿QUÉ NÚMERO FALTA?</h2>
            <div className="flex gap-2 items-center">
                {seq.map((n, idx) => (
                    idx === missingIndex
                        ? <div key={idx} className="w-16 h-16 bg-slate-200 border-dashed border-4 border-slate-300 rounded-full flex items-center justify-center text-3xl font-bold text-slate-400">?</div>
                        : <div key={idx} className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-lg">{n}</div>
                ))}
            </div>
            <div className="flex gap-4">
                {opts.map((n, i) => (
                    <button key={i} onClick={() => handleAns(n)} className="w-20 h-20 bg-white border-4 border-blue-200 rounded-xl text-3xl font-bold hover:scale-110 active:scale-95 transition-transform">
                        {n}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default NumberSequence;
