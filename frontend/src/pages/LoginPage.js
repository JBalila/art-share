import React from 'react';
import { Link } from "react-router-dom";

import Page from '../components/Page';
import '../LoginRegisterPage.css';

import background from "../background.jpg";

function LoginPage() {
  return(
    <div className="background" style={{ backgroundImage: `url(${background})` }}>
        <Page className="leftPage">
          <div class="page-format">
            <div class="title">
            Welcome <br/>
            To <br/>
            <div class="title-color"><b>Art Share</b></div>
            </div>
          </div>
        </Page>

        <Page className="rightPage">
          <div class="page-format">
            <div class="title">Log In</div>

            <div class="input-format">
              <label class="label" for="Username">Username</label>
              <input type="text" class="form-control" id="Username" placeholder="Username"></input>
              <label class="label" for="Password">Password</label>
              <input type="text" class="form-control" id="Password" placeholder="Password"></input>
            </div>

              <button class="button">
              Log In
              </button>

            <div class="footer">
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
