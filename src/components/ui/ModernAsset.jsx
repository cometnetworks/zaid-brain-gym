import React from 'react';

const ModernAsset = ({ type, size = 16, className = "", count = 1 }) => {
    const s = size * 4;
    const renderIcon = () => {
        switch (type) {
            case 'apple': return <div className="text-4xl drop-shadow-md">🍎</div>;
            case 'star': return <div className="text-4xl drop-shadow-md">⭐</div>;
            case 'cat': return <div className="text-4xl drop-shadow-md">🐱</div>;
            case 'dog': return <div className="text-4xl drop-shadow-md">🐶</div>;
            case 'sun': return <div className="text-4xl drop-shadow-md">☀️</div>;
            case 'bread': return <div className="text-4xl drop-shadow-md">🍞</div>;
            case 'sea': return <div className="text-4xl drop-shadow-md">🌊</div>;
            case 'duck': return <div className="text-4xl drop-shadow-md">🦆</div>;
            case 'moon': return <div className="text-4xl drop-shadow-md">🌙</div>;
            case 'house': return <div className="text-4xl drop-shadow-md">🏠</div>;
            case 'book': return <div className="text-4xl drop-shadow-md">📖</div>;
            case 'tree': return <div className="text-4xl drop-shadow-md">🌳</div>;
            case 'flower': return <div className="text-4xl drop-shadow-md">🌸</div>;
            case 'table': return <div className="text-4xl drop-shadow-md">🪑</div>;
            case 'pencil': return <div className="text-4xl drop-shadow-md">✏️</div>;
            case 'car': return <div className="text-4xl drop-shadow-md">🚗</div>;
            case 'train': return <div className="text-4xl drop-shadow-md">🚂</div>;
            case 'lion': return <div className="text-4xl drop-shadow-md">🦁</div>;
            case 'tiger': return <div className="text-4xl drop-shadow-md">🐯</div>;
            case 'mouse': return <div className="text-4xl drop-shadow-md">🐭</div>;
            case 'water': return <div className="text-4xl drop-shadow-md">💧</div>;
            case 'fire': return <div className="text-4xl drop-shadow-md">🔥</div>;
            case 'cloud': return <div className="text-4xl drop-shadow-md">☁️</div>;
            case 'red': return <div className="w-8 h-8 rounded-full bg-red-500 border-2 border-white shadow"></div>;
            case 'blue': return <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white shadow"></div>;
            case 'fish': return <div className="text-4xl drop-shadow-md">🐟</div>;
            case 'bird': return <div className="text-4xl drop-shadow-md">🐦</div>;
            case 'milk': return <div className="text-4xl drop-shadow-md">🥛</div>;
            case 'pig': return <div className="text-4xl drop-shadow-md">🐷</div>;
            case 'hat': return <div className="text-4xl drop-shadow-md">🎩</div>;
            case 'ball': return <div className="text-4xl drop-shadow-md">⚽</div>;
            case 'cake': return <div className="text-4xl drop-shadow-md">🍰</div>;
            case 'frog': return <div className="text-4xl drop-shadow-md">🐸</div>;
            case 'ship': return <div className="text-4xl drop-shadow-md">🚢</div>;
            case 'wall': return <div className="w-full h-full bg-slate-700 rounded-sm border-t-4 border-slate-500 shadow-xl flex items-center justify-center text-xs">🧱</div>;
            case 'fire_wall': return <div className="w-full h-full bg-orange-600 rounded-sm border-t-4 border-orange-400 shadow-inner flex items-center justify-center text-xs animate-pulse">🔥</div>;
            default: return <div className="text-4xl">📦</div>;
        }
    };

    return (
        <div className={`flex gap-1 flex-wrap justify-center ${className}`}>
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="animate-bounce-slight" style={{ width: s, height: s, fontSize: s / 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {renderIcon()}
                </div>
            ))}
        </div>
    );
};

export default ModernAsset;
