import { useState, useEffect } from "react"
import { EffectScene } from "@/components/effect-scene"

const QUOTES = [
    { text: "The obstacle is the path.", author: "Zen proverb" },
    { text: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche" },
    { text: "The best time to plant a tree was twenty years ago. The second best time is now.", author: "Chinese proverb" },
    { text: "Do not seek to follow in the footsteps of the wise. Seek what they sought.", author: "Matsuo Bashō" },
    { text: "The wound is the place where the Light enters you.", author: "Rumi" },
    { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Will Durant" },
    { text: "Before enlightenment, chop wood, carry water. After enlightenment, chop wood, carry water.", author: "Zen saying" },
    { text: "The mind is its own place, and in itself can make a heaven of hell, a hell of heaven.", author: "John Milton" },
    { text: "You are not a drop in the ocean. You are the entire ocean in a drop.", author: "Rumi" },
    { text: "The only way out is through.", author: "Robert Frost" },
    { text: "When you reach the end of what you should know, you will be at the beginning of what you should sense.", author: "Kahlil Gibran" },
    { text: "Fall seven times, stand up eight.", author: "Japanese proverb" },
    { text: "No man is free who is not master of himself.", author: "Epictetus" },
    { text: "The quieter you become, the more you can hear.", author: "Ram Dass" },
    { text: "What you seek is seeking you.", author: "Rumi" },
    { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius" },
    { text: "The flame that burns twice as bright burns half as long.", author: "Lao Tzu" },
    { text: "When the student is ready, the teacher will appear.", author: "Buddhist proverb" },
    { text: "Everything has beauty, but not everyone sees it.", author: "Confucius" },
    { text: "The way you do one thing is the way you do everything.", author: "Zen saying" },
    { text: "An unexamined life is not worth living.", author: "Socrates" },
    { text: "Out beyond ideas of wrongdoing and rightdoing, there is a field. I'll meet you there.", author: "Rumi" },
    { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Ralph Waldo Emerson" },
    { text: "We suffer more often in imagination than in reality.", author: "Seneca" },
    { text: "If you are depressed you are living in the past. If you are anxious you are living in the future. If you are at peace you are living in the present.", author: "Lao Tzu" },
    { text: "A smooth sea never made a skilled sailor.", author: "Franklin D. Roosevelt" },
    { text: "He who knows others is wise; he who knows himself is enlightened.", author: "Lao Tzu" },
    { text: "The privilege of a lifetime is to become who you truly are.", author: "Carl Jung" },
    { text: "One who conquers himself is greater than another who conquers a thousand times a thousand on the battlefield.", author: "The Dhammapada" },
    { text: "When I let go of what I am, I become what I might be.", author: "Lao Tzu" },
    { text: "Between stimulus and response there is a space. In that space is our power to choose our response.", author: "Viktor Frankl" }
]

export function Quote() {
    const [quote, setQuote] = useState(QUOTES[0])
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
        const random = QUOTES[Math.floor(Math.random() * QUOTES.length)]
        setQuote(random)
    }, [])

    if (!isClient) return null // Or return a skeleton/loading state

    return (
        <section className="relative w-full h-[600px] overflow-hidden select-none">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <EffectScene className="w-full h-full" />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full p-8 text-center pointer-events-none">
                <div className="max-w-4xl space-y-4">
                    <h2 className="text-xs text-white font-mono uppercase">
                        "{quote.text}"
                    </h2>
                    <p className="text-xs text-white/50 font-mono uppercase text-right">
                        — {quote.author}
                    </p>
                </div>
            </div>
        </section>
    )
}
