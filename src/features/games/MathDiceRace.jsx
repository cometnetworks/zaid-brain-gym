import React, { useState, useEffect } from 'react';
import { playSound } from '../../utils/audio';

const MathDiceRace = ({ onComplete, isDaily, dailyTarget = 100 }) => {
    const [position, setPosition] = useState(0); // 0 to 10
    const [score, setScore] = useState(0);
    const [problem, setProblem] = useState(null);
    const [options, setOptions] = useState([]);
    const [feedback, setFeedback] = useState(null); // 'correct', 'wrong', 'win'

    const generateProblem = () => {
        const a = Math.floor(Math.random() * 6) + 1;
        const b = Math.floor(Math.random() * 6) + 1;
        const isAddition = Math.random() > 0.3; // Mostly addition

        let op = isAddition ? '+' : '-';
        let val = isAddition ? a + b : Math.max(a, b) - Math.min(a, b);
        let text = isAddition ? `${a} + ${b}` : `${Math.max(a, b)} - ${Math.min(a, b)}`;

        // Current answer
        const correct = val;

        // Generate distractors
        let ans = new Set();
        ans.add(correct);
        while (ans.size < 3) {
            let n = correct + Math.floor(Math.random() * 5) - 2;
            if (n >= 0 && n !== correct) ans.add(n);
        }

        setProblem({ text, val: correct });
        setOptions(Array.from(ans).sort(() => 0.5 - Math.random()));
    };

    useEffect(() => {
        generateProblem();
    }, []);

    const handleAnswer = (ans) => {
        if (feedback) return;

        if (ans === problem.val) {
            playSound('correct');
            setFeedback('correct');
            const move = Math.floor(Math.random() * 2) + 1; // Move 1 or 2 steps
            const newPos = Math.min(position + move, 10);
            setPosition(newPos);
            setScore(s => s + 10);

            if (newPos >= 10) {
                playSound('win');
                setFeedback('win');
                setTimeout(() => {
                    onComplete(score + 50); // Winner bonus
                }, 2000);
                return;
            }

            setTimeout(() => {
                setFeedback(null);
                generateProblem();
            }, 1000);
        } else {
            playSound('wrong');
            setFeedback('wrong');
            setTimeout(() => setFeedback(null), 1000);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full gap-4 w-full max-w-2xl mx-auto">
            <div className="flex justify-between w-full px-4 mb-4">
                <div className="text-xl font-bold text-slate-600">Meta: 10 pasos</div>
                <div className="text-xl font-bold text-green-600">Puntos: {score}</div>
            </div>

            {/* Race Track */}
            <div className="relative w-full h-24 bg-slate-200 rounded-full mb-8 flex items-center px-4 border-4 border-slate-300 shadow-inner">
                {/* Track markings */}
                <div className="absolute inset-0 flex justify-between px-6 items-center pointer-events-none opacity-30">
                    {Array.from({ length: 11 }).map((_, i) => <div key={i} className="w-1 h-8 bg-slate-400 rounded-full" />)}
                </div>

                {/* Character */}
                <div
                    className="absolute transition-all duration-700 ease-out"
                    style={{ left: `${(position / 10) * 90}%` }}
                >
                    <div className="text-5xl drop-shadow-lg transform -translate-y-2">🏎️</div>
                </div>

                {/* Finish Line */}
                <div className="absolute right-4 text-4xl">🏁</div>
            </div>

            {/* Problem Card */}
            <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center gap-6 w-full max-w-md border-b-8 border-slate-200">
                <div className="text-sm text-slate-400 font-bold tracking-widest uppercase">Resuelve para avanzar</div>
                <div className="text-7xl font-black text-slate-800">{problem ? problem.text : '...'}</div>

                <div className="grid grid-cols-3 gap-4 w-full">
                    {options.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => handleAnswer(opt)}
                            className={`h-20 text-3xl font-bold rounded-2xl shadow-md border-b-4 transition-all active:scale-95 flex items-center justify-center
                                ${feedback === 'correct' && opt === problem.val ? 'bg-green-500 text-white border-green-700' : ''}
                                ${feedback === 'wrong' && opt === problem.val ? 'bg-green-500 text-white border-green-700' : ''} 
                                ${feedback === 'wrong' && opt !== problem.val ? 'bg-red-100 text-red-400 border-red-200' : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'}
                            `}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>

            {feedback === 'win' && (
                <div className="absolute inset-0 bg-white/90 z-50 flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
                    <div className="text-8xl animate-bounce">🏆</div>
                    <div className="text-4xl font-black text-yellow-500">¡GANASTE!</div>
                </div>
            )}
        </div>
    );
};

export default MathDiceRace;
