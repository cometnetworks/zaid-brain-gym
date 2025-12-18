// ==========================================
// SISTEMA DE AUDIO (SYNTH)
// ==========================================
let audioCtx = null;

const getAudioContext = () => {
    if (!audioCtx && typeof window !== 'undefined') {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            audioCtx = new AudioContext();
        }
    }
    return audioCtx;
};

const playTone = (freq, type = 'sine', duration = 0.3) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Create oscillator and gain node
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Connect
    osc.connect(gain);
    gain.connect(ctx.destination);

    // Envelope (Attack/Release)
    const now = ctx.currentTime;
    const vol = 0.1; // Master volume

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.01); // Quick attack
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration); // Fade out

    osc.start(now);
    osc.stop(now + duration + 0.1);
};

export const playSound = (effect) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Ensure context is running (resume if suspended)
    if (ctx.state === 'suspended') {
        ctx.resume().catch(e => console.error("Audio resume failed", e));
    }

    switch (effect) {
        case 'correct':
            playTone(600, 'sine', 0.1);
            setTimeout(() => playTone(800, 'sine', 0.2), 100);
            break;
        case 'wrong':
            playTone(150, 'sawtooth', 0.4);
            break;
        case 'pop':
            playTone(400, 'triangle', 0.1);
            break;
        case 'flip':
            playTone(500, 'sine', 0.05);
            break;
        case 'gameover':
            playTone(300, 'sawtooth', 0.2);
            setTimeout(() => playTone(250, 'sawtooth', 0.2), 200);
            setTimeout(() => playTone(200, 'sawtooth', 0.4), 400);
            break;
        case 'win':
            playTone(400, 'sine', 0.1);
            setTimeout(() => playTone(500, 'sine', 0.1), 100);
            setTimeout(() => playTone(600, 'sine', 0.1), 200);
            setTimeout(() => playTone(800, 'square', 0.4), 300);
            break;
        case 'move':
            playTone(300, 'triangle', 0.05);
            break;
        case 'wall':
            playTone(100, 'sawtooth', 0.1);
            break;
        // Tonos estilo Fabuloso Fred / Simon
        case 'simon_green': playTone(415.30, 'triangle', 0.5); break; // G#4
        case 'simon_red': playTone(310.00, 'triangle', 0.5); break;   // D#4
        case 'simon_yellow': playTone(252.00, 'triangle', 0.5); break;// B3
        case 'simon_blue': playTone(209.00, 'triangle', 0.5); break;  // G#3
        case 'simon_purple': playTone(150.00, 'triangle', 0.5); break;
        case 'simon_orange': playTone(500.00, 'triangle', 0.5); break;
        default: break;
    }
};

export const initAudio = () => {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
        ctx.resume().then(() => {
            console.log("Audio Context Resumed!");
        }).catch(e => console.error(e));
    }
};
