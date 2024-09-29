import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry';

interface Graph3DProps {
  func: (x: number, y: number) => number;
  xRange: [number, number];
  yRange: [number, number];
}

const Surface: React.FC<Graph3DProps> = ({ func, xRange, yRange }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (meshRef.current) {
      const geometry = new ParametricGeometry(
        (u: number, v: number, target: THREE.Vector3) => {
          const x = xRange[0] + u * (xRange[1] - xRange[0]);
          const y = yRange[0] + v * (yRange[1] - yRange[0]);
          const z = func(x, y);
          target.set(x, y, z);
        },
        100,
        100
      );
      meshRef.current.geometry = geometry;
    }
  }, [func, xRange, yRange]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={meshRef}>
      <meshNormalMaterial />
    </mesh>
  );
};

const Graph3D: React.FC<Graph3DProps> = (props) => {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Canvas camera={{ position: [0, 5, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Surface {...props} />
      </Canvas>
    </div>
  );
};

export default Graph3D;
