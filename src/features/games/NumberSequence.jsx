import React, { useState, useEffect } from 'react';
import { playSound } from '../../utils/audio';

const NumberSequence = ({ onComplete, isDaily, dailyTarget = 5 }) => {
    const [streak, setStreak] = useState(0);
    const [seq, setSeq] = useState([]);
    const [ans, setAns] = useState(0);
    const [opts, setOpts] = useState([]);
    const [missingIndex, setMissingIndex] = useState(0);
    const [instruction, setInstruction] = useState("¿Qué número falta?");

    const nextSeq = () => {
        const level = Math.floor(streak / 3); // Level up every 3 correct answers
        let start, step, isReverse = false;

        // Sequence types based on level
        // Level 0: Step 1 (Simple 1,2,3... or 24,25,26...)
        // Level 1: Step 2 (2,4,6... or 13,15,17...)
        // Level 2: Step 10 (10,20,30... or 25,35,45...)
        // Level 3: Reverse Step 1 (10,9,8...)
        // Level 4: Step 5 (5,10,15...)

        switch (level % 5) {
            case 0: // Step 1
                step = 1;
                start = Math.floor(Math.random() * 20) + 1;
                setInstruction("Cuenta de 1 en 1");
                break;
            case 1: // Step 2 (Impar o Par)
                step = 2;
                start = Math.floor(Math.random() * 20) + 1;
                setInstruction("Cuenta de 2 en 2");
                break;
            case 2: // Step 10
                step = 10;
                start = Math.floor(Math.random() * 5) * 10; // 0, 10, 20, 30...
                setInstruction("Cuenta de 10 en 10");
                break;
            case 3: // Reverse
                step = -1;
                start = Math.floor(Math.random() * 20) + 10;
                isReverse = true;
                setInstruction("Cuenta hacia atrás");
                break;
            case 4: // Step 5
                step = 5;
                start = Math.floor(Math.random() * 10) * 5;
                setInstruction("Cuenta de 5 en 5");
                break;
            default:
                step = 1;
                start = 1;
        }

        const fullSeq = [start, start + step, start + step * 2, start + step * 3];

        // Ensure no negatives just in case
        if (isReverse && fullSeq[3] < 0) {
            // Regeneration fallback logic if needed, but start+10 should be safe for 4 steps
            // simple fix just to be safe: abs
        }

        const hiddenIdx = Math.floor(Math.random() * 4);
        setMissingIndex(hiddenIdx);
        setAns(fullSeq[hiddenIdx]);
        setSeq(fullSeq);

        const correctAnswer = fullSeq[hiddenIdx];
        // Generate options close to answer
        const o = [
            correctAnswer,
            correctAnswer + (step !== 0 ? step : 1),
            correctAnswer - (step !== 0 ? step : 1)
        ];

        // Filter unique and positive
        const uniqueOpts = [...new Set(o)].filter(n => n >= 0);
        while (uniqueOpts.length < 3) {
            const r = correctAnswer + Math.floor(Math.random() * 10) - 5;
            if (r >= 0 && !uniqueOpts.includes(r)) uniqueOpts.push(r);
        }

        setOpts(uniqueOpts.sort(() => Math.random() - 0.5));
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
        <div className="flex flex-col items-center justify-center h-full gap-6">
            <div className="absolute top-4 flex justify-between w-full px-8 items-center">
                {isDaily && <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold">Misión: {streak}/{dailyTarget}</div>}
                <div className="text-2xl font-bold text-green-600">Racha: {streak}</div>
            </div>

            <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-700">¿QUÉ NÚMERO FALTA?</h2>
                <p className="text-xl text-blue-500 font-bold mt-2 animate-pulse">{instruction}</p>
            </div>

            <div className="flex flex-wrap gap-4 items-center justify-center mt-4">
                {seq.map((n, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                        {idx === missingIndex
                            ? <div className="w-20 h-20 bg-slate-100 border-4 border-dashed border-slate-300 rounded-2xl flex items-center justify-center text-4xl font-bold text-slate-400">?</div>
                            : <div className="w-20 h-20 bg-blue-500 text-white rounded-2xl flex items-center justify-center text-4xl font-bold shadow-lg border-b-4 border-blue-700">{n}</div>
                        }
                        <div className="h-2 w-2 rounded-full bg-slate-300 mt-2"></div>
                    </div>
                ))}
            </div>

            <div className="flex gap-4 mt-8">
                {opts.map((n, i) => (
                    <button key={i} onClick={() => handleAns(n)} className="w-24 h-24 bg-white border-4 border-indigo-200 rounded-xl text-4xl font-bold text-indigo-600 shadow-md hover:scale-110 hover:border-indigo-400 hover:bg-indigo-50 active:scale-95 transition-all">
                        {n}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default NumberSequence;
