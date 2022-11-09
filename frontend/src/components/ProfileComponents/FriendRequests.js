import React from 'react';

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
            <div style={{height:'100px', overflowY:'auto', scrollBehavior: 'smooth'}}>
                <ul style={{paddingLeft:'10px', paddingRight:'10px', listStyle:'none'}}>
                    {props.pendingRequests.map((friend) => 
                        <li style={{paddingBottom:'10px'}} key={friend.id}>{friend.content}
                        <button style={{float:'right'}} onClick={() => declineFriendReqeust(friend.content)}>Decline</button>
                        <button style={{float:'right'}} onClick={() => acceptFriendRequest(friend.content)}>Accept</button> 
                        </li>)}
                </ul>
            </div>

            <h2 className='title'>Sent Requests</h2>
            <div style={{height:'100px', overflowY:'auto', scrollBehavior: 'smooth'}}>
                <ul style={{paddingLeft:'10px', listStyle:'none'}}>
                    {props.sentRequests.map((friend) => <li key={friend.id}>{friend.content}</li>)}
                </ul>
            </div>
        </div>
    );
}

export default FriendRequests;