import React, { useState, useEffect } from 'react';
import { Heart, Target } from 'lucide-react';
import { playSound } from '../../utils/audio';
import ModernAsset from '../../components/ui/ModernAsset';
import Confetti from '../../components/ui/Confetti';

const MemoryMatch = ({ onComplete, isDaily }) => {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [isWon, setIsWon] = useState(false);
    const [lives, setLives] = useState(20);

    const initGame = (lvl) => {
        const icons = ['apple', 'cat', 'dog', 'car', 'sun', 'star', 'fish', 'bird'];
        const numPairs = lvl === 1 ? 4 : lvl === 2 ? 6 : 8;
        const selectedIcons = icons.slice(0, numPairs);
        const deck = [...selectedIcons, ...selectedIcons]
            .sort(() => Math.random() - 0.5)
            .map((icon, id) => ({ id, icon }));

        setCards(deck);
        setFlipped([]);
        setMatched([]);
        setIsWon(false);
        setLives(20); // Regenerate lives on new game/level
    };

    useEffect(() => { initGame(level); }, [level]);

    const handleCardClick = (id) => {
        if (flipped.length === 2 || flipped.includes(id) || matched.includes(id) || lives <= 0) return;

        playSound('flip');
        const newFlipped = [...flipped, id];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            const id1 = newFlipped[0];
            const id2 = newFlipped[1];
            const card1 = cards.find(c => c.id === id1);
            const card2 = cards.find(c => c.id === id2);

            if (card1.icon === card2.icon) {
                playSound('correct');
                setMatched(prev => [...prev, id1, id2]);
                setFlipped([]);
                setScore(s => s + 10);

                if (matched.length + 2 === cards.length) {
                    setIsWon(true);
                    playSound('win');
                    setTimeout(() => {
                        // In Daily Mode, winning one board is enough
                        if (isDaily) {
                            onComplete(score + 100);
                        } else {
                            if (level < 3) setLevel(l => l + 1);
                            else onComplete(score + 100);
                        }
                    }, 2000);
                }
            } else {
                playSound('wrong');
                setLives(prev => {
                    const newLives = prev - 1;
                    if (newLives <= 0) {
                        setTimeout(() => {
                            playSound('gameover');
                            onComplete(score);
                        }, 1000);
                    }
                    return newLives;
                });
                setTimeout(() => { setFlipped([]); }, 1000);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full">
            {isWon && <Confetti />}
            <div className="absolute top-4 flex justify-between w-full px-8 items-center">
                <div className="flex gap-1 flex-wrap max-w-[50%]">
                    {[...Array(20)].map((_, i) => (
                        <Heart key={i} fill={i < lives ? "#ef4444" : "#e2e8f0"} color={i < lives ? "#ef4444" : "#cbd5e1"} className={`w-3 h-3 md:w-5 md:h-5 transition-all ${i < lives ? 'animate-pulse' : ''}`} />
                    ))}
                </div>
                {isDaily && <div className="text-xl font-bold text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full"><Target className="inline w-4 h-4" /> ¡Completa!</div>}
                <div className="text-2xl font-bold text-green-600">Puntos: {score}</div>
            </div>
            <h2 className="text-2xl font-bold mb-6 text-slate-600">ENCUENTRA LOS PARES</h2>
            <div className={`grid gap-3 ${cards.length <= 12 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                {cards.map(card => {
                    const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
                    return (
                        <button key={card.id} onClick={() => handleCardClick(card.id)} className={`w-20 h-24 rounded-xl border-4 transition-all duration-300 transform perspective-1000 ${isFlipped ? 'bg-white border-blue-300 rotate-y-180' : 'bg-blue-500 border-blue-700'} shadow-lg`}>
                            {isFlipped ? <div className="flex items-center justify-center h-full animate-pop"><ModernAsset type={card.icon} size={10} /></div> : <div className="flex items-center justify-center h-full text-white font-bold text-2xl">?</div>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MemoryMatch;
