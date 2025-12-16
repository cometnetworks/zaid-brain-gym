import React, { useState, useEffect } from 'react';
import { playSound } from '../../utils/audio';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const StroopFocus = ({ onComplete, isDaily, dailyTarget = 10 }) => {
    const [score, setScore] = useState(0);
    const [roundConfig, setRoundConfig] = useState(null);
    const [feedback, setFeedback] = useState(null); // 'correct', 'wrong'
    const [showStimulus, setShowStimulus] = useState(false);

    // Game Logic:
    // Screen split into LEFT and RIGHT halves.
    // An Arrow appears on either LEFT or RIGHT side.
    // The Arrow points either LEFT or RIGHT.
    // Instruction: "Touch the side the arrow is POINTING to".
    // Conflict: Arrow points LEFT but is on the RIGHT side.

    const nextRound = () => {
        setFeedback(null);
        setShowStimulus(false);

        setTimeout(() => {
            const side = Math.random() > 0.5 ? 'left' : 'right'; // Screen Side
            const direction = Math.random() > 0.5 ? 'left' : 'right'; // Arrow Direction
            const isCongruent = side === direction; // For analytics difficulty, not used yet

            setRoundConfig({ side, direction, isCongruent });
            setShowStimulus(true);
        }, 500); // Inter-stimulus interval
    };

    useEffect(() => {
        nextRound();
    }, []);

    const handleTap = (tappedSide) => {
        if (!showStimulus || feedback) return;

        if (tappedSide === roundConfig.direction) {
            // Correct!
            playSound('correct');
            setFeedback('correct');
            setScore(s => s + 10);

            if (isDaily && score + 10 >= dailyTarget * 10) {
                setTimeout(() => onComplete(score + 10), 1000);
            } else {
                setTimeout(nextRound, 800);
            }
        } else {
            // Wrong! (Impulse control failure)
            playSound('wrong');
            setFeedback('wrong');
            setTimeout(nextRound, 1000); // Longer penalty delay?
        }
    };

    return (
        <div className="flex flex-col h-full w-full relative overflow-hidden bg-slate-50">
            {/* Header */}
            <div className="absolute top-4 left-0 right-0 flex justify-center z-20 pointer-events-none">
                <div className="bg-white/80 backdrop-blur px-6 py-2 rounded-full shadow-sm text-slate-500 font-bold border border-slate-200">
                    Sigue la flecha, no la posición
                </div>
            </div>
            <div className="absolute top-16 right-8 z-20 font-black text-2xl text-blue-600">
                {score}
            </div>

            {/* Tap Zones */}
            <div className="flex w-full h-full">
                {/* Left Zone */}
                <button
                    onClick={() => handleTap('left')}
                    className={`flex-1 h-full transition-colors active:bg-blue-100 flex items-center justify-center border-r-2 border-slate-100
                        ${feedback === 'correct' && roundConfig?.direction === 'left' ? 'bg-green-100' : ''}
                        ${feedback === 'wrong' && roundConfig?.direction === 'left' ? 'bg-green-100' : ''} 
                        ${feedback === 'wrong' && roundConfig?.direction === 'right' ? 'bg-red-50' : ''} 
                    `}
                >
                    <div className="text-slate-200 font-black text-9xl select-none opacity-20">L</div>
                </button>

                {/* Right Zone */}
                <button
                    onClick={() => handleTap('right')}
                    className={`flex-1 h-full transition-colors active:bg-blue-100 flex items-center justify-center border-l-2 border-slate-100
                        ${feedback === 'correct' && roundConfig?.direction === 'right' ? 'bg-green-100' : ''}
                        ${feedback === 'wrong' && roundConfig?.direction === 'right' ? 'bg-green-100' : ''}
                        ${feedback === 'wrong' && roundConfig?.direction === 'left' ? 'bg-red-50' : ''}
                    `}
                >
                    <div className="text-slate-200 font-black text-9xl select-none opacity-20">R</div>
                </button>
            </div>

            {/* Stimulus Overlay */}
            {showStimulus && roundConfig && (
                <div
                    className={`absolute top-1/2 transform -translate-y-1/2 flex justify-center pointer-events-none transition-all duration-200
                        ${roundConfig.side === 'left' ? 'left-1/4 -translate-x-1/2' : 'right-1/4 translate-x-1/2'}
                    `}
                >
                    <div className={`
                        p-8 rounded-3xl shadow-2xl bg-white border-4 border-slate-800
                        ${feedback === 'correct' ? 'scale-125 border-green-500' : ''}
                        ${feedback === 'wrong' ? 'animate-shake border-red-500' : ''}
                    `}>
                        {roundConfig.direction === 'left'
                            ? <ArrowLeft size={80} strokeWidth={4} className="text-slate-800" />
                            : <ArrowRight size={80} strokeWidth={4} className="text-slate-800" />
                        }
                    </div>
                </div>
            )}

            {/* Center Divisor */}
            <div className="absolute inset-y-0 left-1/2 w-1 bg-slate-200 -translate-x-1/2 pointer-events-none" />
        </div>
    );
};

export default StroopFocus;
