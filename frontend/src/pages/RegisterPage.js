import React from 'react';
import { useState } from 'react';
import { Link } from "react-router-dom";

import Page from '../components/Page';
import bp from '../components/Path';
import '../LoginRegisterPage.css';

import background from "../background.jpg";

function hash(string) {
  const utf8 = new TextEncoder().encode(string);
  return crypto.subtle.digest('SHA-256', utf8).then((hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((bytes) => bytes.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
  });
}

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const register = async function() {
    if (email.trim() === '' || username.trim() === '' || password.trim() === '' || confirmPassword.trim() === '') {
      setMessage('Please fill in all fields');
      return;
    }

    // TODO: Check if email is even valid (has an @ and a .com)

    if (password !== confirmPassword) {
      setMessage('Your passwords do not match');
      return;
    }

    const hashedPassword = await hash(password);

    let obj = {
      firstName: 'Test',
      lastName: 'Test',
      email: email,
      username: username,
      password: hashedPassword
    };
    let jsonPayload = JSON.stringify(obj);

    try {
      const response = await fetch(bp.buildPath('/api/register'), {
        method:'POST', body:jsonPayload, headers: {
          'Content-Type':'application/json'
        }
      });

      let res = JSON.parse(await response.text());
      if (res.error) {
        setMessage(res.error);
        return;
      }

      setMessage('A confirmation link has been sent to your email');
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
            <div className="title">Register</div>

            <div className="input-format">
              <label className="label" htmlFor="Email">Email</label>
              <input type="text" className="form-control" id="Email" placeholder="Email"
                value={email} onChange={(e) => setEmail(e.target.value)} />
              <label className="label" htmlFor="Username">Username</label>
              <input type="text" className="form-control" id="Username" placeholder="Username"
                value={username} onChange={(e) => setUsername(e.target.value)} />
              <label className="label" htmlFor="Password">Password</label>
              <input type="password" className="form-control" id="Password" placeholder="Password"
                value={password} onChange={(e) => setPassword(e.target.value)} />
              <label className="label" htmlFor="ConfirmPassword">Confirm Password</label>
              <input type="password" className="form-control" id="ConfirmPassword" placeholder="Confirm Password"
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div> <br />
            <span>{message}</span>

              <button className="button" onClick={register}>
              Register
              </button>

            <div className="footer">
              <Link to="/">Go to Log In</Link>
            </div>

          </div>
        </Page>
    </div>
  )
}

export default RegisterPage;
