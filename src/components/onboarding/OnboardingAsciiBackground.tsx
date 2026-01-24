"use client"

import { useRef, useMemo, useEffect, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { EffectComposer } from "@react-three/postprocessing"
import { OrbitControls } from "@react-three/drei"
import { AsciiEffect } from "@/components/ascii-effect"
import { Vector2 } from "three"

function FloatingPill() {
    const ref = useRef<any>(null)

    useFrame((state, delta) => {
        if (ref.current) {
            // Slow complex rotation
            ref.current.rotation.x += delta * 0.2
            ref.current.rotation.z += delta * 0.1
            // Floating bounce - slow and rhythmic
            ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
            // Slight tilt wobble
            ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.2
        }
    })

    return (
        <mesh ref={ref} scale={1.8} rotation={[Math.PI / 4, 0, Math.PI / 4]}>
            <capsuleGeometry args={[0.6, 1.4, 4, 16]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} metalness={0.6} />
        </mesh>
    )
}



export function OnboardingAsciiBackground() {
    const containerRef = useRef<HTMLDivElement>(null)
    const [resolution, setResolution] = useState(new Vector2(1200, 800))
    // Default dummy mouse pos
    const mousePos = useMemo(() => new Vector2(0, 0), [])

    useEffect(() => {
        if (containerRef.current) {
            const updateRes = () => {
                const rect = containerRef.current?.getBoundingClientRect()
                if (rect) {
                    setResolution(new Vector2(rect.width, rect.height))
                }
            }
            updateRes()
            window.addEventListener('resize', updateRes)
            return () => window.removeEventListener('resize', updateRes)
        }
    }, [])

    return (
        <div ref={containerRef} className="absolute inset-0 z-0 opacity-[0.15] overflow-hidden">
            <Canvas gl={{ antialias: false, alpha: true }} camera={{ position: [0, 0, 15], fov: 45 }}>
                <ambientLight intensity={1.5} />
                <pointLight position={[10, 10, 10]} intensity={10} />
                <pointLight position={[-10, -10, -5]} intensity={5} />

                <FloatingPill />

                <EffectComposer>
                    <AsciiEffect
                        resolution={resolution}
                        mousePos={mousePos}
                        style="standard"
                        cellSize={4}
                        color={false}
                        invert={false}
                        postfx={{
                            brightnessAdjust: 0.5, // Boost brightness for visibility
                            contrastAdjust: 2
                        }}
                    />
                </EffectComposer>
                <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
        </div>
    )
}
