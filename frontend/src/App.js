import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// Bootstrap import
import 'bootstrap/dist/css/bootstrap.min.css';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import ViewPostPage from './pages/ViewPostPage';
import AddPostPage from './pages/AddPostPage';
import ProfilePage from './pages/ProfilePage';
import SendResetPasswordEmail from './pages/SendResetPasswordEmail';
import ResetPasswordPage from './pages/ResetPasswordPage';
<Route path='/' index element={<LoginPage />} />

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' index element={<LoginPage />} />
        <Route path='/register' index element={<RegisterPage />} />
        <Route path='/home' index element={<HomePage />} />
        <Route path='/viewpost' index element={<ViewPostPage />} />
        <Route path='/addpost' index element={<AddPostPage />} />
        <Route path='/profile' index element={<ProfilePage />} />
        <Route path='/sendresetemail' index element={<SendResetPasswordEmail />} />
        <Route path='/resetpassword' index element={<ResetPasswordPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
