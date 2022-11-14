import React from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';
import '../MenuTabs.css';

import { CgHome, CgAdd, CgProfile } from "react-icons/cg";
import { IconContext } from "react-icons";

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

  function Home() {
    return <h2>Home</h2>;
  }

  function AddPost() {
    return <h2>Add Post</h2>;
  }

  function Profile() {
    return <h2>Profile</h2>;
  }

  return (
      <div className='menu-tabs'>
          <button className='home-tab' onClick={navigateToHome}><CgHome /></button>
          <hr />
          <button className='add-post-tab' onClick={navigateToAddPost}><CgAdd /></button>
          <hr />
          <button className='profile-tab' onClick={navigateToProfile}><CgProfile /></button>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/addpost" element={<AddPost />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
  );
}
