"use client"

import { useState, useEffect, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { EffectComposer } from "@react-three/postprocessing"
import { Vector2 } from "three"
import { AsciiEffect } from "./ascii-effect"

function Pill() {
    const meshRef = useRef<any>(null)

    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.5
            meshRef.current.rotation.y += delta * 0.2
            meshRef.current.rotation.z += delta * 0.1
        }
    })

    return (
        <mesh ref={meshRef}>
            <capsuleGeometry args={[0.8, 1.5, 4, 8]} />
            <meshStandardMaterial color="black" roughness={0.5} />
        </mesh>
    )
}

export function AsciiPillCanvas({ className, cellSize = 1 }: { className?: string, cellSize?: number }) {
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
            <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
                <color attach="background" args={["white"]} />

                <ambientLight intensity={0} />
                <pointLight position={[20, 20, 20]} />

                <Pill />

                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    makeDefault
                />

                <EffectComposer>
                    <AsciiEffect
                        style="standard"
                        cellSize={cellSize}
                        invert={true}
                        resolution={resolution}
                        color={true}
                        postfx={{
                            contrastAdjust: 1,
                            brightnessAdjust: 0.5
                        }}
                    />
                </EffectComposer>
            </Canvas>
        </div>
    )
}
