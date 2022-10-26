import React from 'react';
import Page from './Page';
import './App.css';
import background from "./background.jpg";

function App() {
  return(
    <div className="background" style={{ backgroundImage: `url(${background})` }}>
      <div className="container">
        <Page />
      </div>
    </div>
  )
}

export default App;