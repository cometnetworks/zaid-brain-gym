import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, Wand2, Image as ImageIcon, Film, RefreshCw, Download, Share2, X } from 'lucide-react';
import Button from '../../components/ui/Button';
import { playSound } from '../../utils/audio';

const STYLES = [
    { id: 'pixar', name: 'Estilo Pixar', icon: '🎨', color: 'bg-blue-500' },
    { id: 'anime', name: 'Anime / One Piece', icon: '⚔️', color: 'bg-orange-500' },
    { id: 'minecraft', name: 'Minecraft', icon: '🧱', color: 'bg-green-600' },
    { id: 'marvel', name: 'Cómic Marvel', icon: '🦸', color: 'bg-red-600' },
];

const MagicDrawing = ({ onBack }) => {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [step, setStep] = useState('capture'); // capture, preview, processing, result
    const [selectedStyle, setSelectedStyle] = useState(null);
    const [mode, setMode] = useState('image'); // image, video
    const [result, setResult] = useState(null);

    const capture = useCallback(() => {
        playSound('pop');
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
        setStep('preview');
    }, [webcamRef]);

    const processMagic = () => {
        if (!selectedStyle) return;
        playSound('win');
        setStep('processing');

        // MOCK API CALL
        setTimeout(() => {
            setResult(imgSrc); // In a real app, this would be the transformed image URL
            playSound('correct');
            setStep('result');
        }, 3000);
    };

    const reset = () => {
        setImgSrc(null);
        setResult(null);
        setStep('capture');
        setSelectedStyle(null);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-4 flex flex-col items-center">
            {/* Header */}
            <div className="w-full max-w-4xl flex justify-between items-center mb-6">
                <button onClick={onBack} className="p-2 bg-slate-800 rounded-full hover:bg-slate-700">
                    <X className="w-6 h-6" />
                </button>
                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                    ✨ DIBUJOS MÁGICOS ✨
                </h1>
                <div className="w-10" />
            </div>

            <div className="w-full max-w-4xl bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-700 min-h-[600px] flex flex-col relative">

                {/* STEP 1: CAPTURE */}
                {step === 'capture' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
                        <div className="relative rounded-2xl overflow-hidden border-4 border-slate-600 shadow-xl w-full max-w-lg aspect-video bg-black">
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="mt-8 flex gap-4">
                            <Button
                                onClick={capture}
                                className="rounded-full w-20 h-20 flex items-center justify-center border-4 border-white ring-4 ring-purple-500 bg-red-500 hover:scale-110 active:scale-95 transition-all"
                            >
                                <Camera size={32} />
                            </Button>
                        </div>
                        <p className="mt-4 text-slate-400 font-bold">¡Toma una foto a tu dibujo!</p>
                    </div>
                )}

                {/* STEP 2: PREVIEW & STYLE SELECTION */}
                {step === 'preview' && (
                    <div className="flex-1 flex flex-col md:flex-row">
                        <div className="flex-1 p-6 flex flex-col items-center justify-center border-r border-slate-700 bg-black/20">
                            <img src={imgSrc} alt="Original" className="rounded-xl shadow-lg max-h-[400px] border-4 border-white/20" />
                            <button onClick={reset} className="mt-4 text-slate-400 underline hover:text-white flex items-center gap-2">
                                <RefreshCw size={16} /> Tomar otra
                            </button>
                        </div>

                        <div className="flex-1 p-6 flex flex-col">
                            <h3 className="text-xl font-bold mb-6 text-center">Elige tu Magia</h3>

                            <div className="flex justify-center gap-4 mb-8 bg-slate-900/50 p-2 rounded-xl self-center">
                                <button
                                    onClick={() => { playSound('pop'); setMode('image'); }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${mode === 'image' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700'}`}
                                >
                                    <ImageIcon size={20} /> Imagen
                                </button>
                                <button
                                    onClick={() => { playSound('pop'); setMode('video'); }}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${mode === 'video' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-700'}`}
                                >
                                    <Film size={20} /> Video
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {STYLES.map(style => (
                                    <button
                                        key={style.id}
                                        onClick={() => { playSound('pop'); setSelectedStyle(style.id); }}
                                        className={`p-4 rounded-xl border-4 transition-all flex flex-col items-center gap-2 ${selectedStyle === style.id ? `border-white ${style.color} scale-105 shadow-xl` : 'border-slate-600 bg-slate-700 hover:bg-slate-600'}`}
                                    >
                                        <span className="text-4xl">{style.icon}</span>
                                        <span className="font-bold text-sm">{style.name}</span>
                                    </button>
                                ))}
                            </div>

                            <Button
                                onClick={processMagic}
                                disabled={!selectedStyle}
                                className={`w-full py-6 text-xl flex items-center justify-center gap-3 ${!selectedStyle ? 'opacity-50 cursor-not-allowed' : 'animate-pulse'}`}
                                variant="success"
                            >
                                <Wand2 /> ¡TRANSFORMAR!
                            </Button>
                        </div>
                    </div>
                )}

                {/* STEP 3: PROCESSING */}
                {step === 'processing' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-32 h-32 relative mb-8">
                            <div className="absolute inset-0 border-8 border-slate-700 rounded-full"></div>
                            <div className="absolute inset-0 border-8 border-t-purple-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-4xl animate-bounce">✨</div>
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Haciendo Magia...</h2>
                        <p className="text-slate-400 text-lg max-w-md">
                            Nuestros robots artistas están pintando tu dibujo al estilo {STYLES.find(s => s.id === selectedStyle)?.name}...
                        </p>
                    </div>
                )}

                {/* STEP 4: RESULT */}
                {step === 'result' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-blue-900/50 z-0"></div>

                        <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-2xl">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                <img src={result} alt="Magic Result" className="relative rounded-xl shadow-2xl border-4 border-white w-full" />
                                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs font-bold border border-white/20">
                                    {STYLES.find(s => s.id === selectedStyle)?.name}
                                </div>
                            </div>

                            <div className="flex gap-4 w-full">
                                <Button onClick={() => { playSound('pop'); alert('¡Guardado en tu galería!'); }} className="flex-1 flex items-center justify-center gap-2" variant="primary">
                                    <Download size={20} /> Guardar
                                </Button>
                                <Button onClick={() => { playSound('pop'); alert('¡Compartiendo!'); }} className="flex-1 flex items-center justify-center gap-2" variant="warning">
                                    <Share2 size={20} /> Compartir
                                </Button>
                            </div>

                            <button onClick={reset} className="text-white/70 hover:text-white flex items-center gap-2 font-bold mt-4">
                                <RefreshCw size={16} /> Crear otro dibujo mágico
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default MagicDrawing;
