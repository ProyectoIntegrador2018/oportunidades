import React from 'react';
import './App.css';
import {Routes, Route} from 'react-router';

import Login from './components/pages/Login';
import Inicio from './components/pages/Inicio';
import Signup from './components/pages/Signup';
import SignupSocio from './components/pages/SignupSocio';
import RegistroOportunidad from './components/pages/RegistroOportunidad';

function App() { 
   return (
      <div className="App">
         <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/registro" element={<Signup />} />
            <Route path="/registro-socio" element={<SignupSocio />} />
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/registro-oportunidad" element={<RegistroOportunidad />} />
         </Routes>
      </div>
   );
}

export default App;
