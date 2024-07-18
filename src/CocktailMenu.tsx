import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { useNavigate } from 'react-router-dom';

const cocktails = [
  { name: 'Cóctel demo 1', modelPath: '/prueba.glb' },
  { name: 'Cóctel demo 2', modelPath: '/assets/demo2.glb' },
  { name: 'Cóctel demo 3', modelPath: '/assets/demo3.glb' },
];

const CocktailMenu: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedCocktail, setSelectedCocktail] = useState(cocktails[0].modelPath);
  const navigate = useNavigate();

  useEffect(() => {
    let renderer: THREE.WebGLRenderer | null = null;
    let currentModel: THREE.Group | null = null;

    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
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
      <div className="absolute top-0 left-0 p-4 bg-transparent">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 bg-[#A08246] text-white py-2 px-4 rounded-full"
        >
          Regresar
        </button>
        <h1 className="w-full sm:w-64 text-xl sm:text-2xl font-semibold text-black py-2 px-4 rounded-full text-center transition duration-300 ease-in-out bg-[#A08246] mb-3">
          Menú cócteles
        </h1>
        <ul className="flex flex-col items-center space-y-2">
          {cocktails.map((cocktail, index) => (
            <li key={index} className="mb-2">
              <button 
                onClick={() => setSelectedCocktail(cocktail.modelPath)}
                className={`w-full sm:w-64 text-xl sm:text-2xl font-semibold text-black py-2 px-4 rounded-full text-center transition duration-300 ease-in-out ${selectedCocktail === cocktail.modelPath ? 'bg-blue-500' : 'bg-[#A08246]'}`}
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

export default CocktailMenu;
