"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// ─── Material — loud bright whitish silver ─────────────────────────────────────
const makeMaterial = () =>
  new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#F2F4FA"),
    metalness: 1.0,
    roughness: 0.04,
    reflectivity: 1.0,
    envMapIntensity: 6.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    sheen: 0.5,
    sheenColor: new THREE.Color("#FFFFFF"),
    side: THREE.FrontSide,
  });

// ─── Model ────────────────────────────────────────────────────────────────────
function AdonaiModel() {
  const gltf = useGLTF(encodeURI("/3-D/adonai logo .glb"));
  const groupRef = useRef<THREE.Group>(null);
  const modelMaxDim = useRef<number | null>(null);

  useEffect(() => {
    gltf.scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.material = Array.isArray(mesh.material)
        ? mesh.material.map(() => makeMaterial())
        : makeMaterial();
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });

    const box = new THREE.Box3().setFromObject(gltf.scene);
    const size = box.getSize(new THREE.Vector3());
    modelMaxDim.current = Math.max(size.x, size.y, size.z);

    const centre = box.getCenter(new THREE.Vector3());
    gltf.scene.position.sub(centre);
  }, [gltf.scene]);

  useFrame(({ viewport }, delta) => {
    if (!groupRef.current || modelMaxDim.current === null) return;

    const FILL_RATIO = 0.72;
    const shorter = Math.min(viewport.width, viewport.height);
    const target = (shorter * FILL_RATIO) / modelMaxDim.current;

    groupRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.08);
    groupRef.current.rotation.y += delta * 0.42;
  });

  return (
    <group ref={groupRef}>
      <primitive
        object={gltf.scene}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
}

// ─── Lights ───────────────────────────────────────────────────────────────────
function MetallicLights() {
  const flash1 = useRef<THREE.PointLight>(null);
  const flash2 = useRef<THREE.PointLight>(null);
  const t = useRef(0);

  useFrame((_, delta) => {
    t.current += delta;
    if (flash1.current)
      flash1.current.intensity = 2.0 + Math.sin(t.current * 7.3) * 1.2 + Math.random() * 0.3;
    if (flash2.current)
      flash2.current.intensity = 1.5 + Math.cos(t.current * 11.1) * 1.0 + Math.random() * 0.2;
  });

  return (
    <>
      <ambientLight intensity={0.12} color="#B0C0FF" />
      <directionalLight position={[0, 10, 3]}  intensity={4.0} color="#FFFFFF" castShadow />
      <directionalLight position={[-6, 3, -5]} intensity={2.5} color="#7EAAFF" />
      <directionalLight position={[5, 1, 4]}   intensity={1.4} color="#FFE8D0" />
      <pointLight ref={flash1} position={[ 2,  6,  2]} color="#AACCFF" distance={18} decay={2} />
      <pointLight ref={flash2} position={[-3,  4, -2]} color="#88BBFF" distance={14} decay={2} />
      <pointLight              position={[ 0, -5,  0]} color="#334466" intensity={0.6} distance={10} decay={2} />
      <spotLight position={[0, 8, 1]} angle={0.2} penumbra={0.6} intensity={5} color="#FFFFFF" />
    </>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────
export default function AdonaiLogo3D() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative h-full w-full">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(180,200,255,0.13) 0%, transparent 70%)",
        }}
      />

      {mounted && (
        <Canvas
          className="relative z-10"
          camera={{ position: [0, 0, 5], fov: 30 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.4,
          }}
        >
          <MetallicLights />
          <Suspense fallback={null}>
            <AdonaiModel />
            <Environment preset="warehouse" backgroundIntensity={0} />
          </Suspense>
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            enableRotate={true}
            minPolarAngle={Math.PI / 2.4}
            maxPolarAngle={Math.PI / 1.7}
          />
        </Canvas>
      )}
    </div>
  );
}
