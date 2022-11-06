import * as React from 'react';
import './App.css';
import {Routes, Route, useNavigate} from 'react-router-dom';
import {Landing} from './pages/Landing';
import Game from './Game';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </div>
  );
}

export default App;
