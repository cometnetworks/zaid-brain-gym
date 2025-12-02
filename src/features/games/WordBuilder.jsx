import React, { useState, useEffect } from 'react';
import { Target, Heart } from 'lucide-react';
import { playSound } from '../../utils/audio';
import ModernAsset from '../../components/ui/ModernAsset';
import { WORD_DB_ES, WORD_DB_EN } from '../../data/db';

const WordBuilder = ({ onComplete, language = 'es', isDaily, dailyTarget = 5 }) => {
    const [streak, setStreak] = useState(0);
    const [lives, setLives] = useState(10);
    const [target, setTarget] = useState(null);
    const [placed, setPlaced] = useState([]);
    const [scramble, setScramble] = useState([]);
    const [errorIndex, setErrorIndex] = useState(null);

    const db = language === 'en' ? WORD_DB_EN : WORD_DB_ES;

    const nextWord = () => {
        const w = db[Math.floor(Math.random() * db.length)];
        setTarget(w);
        setPlaced(Array(w.word.length).fill(null));
        const letters = w.word.split('').sort(() => Math.random() - 0.5);
        setScramble(letters);
        setErrorIndex(null);
    };

    useEffect(() => { nextWord(); }, [streak]);

    const handlePool = (char) => {
        const idx = placed.indexOf(null);
        if (idx !== -1) {
            if (char !== target.word[idx]) {
                playSound('wrong');
                const newLives = lives - 1;
                setLives(newLives);
                setErrorIndex(idx);
                const newPlaced = [...placed];
                newPlaced[idx] = char;
                setPlaced(newPlaced);
                setTimeout(() => {
                    const resetPlaced = [...newPlaced];
                    resetPlaced[idx] = null;
                    setPlaced(resetPlaced);
                    setErrorIndex(null);
                    if (newLives <= 0) {
                        playSound('gameover');
                        onComplete(streak * 10);
                    }
                }, 800);
            } else {
                playSound('pop');
                const newPlaced = [...placed];
                newPlaced[idx] = char;
                setPlaced(newPlaced);
                if (newPlaced.join('') === target.word) {
                    playSound('correct');
                    setTimeout(() => {
                        const newStreak = streak + 1;
                        setStreak(newStreak);
                        if (isDaily && newStreak >= dailyTarget) {
                            playSound('win');
                            onComplete(newStreak * 10);
                        }
                    }, 500);
                }
            }
        }
    };

    const handleReset = () => {
        playSound('pop');
        setPlaced(Array(target.word.length).fill(null));
        setErrorIndex(null);
    };

    if (!target) return null;

    return (
        <div className="flex flex-col items-center justify-center h-full gap-8">
            {isDaily && (
                <div className="absolute top-16 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold flex items-center gap-2 z-10">
                    <Target size={20} /> Palabras: {streak} / {dailyTarget}
                </div>
            )}

            <div className="absolute top-4 w-full flex justify-between px-8 items-center">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold text-sm">
                    {language === 'en' ? 'ENGLISH' : 'ESPAÑOL'}
                </div>
                <div className="flex gap-1 flex-wrap max-w-[50%]">
                    {[...Array(10)].map((_, i) => (
                        <Heart key={i} fill={i < lives ? "#ef4444" : "#e2e8f0"} color={i < lives ? "#ef4444" : "#cbd5e1"} className={`w-4 h-4 md:w-6 md:h-6 transition-all ${i < lives ? 'animate-pulse' : ''}`} />
                    ))}
                </div>
                <div className="text-2xl font-bold text-green-600">Puntos: {streak * 10}</div>
            </div>

            <div className="animate-bounce-slight mt-8">
                <ModernAsset type={target.icon} size={24} />
            </div>

            <div className="flex gap-2 min-h-[80px]">
                {placed.map((l, i) => (
                    <div key={i} className={`w-14 h-16 md:w-16 md:h-20 border-b-4 rounded-lg flex items-center justify-center text-4xl font-bold transition-all ${i === errorIndex ? 'bg-red-100 border-red-400 text-red-600 animate-shake' : 'bg-slate-100 border-slate-300 text-slate-700'} ${l && i !== errorIndex ? 'bg-blue-50 border-blue-300 text-blue-800' : ''}`}>
                        {l}
                    </div>
                ))}
            </div>

            <div className="flex gap-3 flex-wrap justify-center max-w-md">
                {scramble.map((char, i) => (
                    <button key={i} onClick={() => handlePool(char)} className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl font-bold text-2xl shadow-sm border border-purple-200 hover:scale-110 active:scale-95 transition-transform">
                        {char}
                    </button>
                ))}
            </div>
            <button onClick={handleReset} className="text-sm text-slate-400 underline hover:text-slate-600">Borrar todo</button>
        </div>
    );
};

export default WordBuilder;
