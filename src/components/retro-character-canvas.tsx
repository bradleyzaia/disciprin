"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import type { Group } from "three"

function Character() {
    const groupRef = useRef<Group>(null)

    // Colors
    const skinColor = "#ffccaa"
    const giColor = "#d32f2f" // Red Gi
    const beltColor = "#111111" // Black Belt
    const hairColor = "#ffeb3b" // Blonde Hair
    const glovesColor = "#8d6e63" // Brownish gloves

    useFrame((state) => {
        if (groupRef.current) {
            const time = state.clock.elapsedTime
            // Fighting Stance Idle: "Breathing" / Bobbing
            // Bobs up and down
            groupRef.current.position.y = Math.sin(time * 5) * 0.05 - 0.5

            // Subtle sway
            groupRef.current.rotation.z = Math.sin(time * 2.5) * 0.02
        }
    })

    return (
        <group ref={groupRef} rotation={[0, -Math.PI / 4, 0]}> {/* Angled stance */}

            {/* --- HEAD & FACE --- */}
            <group position={[0, 1.45, 0]}>
                {/* Face */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[0.45, 0.5, 0.45]} />
                    <meshStandardMaterial color={skinColor} roughness={0.5} />
                </mesh>
                {/* Hair (Spiky / Long) */}
                <mesh position={[0, 0.35, -0.1]}>
                    <boxGeometry args={[0.55, 0.4, 0.6]} />
                    <meshStandardMaterial color={hairColor} roughness={0.8} />
                </mesh>
                {/* Ponytail / Long Hair Back */}
                <mesh position={[0, -0.2, -0.4]}>
                    <boxGeometry args={[0.3, 0.8, 0.2]} />
                    <meshStandardMaterial color={hairColor} roughness={0.8} />
                </mesh>
            </group>

            {/* --- TORSO (GI) --- */}
            <group position={[0, 0.65, 0]}>
                {/* Upper Body (Gi) */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[0.65, 0.8, 0.45]} />
                    <meshStandardMaterial color={giColor} roughness={0.9} />
                </mesh>
                {/* V-Neck / Chest Skin exposed */}
                <mesh position={[0, 0.15, 0.23]}>
                    <boxGeometry args={[0.2, 0.3, 0.05]} />
                    <meshStandardMaterial color={skinColor} roughness={0.5} />
                </mesh>
                {/* Black Belt */}
                <mesh position={[0, -0.35, 0]}>
                    <boxGeometry args={[0.7, 0.15, 0.5]} />
                    <meshStandardMaterial color={beltColor} roughness={0.9} />
                </mesh>
                {/* Belt Knot */}
                <mesh position={[0, -0.4, 0.3]}>
                    <boxGeometry args={[0.4, 0.1, 0.1]} />
                    <meshStandardMaterial color={beltColor} roughness={0.9} />
                </mesh>
            </group>

            {/* --- ARMS (Fighting Guard) --- */}
            {/* Left Arm (Forward Guard) */}
            <group position={[-0.5, 0.8, 0.3]}>
                {/* Shoulder/Sleeve */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[0.3, 0.3, 0.3]} />
                    <meshStandardMaterial color={giColor} roughness={0.9} />
                </mesh>
                {/* Forearm (raised) */}
                <mesh position={[0, 0.2, 0.3]} rotation={[0.5, 0, -0.2]}>
                    <boxGeometry args={[0.2, 0.6, 0.2]} />
                    <meshStandardMaterial color={skinColor} roughness={0.6} />
                </mesh>
                {/* Glove/Hand */}
                <mesh position={[0, 0.55, 0.35]}>
                    <boxGeometry args={[0.25, 0.25, 0.25]} />
                    <meshStandardMaterial color={glovesColor} roughness={0.7} />
                </mesh>
            </group>

            {/* Right Arm (Rear Guard/Chambered) */}
            <group position={[0.5, 0.7, 0.1]}>
                {/* Shoulder/Sleeve */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[0.3, 0.3, 0.3]} />
                    <meshStandardMaterial color={giColor} roughness={0.9} />
                </mesh>
                {/* Forearm */}
                <mesh position={[0, -0.2, 0.2]} rotation={[-0.5, 0, 0.2]}>
                    <boxGeometry args={[0.2, 0.6, 0.2]} />
                    <meshStandardMaterial color={skinColor} roughness={0.6} />
                </mesh>
                {/* Glove/Hand */}
                <mesh position={[0, -0.55, 0.25]}>
                    <boxGeometry args={[0.25, 0.25, 0.25]} />
                    <meshStandardMaterial color={glovesColor} roughness={0.7} />
                </mesh>
            </group>

            {/* --- LEGS (Wide Stance) --- */}
            {/* Left Leg (Forward) */}
            <group position={[-0.4, -0.3, 0.4]}>
                <mesh rotation={[0, 0, 0.1]}>
                    <boxGeometry args={[0.35, 1.0, 0.4]} />
                    <meshStandardMaterial color={giColor} roughness={0.9} />
                </mesh>
                {/* Foot */}
                <mesh position={[0, -0.55, 0.1]}>
                    <boxGeometry args={[0.3, 0.15, 0.5]} />
                    <meshStandardMaterial color={skinColor} roughness={0.6} />
                </mesh>
            </group>

            {/* Right Leg (Back) */}
            <group position={[0.4, -0.3, -0.4]}>
                <mesh rotation={[0, 0, -0.1]}>
                    <boxGeometry args={[0.35, 1.0, 0.4]} />
                    <meshStandardMaterial color={giColor} roughness={0.9} />
                </mesh>
                {/* Foot */}
                <mesh position={[0, -0.55, 0.1]}>
                    <boxGeometry args={[0.3, 0.15, 0.5]} />
                    <meshStandardMaterial color={skinColor} roughness={0.6} />
                </mesh>
            </group>

        </group>
    )
}

export function RetroCharacterCanvas({ className }: { className?: string }) {
    return (
        <div className={className}>
            <Canvas camera={{ position: [0, 0, 4], fov: 40 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <directionalLight position={[-5, 5, 5]} intensity={0.5} />
                <Character />
            </Canvas>
        </div>
    )
}
