import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import ProfilePage from './pages/ProfilePage';

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/profile' index element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
