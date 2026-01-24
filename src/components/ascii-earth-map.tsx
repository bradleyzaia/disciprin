"use client"

import { useState, useEffect, useRef } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { EffectComposer } from "@react-three/postprocessing"
import { TextureLoader, Vector2, MathUtils } from "three"
import { AsciiEffect } from "./ascii-effect"

const TIMEZONE_COORDS: Record<string, { lat: number; lon: number }> = {
    "UTC": { lat: 51.5, lon: 0 },
    "AMERICA/NEW_YORK": { lat: 40.71, lon: -74.00 },
    "AMERICA/LOS_ANGELES": { lat: 34.05, lon: -118.24 },
    "EUROPE/LONDON": { lat: 51.50, lon: -0.12 },
    "EUROPE/BERLIN": { lat: 52.52, lon: 13.40 },
    "ASIA/TOKYO": { lat: 35.67, lon: 139.65 },
    "AUSTRALIA/SYDNEY": { lat: -33.86, lon: 151.20 },
    "ASIA/BANGKOK": { lat: 13.75, lon: 100.50 },
}

function Globe({ timezone }: { timezone: string }) {
    const texture = useLoader(TextureLoader, "/world-map.png")
    const meshRef = useRef<any>(null)
    const targetRotation = useRef(new Vector2(0, 0))
    const currentRotation = useRef(new Vector2(0, 0))

    useEffect(() => {
        const tz = timezone.toUpperCase()
        const coords = TIMEZONE_COORDS[tz] || TIMEZONE_COORDS["UTC"]

        // Convert Lat/Lon to Radians
        const latRad = coords.lat * (Math.PI / 180)
        const lonRad = coords.lon * (Math.PI / 180)

        // Target Rotation logic:
        // By default, sphere faces +Z. Texture wraps around Y.
        // We want the coordinate (lat, lon) to be at +Z.
        // Rotate Y to bring longitude to front.
        // Rotate X to bring latitude to center.

        // Adjust for standard texture mapping
        // Usually, Lon 0 is at Prime Meridian.
        // We need to rotate Y by -lonRad (plus offset depending on texture start).
        // Let's assume standard starts at +/- 180 or 0. 
        // Trial & error or standard [-PI/2] offset is common if texture starts at 0.

        targetRotation.current.set(latRad, -lonRad - Math.PI / 2)

    }, [timezone])

    useFrame((_state, delta) => {
        currentRotation.current.x = MathUtils.damp(currentRotation.current.x, targetRotation.current.x, 2, delta)
        currentRotation.current.y = MathUtils.damp(currentRotation.current.y, targetRotation.current.y, 2, delta)

        if (meshRef.current) {
            meshRef.current.rotation.x = currentRotation.current.x
            meshRef.current.rotation.y = currentRotation.current.y
        }
    })

    return (
        <mesh ref={meshRef} rotation={[0, 0, 0]}>
            <sphereGeometry args={[2.2, 64, 64]} />
            <meshStandardMaterial map={texture} color="white" roughness={0.6} metalness={0.2} />
        </mesh>
    )
}

export function AsciiEarthMap({ timezone, className }: { timezone: string, className?: string }) {
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
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <color attach="background" args={["black"]} />

                <ambientLight intensity={0.2} />
                <directionalLight position={[5, 3, 5]} intensity={2.0} />
                <directionalLight position={[-5, -3, -5]} intensity={0.5} />

                <Globe timezone={timezone} />

                <EffectComposer>
                    <AsciiEffect
                        style="standard"
                        cellSize={6}
                        invert={true}
                        resolution={resolution}
                        postfx={{
                            contrastAdjust: 1.5,
                            brightnessAdjust: 0.1
                        }}
                    />
                </EffectComposer>
            </Canvas>
        </div>
    )
}
