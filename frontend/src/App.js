import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' index element={<LoginPage />} />
        <Route path='/register' index element={<RegisterPage />} />
        <Route path='/profile' index element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
