import React from 'react';
import { Link } from "react-router-dom";

import Page from '../components/Page';
import '../LoginRegisterPage.css';

import background from "../background.jpg";

function RegisterPage() {
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
            <div class="title">Register</div>

            <div class="input-format">
              <label class="label" for="Email">Email</label>
              <input type="text" class="form-control" id="Email" placeholder="Email"></input>
              <label class="label" for="Username">Username</label>
              <input type="text" class="form-control" id="Username" placeholder="Username"></input>
              <label class="label" for="Password">Password</label>
              <input type="text" class="form-control" id="Password" placeholder="Password"></input>
              <label class="label"  for="ConfirmPassword">Confirm Password</label>
              <input type="text" class="form-control" id="ConfirmPassword" placeholder="Confirm Password"></input>
            </div>

              <button class="button">
              Register
              </button>

            <div class="footer">
              <Link to="/">Go to Log In</Link>
            </div>

          </div>
        </Page>
    </div>
  )
}

export default RegisterPage;
