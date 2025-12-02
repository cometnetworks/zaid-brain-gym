import React, { useState, useEffect } from 'react';
import { playSound } from '../../utils/audio';
import { STORY_DB } from '../../data/db';

const StoryTime = ({ onComplete }) => {
    const [timeLeft, setTimeLeft] = useState(60);
    const [score, setScore] = useState(0);
    const [currentStory, setCurrentStory] = useState(null);
    const [step, setStep] = useState('read');
    const [usedStories, setUsedStories] = useState([]);

    useEffect(() => {
        pickStory();
        const timer = setInterval(() => setTimeLeft(t => t <= 1 ? (clearInterval(timer), 0) : t - 1), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => { if (timeLeft === 0) onComplete(score * 10); }, [timeLeft]);

    const pickStory = () => {
        let pool = STORY_DB.filter(s => !usedStories.includes(s.title));
        if (pool.length === 0) { setUsedStories([]); pool = STORY_DB; }
        const s = pool[Math.floor(Math.random() * pool.length)];
        setCurrentStory(s);
        setUsedStories(prev => [...prev, s.title]);
        setStep('read');
    };

    const handleAnswer = (ans) => {
        if (ans === currentStory.a) {
            playSound('correct');
            setScore(s => s + 1);
            pickStory();
        } else {
            playSound('wrong');
        }
    };

    if (!currentStory) return null;

    if (step === 'read') {
        return (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <div className="absolute top-4 right-4 text-2xl font-mono bg-slate-100 p-2 rounded">⏱️ {timeLeft}s</div>
                <div className="bg-yellow-50 p-6 rounded-3xl border-4 border-yellow-200 shadow-xl max-w-md animate-fade-in">
                    <h3 className="text-xl font-bold text-yellow-800 mb-2">{currentStory.title}</h3>
                    <p className="text-xl text-slate-700 leading-relaxed mb-4">{currentStory.text}</p>
                    <button onClick={() => { playSound('pop'); setStep('quiz'); }} className="bg-green-500 text-white px-8 py-3 rounded-full font-bold text-xl shadow-lg hover:scale-105 active:scale-95 transition-transform">
                        ¡Listo, a preguntar!
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full gap-8 text-center">
            <div className="absolute top-4 right-4 text-2xl font-mono bg-slate-100 p-2 rounded">⏱️ {timeLeft}s</div>
            <h2 className="text-2xl font-bold text-slate-700 px-4">{currentStory.q}</h2>
            <div className="grid grid-cols-2 gap-6">
                {currentStory.opts.map(opt => (
                    <button key={opt} onClick={() => handleAnswer(opt)} className="bg-blue-500 text-white w-32 h-32 rounded-2xl font-bold text-xl shadow-lg hover:scale-105 active:scale-95 transition-transform">
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default StoryTime;
