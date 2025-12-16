import React, { useState, useEffect } from 'react';
import { playSound } from '../../utils/audio';
import ModernAsset from '../../components/ui/ModernAsset';
import { WORD_DB_ES } from '../../data/db';

const LETTER_SCORES = {
    'A': 1, 'B': 3, 'C': 3, 'D': 2, 'E': 1, 'F': 4, 'G': 2, 'H': 4, 'I': 1, 'J': 8,
    'K': 5, 'L': 1, 'M': 3, 'N': 1, 'Ñ': 8, 'O': 1, 'P': 3, 'Q': 10, 'R': 1, 'S': 1,
    'T': 1, 'U': 1, 'V': 4, 'W': 4, 'X': 8, 'Y': 4, 'Z': 10
};

const ScrabbleGame = ({ onComplete, isDaily, dailyTarget = 50, wordList = WORD_DB_ES }) => {
    const [score, setScore] = useState(0);
    const [currentWord, setCurrentWord] = useState(null);
    const [placedTiles, setPlacedTiles] = useState([]);
    const [rackLetters, setRackLetters] = useState([]);
    const [level, setLevel] = useState(1);

    const nextRound = () => {
        // Find a word with length 3-6
        const candidates = wordList.filter(w => w.word.length >= 3 && w.word.length <= 6);
        const w = candidates[Math.floor(Math.random() * candidates.length)];

        setCurrentWord(w);
        setPlacedTiles(Array(w.word.length).fill(null));

        // Rack: word letters + 2 distractors
        const letters = w.word.split('');
        const alphabet = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ";
        for (let i = 0; i < 2; i++) {
            letters.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
        }

        setRackLetters(letters.sort(() => 0.5 - Math.random()).map((l, i) => ({ id: i, char: l, status: 'rack' })));
    };

    useEffect(() => {
        nextRound();
    }, [level, wordList]);

    const handleTileClick = (tile, rackIndex) => {
        if (tile.status !== 'rack') return; // Only move from rack to board for now (simple click)

        // Find first empty slot
        const emptyIndex = placedTiles.indexOf(null);
        if (emptyIndex === -1) return; // Full

        playSound('tap');

        // Move to board
        const newPlaced = [...placedTiles];
        newPlaced[emptyIndex] = tile;
        setPlacedTiles(newPlaced);

        // Update rack
        const newRack = [...rackLetters];
        newRack[rackIndex] = { ...tile, status: 'board' };
        setRackLetters(newRack);

        // Check if full
        if (!newPlaced.includes(null)) {
            // Check correctness
            const formedWord = newPlaced.map(t => t.char).join('');
            if (formedWord === currentWord.word) {
                // Correct!
                playSound('correct');

                // Calc score
                const wordScore = formedWord.split('').reduce((acc, char) => acc + (LETTER_SCORES[char] || 1), 0);
                setScore(s => s + wordScore);

                setTimeout(() => {
                    if (isDaily && score + wordScore >= dailyTarget) {
                        onComplete(score + wordScore);
                    } else {
                        setLevel(l => l + 1);
                    }
                }, 1000);
            } else {
                // Wrong
                playSound('wrong');
                setTimeout(() => {
                    // Reset tiles to rack
                    setPlacedTiles(Array(currentWord.word.length).fill(null));
                    setRackLetters(rackLetters.map(t => ({ ...t, status: 'rack' })));
                }, 800);
            }
        }
    };

    const handleBoardTileClick = (index) => {
        const tile = placedTiles[index];
        if (!tile) return;

        playSound('tap');
        // Remove from board
        const newPlaced = [...placedTiles];
        newPlaced[index] = null;
        setPlacedTiles(newPlaced);

        // Return to rack
        const newRack = [...rackLetters];
        const rackIdx = newRack.findIndex(r => r.id === tile.id);
        if (rackIdx !== -1) {
            newRack[rackIdx].status = 'rack';
        }
        setRackLetters(newRack);
    };

    if (!currentWord) return null;

    return (
        <div className="flex flex-col items-center justify-center h-full gap-8 w-full">
            <div className="flex justify-between w-full px-8 items-center">
                <div className="text-xl font-bold text-amber-800 bg-amber-100 px-4 py-1 rounded">Nivel {level}</div>
                <div className="text-xl font-bold text-amber-800 bg-amber-100 px-4 py-1 rounded">Score: {score}</div>
            </div>

            {/* Image Clue */}
            <div className="bg-white p-4 rounded-2xl shadow-lg border-4 border-amber-200 rotate-1">
                <ModernAsset type={currentWord.icon} size={20} />
            </div>

            {/* Board */}
            <div className="bg-amber-700 p-4 rounded-xl shadow-inner flex gap-2 border-4 border-amber-800">
                {placedTiles.map((tile, i) => (
                    <button
                        key={i}
                        onClick={() => handleBoardTileClick(i)}
                        className={`w-14 h-14 bg-amber-100 rounded flex items-center justify-center shadow-lg border-b-4 border-amber-300 transition-all
                            ${tile ? 'text-amber-900' : 'opacity-30'}
                        `}
                    >
                        {tile && (
                            <div className="relative w-full h-full flex items-center justify-center">
                                <span className="text-3xl font-bold">{tile.char}</span>
                                <span className="absolute bottom-0 right-1 text-[10px] font-bold opacity-60">{LETTER_SCORES[tile.char] || 1}</span>
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* Rack */}
            <div className="bg-amber-900/10 p-6 rounded-3xl w-full max-w-lg flex flex-wrap justify-center gap-3 min-h-[100px]">
                {rackLetters.map((tile, i) => {
                    if (tile.status !== 'rack') return <div key={tile.id} className="w-14 h-14" />; // Spacer

                    return (
                        <button
                            key={tile.id}
                            onClick={() => handleTileClick(tile, i)}
                            className="w-14 h-14 bg-amber-50 rounded-lg shadow-md border-b-4 border-amber-200 text-amber-900 relative hover:-translate-y-1 transition-transform flex items-center justify-center"
                        >
                            <span className="text-3xl font-bold">{tile.char}</span>
                            <span className="absolute bottom-0 right-1 text-[10px] font-bold opacity-60">{LETTER_SCORES[tile.char] || 1}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ScrabbleGame;
