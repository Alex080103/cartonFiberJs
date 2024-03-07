"use client";
import { Suspense, useEffect, useRef } from "react";
import { OrbitControls, useAnimations, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScrollPercentage } from "react-scroll-percentage";
import CanvasLoader from "../loader/CanvasLoader";

const Carton = () => {
  // On crée en premier nieu notre objet
  const { nodes, materials, animations } = useGLTF(
    "cubeAnimateEvolve.glb",
    true
  ); // Permet de récupérer le carton grâce au format GLTF

  const group = useRef(); // référence pour le group qui entoure notre carton

  const { actions, mixer } = useAnimations(animations, group); // Permet de récupérer les animations contenus dans notre fichier

  useEffect(() => {
    Object.keys(actions).forEach((key) => {
      // Pour chaque animation (une par face), on applique des règles
      actions[key].timeScale = 1; // Pour modifier la durée de l'animation 0.5 = 2 fois plus rapide
      actions[key].repetitions = 1; // Nombre de fois ou l'animation se répète
      actions[key].clampWhenFinished = true; // L'animation reste dans son état final
      actions[key].play(); // Joue l'animation
    });
    window.scrollY > 0 // Pour activer l'animation un scroll est nécéssaire
      ? window.scrollTo(0, 5 + window.scrollY) // Si la distance scroll est supérieur à 0, j'active un scroll plus loin pour activer l'animation
      : window.scrollTo(0, 2); // Si la distance scroll est égale à 0, j'active un scroll plus loin pour activer l'animation
  }, [actions]);

  return (
    <group ref={group}>
      {/* primitive constitue notre élément 
      On y ajoute notre object via sa scène
      scale permet de gérer la taille de  notre élément 
      Pour bouger notre élément il faut utiliser les rotation selon les axes de la 3d */}
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
  // En second lieu on crée notre scène qui contiendra notre carton, la lumière et la caméra
  return (
    <>
      <Suspense fallback={CanvasLoader}>
        {/* Le Suspense permet d'effectuer un chargement au préalable de l'affichage du carton */}
        {/* Sur notre Canvas on active les ombrages
       frameloop, dpr et gl gère le mode de rendu et l'efficacité de l'animation
       la camera permet d'obtenir une vision de notre élément, si on la remove elle se centre automatiquement sur notre élément
       On peut modifier le style de notre Canvas en appliquant un style css
       Si on cherche à modifier la taille il faudra jouer sur le scale et la caméra
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
          {/* On ajoute une lumière dans notre scène afin de mieux voir les objets,
           en l'occurence c'est une lumière ambiante mais on peut en ajouter de différents types */}
          <ambientLight color="white" intensity={1.7} />
          <Suspense fallback={"...loading"}>
            {/* OrbitControls permet d'intéragir avec notre élément à la souris
              autorotate active une rotation automatique 
              enableZoom permet à l'utilisateur de scroll sur l'élément 3d
              maxPolarAngle et minPolarAngle régle la rotation sur l'axe polaire (vertical), 
              en l'occurence on ne peut pas bouger notre objet sur l'axe vertical car max == min
            */}
            <OrbitControls
              autoRotate
              enableZoom={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
            ></OrbitControls>
            {/* On ajoute notre carton dans la scène */}
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
      {/* On rends notre scène sur la page */}
      <CartonCanvas id="cartonCanvas" />
    </div>
  );
};

export default page;
