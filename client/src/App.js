import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from  './Component/Dashboard'
import Token from './Component/Token'
// import Search from './Component/Search'
// import Gallery from './Component/Gallery'
// import Setting from './Component/Setting'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="token" element={<Token />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App