"use client";
import { Suspense, useEffect, useRef } from "react";
import { OrbitControls, useAnimations, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollPercentage } from "react-scroll-percentage";
import CanvasLoader from "../loader/CanvasLoader";

const Carton = () => {
  // First, we create our object
  const { nodes, materials, animations } = useGLTF(
    "cubeAnimateEvolve.glb",
    true
  ); // Retrieve the carton using the GLTF format

  const group = useRef(); // Reference for the group surrounding our carton

  const { actions, mixer } = useAnimations(animations, group); // Retrieve the animations contained in our file

  useEffect(() => {
    Object.keys(actions).forEach((key) => {
      // For each animation (one per face), we apply some rules
      actions[key].timeScale = 1; // To modify the duration of the animation 0.5 = 2 times faster
      actions[key].repetitions = 1; // Number of times the animation repeats
      actions[key].clampWhenFinished = true; // The animation stays in its final state
      actions[key].play(); // Play the animation
    });
    window.scrollY > 0 // To activate the animation, scrolling is necessary
      ? window.scrollTo(0, 5 + window.scrollY) // If the scroll distance is greater than 0, I activate a scroll further to trigger the animation
      : window.scrollTo(0, 2); // If the scroll distance is equal to 0, I activate a scroll further to trigger the animation
  }, [actions]);

  return (
    <group ref={group}>
      {/* primitive constitutes our element
      We add our object via its scene
      scale allows to manage the size of our element
      To move our element, rotation along the axes of the 3d is necessary */}
      <primitive
        object={nodes.Scene}
        scale={0.2}
        height={300}
        width={300}
        rotation-x={0.3}
        rotation-y={-0.7}
        rotation-z={-0.2}
      />
    </group>
  );
};

const CartonCanvas = () => {
  // Secondly, we create our scene that will contain our carton, light, and camera
  return (
    <>
      <Suspense fallback={CanvasLoader}>
        {/* Suspense allows preloading before displaying the carton */}
        {/* On our Canvas, we enable shadows
       frameloop, dpr, and gl manage the rendering mode and animation efficiency
       the camera allows to obtain a view of our element, if we remove it, it automatically centers on our element
       We can modify the style of our Canvas by applying a css style
       If we want to change the size, we will have to play with the scale and the camera
      */}
        <Canvas
          shadows
          frameloop="demand"
          dpr={[1, 2]}
          gl={{ preserveDrawingBuffer: true }}
          camera={{ fov: 50, zoom: 3, near: 1, far: 1000 }}
          style={{
            height: "100vh",
            width: "100vh",
            margin: "auto",
            position: "absolute",
          }}
        >
          {/* <directionalLight color="white" position={[0, 0, 5]} /> */}
          {/* <directionalLight color="white" position={[0, 0, -5]} /> */}
          {/* <directionalLight color="white" position={[0, 5, 0]} /> */}
          {/* <directionalLight color="white" position={[0, -5, 0]} /> */}
          {/* <directionalLight color="white" position={[5, 0, 0]} /> */}
          {/* <directionalLight color="white" position={[-5, 0, 0]} /> */}
          {/* <directionalLight color="white" position={[0, 0, 0]} /> */}
          {/* <pointLight color="purple" intensity={0.05} /> */}
          {/* We add a light in our scene to better see the objects,
           in this case it's an ambient light but we can add different types */}
          <ambientLight color="white" intensity={1.7} />
          <Suspense fallback={"...loading"}>
            {/* OrbitControls allows interaction with our element via the mouse
              autoRotate enables automatic rotation
              enableZoom allows the user to scroll on the 3D element
              maxPolarAngle and minPolarAngle adjust the rotation on the polar axis (vertical),
              in this case, we cannot move our object on the vertical axis because max == min
            */}
            <OrbitControls
              autoRotate
              enableZoom={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
            ></OrbitControls>
            {/* We add our carton to the scene */}
            <Carton />
          </Suspense>
        </Canvas>
      </Suspense>
    </>
  );
};

const page = () => {
  // const [ref, percentage] = useScrollPercentage();

  return (
    <div className="h-[3000px]">
      {/* We render our scene on the page */}
      <CartonCanvas id="cartonCanvas" />
    </div>
  );
};

export default page;
