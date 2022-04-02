import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from  './Component/Dashboard'
import Token from './Component/Token'
import Shop from './Component/Shop'
import Purchased from './Component/Purchased'
import Withdraw from './Component/Withdraw'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="token" element={<Token />} />
        <Route path="shop" element={<Shop />} />
        <Route path="purchased" element={<Purchased />} />
        <Route path="withdraw" element={<Withdraw />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App