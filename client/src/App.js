import React from 'react';
import './App.css';
import {Routes, Route} from 'react-router';

import Login from './components/pages/Login';
import Signup from './components/pages/Signup';

function App() { 
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
