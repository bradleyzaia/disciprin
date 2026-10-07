"use client"

import { useState, useEffect, useRef, Suspense, useMemo } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { EffectComposer } from "@react-three/postprocessing"
import { useVideoTexture } from "@react-three/drei"
import { Vector2 } from "three"
import { AsciiEffect } from "./ascii-effect"
import { cn } from "@/lib/utils"
import { colors } from "@/styles/tokens"

function VideoScene() {
    const texture = useVideoTexture("/test.mp4", { muted: true, playsInline: true, autoplay: true, loop: true })
    const { viewport } = useThree()

    const videoConfig = useMemo(() => {
        const vidW = texture.image?.videoWidth || 1920
        const vidH = texture.image?.videoHeight || 1080
        const vidAspect = vidW / vidH
        return { vidAspect }
    }, [texture])

    const scale: [number, number, number] = useMemo(() => {
        const { vidAspect } = videoConfig
        const { width, height } = viewport
        const viewAspect = width / height

        // Cover logic
        if (viewAspect > vidAspect) {
            // Viewport is wider than video -> constrain by width, let height overshoot (or usually height is strictly constrained by ratio? wait.)
            // If Viewport is 2:1 and Video is 1:1.
            // We want to cover.
            // So width = viewport.width. Height = viewport.width / 1 = huge.
            // This covers.
            return [width, width / vidAspect, 1] // Correct
        } else {
            // Viewport is taller (e.g. mobile 1:2) and Video is 1:1.
            // We want to cover.
            // Width = viewport.height * vidAspect = large. Height = viewport.height.
            return [height * vidAspect, height, 1] // Correct
        }
    }, [viewport.width, viewport.height, videoConfig.vidAspect])


    return (
        <mesh scale={scale}>
            <planeGeometry />
            <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
    )
}

export function EffectScene({ className }: { className?: string }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const mousePos = useMemo(() => new Vector2(0, 0), [])
    const [resolution, setResolution] = useState(new Vector2(1920, 1080))

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = rect.height - (e.clientY - rect.top)
                mousePos.set(x, y)
            }
        }

        const container = containerRef.current
        if (container) {
            container.addEventListener("mousemove", handleMouseMove)

            const rect = container.getBoundingClientRect()
            setResolution(new Vector2(rect.width, rect.height))

            const handleResize = () => {
                const rect = container.getBoundingClientRect()
                setResolution(new Vector2(rect.width, rect.height))
            }
            window.addEventListener("resize", handleResize)

            return () => {
                container.removeEventListener("mousemove", handleMouseMove)
                window.removeEventListener("resize", handleResize)
            }
        }
    }, [])

    return (
        <div ref={containerRef} className={cn("w-full h-full relative", className)}>
            <Canvas
                gl={{ antialias: false }}
                camera={{ position: [0, 0, 5], fov: 50 }}
                style={{ background: colors.black }}
            >
                <color attach="background" args={[colors.black]} />

                <Suspense fallback={null}>
                    <VideoScene />
                </Suspense>

                {/* ASCII Effect with PostFX */}
                <EffectComposer>
                    <AsciiEffect
                        style="standard"
                        cellSize={2}
                        invert={false}
                        color={false}
                        resolution={resolution}
                        mousePos={mousePos}
                        postfx={{
                            scanlineIntensity: 0,
                            scanlineCount: 100,
                            targetFPS: 30,
                            jitterIntensity: 0,
                            jitterSpeed: 0,
                            mouseGlowEnabled: false,
                            mouseGlowRadius: 100,
                            mouseGlowIntensity: 1.5,
                            vignetteIntensity: 0,
                            vignetteRadius: 0,
                            colorPalette: "original",
                            curvature: 0,
                            aberrationStrength: 0,
                            noiseIntensity: 0,
                            noiseScale: 1,
                            noiseSpeed: 1,
                            waveAmplitude: 0,
                            waveFrequency: 10,
                            waveSpeed: 1,
                            glitchIntensity: 0,
                            glitchFrequency: 0,
                            brightnessAdjust: 0.1, // Range is typically -1.0 to 1.0 (0.1 adds 10% brightness)
                            contrastAdjust: 1,
                        }}
                    />
                </EffectComposer>
            </Canvas>
        </div>
    )
}
