import React from 'react';
import { useState, useEffect } from 'react';

import background from '../background.jpg';

import Page from '../Page';
import ProfileHeader from '../components/ProfileComponents/ProfileHeader';
import ProfileSettings from '../components/ProfileComponents/ProfileSettings';
import MyFriends from '../components/ProfileComponents/MyFriends';
import FriendRequests from '../components/ProfileComponents/FriendRequests';

const ProfilePage = () => {
    let cliqueIDs = ['634b6c200ddde7aadb180d75', '634b6c370ddde7aadb180d76'];
    const [clique, setClique] = useState([]);

    let sentRequestIDs = ['634b6c200ddde7aadb180d75', '634b6c370ddde7aadb180d76'];
    const [sentRequests, setSentRequests] = useState([]);

    let pendingRequestIDs = ['634b6c200ddde7aadb180d75', '634b6c370ddde7aadb180d76'];
    const [pendingRequests, setPendingRequests] = useState([]);

    useEffect(() => {
        formatIDs('clique', cliqueIDs);
        formatIDs('sentRequests', sentRequestIDs);
        formatIDs('pendingRequests', pendingRequestIDs);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function formatIDs(type, idList) {
        let ret = [];

        for (let i = 0; i < idList.length; i++) {
            let obj = {userID: idList[i]};
            let jsonPayload = JSON.stringify(obj);

            try {
                let response = await fetch('http://localhost:5000/api/getUsername', 
                    {method:'POST', body:jsonPayload, headers:{
                        'Content-Type':'application/json'
                    }});
                
                let text = await response.text();
                if (text) {
                    let obj = {id: idList[i], content: JSON.parse(text)};
                    ret.push(obj);
                }
            }
            catch(e) {
                console.error(e.message);
            }
        }

        if (type === 'clique')
            setClique(ret);
        else if (type === 'sentRequests')
            setSentRequests(ret);
        else if (type === 'pendingRequests')
            setPendingRequests(ret);
    }

    return(
        <div className="background" style={{ backgroundImage: `url(${background})` }}>
            <Page classname='leftpage'>
                <ProfileHeader name={'jbalila'} />

                <ProfileSettings />
            </Page>

            <Page classname='rightpage'>
                <MyFriends clique={clique} />

                <FriendRequests sentRequests={sentRequests} pendingRequests={pendingRequests} />
            </Page>
        </div>
    );
};

export default ProfilePage;