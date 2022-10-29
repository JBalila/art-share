import React from 'react';

import background from '../background.jpg';

import Page from '../Page';
import ProfileHeader from '../components/ProfileComponents/ProfileHeader';
import ProfileSettings from '../components/ProfileComponents/ProfileSettings';
import MyFriends from '../components/ProfileComponents/MyFriends';
import FriendRequests from '../components/ProfileComponents/FriendRequests';

const ProfilePage = () => {

    return(
        <div className="background" style={{ backgroundImage: `url(${background})` }}>
            <Page classname='leftpage'>
                <ProfileHeader name={'jbalila'} />

                <ProfileSettings />
            </Page>

            <Page classname='rightpage'>
                <MyFriends clique={[]}/>

                <FriendRequests sentRequests={[]} pendingRequests={[]}/>
            </Page>
        </div>
    );
};

export default ProfilePage;