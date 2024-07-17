import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    })
    .catch(err => {
      console.error('Error accessing camera: ', err);
    });
  }, []);

  return (
    <div className="relative w-full h-screen">
      <video ref={videoRef} autoPlay className="absolute top-0 left-0 w-full h-full object-cover" />
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-4">
        <img src="/cocktail.png" alt="Una Bestia Co." className="mb-4 w-1/2 sm:w-1/3 lg:w-1/4" />
        <Link to="/cocktail-menu" className="w-64 text-xl sm:text-2xl font-semibold text-black py-2 px-4 rounded-full text-center" style={{ backgroundColor: '#A08246' }}>
          Menú cócteles
        </Link>
        <Link to="/bar-moviles" className="w-64 text-xl sm:text-2xl font-semibold text-black py-2 px-4 rounded-full text-center" style={{ backgroundColor: '#A08246' }}>
          Barras móviles
        </Link>
        <a href="https://www.instagram.com/unabestia_cocktails?igsh=NmVxdjB5N212bzFo" target="_blank" rel="noopener noreferrer" className="w-64 text-xl sm:text-2xl font-semibold text-black py-2 px-4 rounded-full text-center" style={{ backgroundColor: '#A08246' }}>
          Instagram
        </a>
      </div>
    </div>
  );
};

export default Home;
