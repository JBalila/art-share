import React from 'react';
import { useState, useEffect } from 'react';

import Page from '../components/Page';
import ProfileHeader from '../components/ProfileComponents/ProfileHeader';
import ProfileSettings from '../components/ProfileComponents/ProfileSettings';
import MyFriends from '../components/ProfileComponents/MyFriends';
import FriendRequests from '../components/ProfileComponents/FriendRequests';

import background from '../background.jpg';

const ProfilePage = () => {
    const [cliqueIDs, setCliqueIDs] = useState([]);
    const [clique, setClique] = useState([]);
    useEffect(() => {
        formatIDs(setClique, cliqueIDs);
    }, [JSON.stringify(cliqueIDs)]);

    const [sentRequestIDs, setSentRequestIDs] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    useEffect(() => {
        formatIDs(setSentRequests, sentRequestIDs);
    }, [JSON.stringify(sentRequestIDs)]);

    const [pendingRequestIDs, setPendingRequestIDs] = useState([]);
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

        console.log(ret);
        setterFunction(ret);
    }

    const addToCliqueIDs = (newID) => {
        setCliqueIDs((arr) => [...arr, newID]);
    }

    const removeFromCliqueIDs = (newID) => {
        setCliqueIDs(cliqueIDs.splice(cliqueIDs.indexOf(newID), 1));
    };

    const addToSentRequestIDs = (newID) => {
        setSentRequestIDs((arr) => [...arr, newID]);
    };

    const removeFromPendingRequestIDs = (newID) => {
        setPendingRequestIDs(sentRequestIDs.splice(sentRequestIDs.indexOf(newID), 1));
    }

    return(
        <div className="background" style={{ backgroundImage: `url(${background})` }}>
            <Page classname='leftpage'>
                <ProfileHeader name={'jbalila'} />
                <ProfileSettings />
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
