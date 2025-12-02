import React, { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import { playSound } from '../../utils/audio';
import ModernAsset from '../../components/ui/ModernAsset';

const OddOneOut = ({ onComplete, isDaily, dailyTarget = 5 }) => {
    const [streak, setStreak] = useState(0);
    const [level, setLevel] = useState(1);
    const [items, setItems] = useState([]);
    const [oddIndex, setOddIndex] = useState(0);

    const generateLevel = () => {
        const currentGrid = level < 2 ? 4 : level < 4 ? 9 : 16;
        const icons = [{ main: 'apple', odd: 'star' }, { main: 'dog', odd: 'cat' }, { main: 'car', odd: 'sun' }, { main: 'sun', odd: 'flower' }, { main: 'fish', odd: 'bird' }];
        const theme = icons[Math.floor(Math.random() * icons.length)];
        const newItems = Array(currentGrid).fill(theme.main);
        const idx = Math.floor(Math.random() * currentGrid);
        newItems[idx] = theme.odd;
        setItems(newItems);
        setOddIndex(idx);
    };

    useEffect(() => { generateLevel(); }, [level]);

    const handleClick = (idx) => {
        if (idx === oddIndex) {
            playSound('correct');
            const newStreak = streak + 1;
            setStreak(newStreak);

            // Daily Goal Check
            if (isDaily && newStreak >= dailyTarget) {
                playSound('win');
                onComplete(newStreak * 10);
                return;
            }

            if (newStreak % 10 === 0) setLevel(l => l + 1);
            generateLevel();
        } else {
            playSound('wrong');
            if (!isDaily) onComplete(streak * 10); // Arcade mode ends on fail
        }
    };

    const gridClass = items.length === 4 ? 'grid-cols-2' : items.length === 9 ? 'grid-cols-3' : 'grid-cols-4';

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="absolute top-4 flex justify-between w-full px-8 items-center">
                {isDaily ? (
                    <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold flex items-center gap-2">
                        <Target size={20} /> Misión: {streak} / {dailyTarget}
                    </div>
                ) : (
                    <div className="text-xl font-bold text-slate-500">Nivel {Math.floor(streak / 10) + 1}</div>
                )}
                <div className="text-2xl font-bold text-green-600">Racha: {streak}</div>
            </div>
            <h2 className="text-2xl font-bold mb-8 text-slate-600">ENCUENTRA EL DIFERENTE</h2>
            <div className={`grid gap-4 ${gridClass}`}>
                {items.map((item, i) => (
                    <button key={i} onClick={() => handleClick(i)} className="w-20 h-20 bg-white rounded-2xl shadow-md border-b-4 border-slate-200 active:border-b-0 active:translate-y-1 hover:bg-blue-50 flex items-center justify-center transition-all">
                        <ModernAsset type={item} size={10} />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default OddOneOut;
