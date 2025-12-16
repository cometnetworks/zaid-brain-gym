import React, { useState, useEffect } from 'react';
import { playSound } from '../../utils/audio';
import ModernAsset from '../../components/ui/ModernAsset';

import { WORD_DB_ES } from '../../data/db';

const SpeedReading = ({ onComplete, isDaily, dailyTarget = 60, wordPool = WORD_DB_ES, title = "Lectura Rápida" }) => {
    const [timeLeft, setTimeLeft] = useState(isDaily ? dailyTarget : 60);
    const [score, setScore] = useState(0);
    const [currentWord, setCurrentWord] = useState(null);
    const [options, setOptions] = useState([]);
    const [showWord, setShowWord] = useState(true);

    // Filter wordPool to ensure it has valid items (text/word, emoji/icon)
    // DB uses 'word', game used 'text'. Let's normalize. 
    // Actually, let's map the incoming DB format {word, icon} to {text, emoji} or just use DB format directly.
    // The previous hardcoded list had { text, emoji }. DB has { word, icon }.
    // Let's adapt the component to use { word, icon }.

    // Normalized pool check
    const gamePool = wordPool.map(w => ({
        text: w.word || w.text,
        emoji: w.icon || w.emoji
    }));

    const nextRound = () => {
        setShowWord(true);
        // Safety check
        if (!gamePool || gamePool.length === 0) return;

        const target = gamePool[Math.floor(Math.random() * gamePool.length)];
        setCurrentWord(target);

        // Ensure distractors are unique
        const distractors = gamePool
            .filter(w => w.text !== target.text)
            .sort(() => 0.5 - Math.random())
            .slice(0, 2);

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
