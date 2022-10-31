import React from 'react';

import Page from '../components/Page';

import background from "../background.jpg";

function LoginPage() {
  return(
    <div className="background" style={{ backgroundImage: `url(${background})` }}>
      <Page classname='leftpage'>
      </Page>
      <Page classname='rightpage'>
      </Page>
    </div>
  )
}

export default LoginPage;
