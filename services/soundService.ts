// Sound Service — synthesized alarm tones + custom uploaded sounds
// Built-in: classic, gentle, urgent, digital, bells
// Custom: user-uploaded audio stored as base64 data URLs

import { getCustomSounds, saveCustomSound, CustomSound } from '../store/alarmStore';

export interface AlarmSound {
    id: string;
    emoji: string;
}

export const ALARM_SOUNDS: AlarmSound[] = [
    { id: 'classic', emoji: '🔔' },
    { id: 'gentle', emoji: '🌙' },
    { id: 'urgent', emoji: '🚨' },
    { id: 'digital', emoji: '📱' },
    { id: 'bells', emoji: '🔔' },
];

let audioContext: AudioContext | null = null;
let activeOscillators: OscillatorNode[] = [];
let activeGains: GainNode[] = [];
let activeSource: AudioBufferSourceNode | null = null;
let loopTimeout: ReturnType<typeof setTimeout> | null = null;

function getAudioContext(): AudioContext {
    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    return audioContext;
}

function stopAll() {
    activeOscillators.forEach(osc => {
        try { osc.stop(); } catch (e) { }
    });
    activeGains.forEach(gain => {
        try { gain.disconnect(); } catch (e) { }
    });
    if (activeSource) {
        try { activeSource.stop(); activeSource.disconnect(); } catch (e) { }
        activeSource = null;
    }
    activeOscillators = [];
    activeGains = [];
    if (loopTimeout) {
        clearTimeout(loopTimeout);
        loopTimeout = null;
    }
}

function playTone(ctx: AudioContext, freq: number, startTime: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + duration);
    activeOscillators.push(osc);
    activeGains.push(gain);
}

// --- Sound definitions ---

function playClassic(ctx: AudioContext) {
    // Classic alarm: two-tone beep pattern (high-low)
    const now = ctx.currentTime;
    for (let i = 0; i < 3; i++) {
        playTone(ctx, 880, now + i * 0.4, 0.15, 'square', 0.2);
        playTone(ctx, 660, now + i * 0.4 + 0.2, 0.15, 'square', 0.2);
    }
}

function playGentle(ctx: AudioContext) {
    // Gentle: soft ascending chime
    const now = ctx.currentTime;
    const notes = [523, 587, 659, 784, 880]; // C5 D5 E5 G5 A5
    notes.forEach((freq, i) => {
        playTone(ctx, freq, now + i * 0.25, 0.4, 'sine', 0.15);
    });
}

function playUrgent(ctx: AudioContext) {
    // Urgent: rapid high-pitched beeps
    const now = ctx.currentTime;
    for (let i = 0; i < 8; i++) {
        playTone(ctx, 1200, now + i * 0.12, 0.08, 'sawtooth', 0.15);
    }
}

function playDigital(ctx: AudioContext) {
    // Digital: electronic melody pattern
    const now = ctx.currentTime;
    const notes = [440, 554, 659, 554, 440, 659]; // A4 C#5 E5 C#5 A4 E5
    notes.forEach((freq, i) => {
        playTone(ctx, freq, now + i * 0.2, 0.18, 'triangle', 0.2);
    });
}

function playBells(ctx: AudioContext) {
    // Bells: layered bell-like tones
    const now = ctx.currentTime;
    const notes = [523, 659, 784]; // C5 E5 G5 (major chord)
    for (let r = 0; r < 2; r++) {
        notes.forEach((freq, i) => {
            playTone(ctx, freq, now + r * 0.8 + i * 0.15, 0.6, 'sine', 0.12);
            // Overtone for bell character
            playTone(ctx, freq * 2.5, now + r * 0.8 + i * 0.15, 0.3, 'sine', 0.05);
        });
    }
}

const soundPlayers: Record<string, (ctx: AudioContext) => void> = {
    classic: playClassic,
    gentle: playGentle,
    urgent: playUrgent,
    digital: playDigital,
    bells: playBells,
};

// --- Custom sound playback ---

async function loadCustomDataUrl(soundId: string): Promise<string | null> {
    try {
        const customs = await getCustomSounds();
        const found = customs.find(s => s.id === soundId);
        return found ? found.dataUrl : null;
    } catch {
        return null;
    }
}

async function playCustomAudio(ctx: AudioContext, dataUrl: string, loop = false) {
    try {
        const response = await fetch(dataUrl);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = loop;
        source.connect(ctx.destination);
        source.start();
        activeSource = source;
    } catch (e) {
        console.warn('Custom audio playback failed:', e);
    }
}

// --- Public API ---

/** Play a short preview of a sound */
export async function previewSound(soundId: string) {
    try {
        stopAll();
        const ctx = getAudioContext();

        if (soundId.startsWith('custom_')) {
            const dataUrl = await loadCustomDataUrl(soundId);
            if (dataUrl) await playCustomAudio(ctx, dataUrl);
            return;
        }

        const player = soundPlayers[soundId] || playClassic;
        player(ctx);
    } catch (e) {
        console.warn('Sound preview failed:', e);
    }
}

/** Start looping alarm sound */
export async function startAlarmSound(soundId: string) {
    try {
        stopAll();
        const ctx = getAudioContext();

        if (soundId.startsWith('custom_')) {
            const dataUrl = await loadCustomDataUrl(soundId);
            if (dataUrl) await playCustomAudio(ctx, dataUrl, true);
            return;
        }

        const player = soundPlayers[soundId] || playClassic;
        const playLoop = () => {
            player(ctx);
            loopTimeout = setTimeout(playLoop, 2000);
        };
        playLoop();
    } catch (e) {
        console.warn('Alarm sound start failed:', e);
    }
}

/** Stop any playing alarm sound */
export function stopAlarmSound() {
    stopAll();
}

/** Open file picker and save uploaded audio as a custom sound */
export function pickAudioFile(): Promise<CustomSound | null> {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/*';
        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) { resolve(null); return; }

            const reader = new FileReader();
            reader.onload = async () => {
                const dataUrl = reader.result as string;
                const name = file.name.replace(/\.[^.]+$/, ''); // strip extension
                const id = `custom_${Date.now()}`;
                const sound: CustomSound = { id, name, dataUrl };
                await saveCustomSound(sound);
                resolve(sound);
            };
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(file);
        };
        input.click();
    });
}
