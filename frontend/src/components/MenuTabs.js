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
          <div className='home-tab'>
            <button className='home-tab-button' onClick={navigateToHome}>
              <div className='home-icon' >
                <CgHome />
              </div>
            </button>
          </div>
          <div className='add-post-tab'>
            <button className='add-post-tab-button' onClick={navigateToAddPost}>
              {/* <CgAdd /> */}
            </button>
          </div>
          <div className='profile-tab'>
            <button className='profile-tab-button' onClick={navigateToProfile}>
              {/* <CgProfile /> */}
            </button>
          </div>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/addpost" element={<AddPost />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
  );
}
