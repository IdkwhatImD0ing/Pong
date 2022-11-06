import * as React from 'react';
import './App.css';
import {Routes, Route} from 'react-router-dom';
import {Landing} from './pages/Landing';
import Game from './Game';

function App() {
  function genId() {
    return (
      Date.now().toString(36) + 
      Math.floor(Math.pow(10,12) + Math.random() * 9 * Math.pow(10,12))
      .toString(36)
    );
  }
  const [name, setName] = React.useState(null);
  const [userId, setUserId] = React.useState(genId());

  return (
    <div className="App">
      <UserContext.Provider value={{name, setName, userId, setUserId}}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/game" element={<Game />} />
      </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;
