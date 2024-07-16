import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const cocktails = [
  { name: 'Cóctel demo 1', modelPath: '/src/assets/prueba.glb' },
  { name: 'Cóctel demo 2', modelPath: '/assets/demo2.glb' },
  { name: 'Cóctel demo 3', modelPath: '/assets/demo3.glb' },
  // Agrega más cócteles según sea necesario
];

const App: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedCocktail, setSelectedCocktail] = useState(cocktails[0].modelPath);

  useEffect(() => {
    let renderer: THREE.WebGLRenderer | null = null;
    let currentModel: THREE.Group | null = null;

    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => {
        console.error('Error accessing camera: ', err);
      });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const initRenderer = () => {
      renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (containerRef.current) {
        containerRef.current.appendChild(renderer.domElement);
      }

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(0, 10, 10);
      scene.add(directionalLight);

      camera.position.z = 5;

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;
      controls.screenSpacePanning = false;
      controls.minDistance = 1;
      controls.maxDistance = 10;
      controls.maxPolarAngle = Math.PI / 2;

      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer!.render(scene, camera);
      };

      animate();
    };

    const loader = new GLTFLoader();
    const loadModel = (modelPath: string) => {
      loader.load(modelPath, (gltf) => {
        if (currentModel) {
          scene.remove(currentModel);
        }
        currentModel = gltf.scene;
        scene.add(currentModel);
      }, undefined, (error) => {
        console.error('Error loading GLTF model:', error);
      });
    };

    if (!renderer) {
      initRenderer();
    }
    loadModel(selectedCocktail);

    return () => {
      if (currentModel) {
        scene.remove(currentModel);
      }
      if (renderer && containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
        renderer.dispose();
        renderer = null;
      }
    };
  }, [selectedCocktail]);

  return (
    <div className="relative w-full h-screen">
    <video ref={videoRef} autoPlay className="absolute top-0 left-0 w-full h-full object-cover" />
    <div ref={containerRef} className="absolute top-0 left-0 w-full h-full" />
    <div className="absolute top-0 right-0 p-4 bg-transparent rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-red-500 animate-pulse">Una bestia! Cocktails</h1>
      <ul>
        {cocktails.map((cocktail, index) => (
          <li key={index} className="mb-2">
            <button 
              onClick={() => setSelectedCocktail(cocktail.modelPath)}
              className="text-xl font-semibold text-black hover:text-red-500 transition duration-300 ease-in-out"
            >
              {cocktail.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>
  );
};

export default App;
