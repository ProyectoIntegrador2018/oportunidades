import React from 'react';
import './App.css';
import {Routes, Route} from 'react-router';

import Login from './components/pages/Login';
import Inicio from './components/pages/Inicio';
import Signup from './components/pages/Signup';
import SignupSocio from './components/pages/SignupSocio';
import RegistroOportunidad from './components/pages/RegistroOportunidad';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';

const theme = createMuiTheme({
   palette: {
      primary: { main: '#EE5D36' },
      secondary: { main: '#FFFFFF'}
   }
})
function App() { 
   return (
      <div className="App">
         <MuiThemeProvider theme={theme}>
         <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/registro" element={<Signup />} />
            <Route path="/registro-socio" element={<SignupSocio />} />
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/registro-oportunidad" element={<RegistroOportunidad />} />
         </Routes>
         </MuiThemeProvider>
      </div>
   );
}

export default App;
