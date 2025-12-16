import React, { useState, useEffect, useMemo } from 'react';
import { playSound } from '../../utils/audio';
import { WORD_DB_ES } from '../../data/db';
import { generateCrossword } from '../../utils/crosswordGen';

const CrosswordGame = ({ onComplete, isDaily, dailyTarget = 1, wordList = WORD_DB_ES, title = "Crucigrama" }) => {
    // Current level (starts at 1 for display)
    const [level, setLevel] = useState(1);
    const [gridState, setGridState] = useState({});
    const [selectedWord, setSelectedWord] = useState(null);
    const [completedWords, setCompletedWords] = useState([]);
    const [showKeyboard, setShowKeyboard] = useState(false);

    // Dynamic Layout State
    const [layout, setLayout] = useState(null);

    // Generate Layout on Level Change
    useEffect(() => {
        // Difficulty scaling:
        // Level 1-5: 3 words
        // Level 6-10: 4 words
        // Level 11+: 5 words (capped at 6 for screen size)

        let wordCount = 3;
        if (level > 5) wordCount = 4;
        if (level > 10) wordCount = 5;

        // Generate
        let attempts = 0;
        let newLayout = null;
        while (!newLayout && attempts < 10) {
            newLayout = generateCrossword(wordList, wordCount);
            attempts++;
        }

        // Fallback if generation fails (rare but possible with tight constraints)
        if (!newLayout) {
            // Fallback to minimal 3 words
            newLayout = generateCrossword(wordList, 3);
        }

        if (newLayout) {
            setLayout(newLayout);

            // Init Grid
            let initialGrid = {};
            newLayout.words.forEach(w => {
                for (let i = 0; i < w.text.length; i++) {
                    const cx = w.direction === 'H' ? w.x + i : w.x;
                    const cy = w.direction === 'V' ? w.y + i : w.y;
                    const key = `${cx},${cy}`;
                    initialGrid[key] = { char: '', answer: w.text[i], status: 'empty' };
                }
            });
            setGridState(initialGrid);
            setCompletedWords([]);
            setSelectedWord(null);
            setShowKeyboard(false);
        }
    }, [level, wordList]);

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
            if (gridState[key] && gridState[key].char === '') {
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
            if (gridState[key] && gridState[key].char !== '') {
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

    const isCellLocked = (key, currentGrid) => {
        return false;
    };

    const checkWordCompletion = (w, currentGrid) => {
        let fullWord = '';
        for (let i = 0; i < w.text.length; i++) {
            const cx = w.direction === 'H' ? w.x + i : w.x;
            const cy = w.direction === 'V' ? w.y + i : w.y;
            const key = `${cx},${cy}`;
            fullWord += currentGrid[key] ? currentGrid[key].char : '';
        }

        if (fullWord.length === w.text.length) {
            if (fullWord === w.text) {
                playSound('correct');
                const newCompleted = [...completedWords, w.id];
                setCompletedWords(newCompleted);
                setSelectedWord(null);
                setShowKeyboard(false);

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

    const handleHint = () => {
        if (!selectedWord) return;

        playSound('pop');
        const w = selectedWord;

        let newState = { ...gridState };
        for (let i = 0; i < w.text.length; i++) {
            const cx = w.direction === 'H' ? w.x + i : w.x;
            const cy = w.direction === 'V' ? w.y + i : w.y;
            const key = `${cx},${cy}`;
            newState[key] = { ...newState[key], char: w.text[i] };
        }
        setGridState(newState);
        checkWordCompletion(w, newState);
    };

    if (!layout) return <div className="flex h-full items-center justify-center text-xl font-bold text-slate-500 animate-pulse">Generando Crucigrama...</div>;

    // Calculate dynamic scaling for larger grids
    const maxDim = Math.max(layout.width, layout.height);
    const cellSize = maxDim > 8 ? 40 : 50; // Smaller cells for big grids

    return (
        <div className="flex flex-col items-center justify-center h-full w-full max-w-lg mx-auto gap-4">
            <div className="absolute top-4 flex justify-between w-full px-8 items-center">
                <div className="text-xl font-bold text-sky-800">Crucigrama</div>
                <div className="text-sm font-bold text-sky-600">Nivel {level}</div>
            </div>

            {/* Clue Area */}
            <div className="min-h-[100px] w-full px-4 flex items-center justify-center">
                {selectedWord ? (
                    <div
                        onClick={handleHint}
                        className="animate-in fade-in zoom-in duration-300 bg-yellow-50 p-4 rounded-2xl border-4 border-yellow-200 shadow-md text-center max-w-sm cursor-help hover:bg-yellow-100 transition-colors active:scale-95 group relative"
                    >
                        <div className="absolute top-1 right-2 text-[10px] text-yellow-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">💡 Ayuda</div>
                        <p className="text-lg font-bold text-slate-700 leading-relaxed">
                            {selectedWord.clue.split('_____').map((part, i) => (
                                <React.Fragment key={i}>
                                    {part}
                                    {i === 0 && <span className="inline-block w-16 border-b-4 border-slate-400 mx-1 text-slate-400 text-sm">{selectedWord.text.split('').map(() => '_').join(' ')}</span>}
                                </React.Fragment>
                            ))}
                        </p>
                    </div>
                ) : (
                    <div className="text-slate-400 text-lg font-medium italic animate-pulse">
                        👆 Toca una palabra
                    </div>
                )}
            </div>

            {/* Grid */}
            <div
                className="bg-white p-4 rounded-3xl shadow-2xl border-4 border-slate-100 grid gap-1 relative"
                style={{
                    gridTemplateColumns: `repeat(${layout.width}, 1fr)`,
                    width: 'auto',
                    maxWidth: '100%'
                }}
            >
                {Array.from({ length: layout.height }).map((_, y) =>
                    Array.from({ length: layout.width }).map((_, x) => {
                        const key = `${x},${y}`;
                        const cell = gridState[key];
                        let isSelected = false;
                        if (selectedWord) {
                            if (selectedWord.direction === 'H' && y === selectedWord.y && x >= selectedWord.x && x < selectedWord.x + selectedWord.text.length) isSelected = true;
                            if (selectedWord.direction === 'V' && x === selectedWord.x && y >= selectedWord.y && y < selectedWord.y + selectedWord.text.length) isSelected = true;
                        }

                        const ownerWord = layout.words.find(w => {
                            if (w.direction === 'H') return y === w.y && x >= w.x && x < w.x + w.text.length;
                            return x === w.x && y >= w.y && y < w.y + w.text.length;
                        });

                        return (
                            <div
                                key={key}
                                onClick={() => ownerWord && handleCellClick(ownerWord)}
                                style={{ width: cellSize, height: cellSize, fontSize: cellSize * 0.5 }}
                                className={`
                                    rounded-lg flex items-center justify-center font-black uppercase select-none cursor-pointer transition-all
                                    ${!cell ? 'invisible' : ''}
                                    ${cell && isSelected ? 'bg-yellow-200 border-2 border-yellow-400 scale-105 z-10 shadow-lg' : ''}
                                    ${cell && !isSelected ? 'bg-slate-100 border-2 border-slate-200' : ''}
                                    ${cell && completedWords.some(id => {
                                    const w = layout.words.find(wd => wd.id === id);
                                    if (w.direction === 'H') return y === w.y && x >= w.x && x < w.x + w.text.length;
                                    return x === w.x && y >= w.y && y < w.y + w.text.length;
                                }) ? 'bg-green-100 text-green-700 border-green-300' : 'text-slate-700'
                                    }
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
                <div className="bg-slate-200 p-2 rounded-t-3xl w-full flex flex-wrap justify-center gap-1 absolute bottom-0 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] z-50 animate-in slide-in-from-bottom duration-300">
                    {"ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split('').map(char => (
                        <button
                            key={char}
                            onClick={() => handleKeyPress(char)}
                            className="w-7 h-10 bg-white rounded-md shadow-sm border-b-2 border-slate-300 font-bold text-slate-600 text-sm active:bg-slate-100 active:border-b-0 active:translate-y-1 transition-all"
                        >
                            {char}
                        </button>
                    ))}
                    <button onClick={handleBackspace} className="w-12 h-10 bg-rose-100 text-rose-500 rounded-md shadow-sm border-b-2 border-rose-200 font-bold active:border-b-0 active:translate-y-1">⌫</button>
                </div>
            )}
        </div>
    );
};

export default CrosswordGame;
