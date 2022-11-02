import React from 'react';
import { Link } from "react-router-dom";

import Page from '../components/Page';
import '../RegisterPage.css';

import background from "../background.jpg";

function RegisterPage() {
  return(
      <div className="background" style={{ backgroundImage: `url(${background})` }}>
          <Page className="leftPage">
          <div class="leftpage-format">
              <p>
              Welcome <br>
              </br>
              To <br>
              </br>
              <div class="pink">
              Art Share
              </div>

              </p>
            </div>
          </Page>
          <Page className="rightPage">
            <div class="leftpage-format">
              Register
            </div>
            <div >
                Email
                <br></br>
                <input type="text" class="form-control" id="Email" placeholder="Email"></input>
            </div>
            <div>
            Username
            <br></br>
            <input type="text" class="form-control" id="UserName" placeholder="UserName"></input>
          </div>
          <div>
            Password
            <br></br>
            <input type="text" class="form-control" id="Password" placeholder="Password"></input>
          </div>
          <div>
            Confirm Password
            <br></br>
            <input type="text" class="form-control" id="ConfirmPassword" placeholder="Confirm Password"></input>
          </div>
          <div class="parent">
          <button class="bpink parent">
            Register
          </button>
          </div>
          <div class="parent">
          <a href='#'>Login Page</a>
          </div>

          </Page>

      </div>
  )
}

export default RegisterPage;
