"use client"

import { useState, useEffect, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { EffectComposer } from "@react-three/postprocessing"
import { Vector2 } from "three"
import { AsciiEffect } from "./ascii-effect"

export function CameraAsciiFeed({ className }: { className?: string }) {
    // We need to track the container size to pass resolution to the effect
    // But for now, we can rely on the Canvas auto-sizing and passing window size or use a resize observer.
    // The AsciiEffect expects a resolution uniform.

    // Let's use a simpler approach for resolution inside the canvas components if possible, 
    // but the existing `effect-scene` passed it down. Let's replicate that logic for robustness.

    const containerRef = useRef<HTMLDivElement>(null)
    const [resolution, setResolution] = useState(new Vector2(100, 100))

    useEffect(() => {
        if (!containerRef.current) return

        const updateSize = () => {
            const rect = containerRef.current?.getBoundingClientRect()
            if (rect) {
                setResolution(new Vector2(rect.width, rect.height))
            }
        }

        updateSize()
        const observer = new ResizeObserver(updateSize)
        observer.observe(containerRef.current)

        return () => observer.disconnect()
    }, [])

    return (
        <div ref={containerRef} className={className}>
            <Canvas
                gl={{ antialias: false }}
                camera={{ position: [0, 0, 5], fov: 50 }}
            >
                <color attach="background" args={["black"]} />

                {/* We render a plane that fills the camera view */}
                {/* 
                   At z=0, with camera at z=5 and fov=50:
                   height = 2 * tan(50/2 * deg2rad) * 5 ≈ 4.66
                   width = height * aspect
                   
                   Instead of calculating exact math, let's just use `drei`'s Image or just a large plane 
                   and let the texture cover it. 
                */}
                <VideoPlaneWrapper />

                <EffectComposer>
                    <AsciiEffect
                        style="standard"
                        cellSize={4}
                        invert={false}
                        color={false}
                        resolution={resolution}
                        postfx={{
                            contrastAdjust: 1.2,
                            brightnessAdjust: 0.2,
                        }}

                    />
                </EffectComposer>
            </Canvas>
        </div>
    )
}

function VideoPlaneWrapper() {
    const [video] = useState(() => {
        const vid = document.createElement("video")
        vid.playsInline = true
        vid.muted = true
        vid.loop = true
        vid.crossOrigin = "Anonymous"
        return vid
    })

    useEffect(() => {
        let stream: MediaStream | null = null;
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
                .then(s => {
                    stream = s
                    video.srcObject = s
                    video.play()
                })
                .catch(console.error)
        }
        return () => {
            if (stream) {
                stream.getTracks().forEach(t => t.stop())
            }
        }
    }, [video])

    return (
        <mesh scale={[10, 10, 1]}>
            <planeGeometry />
            <meshBasicMaterial>
                <videoTexture attach="map" args={[video]} />
            </meshBasicMaterial>
        </mesh>
    )
}
