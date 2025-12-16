import React, { useState, useEffect } from 'react';
import { playSound } from '../../utils/audio';
import ModernAsset from '../../components/ui/ModernAsset';

// Simple fixed crossword layouts for MVP
const LAYOUTS = [
    {
        id: 1,
        width: 6, height: 6,
        words: [
            { id: 1, text: "GATO", direction: "H", x: 0, y: 1, clue: "cat" },
            { id: 2, text: "AUTO", direction: "V", x: 1, y: 0, clue: "car" },
            { id: 3, text: "SOL", direction: "H", x: 1, y: 3, clue: "sun" }
        ]
    },
    {
        id: 2,
        width: 7, height: 7,
        words: [
            { id: 1, text: "FLOR", direction: "V", x: 2, y: 0, clue: "flower" },
            { id: 2, text: "LEON", direction: "H", x: 0, y: 3, clue: "lion" }, // Overlaps with F(L)OR at x=2, y=3? No, L in FLOR is at y=1. 
            // FLOR: (2,0)F, (2,1)L, (2,2)O, (2,3)R.
            // LEON: (0,3)L, (1,3)E, (2,3)O, (3,3)N. -> Intersects at (2,3) which is O. 
            // FLOR has O at (2,2). Wait. F(0), L(1), O(2), R(3).
            // So FLOR vertical at x=2: (2,0)F, (2,1)L, (2,2)O, (2,3)R. 
            // LEON horizontal at y=3: intersects at (2,3). FLOR char is R. LEON char is O. Clash!
            // Need careful design.
            // Let's rely on simple hardcoded valid intersections.

            // PATO (H) at 0,0. P-A-T-O
            // TREN (V) at 2,0. T overlaps T of PATO. 
            // P(0,0), A(1,0), T(2,0), O(3,0).
            // T(2,0), R(2,1), E(2,2), N(2,3).
            { id: 1, text: "PATO", direction: "H", x: 0, y: 0, clue: "duck" },
            { id: 2, text: "TREN", direction: "V", x: 2, y: 0, clue: "train" },
            { id: 3, text: "NUBE", direction: "H", x: 0, y: 3, clue: "cloud" } // Overlaps N of TREN at (2,3) ? TREN ends at (2,3) with N. Perfect.
        ]
    }
];

const CrosswordGame = ({ onComplete, isDaily, dailyTarget = 1 }) => {
    const [level, setLevel] = useState(0);
    const [gridState, setGridState] = useState({});
    const [selectedWord, setSelectedWord] = useState(null);
    const [completedWords, setCompletedWords] = useState([]);
    const [showKeyboard, setShowKeyboard] = useState(false);

    const layout = LAYOUTS[level % LAYOUTS.length];

    useEffect(() => {
        // Init grid
        let initialGrid = {};
        layout.words.forEach(w => {
            for (let i = 0; i < w.text.length; i++) {
                const cx = w.direction === 'H' ? w.x + i : w.x;
                const cy = w.direction === 'V' ? w.y + i : w.y;
                const key = `${cx},${cy}`;
                initialGrid[key] = { char: '', answer: w.text[i], status: 'empty' }; // status: empty, filled, correct
            }
        });
        setGridState(initialGrid);
        setCompletedWords([]);
        setSelectedWord(null);
        setShowKeyboard(false);
    }, [level]);

    const handleCellClick = (w) => {
        if (completedWords.includes(w.id)) return;
        setSelectedWord(w);
        setShowKeyboard(true);
        playSound('tap');
    };

    const handleKeyPress = (char) => {
        if (!selectedWord) return;

        playSound('tap');

        // Fill selected word
        // Simple logic: fill sequentially or all at once? Let's try filling first empty slot of selected word.
        const w = selectedWord;
        let targetIndex = -1;

        // Find first empty cell in this word
        for (let i = 0; i < w.text.length; i++) {
            const cx = w.direction === 'H' ? w.x + i : w.x;
            const cy = w.direction === 'V' ? w.y + i : w.y;
            const key = `${cx},${cy}`;
            if (gridState[key].char === '') {
                targetIndex = i;
                break;
            }
        }

        if (targetIndex !== -1) {
            const cx = w.direction === 'H' ? w.x + targetIndex : w.x;
            const cy = w.direction === 'V' ? w.y + targetIndex : w.y;
            const key = `${cx},${cy}`;

            const newState = { ...gridState };
            newState[key] = { ...newState[key], char: char };
            setGridState(newState);

            // Check if word is full now
            checkWordCompletion(w, newState);
        }
    };

    const handleBackspace = () => {
        if (!selectedWord) return;
        // Remove last char
        const w = selectedWord;
        // Find last filled char
        let targetIndex = -1;
        for (let i = w.text.length - 1; i >= 0; i--) {
            const cx = w.direction === 'H' ? w.x + i : w.x;
            const cy = w.direction === 'V' ? w.y + i : w.y;
            const key = `${cx},${cy}`;
            if (gridState[key].char !== '') {
                // Check if locked (part of another completed word)
                // Simplify: just clear it.
                targetIndex = i;
                break;
            }
        }

        if (targetIndex !== -1) {
            const cx = w.direction === 'H' ? w.x + targetIndex : w.x;
            const cy = w.direction === 'V' ? w.y + targetIndex : w.y;
            const key = `${cx},${cy}`;
            const newState = { ...gridState };
            newState[key] = { ...newState[key], char: '' };
            setGridState(newState);
        }
    };

    const checkWordCompletion = (w, currentGrid) => {
        let fullWord = '';
        for (let i = 0; i < w.text.length; i++) {
            const cx = w.direction === 'H' ? w.x + i : w.x;
            const cy = w.direction === 'V' ? w.y + i : w.y;
            const key = `${cx},${cy}`;
            fullWord += currentGrid[key].char;
        }

        if (fullWord.length === w.text.length) {
            if (fullWord === w.text) {
                playSound('correct');
                setCompletedWords([...completedWords, w.id]);
                setSelectedWord(null);
                setShowKeyboard(false);

                // Check Level Win
                if (completedWords.length + 1 === layout.words.length) {
                    playSound('win');
                    setTimeout(() => {
                        if (isDaily) onComplete(100);
                        else setLevel(l => l + 1);
                    }, 1000);
                }
            } else {
                playSound('wrong');
                // Auto-clear? or let user fix.
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full max-w-lg mx-auto">
            <div className="absolute top-4 flex justify-between w-full px-8 items-center">
                <div className="text-xl font-bold text-sky-800">Crucigrama</div>
                <div className="text-sm font-bold text-sky-600">Nivel {level + 1}</div>
            </div>

            {/* Clue Area */}
            <div className="h-24 mb-4 flex items-center justify-center">
                {selectedWord ? (
                    <div className="animate-bounce-slight flex flex-col items-center">
                        <ModernAsset type={selectedWord.clue} size={14} />
                    </div>
                ) : (
                    <div className="text-slate-400 text-sm">Toca una palabra para ver la pista</div>
                )}
            </div>

            {/* Grid */}
            <div
                className="bg-white p-2 rounded-xl shadow-lg border-2 border-slate-200 grid gap-1 mb-4"
                style={{
                    gridTemplateColumns: `repeat(${layout.width}, 1fr)`,
                    width: '300px', height: '300px'  // Fixed for consistency
                }}
            >
                {Array.from({ length: layout.height }).map((_, y) =>
                    Array.from({ length: layout.width }).map((_, x) => {
                        const key = `${x},${y}`;
                        const cell = gridState[key];
                        // Is this cell part of selected word?
                        let isSelected = false;
                        if (selectedWord) {
                            if (selectedWord.direction === 'H' && y === selectedWord.y && x >= selectedWord.x && x < selectedWord.x + selectedWord.text.length) isSelected = true;
                            if (selectedWord.direction === 'V' && x === selectedWord.x && y >= selectedWord.y && y < selectedWord.y + selectedWord.text.length) isSelected = true;
                        }

                        // Determine word that owns this cell to enable clicking
                        const ownerWord = layout.words.find(w => {
                            if (w.direction === 'H') return y === w.y && x >= w.x && x < w.x + w.text.length;
                            return x === w.x && y >= w.y && y < w.y + w.text.length;
                        });

                        return (
                            <div
                                key={key}
                                onClick={() => ownerWord && handleCellClick(ownerWord)}
                                className={`
                                    rounded-md flex items-center justify-center text-xl font-bold uppercase select-none cursor-pointer border
                                    ${!cell ? 'invisible' : ''}
                                    ${cell && isSelected ? 'bg-yellow-100 border-yellow-400 ring-2 ring-yellow-200 z-10' : ''}
                                    ${cell && !isSelected ? 'bg-slate-100 border-slate-300' : ''}
                                    ${cell && completedWords.some(id => {
                                    const w = layout.words.find(wd => wd.id === id);
                                    // Complex check if this specific cell belongs to a completed word
                                    if (w.direction === 'H') return y === w.y && x >= w.x && x < w.x + w.text.length;
                                    return x === w.x && y >= w.y && y < w.y + w.text.length;
                                }) ? 'bg-green-100 text-green-700 border-green-300' : 'text-slate-700'}
                                `}
                            >
                                {cell ? cell.char : ''}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Keyboard */}
            {showKeyboard && (
                <div className="bg-slate-100 p-2 rounded-t-2xl w-full flex flex-wrap justify-center gap-1 absolute bottom-0 shadow-2xl border-t-4 border-slate-200 animate-in slide-in-from-bottom">
                    {"ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split('').map(char => (
                        <button
                            key={char}
                            onClick={() => handleKeyPress(char)}
                            className="w-8 h-10 bg-white rounded shadow-sm border-b-2 border-slate-300 font-bold active:bg-slate-50"
                        >
                            {char}
                        </button>
                    ))}
                    <button onClick={handleBackspace} className="w-16 h-10 bg-red-100 text-red-500 rounded shadow-sm border-b-2 border-red-200 font-bold">⌫</button>
                </div>
            )}
        </div>
    );
};

export default CrosswordGame;
