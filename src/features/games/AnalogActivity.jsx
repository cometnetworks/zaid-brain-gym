import React, { useState, useEffect } from 'react';
import { Hammer } from 'lucide-react';
import { playSound } from '../../utils/audio';
import { PHYS_DB } from '../../data/db';

const AnalogActivity = ({ onComplete }) => {
    const [challenge, setChallenge] = useState("");
    useEffect(() => { setChallenge(PHYS_DB[Math.floor(Math.random() * PHYS_DB.length)]); }, []);

    return (
        <div className="flex flex-col items-center justify-center h-full text-center gap-8 p-4">
            <div className="bg-orange-100 p-8 rounded-3xl border-4 border-orange-300 shadow-xl max-w-md">
                <h3 className="text-2xl font-bold text-orange-800 mb-4 flex items-center justify-center gap-2"><Hammer size={32} /> RETO FÍSICO</h3>
                <p className="text-xl text-orange-900 font-medium leading-relaxed">{challenge}</p>
            </div>
            <button onClick={() => { playSound('win'); onComplete(50); }} className="bg-green-500 text-white px-10 py-5 rounded-full font-bold text-2xl shadow-xl animate-bounce hover:bg-green-400">
                ¡LO LOGRÉ!
            </button>
        </div>
    );
};

export default AnalogActivity;
