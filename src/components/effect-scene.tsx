"use client"

import { useState, useEffect, useRef, Suspense, useMemo } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { EffectComposer } from "@react-three/postprocessing"
import { useVideoTexture } from "@react-three/drei"
import { Vector2 } from "three"
import { AsciiEffect } from "./ascii-effect"

function VideoScene() {
    const texture = useVideoTexture("/test.webm")
    const { viewport } = useThree()

    return (
        <mesh scale={[viewport.width, viewport.height, 1]}>
            <planeGeometry />
            <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
    )
}

export function EffectScene() {
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
        <div ref={containerRef} style={{ width: "100%", height: "100vh" }}>
            <Canvas
                gl={{ antialias: false }}
                camera={{ position: [0, 0, 5], fov: 50 }}
                style={{ background: "#000000" }}
            >
                <color attach="background" args={["#000000"]} />

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
