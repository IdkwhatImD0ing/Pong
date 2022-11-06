import * as React from 'react';
import './App.css';
import {Routes, Route} from 'react-router-dom';
import {Landing} from './pages/Landing';


function App() {
  const [name, setName] = React.useState(null);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={
          <Landing nameState={[name, setName]}/>
        } />
      </Routes>
    </div>
  );
}

export default App;
