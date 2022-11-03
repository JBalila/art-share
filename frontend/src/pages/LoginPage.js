import React from 'react';
import { useState } from 'react';
import { Link } from "react-router-dom";

import Page from '../components/Page';
import bp from '../components/Path';
import functions from '../functions';
import '../LoginRegisterPage.css';

import background from "../background.jpg";

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = async function() {
    if (username.trim() === '' || password.trim() === '') {
      setError('Please fill in all fields');
      return;
    }

    const hashedPassword = await functions.hash(password);

    let obj = {username: username, password: hashedPassword};
    let jsonPayload = JSON.stringify(obj);

    try {
      const response = await fetch(bp.buildPath('/api/login'), {
        method:'POST', body:jsonPayload, headers: {
          'Content-Type':'application/json'
        }
      });

      let res = JSON.parse(await response.text());
      if (res.error) {
        setError(res.error);
        return;
      }

      setError('');

      localStorage.setItem('userData', JSON.stringify(res.user));
      localStorage.setItem('accessToken', JSON.stringify(res.accessToken));

      window.location.href='/profile';
    }
    catch(e) {
      console.error(e);
    }
  }

  return(
    <div className="background" style={{ backgroundImage: `url(${background})` }}>
        <Page className="leftPage">
          <div className="page-format">
            <div className="title">
            Welcome <br/>
            To <br/>
            <div className="title-color"><b>Art Share</b></div>
            </div>
          </div>
        </Page>

        <Page className="rightPage">
          <div className="page-format">
            <div className="title">Log In</div>

            <div className="input-format">
              <label className="label" htmlFor="Username">Username</label>
              <input type="text" className="form-control" id="Username" placeholder="Username"
                value={username} onChange={(e) => setUsername(e.target.value)} />
              <label className="label" htmlFor="Password">Password</label>
              <input type="password" className="form-control" id="Password" placeholder="Password"
                value={password} onChange={(e) => setPassword(e.target.value)} />
            </div> <br />
            <span>{error}</span>

              <button className="button" onClick={login}>
              Log In
              </button>

            <div className="footer">
              <Link to="/register">Register Account</Link>
              <br/>
              <Link to="/">Forgot Password</Link>
            </div>

          </div>
        </Page>
    </div>
  )
}

export default LoginPage;
