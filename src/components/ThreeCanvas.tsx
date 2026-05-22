import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ── Smooth Flowing Vertex Shader ──
const vertexShader = `
precision highp float;

varying vec2 vUv;
varying float vElevation;
uniform float uTime;
uniform vec2 uMouse;

void main() {
  vUv = uv;
  vec3 pos = position;
  
  // Layer smooth sine waves for silk-like undulation
  float wave1 = sin(pos.x * 1.2 + uTime * 0.3) * cos(pos.y * 0.8 + uTime * 0.2) * 0.35;
  float wave2 = sin(pos.x * 0.5 - uTime * 0.15) * sin(pos.y * 1.5 + uTime * 0.25) * 0.2;
  float wave3 = cos(pos.x * 0.8 + pos.y * 0.6 + uTime * 0.1) * 0.15;
  
  // Ultra-smooth mouse interaction
  vec2 center = vec2(uMouse.x * 2.0 - 1.0, uMouse.y * 2.0 - 1.0);
  float d = length(uv - uMouse);
  float mouseWave = exp(-d * 4.0) * 0.3;
  
  float elevation = wave1 + wave2 + wave3 + mouseWave;
  pos.z = elevation;
  vElevation = elevation;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

// ── Smooth Flowing Fragment Shader ──
const fragmentShader = `
precision highp float;

varying vec2 vUv;
varying float vElevation;
uniform float uTime;

void main() {
  // Deep navy palette
  vec3 deep    = vec3(0.028, 0.045, 0.095);   // Deepest navy
  vec3 mid     = vec3(0.055, 0.085, 0.165);    // Mid navy  
  vec3 light   = vec3(0.10, 0.14, 0.25);       // Lighter navy
  vec3 gold    = vec3(0.72, 0.58, 0.35);        // Gold accent
  
  // Smooth flowing gradient based on elevation
  float t = smoothstep(-0.5, 0.7, vElevation);
  vec3 color = mix(deep, mid, t);
  
  // Add lighter streaks on the peaks (silk highlights)
  float highlight = smoothstep(0.3, 0.7, vElevation);
  color = mix(color, light, highlight * 0.6);
  
  // Very subtle gold shimmer on the highest points
  float goldShimmer = smoothstep(0.5, 0.75, vElevation);
  float shimmerPulse = sin(vUv.x * 8.0 + uTime * 0.5) * 0.5 + 0.5;
  color = mix(color, gold, goldShimmer * shimmerPulse * 0.06);
  
  // Soft radial vignette from center
  float vignette = 1.0 - smoothstep(0.2, 0.9, length(vUv - vec2(0.5)));
  color *= 0.75 + vignette * 0.25;
  
  gl_FragColor = vec4(color, 1.0);
}
`;

// ── Fluid Surface Component ──
const FluidSurface: React.FC = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const mouseSmooth = useRef(new THREE.Vector2(0.5, 0.5));
  const mouseTarget = useRef(new THREE.Vector2(0.5, 0.5));

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseTarget.current.set(
        e.clientX / window.innerWidth,
        1.0 - e.clientY / window.innerHeight
      );
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
  }), []);

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value = clock.elapsedTime;
    // Very smooth mouse lerp for silk-like response
    mouseSmooth.current.lerp(mouseTarget.current, 0.02);
    materialRef.current.uniforms.uMouse.value.copy(mouseSmooth.current);
  });

  const scale = 1.6;

  return (
    <mesh rotation={[-0.45, 0, 0]} position={[0, -0.2, 0]}>
      <planeGeometry args={[viewport.width * scale, viewport.height * scale, 96, 96]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

// ── Main Canvas Export ──
export default function ThreeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Small delay so React hydration finishes before showing canvas
    const timer = setTimeout(() => setReady(true), 100);

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0"
      style={{ opacity: ready ? 1 : 0, transition: 'opacity 1.2s ease' }}
    >
      {isVisible && ready && (
        <Canvas
          camera={{ position: [0, 0, 3.5], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
            stencil: false,
            depth: false,
          }}
        >
          <FluidSurface />
        </Canvas>
      )}
    </div>
  );
}
