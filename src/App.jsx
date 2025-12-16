import React, { useState, useEffect } from 'react';
import {
    Brain, Clock, Settings, User, CheckCircle, XCircle,
    Play, Pause, RotateCcw, Lock, Star, Heart, Map, Hammer, HelpCircle,
    ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Home, ChevronRight,
    BookOpen, Eye, Zap, Calculator, Grid, Hash, Trophy, Timer, Languages,
    Volume2, VolumeX, Smile, Target, Wand2
} from 'lucide-react';

// Utilities
import { playSound, initAudio } from './utils/audio';

// Components
import MascotGuide from './components/MascotGuide';

// Games
import SpeedReading from './features/games/SpeedReading';
import OddOneOut from './features/games/OddOneOut';
import MemorySimon from './features/games/MemorySimon';
import MemoryMatch from './features/games/MemoryMatch';
import VisualMath from './features/games/VisualMath';
import WordBuilder from './features/games/WordBuilder';
import StoryTime from './features/games/StoryTime';
import QuickCount from './features/games/QuickCount';
import NumberSequence from './features/games/NumberSequence';
import ScrabbleGame from './features/games/ScrabbleGame';
import CrosswordGame from './features/games/CrosswordGame';
import AnalogActivity from './features/games/AnalogActivity';
import LogicPattern from './features/games/LogicPattern';
import LogicClassification from './features/games/LogicClassification';
import MathDiceRace from './features/games/MathDiceRace';
import MathNumberBuilder from './features/games/MathNumberBuilder';
import TraceMaster from './features/games/TraceMaster';
import StroopFocus from './features/games/StroopFocus';

// New Features
import MagicDrawing from './features/magic/MagicDrawing';

export default function App() {
    const [view, setView] = useState('landing');
    const [activeGameId, setActiveGameId] = useState(null);
    const [xp, setXp] = useState(0);
    const [day, setDay] = useState(1);
    const [tutorial, setTutorial] = useState(true);
    const [highScores, setHighScores] = useState({});

    useEffect(() => {
        window.addEventListener('click', initAudio);
        return () => window.removeEventListener('click', initAudio);
    }, []);

    const gamesList = [
        { id: 'speed', title: 'Lectura Rápida', color: 'bg-red-400', icon: <Eye />, Component: SpeedReading },
        { id: 'attn', title: 'Atención', color: 'bg-green-400', icon: <Zap />, Component: OddOneOut },
        { id: 'mem', title: 'Simón Dice', color: 'bg-yellow-400', icon: <Brain />, Component: MemorySimon },
        { id: 'pairs', title: 'Pares', color: 'bg-cyan-400', icon: <Smile />, Component: MemoryMatch },
        { id: 'math', title: 'Matemáticas', color: 'bg-blue-400', icon: <Calculator />, Component: VisualMath },
        { id: 'word_es', title: 'Ordena Letras', color: 'bg-purple-400', icon: <BookOpen />, Component: (props) => <WordBuilder {...props} language="es" /> },
        { id: 'word_en', title: 'Spelling Bee', color: 'bg-pink-400', icon: <Languages />, Component: (props) => <WordBuilder {...props} language="en" /> },
        { id: 'story', title: 'Historias', color: 'bg-orange-400', icon: <BookOpen />, Component: StoryTime },
        { id: 'count', title: 'Conteo Rápido', color: 'bg-rose-400', icon: <Hash />, Component: QuickCount },
        { id: 'seq', title: 'Secuencias', color: 'bg-teal-400', icon: <Grid />, Component: NumberSequence },
        { id: 'scrab', title: 'Scrabble Jr', color: 'bg-amber-600', icon: <Grid />, Component: ScrabbleGame },
        { id: 'cross', title: 'Crucigrama', color: 'bg-sky-500', icon: <Grid />, Component: CrosswordGame },
        { id: 'phys', title: 'Físico', color: 'bg-stone-400', icon: <Hammer />, Component: AnalogActivity },
        { id: 'patt', title: 'Patrones', color: 'bg-orange-600', icon: <Grid />, Component: LogicPattern },
        { id: 'class', title: 'Organizar', color: 'bg-emerald-500', icon: <Target />, Component: LogicClassification },
        { id: 'dice', title: 'Dados', color: 'bg-blue-600', icon: <Calculator />, Component: MathDiceRace },
        { id: 'build', title: 'Suma 10', color: 'bg-violet-600', icon: <Hash />, Component: MathNumberBuilder },
        { id: 'trace', title: 'Trazo Maestro', color: 'bg-stone-500', icon: <Wand2 />, Component: TraceMaster },
        { id: 'stroop', title: 'Flechas Locas', color: 'bg-red-500', icon: <Target />, Component: StroopFocus },
    ];

    const handleGameComplete = (score) => {
        setXp(prev => prev + score);
        if (activeGameId !== 'daily_routine') {
            setHighScores(prev => ({ ...prev, [activeGameId]: Math.max(prev[activeGameId] || 0, score) }));
        }
        setView(activeGameId === 'daily_routine' ? 'map' : 'arcade');
        setActiveGameId(null);
    };

    const launchGame = (gameId) => {
        setActiveGameId(gameId);
        setTutorial(true);
        setView('game');
    };

    if (view === 'magic') {
        return <MagicDrawing onBack={() => setView('landing')} />;
    }

    if (view === 'landing') {
        return (
            <div className="min-h-screen bg-sky-200 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
                <h1 className="text-5xl md:text-7xl font-black text-green-700 mb-12 text-center drop-shadow-md bg-white/60 px-8 py-4 rounded-3xl backdrop-blur-md">
                    ZAID'S BRAIN GYM
                </h1>
                <div className="grid md:grid-cols-3 gap-8 w-full max-w-6xl z-10">
                    <button onClick={() => { playSound('pop'); setView('map'); }} className="bg-white border-b-8 border-r-8 border-green-600 rounded-3xl p-8 hover:bg-green-50 hover:scale-105 transition-all flex flex-col items-center shadow-2xl group">
                        <div className="w-32 h-32 bg-green-500 rounded-2xl mb-6 flex items-center justify-center text-6xl shadow-inner group-hover:rotate-3 transition-transform">🗺️</div>
                        <h2 className="text-3xl font-black text-slate-700 mb-2">MODO AVENTURA</h2>
                        <p className="text-slate-500 font-bold text-lg">Tu plan de 30 días</p>
                    </button>
                    <button onClick={() => { playSound('pop'); setView('arcade'); }} className="bg-white border-b-8 border-r-8 border-blue-600 rounded-3xl p-8 hover:bg-blue-50 hover:scale-105 transition-all flex flex-col items-center shadow-2xl group">
                        <div className="w-32 h-32 bg-blue-500 rounded-2xl mb-6 flex items-center justify-center text-6xl shadow-inner group-hover:-rotate-3 transition-transform">🎮</div>
                        <h2 className="text-3xl font-black text-slate-700 mb-2">SALA DE JUEGOS</h2>
                        <p className="text-slate-500 font-bold text-lg">¡Récords y Retos!</p>
                    </button>
                    <button onClick={() => { playSound('pop'); setView('magic'); }} className="bg-white border-b-8 border-r-8 border-purple-600 rounded-3xl p-8 hover:bg-purple-50 hover:scale-105 transition-all flex flex-col items-center shadow-2xl group">
                        <div className="w-32 h-32 bg-purple-500 rounded-2xl mb-6 flex items-center justify-center text-6xl shadow-inner group-hover:scale-110 transition-transform">✨</div>
                        <h2 className="text-3xl font-black text-slate-700 mb-2">DIBUJOS MÁGICOS</h2>
                        <p className="text-slate-500 font-bold text-lg">¡Crea arte con IA!</p>
                    </button>
                </div>
            </div>
        );
    }

    if (view === 'arcade') {
        return (
            <div className="min-h-screen bg-indigo-100 p-6 font-sans">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <button onClick={() => setView('landing')} className="bg-white p-3 rounded-full shadow-lg hover:scale-110"><Home className="text-slate-700" /></button>
                        <h1 className="text-4xl font-black text-slate-700">SALA DE JUEGOS</h1>
                        <div className="ml-auto bg-yellow-400 px-6 py-2 rounded-full font-bold text-yellow-900 shadow-md flex items-center gap-2">
                            <Star className="fill-current" /> {xp} XP
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {gamesList.map((game) => (
                            <button key={game.id} onClick={() => launchGame(game.id)} className="bg-white rounded-3xl p-6 shadow-xl border-b-8 border-slate-200 hover:border-slate-300 hover:-translate-y-2 transition-all flex flex-col items-center gap-2 group relative">
                                <div className={`w-20 h-20 ${game.color} rounded-2xl flex items-center justify-center text-white shadow-inner group-hover:scale-110 transition-transform`}>
                                    {React.cloneElement(game.icon, { size: 40 })}
                                </div>
                                <span className="font-bold text-lg text-slate-600 text-center leading-tight">{game.title}</span>
                                {highScores[game.id] > 0 && (
                                    <div className="mt-2 bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                        <Trophy size={10} /> Récord: {highScores[game.id]}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (view === 'map') {
        return (
            <div className="min-h-screen bg-green-700 p-4 font-sans relative">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-8 bg-slate-900/80 p-4 rounded-xl backdrop-blur text-white">
                        <button onClick={() => setView('landing')} className="flex items-center gap-2 hover:text-green-400"><ArrowLeft /> VOLVER</button>
                        <h1 className="text-2xl font-bold font-mono">DÍA {day}</h1>
                        <div className="flex items-center gap-2 text-yellow-400"><Star className="fill-current" /> {xp}</div>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                        {Array.from({ length: 30 }).map((_, i) => {
                            const d = i + 1;
                            const status = d === day ? 'active' : d < day ? 'done' : 'locked';
                            return (
                                <button key={d} onClick={() => { if (status === 'active') { setActiveGameId('daily_routine'); setView('game'); } }} disabled={status === 'locked'} className={`aspect-square rounded-xl border-b-8 flex flex-col items-center justify-center relative ${status === 'done' ? 'bg-green-600 border-green-800' : status === 'active' ? 'bg-yellow-400 border-yellow-600 animate-bounce' : 'bg-slate-600 border-slate-800 opacity-60'}`}>
                                    <span className="text-2xl font-black font-mono text-white drop-shadow-md">{d}</span>
                                    {status === 'locked' && <Lock className="text-slate-400 absolute bottom-2" />}
                                    {status === 'done' && <CheckCircle className="text-white absolute bottom-2" />}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
        );
    }

    if (view === 'game') {
        const isDaily = activeGameId === 'daily_routine';
        const CurrentGame = isDaily
            ? gamesList[Math.floor(Math.random() * gamesList.length)].Component
            : gamesList.find(g => g.id === activeGameId)?.Component;
        const gameTitle = isDaily ? "Misión Diaria" : gamesList.find(g => g.id === activeGameId)?.title;

        // Calcular meta diaria basada en el día (aumenta ligeramente dificultad)
        const baseTarget = 5;
        const dailyTarget = Math.min(baseTarget + Math.floor(day / 7), 10); // Sube 1 cada semana

        if (tutorial) return <MascotGuide text={`¡Bienvenido a ${gameTitle}! ${isDaily ? `Tu misión es llegar a ${dailyTarget} puntos.` : '¡Rompe tu récord!'}`} onNext={() => setTutorial(false)} />;

        return (
            <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
                <div className="bg-white p-4 shadow-md flex justify-between items-center">
                    <h2 className="text-xl font-black text-slate-700">{gameTitle}</h2>
                    <button onClick={() => setView(isDaily ? 'map' : 'arcade')} className="bg-red-100 text-red-500 p-2 rounded-full hover:bg-red-200"><XCircle /></button>
                </div>
                <div className="flex-1 p-4 md:p-8 flex flex-col items-center justify-center">
                    <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl h-[600px] border-4 border-slate-200 relative overflow-hidden p-4">
                        {CurrentGame ? <CurrentGame onComplete={handleGameComplete} isDaily={isDaily} dailyTarget={dailyTarget} /> : <div>Error</div>}
                    </div>
                </div>
            </div>
        );
    }

    return <div className="p-10 text-center">Cargando Zaid's Super App...</div>;
}
