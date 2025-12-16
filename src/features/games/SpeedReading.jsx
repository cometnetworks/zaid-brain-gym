import React, { useState, useEffect } from 'react';
import { playSound } from '../../utils/audio';
import ModernAsset from '../../components/ui/ModernAsset';

const SpeedReading = ({ onComplete, isDaily, dailyTarget = 60 }) => {
    const [timeLeft, setTimeLeft] = useState(isDaily ? dailyTarget : 60);
    const [score, setScore] = useState(0);
    const [currentWord, setCurrentWord] = useState(null);
    const [options, setOptions] = useState([]);
    const [showWord, setShowWord] = useState(true);

    const wordPool = [
        // Palabras simples
        { text: "CASA", emoji: "house" }, { text: "PERRO", emoji: "dog" }, { text: "AUTO", emoji: "car" },
        { text: "SOL", emoji: "sun" }, { text: "GATO", emoji: "cat" }, { text: "PELOTA", emoji: "ball" },
        { text: "MANZANA", emoji: "apple" }, { text: "LIBRO", emoji: "book" }, { text: "LAPIZ", emoji: "pencil" },
        { text: "TREN", emoji: "train" }, { text: "LEON", emoji: "lion" }, { text: "AGUA", emoji: "water" },
        { text: "FLOR", emoji: "flower" }, { text: "ARBOL", emoji: "tree" }, { text: "PAN", emoji: "bread" },
        { text: "LUNA", emoji: "moon" }, { text: "PATO", emoji: "duck" }, { text: "MESA", emoji: "table" },
        { text: "PEZ", emoji: "fish" }, { text: "AVE", emoji: "bird" }, { text: "LECHE", emoji: "milk" },
        { text: "CERDO", emoji: "pig" }, { text: "RANA", emoji: "frog" }, { text: "BARCO", emoji: "ship" },

        // Frases cortas
        { text: "EL GATO", emoji: "cat" }, { text: "LA CASA", emoji: "house" }, { text: "UN PERRO", emoji: "dog" },
        { text: "EL SOL", emoji: "sun" }, { text: "LA LUNA", emoji: "moon" }, { text: "MI LIBRO", emoji: "book" },
        { text: "EL AUTO", emoji: "car" }, { text: "UNA FLOR", emoji: "flower" }, { text: "EL TREN", emoji: "train" },
        { text: "LA MESA", emoji: "table" }, { text: "EL LEON", emoji: "lion" }, { text: "UN PEZ", emoji: "fish" }
    ];

    const nextRound = () => {
        setShowWord(true);
        const target = wordPool[Math.floor(Math.random() * wordPool.length)];
        setCurrentWord(target);
        const distractors = wordPool.filter(w => w.text !== target.text).sort(() => 0.5 - Math.random()).slice(0, 2);
        setOptions([target, ...distractors].sort(() => 0.5 - Math.random()));
        setTimeout(() => setShowWord(false), 3000);
    };

    useEffect(() => {
        nextRound();
        const timer = setInterval(() => setTimeLeft(t => t <= 1 ? (clearInterval(timer), 0) : t - 1), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => { if (timeLeft === 0) onComplete(score); }, [timeLeft]);

    const handleChoice = (opt) => {
        if (showWord) return;
        if (opt.text === currentWord.text) {
            playSound('correct');
            setScore(s => s + 10);
        } else {
            playSound('wrong');
        }
        nextRound();
    };

    if (showWord && currentWord) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="absolute top-4 right-4 text-2xl font-mono bg-slate-100 p-2 rounded">⏱️ {timeLeft}s</div>
                <h1 className="text-6xl md:text-8xl font-black text-slate-800 animate-pulse">{currentWord.text}</h1>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full gap-8">
            <div className="absolute top-4 flex justify-between w-full px-8">
                <div className="text-2xl font-bold text-green-600">Puntos: {score}</div>
                <div className="text-2xl font-mono bg-slate-100 p-2 rounded">⏱️ {timeLeft}s</div>
            </div>
            <h2 className="text-2xl text-slate-600">¿Qué palabra viste?</h2>
            <div className="flex gap-4">
                {options.map((opt, i) => (
                    <button key={i} onClick={() => handleChoice(opt)} className="w-28 h-28 bg-white border-4 border-blue-200 rounded-2xl shadow-lg hover:scale-110 active:bg-blue-50 transition-transform flex items-center justify-center">
                        <ModernAsset type={opt.emoji} size={12} />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SpeedReading;
