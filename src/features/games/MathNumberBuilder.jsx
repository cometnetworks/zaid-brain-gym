import React, { useState, useEffect } from 'react';
import { playSound } from '../../utils/audio';

const MathNumberBuilder = ({ onComplete, isDaily, dailyTarget = 100 }) => {
    const [target, setTarget] = useState(10);
    const [grid, setGrid] = useState([]);
    const [selected, setSelected] = useState(null); // Index of first selected
    const [score, setScore] = useState(0);
    const [matchesFound, setMatchesFound] = useState(0);

    // Level config
    const [level, setLevel] = useState(1);

    const generateGrid = (targetSum) => {
        // We need pairs that sum to targetSum.
        // Grid size 4x3 = 12 items (6 pairs)
        let pairs = [];
        for (let i = 0; i < 6; i++) {
            let a = Math.floor(Math.random() * (targetSum)); // 0 to target-1 (avoid 0 if we want strictly positive, but 0+10 is valid logic)
            // Let's stick to 1 to target-1
            a = Math.floor(Math.random() * (targetSum - 1)) + 1;
            let b = targetSum - a;
            pairs.push(a);
            pairs.push(b);
        }

        // Shuffle
        return pairs.map((val, id) => ({ val, id: Math.random(), status: 'active' })).sort(() => 0.5 - Math.random());
    };

    useEffect(() => {
        // Levels: 1-> Sum 5, 2-> Sum 10, 3-> Sum 20? 
        const t = level === 1 ? 5 : level === 2 ? 8 : 10;
        setTarget(t);
        setGrid(generateGrid(t));
        setMatchesFound(0);
    }, [level]);

    const handleSelect = (index) => {
        if (grid[index].status === 'matched') return;

        if (selected === null) {
            // Select first
            setSelected(index);
            playSound('tap');
        } else {
            if (index === selected) {
                // Deselect
                setSelected(null);
                return;
            }

            // Check match
            const valA = grid[selected].val;
            const valB = grid[index].val;

            if (valA + valB === target) {
                // Match!
                playSound('correct');
                const newGrid = [...grid];
                newGrid[selected].status = 'matched';
                newGrid[index].status = 'matched';
                setGrid(newGrid);
                setScore(s => s + 20);
                setSelected(null);

                const newMatches = matchesFound + 1;
                setMatchesFound(newMatches);

                if (newMatches >= 6) { // All cleared
                    playSound('win');
                    setTimeout(() => {
                        if (isDaily && score >= dailyTarget) {
                            onComplete(score);
                        } else {
                            setLevel(l => l + 1);
                        }
                    }, 1000);
                }
            } else {
                // Wrong
                playSound('wrong');
                setSelected(null);
                // Maybe shake effect?
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full gap-6">
            <div className="flex justify-between w-full px-8 items-center">
                <div className="text-2xl font-black text-slate-700">Nivel {level}</div>
                <div className="bg-purple-100 px-6 py-2 rounded-full text-purple-800 font-bold border-2 border-purple-200">
                    Puntos: {score}
                </div>
            </div>

            <div className="text-center mb-4">
                <div className="text-slate-500 font-medium">Encuentra parejas que sumen</div>
                <div className="text-6xl font-black text-purple-600 drop-shadow-sm">{target}</div>
            </div>

            <div className="grid grid-cols-4 gap-3 p-4 bg-slate-100 rounded-3xl shadow-inner w-full max-w-lg">
                {grid.map((item, i) => (
                    <button
                        key={item.id}
                        onClick={() => handleSelect(i)}
                        disabled={item.status === 'matched'}
                        className={`h-20 rounded-2xl text-3xl font-bold transition-all transform duration-300
                            ${item.status === 'matched'
                                ? 'opacity-0 scale-0'
                                : selected === i
                                    ? 'bg-purple-500 text-white scale-110 shadow-lg ring-4 ring-purple-200'
                                    : 'bg-white text-slate-700 shadow-md hover:scale-105 active:scale-95'
                            }
                        `}
                    >
                        {item.val}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MathNumberBuilder;
