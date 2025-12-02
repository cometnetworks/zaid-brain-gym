import React from 'react';
import { playSound } from '../utils/audio';

const MascotGuide = ({ text, onNext, isParent = false }) => (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-3xl border-4 border-blue-400 max-w-lg w-full p-8 shadow-2xl relative mt-10 text-center">
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 animate-bounce">
                <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-2xl shadow-xl border-4 border-white flex items-center justify-center text-5xl">🤖</div>
            </div>
            <h3 className="text-2xl font-bold text-blue-600 mt-8 mb-4 font-sans">{isParent ? 'NOTA PARA PAPÁ' : '¡HOLA ZAID!'}</h3>
            <p className="text-xl text-slate-700 leading-relaxed font-medium mb-8">{text}</p>
            <button onClick={() => { playSound('pop'); onNext(); }} className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white font-bold text-xl py-4 rounded-xl shadow-lg hover:scale-105 transition-transform">
                {isParent ? 'ENTENDIDO' : '¡VAMOS!'}
            </button>
        </div>
    </div>
);

export default MascotGuide;
