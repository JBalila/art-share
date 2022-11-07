import React from 'react';

import Page from '../components/Page';
import MenuTabs from '../components/MenuTabs';

import background from "../background.jpg";

function HomePage() {

  return(
    <div className="background" style={{ backgroundImage: `url(${background})` }}>
      <MenuTabs />
        <Page className="leftPage">
        Home
        </Page>
        <Page className="rightPage">
        </Page>
    </div>
  )
}

export default HomePage;
