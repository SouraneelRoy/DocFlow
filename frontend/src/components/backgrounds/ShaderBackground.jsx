import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
varying vec2 vUv;

// Simple pseudo-random function
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 5

float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main() {
  vec2 st = vUv * 3.0; // Scale the coordinate system
  // st += st * abs(sin(uTime*0.1)*3.0);
  vec2 q = vec2(0.);
  q.x = fbm( st + 0.00*uTime);
  q.y = fbm( st + vec2(1.0));

  vec2 r = vec2(0.);
  r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*uTime );
  r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*uTime);

  float f = fbm(st+r);

  // Color palette
  vec3 color = mix(vec3(0.0, 0.0, 0.0),
              vec3(0.1, 0.1, 0.2), // Dark bluish/purplish
              clamp((f*f)*4.0,0.0,1.0));

  color = mix(color,
              vec3(0.0, 0.0, 0.16), // Dark blue
              clamp(length(q),0.0,1.0));

  color = mix(color,
              vec3(0.2, 0.2, 0.3), // Slightly lighter highlight
              clamp(length(r.x),0.0,1.0));
              
  // Darken it overall to be a background
  gl_FragColor = vec4((f*f*f+.6*f*f+.5*f)*color, 1.0);
}
`;

const ShaderPlane = () => {
    const meshRef = useRef();

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
        }),
        []
    );

    useFrame((state) => {
        const { clock } = state;
        if (meshRef.current) {
            meshRef.current.material.uniforms.uTime.value = clock.getElapsedTime() * 0.5; // Slow time
        }
    });

    return (
        <mesh ref={meshRef} scale={[10, 10, 1]}> {/* Scale to cover screen roughly if camera is close */}
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
        </mesh>
    );
};

const ShaderBackground = () => {
    return (
        <div className="fixed inset-0 z-[-1] bg-black">
            <Canvas
                camera={{ position: [0, 0, 1], fov: 75 }}
                dpr={[1, 2]} // Quality scaling
                gl={{ antialias: true }}
            >
                <ShaderPlane />
            </Canvas>
            {/* Overlays for fade effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
        </div>
    );
};

export default ShaderBackground;
