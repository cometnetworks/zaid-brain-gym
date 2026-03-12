import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, Wand2, Image as ImageIcon, Film, RefreshCw, Download, Share2, X, AlertTriangle } from 'lucide-react';
import Button from '../../components/ui/Button';
import { playSound } from '../../utils/audio';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const TOGETHER_API_KEY = import.meta.env.VITE_TOGETHER_API_KEY || '';

const STYLES = [
    { id: 'pixar', name: 'Pixar', icon: '🎨', color: 'bg-blue-500', prompt: 'Convert this drawing into a high-quality 3D Pixar-style animation character. Vibrant colors, cute features, soft lighting, 3d render.' },
    { id: 'anime', name: 'One Piece', icon: '⚔️', color: 'bg-orange-500', prompt: 'Convert this drawing into a high-quality One Piece anime style character. Cel shaded, vibrant colors, dramatic lighting, manga style.' },
    { id: 'minecraft', name: 'Minecraft', icon: '🧱', color: 'bg-green-600', prompt: 'Convert this drawing into a Minecraft blocky style character. Voxel art, pixelated textures, cube world aesthetic.' },
    { id: 'marvel', name: 'Cómic Marvel', icon: '🦸', color: 'bg-red-600', prompt: 'Convert this drawing into a Marvel comic book style character. Bold lines, dynamic shading, comic book aesthetic, superhero.' },
    { id: 'sonic', name: 'Sonic Game', icon: '🦔', color: 'bg-blue-600', prompt: 'Convert this drawing into a Sonic the Hedgehog video game character. Blue hedgehog style, 3D modern look, dynamic pose, high energy.' },
    { id: 'spiderman', name: 'Spider-Man', icon: '🕷️', color: 'bg-red-700', prompt: 'Convert this drawing into a Marvel Spider-Man character. The character is wearing the iconic red and blue suit but has NO MASK, showing a human face. High quality cinematic lighting, superhero aesthetic.' },
    { id: 'ghibli', name: 'Studio Ghibli', icon: '🚂', color: 'bg-sky-400', prompt: 'Convert this drawing into a Studio Ghibli anime style illustration. Soft hand-drawn textures, high detail, whimsical atmosphere, cinematic anime aesthetic.' },
    { id: 'zombie', name: 'Zombi', icon: '🧟', color: 'bg-emerald-900', prompt: 'Convert this drawing into a scary zombie style character. Post-apocalyptic, weathered clothes, green/grey skin, spooky details, horror aesthetic.' },
];

const MagicDrawing = ({ onBack }) => {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [step, setStep] = useState('capture'); // capture, preview, processing, result
    const [selectedStyle, setSelectedStyle] = useState(null);
    const [mode, setMode] = useState('image'); // image, video
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [webcamError, setWebcamError] = useState(null);
    const [processingStatus, setProcessingStatus] = useState('');

    const capture = useCallback(() => {
        playSound('pop');
        const imageSrc = webcamRef.current?.getScreenshot();
        if (!imageSrc) {
            setError('No se pudo capturar la imagen. Asegúrate de que tu cámara esté activa.');
            return;
        }
        setError(null);
        setImgSrc(imageSrc);
        setStep('preview');
    }, [webcamRef]);

    const processMagic = async () => {
        if (!selectedStyle) return;

        if (!GROQ_API_KEY || !TOGETHER_API_KEY) {
            setError('Faltan las API Keys. Configura VITE_GROQ_API_KEY y VITE_TOGETHER_API_KEY en tu archivo .env.local');
            return;
        }

        playSound('win');
        setStep('processing');
        setError(null);
        setProcessingStatus('Analizando tu dibujo con IA...');

        try {
            // 1. VISION: Describe the drawing using Groq (Llama 3.2 Vision)
            console.log("1. Analyzing image with Groq Vision...");

            const visionResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                },
                body: JSON.stringify({
                    model: 'meta-llama/llama-4-scout-17b-16e-instruct',
                    messages: [
                        {
                            role: 'user',
                            content: [
                                {
                                    type: 'text',
                                    text: 'Analyze this drawing for the purpose of recreating it as a high-quality image. Describe the EXACT composition, framing, subject pose, and element placement. Be extremely literal about what is where. Example: "A cat sitting in the center facing right, with a tree on the left." Ignore the rough sketch style, focus on the content and layout.'
                                },
                                {
                                    type: 'image_url',
                                    image_url: { url: imgSrc }
                                },
                            ],
                        },
                    ],
                    max_tokens: 500,
                }),
            });

            if (!visionResponse.ok) {
                const errData = await visionResponse.json().catch(() => ({}));
                throw new Error(errData?.error?.message || `Groq API error: ${visionResponse.status}`);
            }

            const visionData = await visionResponse.json();
            const description = visionData.choices[0].message.content;
            console.log("Description:", description);

            // 2. GENERATION: Create the new image using Together AI (FLUX)
            setProcessingStatus('¡Genial! Ahora creando tu obra de arte...');
            const stylePrompt = STYLES.find(s => s.id === selectedStyle).prompt;
            const finalPrompt = `${stylePrompt} STRICTLY follow this composition and scene description: ${description}. Keep the same camera angle and framing.`;

            console.log("2. Generating image with Together AI FLUX...");

            const imageResponse = await fetch('https://api.together.xyz/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${TOGETHER_API_KEY}`,
                },
                body: JSON.stringify({
                    model: 'black-forest-labs/FLUX.1-schnell',
                    prompt: finalPrompt,
                    width: 1024,
                    height: 1024,
                    steps: 4,
                    n: 1,
                    response_format: 'b64_json',
                }),
            });

            if (!imageResponse.ok) {
                const errData = await imageResponse.json().catch(() => ({}));
                throw new Error(errData?.error?.message || `Together AI error: ${imageResponse.status}`);
            }

            const imageData = await imageResponse.json();
            const newImageBase64 = "data:image/png;base64," + imageData.data[0].b64_json;

            setResult(newImageBase64);
            playSound('correct');
            setStep('result');

        } catch (err) {
            console.error("Generation Error:", err);

            let errorMessage = `Error: ${err.message || "Algo salió mal"}`;

            if (err.message?.includes('401') || err.message?.includes('auth')) {
                errorMessage = "Error de autenticación: Revisa tus API Keys (Groq / Together AI).";
            } else if (err.message?.includes('429') || err.message?.includes('rate')) {
                errorMessage = "Has excedido tu cuota. Espera un momento e intenta de nuevo.";
            }

            setError(errorMessage);
            setStep('preview');
        }
    };

    const handleDownload = () => {
        if (!result) return;
        playSound('pop');
        const link = document.createElement('a');
        link.href = result;
        link.download = `dibujo-magico-${selectedStyle}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleShare = async () => {
        if (!result) return;
        playSound('pop');
        try {
            const res = await fetch(result);
            const blob = await res.blob();
            const file = new File([blob], `dibujo-magico-${selectedStyle}.png`, { type: 'image/png' });

            if (navigator.share && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: '¡Mi Dibujo Mágico! ✨',
                    text: `¡Mira mi dibujo transformado en estilo ${STYLES.find(s => s.id === selectedStyle)?.name}!`,
                    files: [file],
                });
            } else {
                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]);
                alert('¡Imagen copiada al portapapeles!');
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Share error:', err);
                alert('No se pudo compartir. Intenta descargar la imagen.');
            }
        }
    };

    const reset = () => {
        setImgSrc(null);
        setResult(null);
        setStep('capture');
        setSelectedStyle(null);
        setError(null);
        setProcessingStatus('');
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
                <div className="w-10" /> {/* Spacer for alignment */}
            </div>

            {/* API Status Badge */}
            <div className="mb-4 flex gap-2">
                <span className={`text-xs px-3 py-1 rounded-full font-bold ${GROQ_API_KEY ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
                    {GROQ_API_KEY ? '✓ Groq' : '✗ Groq'}
                </span>
                <span className={`text-xs px-3 py-1 rounded-full font-bold ${TOGETHER_API_KEY ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
                    {TOGETHER_API_KEY ? '✓ Together AI' : '✗ Together AI'}
                </span>
            </div>

            <div className="w-full max-w-4xl bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-700 min-h-[600px] flex flex-col relative">

                {/* STEP 1: CAPTURE */}
                {step === 'capture' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
                        <div className="relative rounded-2xl overflow-hidden border-4 border-slate-600 shadow-xl w-full max-w-lg aspect-video bg-black">
                            {webcamError ? (
                                <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-slate-800">
                                    <AlertTriangle className="w-12 h-12 text-yellow-400 mb-4" />
                                    <p className="text-white font-bold mb-2">No se pudo acceder a la cámara</p>
                                    <p className="text-slate-400 text-sm">{webcamError}</p>
                                </div>
                            ) : (
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    className="w-full h-full object-cover"
                                    onUserMediaError={(err) => {
                                        console.error('Webcam error:', err);
                                        setWebcamError(
                                            typeof err === 'string' ? err :
                                            err?.name === 'NotAllowedError' ? 'Permiso de cámara denegado. Actívalo en la configuración de tu navegador.' :
                                            err?.name === 'NotFoundError' ? 'No se encontró ninguna cámara conectada.' :
                                            'Error al acceder a la cámara. Revisa los permisos.'
                                        );
                                    }}
                                />
                            )}
                        </div>

                        {error && (
                            <div className="mt-4 bg-red-500/20 text-red-300 p-3 rounded-lg border border-red-500/50 max-w-lg">
                                {error}
                            </div>
                        )}

                        <div className="mt-8 flex gap-4">
                            <Button
                                onClick={capture}
                                disabled={!!webcamError}
                                className={`rounded-full w-20 h-20 flex items-center justify-center border-4 border-white ring-4 ring-purple-500 bg-red-500 hover:scale-110 active:scale-95 transition-all ${webcamError ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <Camera size={32} />
                            </Button>
                        </div>
                        <p className="mt-4 text-slate-400 font-bold">
                            {webcamError ? 'Revisa tu cámara para continuar' : '¡Toma una foto a tu dibujo!'}
                        </p>
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
                            {error && <div className="mt-4 bg-red-500/20 text-red-300 p-3 rounded-lg border border-red-500/50">{error}</div>}
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
                                    disabled
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-slate-500 cursor-not-allowed border border-slate-700 bg-slate-800/50"
                                >
                                    <Film size={20} /> Video <span className="text-[10px] bg-slate-700 px-1 rounded text-slate-400">Pronto</span>
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-2 mb-4 scrollbar-thin scrollbar-thumb-slate-600">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {STYLES.map(style => (
                                        <button
                                            key={style.id}
                                            onClick={() => { playSound('pop'); setSelectedStyle(style.id); }}
                                            className={`p-3 rounded-xl border-4 transition-all flex flex-col items-center gap-1 ${selectedStyle === style.id ? `border-white ${style.color} scale-105 shadow-xl` : 'border-slate-600 bg-slate-700 hover:bg-slate-600'}`}
                                        >
                                            <span className="text-3xl">{style.icon}</span>
                                            <span className="font-bold text-[10px] sm:text-xs text-center leading-tight uppercase tracking-tighter">{style.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Button
                                onClick={processMagic}
                                disabled={!selectedStyle}
                                className={`w-full py-6 text-xl flex items-center justify-center gap-3 ${!selectedStyle ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 transition-transform'}`}
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
                            {processingStatus}
                        </p>
                        <div className="mt-4 flex gap-2 text-xs text-slate-500">
                            <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">Groq Vision</span>
                            <span className="text-slate-600">→</span>
                            <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">FLUX (Together AI)</span>
                        </div>
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
                                <Button onClick={handleDownload} className="flex-1 flex items-center justify-center gap-2" variant="primary">
                                    <Download size={20} /> Guardar
                                </Button>
                                <Button onClick={handleShare} className="flex-1 flex items-center justify-center gap-2" variant="warning">
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
