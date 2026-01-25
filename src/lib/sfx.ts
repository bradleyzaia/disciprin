export const SFX = {
    HOVER_DIGITS: '/sfx/hoverdigits.ogg',
    ENTER: '/sfx/enter.ogg',
} as const;

export type SFXKey = (typeof SFX)[keyof typeof SFX];

const audioCache: Record<string, HTMLAudioElement> = {};

export const preloadSFX = (urls: string[]) => {
    urls.forEach((url) => {
        if (!audioCache[url]) {
            const audio = new Audio(url);
            audio.preload = 'auto';
            audio.volume = 0.4;
            // Force load to ensure it's in memory/cache
            audio.load();
            audioCache[url] = audio;
        }
    });
};

export const playSFX = (url: string, volume = 0.4) => {
    const audio = audioCache[url];
    if (audio) {
        // For low latency re-triggering, if it's already playing, we want to restart immediately.
        // However, if we simply reset currentTime, it might cut off the previous tail.
        // To support rapid hovers without cutoff, we can cloneNode, but that might be expensive?
        // For "hover digits", a monophonic behavior per-sound is usually cleaner than a cacophony.
        // But modifying the global singleton's currentTime can cause race conditions if play() is promised.

        // Better approach for UI SFX without delay: Clone for polyphony OR simple restart.
        // Let's try simple restart first for zero-allocation performance on hover.

        audio.currentTime = 0;
        audio.volume = volume;
        audio.play().catch((e) => {
            // Ignore autoplay policy errors (user interaction usually covers this)
            console.warn('SFX playback failed', e);
        });
    } else {
        // Fallback if not preloaded (creates new instance, might have delay)
        const newAudio = new Audio(url);
        newAudio.volume = volume;
        newAudio.play().catch(() => { });
        // Cache it for next time
        audioCache[url] = newAudio;
    }
};
