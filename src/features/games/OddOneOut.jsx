import React, { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import { playSound } from '../../utils/audio';
import ModernAsset from '../../components/ui/ModernAsset';

const OddOneOut = ({ onComplete, isDaily, dailyTarget = 5, history = [] }) => {
    const [gameState, setGameState] = useState('menu'); // menu, playing, end
    const [timerMode, setTimerMode] = useState(60); // 60 or 120 seconds
    const [timeLeft, setTimeLeft] = useState(60);
    const [streak, setStreak] = useState(0);
    const [level, setLevel] = useState(1);
    const [items, setItems] = useState([]);
    const [oddIndices, setOddIndices] = useState([]);

    const generateLevel = () => {
        // Difficulty scaling
        const extraDiff = Math.floor(level / 3);
        const numOdd = Math.min(1 + extraDiff, 3); // Max 3 different items

        const currentGrid = level < 2 ? 4 : level < 4 ? 9 : 16;

        // Ensure grid is big enough for odds
        const actualGrid = Math.max(currentGrid, numOdd + 3);

        const icons = [
            { main: 'apple', odd: 'star' }, { main: 'dog', odd: 'cat' },
            { main: 'car', odd: 'sun' }, { main: 'sun', odd: 'flower' },
            { main: 'fish', odd: 'bird' }, { main: 'tree', odd: 'flower' },
            { main: 'moon', odd: 'star' }
        ];
        const theme = icons[Math.floor(Math.random() * icons.length)];

        const newItems = Array(actualGrid).fill(theme.main);
        const newOddIndices = [];

        while (newOddIndices.length < numOdd) {
            const ra = Math.floor(Math.random() * actualGrid);
            if (!newOddIndices.includes(ra)) newOddIndices.push(ra);
        }

        newOddIndices.forEach(idx => {
            newItems[idx] = theme.odd;
        });

        setItems(newItems);
        setOddIndices(newOddIndices);
    };

    useEffect(() => { 
        if (gameState === 'playing') generateLevel(); 
    }, [level, gameState]);

    useEffect(() => {
        let timer;
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && gameState === 'playing') {
            setGameState('end');
            playSound('win');
        }
        return () => clearInterval(timer);
    }, [timeLeft, gameState]);

    const startGame = (seconds) => {
        playSound('pop');
        setTimerMode(seconds);
        setTimeLeft(seconds);
        setStreak(0);
        setLevel(1);
        setGameState('playing');
    };

    const handleClick = (idx) => {
        if (oddIndices.includes(idx)) {
            playSound('correct');
            // Remove this index from "to find" list locally for UI feedback or refresh immediately?
            // Requirement: "encuentre una o dos o tres diferentes"
            // Usually in these games, clicking one correct one finishes the round if it's "Find the Odd One", 
            // but if there are multiple, maybe we need to find ALL? 
            // "que encuentre una o dos o tres diferentes e la mayoria" -> Implies finding all of them?
            // Let's implement: Click any valid one to pass the round OR reduce count?
            // "en vez de que siga siendo solo una imagen distinta que encuentre una o dos o tres diferentes"
            // Usually implies finding the group. Let's try: Find ALL odd ones to advance.

            const remaining = oddIndices.filter(i => i !== idx);
            if (remaining.length === 0) {
                // All found
                const newStreak = streak + 1;
                setStreak(newStreak);
                if (isDaily && newStreak >= dailyTarget) {
                    playSound('win');
                    onComplete(newStreak * 10);
                    return;
                }
                if (newStreak % 5 === 0) setLevel(l => l + 1); // Faster scaling
                generateLevel();
            } else {
                // Still more to find
                setOddIndices(remaining);
                // Visually hide or change the found one? 
                // Let's replace the found icon with something else or keep it visible?
                // Simplest: Replace with main theme to "fix" it
                const newItems = [...items];
                newItems[idx] = 'check'; // Mark as found
                setItems(newItems);
            }

        } else {
            playSound('wrong');
            if (isDaily) {
                // If daily, maybe don't end immediately but reduce streak or something? 
                // Currently it ends. Let's keep it consistent but for non-daily timed mode
                // usually wrong click might dock time? 
                // Requirement: "cuantos puede identificar en ese tiempo"
                // Let's just dock 5 seconds for wrong click in timed mode
                if (gameState === 'playing') setTimeLeft(prev => Math.max(0, prev - 5));
            } else {
                setGameState('end');
                playSound('wrong');
            }
        }
    };

    const gridClass = items.length <= 4 ? 'grid-cols-2' : items.length <= 9 ? 'grid-cols-3' : 'grid-cols-4';

    if (gameState === 'menu') {
        return (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <Target size={64} className="text-green-500 mb-4 animate-pulse" />
                <h2 className="text-3xl font-black text-slate-700 mb-2">¡DESAFÍO DE ATENCIÓN!</h2>
                <p className="text-slate-500 mb-8 font-bold">Encuentra los objetos diferentes lo más rápido posible.</p>
                
                <div className="flex flex-col gap-4 w-full max-w-xs">
                    <button onClick={() => startGame(60)} className="bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg transition-all hover:scale-105">
                        RETO 1 MINUTO
                    </button>
                    <button onClick={() => startGame(120)} className="bg-indigo-500 hover:bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg transition-all hover:scale-105">
                        RETO 2 MINUTOS
                    </button>
                    <button onClick={() => { playSound('pop'); setGameState('playing'); setTimeLeft(999); }} className="text-slate-400 font-bold hover:text-slate-600">
                        MODO PRÁCTICA (Sin tiempo)
                    </button>
                </div>
            </div>
        );
    }

    if (gameState === 'end') {
        return (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="text-6xl mb-4">🏆</div>
                <h2 className="text-4xl font-black text-slate-700 mb-2">¡TIEMPO AGOTADO!</h2>
                <div className="text-5xl font-black text-green-500 mb-8">
                    {streak} <span className="text-2xl text-slate-400">PUNTOS</span>
                </div>

                {history.length > 0 && (
                    <div className="w-full max-w-xs mb-8 bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">Últimas Puntuaciones</h3>
                        <div className="flex flex-col gap-2">
                            {history.map((s, i) => (
                                <div key={i} className="flex justify-between items-center font-bold text-slate-600">
                                    <span>Juego {i + 1}</span>
                                    <span className="text-blue-500">{s} pts</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <button 
                    onClick={() => onComplete(streak * 10)} 
                    className="bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg transition-all hover:scale-105"
                >
                    CONTINUAR
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full relative">
            <div className="absolute top-4 flex justify-between w-full px-8 items-center z-10">
                {isDaily ? (
                    <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                        <Target size={20} /> Misión: {streak} / {dailyTarget}
                    </div>
                ) : (
                    <div className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 ${timeLeft < 10 ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-100 text-blue-800'}`}>
                        {timeLeft > 900 ? '∞' : `⏱️ ${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`}
                    </div>
                )}
                <div className="text-2xl font-bold text-green-600">Score: {streak}</div>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center w-full">
                <h2 className="text-2xl font-bold mb-6 text-slate-600 text-center">
                    ENCUENTRA {oddIndices.length} {oddIndices.length === 1 ? 'DIFERENTE' : 'DIFERENTES'}
                </h2>
                <div className={`grid gap-4 ${gridClass}`}>
                    {items.map((item, i) => (
                        <button key={i} onClick={() => handleClick(i)} disabled={item === 'check'} className={`w-20 h-20 rounded-2xl shadow-md border-b-4  transition-all flex items-center justify-center ${item === 'check' ? 'bg-green-100 border-green-200' : 'bg-white border-slate-200 hover:bg-blue-50 active:border-b-0 active:translate-y-1'}`}>
                            {item === 'check' ? <div className="text-green-500 font-bold">✓</div> : <ModernAsset type={item} size={10} />}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OddOneOut;
