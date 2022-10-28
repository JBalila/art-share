import React from 'react';
import Page from './Page';
import './App.css';
import background from "./background.jpg";

function App() {
  return(
    <div className="background" style={{ backgroundImage: `url(${background})` }}>
        <Page className="leftPage"/>
        <Page className="rightPage"/>
    </div>
  )
}

export default App;
