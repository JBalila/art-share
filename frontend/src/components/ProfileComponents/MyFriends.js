import React from 'react';
import { useState } from 'react';
import './ProfilePage.css';

import { AiOutlineStop, AiOutlineCheck } from "react-icons/ai";

const bp = require('../Path');

function MyFriends(props) {
    let myUsername = JSON.parse(localStorage.getItem('userData')).Username;
    let accessToken = JSON.parse(localStorage.getItem('accessToken'));
    const [addFriendUsername, setAddFriendUsername] = useState('');

    const [addFriendError, setAddFriendMessage] = useState('');

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
                return;
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

    const addFriend = async event => {
        event.preventDefault();

        let obj = {username: myUsername, friendUsername: addFriendUsername, accessToken: accessToken};
        let jsonPayload = JSON.stringify(obj);

        try {
            const response = await fetch(bp.buildPath('/api/sendFriendRequest'), {
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
                setAddFriendMessage(res.error);
                return;
            }

            setAddFriendUsername('');
            setAddFriendMessage('Friend-request sent!');

            props.addToSentRequestIDs(res.id);

            localStorage.setItem('accessToken', JSON.stringify(res.accessToken));
        }
        catch (e) {
            console.error(e.message);
        }
    }

    const removeFriend = async function(friendUsername) {
        let confirmRemoval = window.confirm('Are you sure you want to remove ' + friendUsername + ' from your Clique?');
        if (!confirmRemoval) return;

        let obj = {username: myUsername, friendUsername: friendUsername, accessToken: accessToken};
        let jsonPayload = JSON.stringify(obj);

        try {
            const response = await fetch(bp.buildPath('/api/removeFriend'), {
                method:'POST', body:jsonPayload, headers: {
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

            props.removeFromCliqueIDs(res.id);

            localStorage.setItem('accessToken', JSON.stringify(res.accessToken));
        }
        catch(e) {
            console.error(e.message);
        }
    }

    return(
        <div className='friends-page'>
          <div className='title' >
            My Clique
          </div>
            <div className='scroll-box'>
                <ul className='friend-list'>
                    {props.clique.map((friend) =>
                        <li key={friend.id}>{friend.content}
                        <button className='remove-friend-button' type='button'
                            onClick={() => removeFriend(friend.content)}>Remove Friend</button>
                        </li>)}
                </ul>
            </div>

            <form onSubmit={ addFriend }>
                <span>Add a Friend  </span>
                <input type="text" id="addFriend" placeholder="Username of friend..."
                    value={addFriendUsername} onChange={(e) => setAddFriendUsername(e.target.value)} />
                <input type='submit' onClick={ addFriend } />
            </form>
            <span>{addFriendError}</span> <br />

            <h2 className="title">Pending Requests</h2>
            <div className="scroll-box">
                <ul className="pending-list">
                    {props.pendingRequests.map((friend) =>
                        <li key={friend.id}>{friend.content}
                        <button className='decline-button'
                            onClick={() => declineFriendReqeust(friend.content)}><AiOutlineStop /></button>
                        <button className='accept-button'
                            onClick={() => acceptFriendRequest(friend.content)}><AiOutlineCheck /></button>
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

export default MyFriends;
