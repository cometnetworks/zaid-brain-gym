import React, { useState, useEffect } from 'react';
import { playSound } from '../../utils/audio';
import ModernAsset from '../../components/ui/ModernAsset';

const LogicClassification = ({ onComplete, isDaily, dailyTarget = 5 }) => {
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [categories, setCategories] = useState([]);
    const [currentItem, setCurrentItem] = useState(null);
    const [feedback, setFeedback] = useState(null);

    // Data definitions
    const categoryData = {
        animals: { label: 'ANIMALES', color: 'bg-orange-100 border-orange-300', items: ['cat', 'dog', 'lion', 'pig', 'frog', 'bird', 'duck', 'fish', 'mouse', 'tiger'] },
        vehicles: { label: 'VEHICULOS', color: 'bg-blue-100 border-blue-300', items: ['car', 'train', 'ship'] }, // "ship" used to be boat, using valid asset key
        nature: { label: 'NATURALEZA', color: 'bg-green-100 border-green-300', items: ['sun', 'moon', 'tree', 'flower', 'water', 'cloud', 'fire'] },
        objects: { label: 'OBJETOS', color: 'bg-purple-100 border-purple-300', items: ['book', 'pencil', 'ball', 'hat', 'chair', 'bed'] } // chair/bed might not exist, need to check assets or map safely
    };

    // Check asset availability mapping to ensure no missing icons
    // Assets available: apple, star, cat, dog, sun, bread, sea, duck, moon, house, book, tree, flower, table, pencil, car, train, lion, tiger, mouse, water, fire, cloud, red, blue, fish, bird, milk, pig, hat, ball, cake, frog, ship, wall, fire_wall

    const safeData = {
        animals: { label: 'ANIMALES', color: 'bg-orange-100 text-orange-700 border-orange-300', items: ['cat', 'dog', 'lion', 'pig', 'frog', 'bird', 'duck', 'fish', 'mouse', 'tiger'] },
        vehicles: { label: 'VEHICULOS', color: 'bg-blue-100 text-blue-700 border-blue-300', items: ['car', 'train', 'ship'] },
        nature: { label: 'NATURALEZA', color: 'bg-green-100 text-green-700 border-green-300', items: ['sun', 'moon', 'tree', 'flower', 'water', 'cloud', 'fire'] },
        food: { label: 'COMIDA', color: 'bg-red-100 text-red-700 border-red-300', items: ['apple', 'bread', 'milk', 'cake'] }
    };

    const nextRound = () => {
        // Pick 2 random categories
        const keys = Object.keys(safeData).sort(() => 0.5 - Math.random()).slice(0, 2);
        const cat1 = safeData[keys[0]];
        const cat2 = safeData[keys[1]];

        setCategories([
            { id: keys[0], ...cat1 },
            { id: keys[1], ...cat2 }
        ]);

        // Pick an item from one of them
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
                    setLevel(l => l + 1); // Triggers nextRound via useEffect
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
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="absolute top-4 flex justify-between w-full px-8">
                <div className="text-xl font-bold text-slate-600">Nivel {level}</div>
                <div className="text-xl font-bold text-green-600">Puntos: {score}</div>
            </div>

            <h2 className="text-2xl text-slate-700 font-bold mb-8">¿A dónde pertenece?</h2>

            {/* Draggable Item Representation (Static for click prototype) */}
            <div className={`w-32 h-32 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-8 border-4 transition-transform ${feedback === 'correct' ? 'scale-0 duration-500' : 'scale-100'} ${feedback === 'wrong' ? 'border-red-400 animate-shake' : 'border-slate-100'}`}>
                <ModernAsset type={currentItem.type} size={16} />
            </div>

            <div className="flex gap-6 w-full px-4 justify-center">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => handleSelect(cat.id)}
                        className={`flex-1 h-40 rounded-3xl border-4 border-dashed flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 ${cat.color} bg-opacity-50`}
                    >
                        <span className="text-lg font-black tracking-wider opacity-80">{cat.label}</span>
                        <div className="w-full h-full absolute inset-0 opacity-10 flex items-center justify-center text-6xl">
                            {cat.id === 'animals' ? '🐾' : cat.id === 'vehicles' ? '🚦' : cat.id === 'nature' ? '🌿' : '🍽️'}
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default LogicClassification;
