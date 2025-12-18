import React, { useState, useEffect } from 'react';
import { Heart, Target, Save } from 'lucide-react';
import { playSound } from '../../utils/audio';
import ModernAsset from '../../components/ui/ModernAsset';
import Confetti from '../../components/ui/Confetti';
import { getActiveProfile, updateProfile } from '../../utils/userStorage';
import { WORD_DB_ES } from '../../data/db'; // Import word DB for variety

const MemoryMatch = ({ onComplete, isDaily }) => {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [isWon, setIsWon] = useState(false);
    const [lives, setLives] = useState(20);

    // Load progress on mount
    useEffect(() => {
        if (!isDaily) {
            const profile = getActiveProfile();
            if (profile?.gameProgress?.memoryLevel) {
                setLevel(profile.gameProgress.memoryLevel);
            }
        }
    }, [isDaily]);

    const initGame = (lvl) => {
        // Use expanded dictionary for variety
        const allIcons = WORD_DB_ES.map(w => w.icon);
        // Shuffle and pick needed amount
        const icons = allIcons.sort(() => Math.random() - 0.5);

        const numPairs = lvl === 1 ? 4 : lvl === 2 ? 6 : Math.min(6 + Math.ceil((lvl - 2) / 2) * 2, 12); // Scale up to 12 pairs
        const selectedIcons = icons.slice(0, numPairs);

        // Safety fallback if not enough unique icons
        if (selectedIcons.length < numPairs) {
            const extra = Array(numPairs - selectedIcons.length).fill('star');
            selectedIcons.push(...extra);
        }

        const deck = [...selectedIcons, ...selectedIcons]
            .sort(() => Math.random() - 0.5)
            .map((icon, id) => ({ id, icon }));

        setCards(deck);
        setFlipped([]);
        setMatched([]);
        setIsWon(false);
        setLives(20);
    };

    useEffect(() => { initGame(level); }, [level]);

    const saveProgress = (nextLevel) => {
        if (!isDaily) {
            const profile = getActiveProfile();
            if (profile) {
                updateProfile({
                    gameProgress: {
                        ...profile.gameProgress,
                        memoryLevel: nextLevel
                    }
                });
            }
        }
    };

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
                        if (isDaily) {
                            onComplete(score + 100);
                        } else {
                            const nextLevel = level + 1;
                            setLevel(nextLevel);
                            saveProgress(nextLevel);
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
                            // Resume logic: Don't clear level, just exit.
                            // User can restart and useEffect will pick up saved level.
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
            <div className="absolute top-4 flex justify-between w-full px-8 items-center bg-white/80 p-2 rounded-xl backdrop-blur-sm shadow-sm md:top-2">
                <div className="flex gap-2 items-center">
                    <span className="font-bold text-slate-500">Nivel {level}</span>
                    {!isDaily && <Save size={16} className="text-slate-400" />}
                </div>
                <div className="flex gap-1 flex-wrap max-w-[40%] justify-center">
                    {[...Array(lives)].map((_, i) => (
                        <Heart key={i} fill="#ef4444" color="#ef4444" className="w-3 h-3" />
                    ))}
                    {lives < 20 && <span className="text-xs text-slate-400">...</span>}
                </div>
                {isDaily && <div className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full"><Target className="inline w-3 h-3" /> Meta</div>}
                <div className="text-xl font-bold text-green-600">{score}</div>
            </div>

            <h2 className="text-xl md:text-2xl font-bold mb-4 mt-12 text-slate-600">ENCUENTRA LOS PARES</h2>
            <div className={`grid gap-2 md:gap-4 p-2 overflow-auto max-h-[70vh] ${cards.length <= 12 ? 'grid-cols-3 md:grid-cols-4' : 'grid-cols-4 md:grid-cols-5'}`}>
                {cards.map(card => {
                    const isFlipped = flipped.includes(card.id) || matched.includes(card.id);
                    return (
                        <button key={card.id} onClick={() => handleCardClick(card.id)} className={`w-16 h-20 md:w-20 md:h-24 rounded-xl border-4 transition-all duration-300 transform perspective-1000 ${isFlipped ? 'bg-white border-blue-300 rotate-y-180' : 'bg-blue-500 border-blue-700'} shadow-lg`}>
                            {isFlipped ? <div className="flex items-center justify-center h-full animate-pop"><ModernAsset type={card.icon} size={8} /></div> : <div className="flex items-center justify-center h-full text-white font-bold text-2xl">?</div>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default MemoryMatch;
