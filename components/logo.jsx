"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

const Logo3D = () => {
  // Load the GLB model
  const { scene } = useGLTF("/assets/images/graphic_art.glb"); // Make sure the file is in the `public/` folder

  return <primitive object={scene} scale={.1} />;
};

export default function Hero3DLogo() {
  return (
    <div className="h-screen w-fit flex justify-center items-center bg-red-600">
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 2, 2]} intensity={1} />
        <Logo3D />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
