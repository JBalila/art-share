import React from 'react';
import './ProfilePage.css';

import { AiOutlineStop, AiOutlineCheck } from "react-icons/ai";

const bp = require('../Path');

function FriendRequests(props) {
    let myUsername = JSON.parse(localStorage.getItem('userData')).Username;
    let accessToken = JSON.parse(localStorage.getItem('accessToken'));

    const acceptFriendRequest = async function(pendingUsername) {
        let obj = {username: myUsername, friendUsername: pendingUsername, accessToken: accessToken};
        let jsonPayload = JSON.stringify(obj);

        try {
            const response = await fetch(bp.buildPath('/api/acceptFriendRequest'), {
                method:'POST', body:jsonPayload, headers:{
                    'Content-Type':'application/json'
                }
            });

            let res = JSON.parse(await response.text());

            // JWT expired, return User to login page
            if (res.jwtExpired) {
                localStorage.removeItem('userData');
                localStorage.removeItem('accessToken');
                window.location.href='/';
            }

            if (res.error) {
                console.error(res.error);
                return;
            }

            props.addToCliqueIDs(res.id);
            props.removeFromPendingRequestIDs(res.id);

            localStorage.setItem('accessToken', JSON.stringify(res.accessToken));
        }
        catch(e) {
            console.error(e.message);
        }
    }

    const declineFriendReqeust = async function(pendingUsername) {
        let obj = {username: myUsername, friendUsername: pendingUsername, accessToken: accessToken};
        let jsonPayload = JSON.stringify(obj);

        try {
            const response = await fetch(bp.buildPath('/api/declineFriendRequest'), {
                method:'POST', body:jsonPayload, headers:{
                    'Content-Type':'application/json'
                }
            });

            let res = JSON.parse(await response.text());

            // JWT expired, return User to login page
            if (res.jwtExpired) {
                localStorage.removeItem('userData');
                localStorage.removeItem('accessToken');
                window.location.href='/';
            }

            if (res.error) {
                console.error(res.error);
                return;
            }

            props.removeFromPendingRequestIDs(res.id);

            localStorage.setItem('accessToken', JSON.stringify(res.accessToken));
        }
        catch(e) {
            console.error(e.message);
        }
    }

    return(
        <div>
            <h2 className='title'>Pending Requests</h2>
            <div className='scroll-box'>
                <ul className='pending-list'>
                    {props.pendingRequests.map((friend) =>
                        <li key={friend.id}>{friend.content}
                        <button className='decline-button' onClick={() => declineFriendReqeust(friend.content)}><AiOutlineStop /></button>
                        <button className='accept-button' onClick={() => acceptFriendRequest(friend.content)}><AiOutlineCheck /></button>
                        </li>)}
                </ul>
            </div>

            <h2 className='title'>Sent Requests</h2>
            <div className='scroll-box'>
                <ul className='sent-list'>
                    {props.sentRequests.map((friend) => <li key={friend.id}>{friend.content}</li>)}
                </ul>
            </div>
        </div>
    );
}

export default FriendRequests;
