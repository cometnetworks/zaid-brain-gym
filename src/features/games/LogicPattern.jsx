import React, { useState, useEffect } from 'react';
import { playSound } from '../../utils/audio';
import ModernAsset from '../../components/ui/ModernAsset';

const LogicPattern = ({ onComplete, isDaily, dailyTarget = 5 }) => {
    const [sequence, setSequence] = useState([]);
    const [options, setOptions] = useState([]);
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [showFeedback, setShowFeedback] = useState(null); // 'correct' or 'wrong'

    const patterns = [
        { type: 'ABAB', len: 4 },
        { type: 'AABB', len: 4 },
        { type: 'ABC', len: 3 },
        { type: 'AAB', len: 3 },
    ];

    const generateRound = () => {
        const patternType = patterns[Math.min(Math.floor((level - 1) / 3), patterns.length - 1)];
        const items = ['apple', 'car', 'star', 'flower', 'cat', 'sun', 'fish', 'ball'].sort(() => 0.5 - Math.random());

        const a = items[0];
        const b = items[1];
        const c = items[2];

        let seq = [];
        let answer = '';

        if (patternType.type === 'ABAB') {
            seq = [a, b, a];
            answer = b;
        } else if (patternType.type === 'AABB') {
            seq = [a, a, b];
            answer = b;
        } else if (patternType.type === 'ABC') {
            seq = [a, b];
            answer = c; // Requires recognizing the set, effectively predicting 3rd. Simplified for visual: A, B, C... next is ? Wait, for ABC pattern usually it's A, B, C, A, B...
            // Let's do repeating sequences.
            // ABAB -> A, B, A, ? (B)
            // AABB -> A, A, B, ? (B)
            // ABC -> A, B, C, A, B, ? (C)
            if (patternType.type === 'ABC') {
                seq = [a, b, c, a, b];
                answer = c;
            } else if (patternType.type === 'AAB') {
                seq = [a, a, b, a, a];
                answer = b;
            }
        }

        // If not caught by specific logic (fallback)
        if (seq.length === 0) {
            seq = [a, b, a];
            answer = b;
        }

        setSequence({ seq, answer, answerType: patternType.type });

        // Generate options: correct answer + 2 distractors
        const distractors = items.filter(i => i !== answer).slice(0, 2);
        setOptions([answer, ...distractors].sort(() => 0.5 - Math.random()));
        setShowFeedback(null);
    };

    useEffect(() => {
        generateRound();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [level]);

    const handleChoice = (choice) => {
        if (showFeedback) return;

        if (choice === sequence.answer) {
            playSound('correct');
            setShowFeedback('correct');
            setScore(s => s + 10);
            setTimeout(() => {
                if (isDaily && score + 10 >= dailyTarget * 10) { // Simple target logic
                    onComplete(score + 10);
                } else {
                    setLevel(l => l + 1);
                }
            }, 1000);
        } else {
            playSound('wrong');
            setShowFeedback('wrong');
            setTimeout(() => {
                setShowFeedback(null); // Just clear feedback, let them try again or could reshuffle
            }, 1000);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full gap-8">
            <div className="absolute top-4 flex justify-between w-full px-8">
                <div className="text-xl font-bold text-blue-600">Nivel {level}</div>
                <div className="text-xl font-bold text-green-600">Puntos: {score}</div>
            </div>

            <h2 className="text-2xl text-slate-700 font-bold mb-4">¿Qué sigue?</h2>

            <div className="flex gap-2 p-6 bg-slate-100 rounded-3xl shadow-inner items-center">
                {sequence.seq && sequence.seq.map((item, i) => (
                    <div key={i} className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-white rounded-xl shadow-md flex items-center justify-center border-2 border-slate-200">
                            <ModernAsset type={item} size={10} />
                        </div>
                    </div>
                ))}
                <div className="w-20 h-20 bg-slate-200 rounded-xl border-4 border-dashed border-slate-400 flex items-center justify-center animate-pulse">
                    <span className="text-3xl text-slate-400">?</span>
                </div>
            </div>

            <div className="flex gap-4 mt-8">
                {options.map((opt, i) => (
                    <button
                        key={i}
                        onClick={() => handleChoice(opt)}
                        className={`w-24 h-24 rounded-2xl shadow-lg border-b-4 flex items-center justify-center transition-all hover:scale-105 active:scale-95
                            ${showFeedback === 'correct' && opt === sequence.answer ? 'bg-green-100 border-green-400' : ''}
                            ${showFeedback === 'wrong' && opt !== sequence.answer ? 'bg-red-50 border-red-200 opacity-50' : 'bg-white border-blue-200'}
                        `}
                    >
                        <ModernAsset type={opt} size={12} />
                    </button>
                ))}
            </div>

            {showFeedback === 'correct' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-50 pointer-events-none">
                    <div className="text-6xl animate-bounce">✨</div>
                </div>
            )}
        </div>
    );
};

export default LogicPattern;
