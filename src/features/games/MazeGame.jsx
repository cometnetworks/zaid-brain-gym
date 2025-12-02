import React, { useState, useEffect } from 'react';
import { playSound } from '../../utils/audio';
import ModernAsset from '../../components/ui/ModernAsset';

const MazeGame = ({ onComplete, isDaily, dailyTarget = 3 }) => {
    const [level, setLevel] = useState(1);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [maze, setMaze] = useState({ grid: [], start: { x: 0, y: 0 }, end: { x: 0, y: 0 } });
    const [mazesSolved, setMazesSolved] = useState(0);

    const generateMaze = (size) => {
        let grid = Array(size).fill().map(() => Array(size).fill(1));
        const start = { x: 0, y: 0 };
        const end = { x: size - 1, y: size - 1 };
        let current = { ...start };
        grid[current.y][current.x] = 0;

        while (current.x !== end.x || current.y !== end.y) {
            const moves = [];
            if (current.x < size - 1) moves.push({ x: current.x + 1, y: current.y });
            if (current.y < size - 1) moves.push({ x: current.x, y: current.y + 1 });
            if (moves.length === 0) break;
            const next = moves[Math.floor(Math.random() * moves.length)];
            grid[next.y][next.x] = 0;
            current = next;
        }

        for (let i = 0; i < size * 2; i++) {
            let rx = Math.floor(Math.random() * size);
            let ry = Math.floor(Math.random() * size);
            if (grid[ry][rx] === 0) {
                const neighbors = [{ x: rx + 1, y: ry }, { x: rx - 1, y: ry }, { x: rx, y: ry + 1 }, { x: rx, y: ry - 1 }].filter(n => n.x >= 0 && n.x < size && n.y >= 0 && n.y < size && grid[n.y][n.x] === 1);
                if (neighbors.length > 0) {
                    const n = neighbors[Math.floor(Math.random() * neighbors.length)];
                    grid[n.y][n.x] = 0;
                }
            }
        }
        return { grid, start, end };
    };

    useEffect(() => {
        const gridSize = level < 3 ? 3 : level < 6 ? 5 : 7;
        setMaze(generateMaze(gridSize));
        setPos({ x: 0, y: 0 });
    }, [level]);

    const move = (dx, dy) => {
        const newX = pos.x + dx;
        const newY = pos.y + dy;

        if (newX < 0 || newX >= maze.grid.length || newY < 0 || newY >= maze.grid.length) return;
        if (maze.grid[newY][newX] === 1) { playSound('wall'); return; }

        playSound('move');
        setPos({ x: newX, y: newY });

        if (newX === maze.end.x && newY === maze.end.y) {
            playSound('win');
            const newSolved = mazesSolved + 1;
            setMazesSolved(newSolved);

            setTimeout(() => {
                if (isDaily && newSolved >= dailyTarget) {
                    onComplete(newSolved * 50);
                } else {
                    if (level === 20 && !isDaily) onComplete(200);
                    setLevel(l => l + 1);
                }
            }, 500);
        }
    };

    const gridSize = maze.grid.length;

    return (
        <div className="flex flex-col items-center justify-center h-full gap-6">
            <div className="absolute top-4 flex justify-between w-full px-8 items-center">
                {isDaily && <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold">Misión: {mazesSolved}/{dailyTarget}</div>}
                <div className="text-xl font-bold text-purple-600">Nivel {level}</div>
            </div>
            <div
                className="bg-slate-800 grid gap-1 p-2 rounded-lg shadow-2xl transition-all"
                style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)`, width: `${gridSize * 50}px`, height: `${gridSize * 50}px` }}
            >
                {maze.grid.map((row, y) => row.map((cell, x) => {
                    const isPlayer = x === pos.x && y === pos.y;
                    const isTarget = x === maze.end.x && y === maze.end.y;
                    const isWall = cell === 1;

                    return (
                        <div key={`${x}-${y}`} className={`rounded flex items-center justify-center ${isPlayer ? 'bg-blue-500 z-10' : isTarget ? 'bg-yellow-400' : isWall ? 'bg-slate-700' : 'bg-slate-200'}`}>
                            {isPlayer && <div className="text-xl">😎</div>}
                            {isTarget && <div className="text-xl animate-spin-slow">⭐</div>}
                            {isWall && <ModernAsset type={level > 10 ? 'fire_wall' : 'wall'} />}
                        </div>
                    );
                }))}
            </div>
            <div className="grid grid-cols-3 gap-2">
                <div /><button onClick={() => move(0, -1)} className="w-16 h-16 bg-blue-100 rounded-xl text-3xl shadow-md active:scale-95">⬆️</button><div />
                <button onClick={() => move(-1, 0)} className="w-16 h-16 bg-blue-100 rounded-xl text-3xl shadow-md active:scale-95">⬅️</button>
                <button onClick={() => move(0, 1)} className="w-16 h-16 bg-blue-100 rounded-xl text-3xl shadow-md active:scale-95">⬇️</button>
                <button onClick={() => move(1, 0)} className="w-16 h-16 bg-blue-100 rounded-xl text-3xl shadow-md active:scale-95">➡️</button>
            </div>
        </div>
    );
};

export default MazeGame;
