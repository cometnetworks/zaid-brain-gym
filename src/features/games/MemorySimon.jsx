import React, { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import { playSound } from '../../utils/audio';

const MemorySimon = ({ onComplete, isDaily, dailyTarget = 5 }) => {
    const [sequence, setSequence] = useState([]);
    const [userStep, setUserStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [flash, setFlash] = useState(null);
    const [score, setScore] = useState(0);
    const [numColors, setNumColors] = useState(4);

    const allColors = [
        { id: 'green', class: 'bg-green-500 border-green-700', tone: 'simon_green' },
        { id: 'red', class: 'bg-red-500 border-red-700', tone: 'simon_red' },
        { id: 'yellow', class: 'bg-yellow-400 border-yellow-600', tone: 'simon_yellow' },
        { id: 'blue', class: 'bg-blue-500 border-blue-700', tone: 'simon_blue' },
        { id: 'purple', class: 'bg-purple-500 border-purple-700', tone: 'simon_purple' },
        { id: 'orange', class: 'bg-orange-500 border-orange-700', tone: 'simon_orange' },
    ];

    const activeColors = allColors.slice(0, numColors);

    useEffect(() => {
        if (sequence.length === 0 && !isPlaying) setTimeout(() => addToSequence(), 1000);
    }, []);

    const addToSequence = () => {
        setIsPlaying(true);
        const randomColor = activeColors[Math.floor(Math.random() * activeColors.length)];
        const newSeq = [...sequence, randomColor];
        setSequence(newSeq);
        playSequence(newSeq);
    };

    const playSequence = async (seq) => {
        await new Promise(r => setTimeout(r, 500));
        for (let i = 0; i < seq.length; i++) {
            const color = seq[i];
            setFlash(color.id);
            playSound(color.tone);
            await new Promise(r => setTimeout(r, 600));
            setFlash(null);
            await new Promise(r => setTimeout(r, 200));
        }
        setIsPlaying(false);
        setUserStep(0);
    };

    const handleTap = (color) => {
        if (isPlaying) return;
        setFlash(color.id);
        playSound(color.tone);
        setTimeout(() => setFlash(null), 200);

        if (color.id === sequence[userStep].id) {
            if (userStep === sequence.length - 1) {
                const newScore = score + 1;
                setScore(newScore);

                // Daily Check
                if (isDaily && newScore >= dailyTarget) {
                    playSound('win');
                    onComplete(newScore * 10);
                    return;
                }

                if (newScore > 0 && newScore % 10 === 0 && numColors < allColors.length) {
                    playSound('win');
                    setNumColors(n => n + 1);
                    setSequence([]);
                }
                setTimeout(() => addToSequence(), 1000);
            } else {
                setUserStep(u => u + 1);
            }
        } else {
            playSound('wrong');
            if (!isDaily) onComplete(score * 10);
            else {
                // In daily mode, maybe restart sequence?
                setSequence([]);
                setScore(0);
                setTimeout(() => addToSequence(), 1000);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="absolute top-4 flex justify-between w-full px-8 items-center">
                {isDaily && (
                    <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                        <Target size={20} /> Misión: {score} / {dailyTarget}
                    </div>
                )}
                <div className="text-2xl font-bold text-green-600">Secuencia: {score}</div>
            </div>
            <h2 className="text-2xl font-bold mb-8 text-slate-600">SIGUE EL RITMO</h2>
            <div className={`grid gap-4 ${numColors > 4 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                {activeColors.map(c => (
                    <button
                        key={c.id}
                        onClick={() => handleTap(c)}
                        className={`
               w-24 h-24 rounded-3xl border-b-8 transition-all duration-100 shadow-xl 
               ${c.class} 
               ${flash === c.id ? 'brightness-150 scale-105 border-b-0 translate-y-2' : ''}
               active:border-b-0 active:translate-y-2
            `}
                    />
                ))}
            </div>
        </div>
    );
};

export default MemorySimon;
