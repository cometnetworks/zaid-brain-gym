import React, { useState, useEffect } from 'react';
import { playSound } from '../../utils/audio';
import { CROSSWORD_LAYOUTS } from '../../data/db';

const CrosswordGame = ({ onComplete, isDaily, dailyTarget = 1 }) => {
    const [level, setLevel] = useState(0);
    const [gridState, setGridState] = useState({});
    const [selectedWord, setSelectedWord] = useState(null);
    const [completedWords, setCompletedWords] = useState([]);
    const [showKeyboard, setShowKeyboard] = useState(false);

    // Loop through available layouts
    const layout = CROSSWORD_LAYOUTS[level % CROSSWORD_LAYOUTS.length];

    useEffect(() => {
        // Init grid
        let initialGrid = {};
        layout.words.forEach(w => {
            for (let i = 0; i < w.text.length; i++) {
                const cx = w.direction === 'H' ? w.x + i : w.x;
                const cy = w.direction === 'V' ? w.y + i : w.y;
                const key = `${cx},${cy}`;
                // Keep correct answer for validation
                // If collision (shared char), valid answer should be same
                initialGrid[key] = { char: '', answer: w.text[i], status: 'empty' };
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

        // Fill selected word first empty slot
        const w = selectedWord;
        let targetIndex = -1;

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
        const w = selectedWord;

        // Find last filled char
        let targetIndex = -1;
        for (let i = w.text.length - 1; i >= 0; i--) {
            const cx = w.direction === 'H' ? w.x + i : w.x;
            const cy = w.direction === 'V' ? w.y + i : w.y;
            const key = `${cx},${cy}`;
            if (gridState[key].char !== '') {
                // Simplified: Allow clearing any non-completed cell
                if (!isCellLocked(key, gridState)) {
                    targetIndex = i;
                    break;
                }
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

    // Check if cell belongs to an already completed word
    const isCellLocked = (key, currentGrid) => {
        // Ideally we check if this specific cell coordinate is part of a word ID in completedWords
        // For MVP, if it intersects, we might clear it if we are not careful. 
        // Let's assume user accepts re-typing if they made a mistake on a crossing word.
        return false;
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
                const newCompleted = [...completedWords, w.id];
                setCompletedWords(newCompleted);
                setSelectedWord(null);
                setShowKeyboard(false);

                // Check Level Win
                if (newCompleted.length === layout.words.length) {
                    playSound('win');
                    setTimeout(() => {
                        if (isDaily) onComplete(100);
                        else setLevel(l => l + 1);
                    }, 1500);
                }
            } else {
                playSound('wrong');
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full max-w-lg mx-auto gap-4">
            <div className="absolute top-4 flex justify-between w-full px-8 items-center">
                <div className="text-xl font-bold text-sky-800">Crucigrama</div>
                <div className="text-sm font-bold text-sky-600">Nivel {level + 1}</div>
            </div>

            {/* Clue Area - Enhanced with Sentence */}
            <div className="min-h-[100px] w-full px-4 flex items-center justify-center">
                {selectedWord ? (
                    <div className="animate-in fade-in zoom-in duration-300 bg-yellow-50 p-6 rounded-2xl border-4 border-yellow-200 shadow-md text-center max-w-sm">
                        <p className="text-xl font-bold text-slate-700 leading-relaxed">
                            {selectedWord.clue.split('_____').map((part, i) => (
                                <React.Fragment key={i}>
                                    {part}
                                    {i === 0 && <span className="inline-block w-20 border-b-4 border-slate-400 mx-1"></span>}
                                </React.Fragment>
                            ))}
                        </p>
                    </div>
                ) : (
                    <div className="text-slate-400 text-lg font-medium italic animate-pulse">
                        👆 Toca una palabra para empezar
                    </div>
                )}
            </div>

            {/* Grid */}
            <div
                className="bg-white p-4 rounded-3xl shadow-2xl border-4 border-slate-100 grid gap-2"
                style={{
                    gridTemplateColumns: `repeat(${layout.width}, 1fr)`,
                    width: Math.min(window.innerWidth - 40, 320) + 'px',
                    aspectRatio: '1/1'
                }}
            >
                {Array.from({ length: layout.height }).map((_, y) =>
                    Array.from({ length: layout.width }).map((_, x) => {
                        const key = `${x},${y}`;
                        const cell = gridState[key];
                        // Select Logic
                        let isSelected = false;
                        if (selectedWord) {
                            if (selectedWord.direction === 'H' && y === selectedWord.y && x >= selectedWord.x && x < selectedWord.x + selectedWord.text.length) isSelected = true;
                            if (selectedWord.direction === 'V' && x === selectedWord.x && y >= selectedWord.y && y < selectedWord.y + selectedWord.text.length) isSelected = true;
                        }

                        // Owner Logic
                        const ownerWord = layout.words.find(w => {
                            if (w.direction === 'H') return y === w.y && x >= w.x && x < w.x + w.text.length;
                            return x === w.x && y >= w.y && y < w.y + w.text.length;
                        });

                        return (
                            <div
                                key={key}
                                onClick={() => ownerWord && handleCellClick(ownerWord)}
                                className={`
                                    rounded-xl flex items-center justify-center text-2xl font-black uppercase select-none cursor-pointer transition-all
                                    ${!cell ? 'invisible' : ''}
                                    ${cell && isSelected ? 'bg-yellow-200 border-2 border-yellow-400 scale-105 z-10 shadow-lg' : ''}
                                    ${cell && !isSelected ? 'bg-slate-100 border-2 border-slate-200' : ''}
                                    ${cell && completedWords.some(id => {
                                    const w = layout.words.find(wd => wd.id === id);
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
                <div className="bg-slate-200 p-3 rounded-t-3xl w-full flex flex-wrap justify-center gap-1.5 absolute bottom-0 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-50 animate-in slide-in-from-bottom duration-300">
                    {"ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split('').map(char => (
                        <button
                            key={char}
                            onClick={() => handleKeyPress(char)}
                            className="w-8 h-12 bg-white rounded-lg shadow-sm border-b-4 border-slate-300 font-bold text-slate-600 active:bg-slate-100 active:border-b-0 active:translate-y-1 transition-all"
                        >
                            {char}
                        </button>
                    ))}
                    <button onClick={handleBackspace} className="w-16 h-12 bg-rose-100 text-rose-500 rounded-lg shadow-sm border-b-4 border-rose-200 font-bold active:border-b-0 active:translate-y-1">⌫</button>
                </div>
            )}
        </div>
    );
};

export default CrosswordGame;
