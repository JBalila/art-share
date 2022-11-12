import React from 'react';
import { useLocation } from 'react-router-dom';

import Page from '../components/Page';
import MenuTabs from '../components/MenuTabs';

import background from "../background.jpg";

function ViewPostPage() {
    const location = useLocation();
    let post = location.state;

    return(
        <div className="background" style={{ backgroundImage: `url(${background})` }}>
            <MenuTabs />
            <Page className='leftPage'>
                <h1>{post.Title}</h1>
            </Page>
            <Page className='rightPage'>

            </Page>
        </div>
    );
}

export default ViewPostPage;