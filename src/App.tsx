import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Home';
import CocktailMenu from './CocktailMenu';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cocktail-menu" element={<CocktailMenu />} />
    </Routes>
  );
};

export default App;
