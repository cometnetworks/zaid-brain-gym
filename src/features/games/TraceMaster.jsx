import React, { useState, useEffect, useRef } from 'react';
import { playSound } from '../../utils/audio';

// Simple SVG Coords for paths. 
// Canvas 300x300 coordinating system.
const LEVELS = [
    { id: 1, name: "La Línea", path: "M 50 150 L 250 150", width: 40 },
    { id: 2, name: "La Ola", path: "M 30 150 Q 150 50 270 150", width: 40 },
    { id: 3, name: "El Valle", path: "M 30 50 Q 150 250 270 50", width: 40 },
    { id: 4, name: "El Bucle", path: "M 30 250 C 100 50 200 50 270 250", width: 45 }, // Bezier
    { id: 5, name: "La Montaña", path: "M 30 250 L 150 50 L 270 250", width: 35 }
];

const TraceMaster = ({ onComplete, isDaily, dailyTarget = 3 }) => {
    const [levelIndex, setLevelIndex] = useState(0);
    const [isTracing, setIsTracing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [failed, setFailed] = useState(false);
    const svgRef = useRef(null);
    const rocketRef = useRef(null);

    const currentLevel = LEVELS[levelIndex % LEVELS.length];

    const getPointAtDist = (pathElem, dist) => {
        return pathElem.getPointAtLength(dist);
    };

    const handleStart = () => {
        setIsTracing(true);
        setProgress(0);
        setFailed(false);
        playSound('move');
    };

    const handleEnd = () => {
        setIsTracing(false);
        // Check win
        if (!failed && progress >= 0.95) {
            playSound('win');
            setTimeout(() => {
                if (isDaily && levelIndex + 1 >= dailyTarget) {
                    onComplete((levelIndex + 1) * 50);
                } else {
                    setLevelIndex(l => l + 1);
                    setProgress(0);
                }
            }, 1000);
        } else {
            // Reset if incomplete
            if (progress < 0.95) {
                setProgress(0);
            }
        }
    };

    const handleMove = (e) => {
        if (!isTracing || failed) return;

        const svg = svgRef.current;
        const path = svg.querySelector('#trace-path'); // The invisible guide path
        if (!svg || !path) return;

        let clientX, clientY;
        if (e.touches) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const point = svg.createSVGPoint();
        point.x = clientX;
        point.y = clientY;
        const cursorValues = point.matrixTransform(svg.getScreenCTM().inverse());

        // Logic: Find closest point on path is expensive. 
        // Simplification: We track progress linearly. 
        // The user must be within radius of the point at current progress len.

        const totalLen = path.getTotalLength();
        const currentTargetPoint = getPointAtDist(path, progress * totalLen);

        // Dist from cursor to target (the rocket's leading edge)
        const dx = cursorValues.x - currentTargetPoint.x;
        const dy = cursorValues.y - currentTargetPoint.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Allow some "pull" - if cursor is ahead, move rocket.
        // Better logic: Project cursor onto path? Too complex for 6yo feedback loop?
        // Simple Logic: 
        // If cursor is close to the *next* segment, advance progress.
        // If cursor is too far from *current* pos, fail.

        const LOOKAHEAD = 20;
        const nextTargetPoint = getPointAtDist(path, Math.min((progress * totalLen) + LOOKAHEAD, totalLen));

        const dxNext = cursorValues.x - nextTargetPoint.x;
        const dyNext = cursorValues.y - nextTargetPoint.y;
        const distNext = Math.sqrt(dxNext * dxNext + dyNext * dyNext);

        if (distNext < currentLevel.width) {
            // Good, advance
            const newLen = Math.min((progress * totalLen) + 5, totalLen); // speed limit
            setProgress(newLen / totalLen);
        } else if (dist > currentLevel.width * 1.5) {
            // Too far from current, FAIL
            setFailed(true);
            playSound('wrong');
            setIsTracing(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full w-full select-none touch-none overscroll-none">
            <div className="absolute top-4 flex justify-between w-full px-8 items-center">
                <div className="text-xl font-bold text-slate-600">Nivel {levelIndex + 1}</div>
                <div className="text-lg text-slate-400">{currentLevel.name}</div>
            </div>

            <div className="relative bg-slate-800 rounded-3xl p-4 shadow-2xl">
                <svg
                    ref={svgRef}
                    width="300"
                    height="300"
                    viewBox="0 0 300 300"
                    onTouchStart={handleStart}
                    onMouseDown={handleStart}
                    onTouchMove={handleMove}
                    onMouseMove={handleMove}
                    onTouchEnd={handleEnd}
                    onMouseUp={handleEnd}
                    className="cursor-crosshair touch-none"
                    style={{ touchAction: 'none' }}
                >
                    {/* Background Track */}
                    <path
                        d={currentLevel.path}
                        stroke="#334155"
                        strokeWidth={currentLevel.width}
                        fill="none"
                        strokeLinecap="round"
                    />

                    {/* Safe Zone (Visual Guide) */}
                    <path
                        d={currentLevel.path}
                        stroke="#475569"
                        strokeWidth={currentLevel.width * 0.8}
                        fill="none"
                        strokeLinecap="round"
                    />

                    {/* Dashed Center Line */}
                    <path
                        id="trace-path"
                        d={currentLevel.path}
                        stroke="#94a3b8"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray="10,10"
                        strokeLinecap="round"
                    />

                    {/* Progress Fill */}
                    <path
                        d={currentLevel.path}
                        stroke={failed ? "#ef4444" : "#22c55e"}
                        strokeWidth={currentLevel.width * 0.6}
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={svgRef.current?.querySelector('#trace-path')?.getTotalLength() || 1000}
                        strokeDashoffset={(svgRef.current?.querySelector('#trace-path')?.getTotalLength() || 1000) * (1 - progress)}
                        className="transition-all duration-75 ease-linear"
                    />

                    {/* Start Point */}
                    <circle cx="0" cy="0" r="15" fill="#22c55e" className="animate-pulse">
                        <animateMotion dur="0s" repeatCount="indefinite" fill="freeze">
                            <mpath href="#trace-path" />
                        </animateMotion>
                    </circle>

                    {/* End Point */}
                    <circle cx="0" cy="0" r="15" fill="#ef4444">
                        <animateMotion dur="0s" repeatCount="indefinite" fill="freeze" keyPoints="1;1" keyTimes="0;1" calcMode="linear">
                            <mpath href="#trace-path" />
                        </animateMotion>
                    </circle>

                    {/* Rocket / Player */}
                    {!failed && (
                        <g ref={rocketRef}>
                            <text x="-15" y="10" fontSize="30">🚀</text>
                            <animateMotion
                                href="#trace-path"
                                dur="0s"
                                fill="freeze"
                                keyPoints={`${progress};${progress}`}
                                keyTimes="0;1"
                                calcMode="linear"
                            >
                                <mpath href="#trace-path" />
                            </animateMotion>
                        </g>
                    )}
                </svg>

                {failed && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-3xl backdrop-blur-sm">
                        <button onClick={() => { setFailed(false); setProgress(0); }} className="bg-white px-6 py-3 rounded-full font-bold text-red-500 shadow-xl hover:scale-105 active:scale-95">
                            ¡Intenta de nuevo!
                        </button>
                    </div>
                )}
            </div>

            <div className="mt-8 text-center text-slate-500 max-w-xs">
                Mantén presionado y sigue la línea punteada sin salirte del camino.
            </div>
        </div>
    );
};

export default TraceMaster;
