import React, { useState, useEffect } from 'react';
import { playSound } from '../../utils/audio';
import ModernAsset from '../../components/ui/ModernAsset';

const LogicClassification = ({ onComplete, isDaily, dailyTarget = 5 }) => {
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [categories, setCategories] = useState([]);
    const [currentItem, setCurrentItem] = useState(null);
    const [feedback, setFeedback] = useState(null);

    // Dictionary for labels
    const spanishLabels = {
        cat: "GATO", dog: "PERRO", lion: "LEÓN", pig: "CERDO", frog: "RANA", bird: "AVE", duck: "PATO", fish: "PEZ", mouse: "RATÓN", tiger: "TIGRE",
        car: "AUTO", train: "TREN", ship: "BARCO",
        sun: "SOL", moon: "LUNA", tree: "ÁRBOL", flower: "FLOR", water: "AGUA", cloud: "NUBE", fire: "FUEGO",
        apple: "MANZANA", bread: "PAN", milk: "LECHE", cake: "PASTEL",
        book: "LIBRO", pencil: "LÁPIZ", ball: "PELOTA", hat: "SOMBRERO"
    };

    const safeData = {
        animals: { label: 'ANIMALES', color: 'bg-orange-100 text-orange-800 border-orange-300', icon: '🐾', items: ['cat', 'dog', 'lion', 'pig', 'frog', 'bird', 'duck', 'fish', 'mouse', 'tiger'] },
        vehicles: { label: 'VEHÍCULOS', color: 'bg-blue-100 text-blue-800 border-blue-300', icon: '🚦', items: ['car', 'train', 'ship'] },
        nature: { label: 'NATURALEZA', color: 'bg-green-100 text-green-800 border-green-300', icon: '🌿', items: ['sun', 'moon', 'tree', 'flower', 'water', 'cloud', 'fire'] },
        food: { label: 'COMIDA', color: 'bg-red-100 text-red-800 border-red-300', icon: '🍽️', items: ['apple', 'bread', 'milk', 'cake'] }
    };

    const nextRound = () => {
        const keys = Object.keys(safeData).sort(() => 0.5 - Math.random()).slice(0, 2);
        const cat1 = safeData[keys[0]];
        const cat2 = safeData[keys[1]];

        setCategories([
            { id: keys[0], ...cat1 },
            { id: keys[1], ...cat2 }
        ]);

        const targetCatKey = Math.random() > 0.5 ? keys[0] : keys[1];
        const targetItems = safeData[targetCatKey].items;
        const item = targetItems[Math.floor(Math.random() * targetItems.length)];

        setCurrentItem({ type: item, categoryId: targetCatKey });
        setFeedback(null);
    };

    useEffect(() => {
        nextRound();
    }, [level]);

    const handleSelect = (categoryId) => {
        if (feedback) return;

        if (categoryId === currentItem.categoryId) {
            playSound('correct');
            setFeedback('correct');
            setScore(s => s + 10);
            setTimeout(() => {
                if (isDaily && score + 10 >= dailyTarget * 10) {
                    onComplete(score + 10);
                } else {
                    setLevel(l => l + 1);
                }
            }, 800);
        } else {
            playSound('wrong');
            setFeedback('wrong');
            setTimeout(() => setFeedback(null), 800);
        }
    };

    if (!currentItem) return null;

    return (
        <div className="flex flex-col items-center justify-center h-full gap-6 w-full max-w-2xl px-4 mx-auto">
            <div className="absolute top-4 flex justify-between w-full px-8 z-10">
                <div className="text-xl font-bold text-slate-600 bg-white/80 px-4 py-1 rounded-full">Nivel {level}</div>
                <div className="text-xl font-bold text-green-600 bg-white/80 px-4 py-1 rounded-full">Puntos: {score}</div>
            </div>

            <div className="mb-4 text-center">
                <h2 className="text-2xl text-slate-700 font-bold">¿En qué grupo va?</h2>
                <p className="text-slate-400 text-sm">Toca el botón correcto</p>
            </div>

            {/* Draggable Item Representation */}
            <div className={`
                flex flex-col items-center justify-center p-6
                bg-white rounded-[2rem] shadow-2xl border-4 
                transition-all duration-300 transform
                ${feedback === 'correct' ? 'scale-0 opacity-0 rotate-180' : 'scale-100 opacity-100'} 
                ${feedback === 'wrong' ? 'border-red-400 animate-shake bg-red-50' : 'border-slate-100'}
            `}>
                <div className="w-32 h-32 flex items-center justify-center mb-2">
                    <ModernAsset type={currentItem.type} size={20} />
                </div>
                <span className="text-3xl font-black text-slate-700 tracking-widest uppercase bg-slate-100 px-4 py-1 rounded-lg">
                    {spanishLabels[currentItem.type] || currentItem.type}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full mt-4">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => handleSelect(cat.id)}
                        className={`
                            h-48 rounded-3xl border-b-8 flex flex-col items-center justify-center gap-3 
                            transition-all hover:scale-[1.02] active:scale-95 active:border-b-0 translate-y-0
                            ${cat.color} border-opacity-40
                            ${feedback === 'wrong' ? 'opacity-50' : 'opacity-100 shadow-lg'}
                        `}
                    >
                        <div className="text-6xl drop-shadow-sm filter saturate-150">{cat.icon}</div>
                        <span className="text-xl font-black tracking-wider opacity-90 bg-white/50 px-4 py-1 rounded-full">{cat.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LogicClassification;
