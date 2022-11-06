import * as React from 'react';
import './App.css';
import {Routes, Route, useNavigate} from 'react-router-dom';
import {Landing} from './pages/Landing';
import Game from './Game';
import {hop} from '@onehop/client';

hop.init({
  projectId: 'project_NzM0ODk3ODE3Njc5NzA5MDY', // replace with your project ID
});

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
