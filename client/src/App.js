import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from  './Component/Dashboard'
import Token from './Component/Token'
import Shop from './Component/Shop'
import Purchased from './Component/Purchased'
import Withdraw from './Component/Withdraw'
import Create from './Component/Create'
import JoinedEvents from './Component/JoinedEvents'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="create" element={<Create />} />
        <Route path="joined" element={<JoinedEvents />} />
        <Route path="token" element={<Token />} />
        <Route path="shop" element={<Shop />} />
        <Route path="purchased" element={<Purchased />} />
        <Route path="withdraw" element={<Withdraw />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App