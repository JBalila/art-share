import React from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';

import { CgHome, CgAdd, CgProfile } from "react-icons/cg";

export default function MenuTabs() {
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate('/home');
  };

  const navigateToAddPost = () => {
    navigate('/addpost');
  };

  const navigateToProfile = () => {
    navigate('/profile');
  };

  return (
      <div>
        <button onClick={navigateToHome}><CgHome /></button>
        <hr />
        <button onClick={navigateToAddPost}><CgAdd /></button>
        <hr />
        <button onClick={navigateToProfile}><CgProfile /></button>

        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/addpost" element={<AddPost />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
  );
}

function Home() {
  return <h2>Home</h2>;
}

function AddPost() {
  return <h2>Add Post</h2>;
}

function Profile() {
  return <h2>Profile</h2>;
}
