export const SFX = {
    HOVER_DIGITS: '/sfx/hoverdigits.ogg',
    ENTER: '/sfx/enter.ogg',
} as const;

export type SFXKey = (typeof SFX)[keyof typeof SFX];

// Use Web Audio API for low-latency playback (especially on mobile)
let audioCtx: AudioContext | null = null;
const buffers: Record<string, AudioBuffer> = {};

const getAudioContext = () => {
    if (!audioCtx && typeof window !== 'undefined') {
        // Cross-browser support
        const Ctx = window.AudioContext || (window as any).webkitAudioContext;
        if (Ctx) {
            audioCtx = new Ctx();
        }
    }
    return audioCtx;
};

export const preloadSFX = async (urls: string[]) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Parallel fetch and decode
    await Promise.all(
        urls.map(async (url) => {
            if (buffers[url]) return;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error ${response.status}`);
                }
                const arrayBuffer = await response.arrayBuffer();
                // decodeAudioData is callback-based in older browsers but Promise-based in modern ones.
                // We'll use the promise syntax which is widely supported now.
                const decodedBuffer = await ctx.decodeAudioData(arrayBuffer);
                buffers[url] = decodedBuffer;
            } catch (error) {
                console.warn(`Failed to preload SFX: ${url}`, error);
            }
        })
    );
};

export const playSFX = (url: string, volume = 0.4) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Auto-resume AudioContext on user interaction (needed for mobile Safari/Chrome)
    if (ctx.state === 'suspended') {
        ctx.resume().catch((e) => console.warn('AudioContext resume failed', e));
    }

    const buffer = buffers[url];
    if (buffer) {
        try {
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            const gainNode = ctx.createGain();
            gainNode.gain.value = volume;

            source.connect(gainNode);
            gainNode.connect(ctx.destination);

            // start(0) plays immediately
            source.start(0);
        } catch (e) {
            console.warn('Error playing SFX source', e);
        }
    } else {
        // Fallback: If not preloaded, try to fetch and play on the fly (will have delay)
        // This ensures the sound eventually plays even if preload failed or wasn't called.
        fetch(url)
            .then(res => res.arrayBuffer())
            .then(ab => ctx.decodeAudioData(ab))
            .then(buf => {
                buffers[url] = buf;
                playSFX(url, volume); // Retry play
            })
            .catch(e => console.warn('On-demand SFX load failed', e));
    }
};
