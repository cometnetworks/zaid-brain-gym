import React, { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import { playSound } from '../../utils/audio';
import ModernAsset from '../../components/ui/ModernAsset';

const OddOneOut = ({ onComplete, isDaily, dailyTarget = 5 }) => {
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

    useEffect(() => { generateLevel(); }, [level]);

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
            if (!isDaily) onComplete(streak * 10);
        }
    };

    const gridClass = items.length <= 4 ? 'grid-cols-2' : items.length <= 9 ? 'grid-cols-3' : 'grid-cols-4';

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="absolute top-4 flex justify-between w-full px-8 items-center">
                {isDaily ? (
                    <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                        <Target size={20} /> Misión: {streak} / {dailyTarget}
                    </div>
                ) : (
                    <div className="text-xl font-bold text-slate-500">Nivel {level}</div>
                )}
                <div className="text-2xl font-bold text-green-600">Racha: {streak}</div>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-slate-600 text-center">
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
    );
};

export default OddOneOut;
