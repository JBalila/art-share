import React from 'react';
import { useState, useEffect } from 'react';

import Page from '../components/Page';
import MenuTabs from '../components/MenuTabs';
import ProfileHeader from '../components/ProfileComponents/ProfileHeader';
import ProfileSettings from '../components/ProfileComponents/ProfileSettings';
import LogoutButton from '../components/ProfileComponents/LogoutButton';
import MyFriends from '../components/ProfileComponents/MyFriends';
import FriendRequests from '../components/ProfileComponents/FriendRequests';

import background from '../background.jpg';

const bp = require('../components/Path');

const ProfilePage = () => {
    const userData = JSON.parse(localStorage.getItem('userData'));

    const [username, setUsername] = useState(userData.Username);

    const [cliqueIDs, setCliqueIDs] = useState(userData.Clique);
    const [clique, setClique] = useState([]);
    useEffect(() => {
        formatIDs(setClique, cliqueIDs);
    }, [JSON.stringify(cliqueIDs)]);

    const [sentRequestIDs, setSentRequestIDs] = useState(userData.SentRequests);
    const [sentRequests, setSentRequests] = useState([]);
    useEffect(() => {
        formatIDs(setSentRequests, sentRequestIDs);
    }, [JSON.stringify(sentRequestIDs)]);

    const [pendingRequestIDs, setPendingRequestIDs] = useState(userData.PendingRequests);
    const [pendingRequests, setPendingRequests] = useState([]);
    useEffect(() => {
        formatIDs(setPendingRequests, pendingRequestIDs);
    }, [JSON.stringify(pendingRequestIDs)]);

    async function formatIDs(setterFunction, idList) {
        let ret = [];

        for (let i = 0; i < idList.length; i++) {
            let obj = {userID: idList[i]};
            let jsonPayload = JSON.stringify(obj);

            try {
                let response = await fetch(bp.buildPath('/api/getUsername'), {
                    method:'POST', body:jsonPayload, headers:{
                        'Content-Type':'application/json'
                    }
                });

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

        console.log(ret);
        setterFunction(ret);
    }

    const changeUsername = (newUsername) => {
        setUsername(newUsername);
        userData.Username = newUsername;
        localStorage.setItem('userData', JSON.stringify(userData));
    }

    const addToCliqueIDs = (newID) => {
        setCliqueIDs((cliqueIDs) => [...cliqueIDs, newID]);
        userData.Clique.push(newID);
        localStorage.setItem('userData', JSON.stringify(userData));
    }

    const removeFromCliqueIDs = (newID) => {
        setCliqueIDs(cliqueIDs.filter(id => id !== newID));
        userData.Clique.splice(userData.Clique.indexOf(newID), 1);
        localStorage.setItem('userData', JSON.stringify(userData));
    };

    const addToSentRequestIDs = (newID) => {
        setSentRequestIDs((sentRequestIDs) => [...sentRequestIDs, newID]);
        userData.SentRequests.push(newID);
        localStorage.setItem('userData', JSON.stringify(userData));
    };

    const removeFromPendingRequestIDs = (newID) => {
        setPendingRequestIDs((pendingRequestIDs.filter(id => id !== newID)));
        userData.PendingRequests.splice(userData.PendingRequests.indexOf(newID), 1);
        localStorage.setItem('userData', JSON.stringify(userData));
    }

    return(
        <div className="background" style={{ backgroundImage: `url(${background})` }}>
          <MenuTabs />
            <Page classname='leftpage'>
                <ProfileHeader name={username} />
                <ProfileSettings id={userData._id} changeUsername={changeUsername} />
                <LogoutButton />
            </Page>

            <Page classname='rightpage'>
                <MyFriends clique={clique} removeFromCliqueIDs={removeFromCliqueIDs}
                    addToSentRequestIDs={addToSentRequestIDs} />
                <FriendRequests sentRequests={sentRequests} pendingRequests={pendingRequests}
                    removeFromPendingRequestIDs={removeFromPendingRequestIDs}
                    addToCliqueIDs={addToCliqueIDs} />
            </Page>
        </div>
    );
};

export default ProfilePage;
