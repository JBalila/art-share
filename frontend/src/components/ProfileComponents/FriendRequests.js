import React from 'react';

function FriendRequests(props) {
    let myUsername = '';
    let accessToken = '';

    const acceptFriendRequest = async function(pendingUsername) {
        let obj = {username: myUsername, friendUsername: pendingUsername, accessToken: accessToken};
        let jsonPayload = JSON.stringify(obj);

        try {
            const response = await fetch('http://localhost:5000/api/acceptFriendRequest', {
                method:'POST', body:jsonPayload, headers:{
                    'Content-Type':'application/json'
                }
            });

            let res = JSON.parse(await response.text());
            if (res.error) {
                console.error(res.error);
                return;
            }

            // TODO: Store newly accepted friend into user's Clique in local-storage
            // TODO: Restore accessToken into token-storage
        }
        catch(e) {
            console.error(e.message);
        }
    }

    const declineFriendReqeust = async function(pendingUsername) {
        let obj = {username: myUsername, friendUsername: pendingUsername, accessToken: accessToken};
        let jsonPayload = JSON.stringify(obj);

        try {
            const response = await fetch('http://localhost:5000/api/declineFriendRequest', {
                method:'POST', body:jsonPayload, headers:{
                    'Content-Type':'application/json'
                }
            });

            let res = JSON.parse(await response.text());
            if (res.error) {
                console.error(res.error);
                return;
            }

            // TODO: Restore accessToken into token-storage
        }
        catch(e) {
            console.error(e.message);
        }
    }

    return(
        <div>
            <h2>Sent Friend-Requests</h2>
            <div style={{height:'120px', overflowY:'auto', scrollBehavior: 'smooth'}}>
                <ul style={{paddingLeft:'10px', listStyle:'none'}}>
                    {props.sentRequests.map((friend) => <li key={friend.id}>{friend.content}</li>)}
                </ul>
            </div>

            <h2>Pending Friend-Requests</h2>
            <div style={{height:'120px', overflowY:'auto', scrollBehavior: 'smooth'}}>
                <ul style={{paddingLeft:'10px', paddingRight:'10px', listStyle:'none'}}>
                    {props.pendingRequests.map((friend) => 
                        <li style={{paddingBottom:'10px'}} key={friend.id}>{friend.content}
                        <button style={{float:'right'}} onClick={() => declineFriendReqeust(friend.content)}>Decline</button>
                        <button style={{float:'right'}} onClick={() => acceptFriendRequest(friend.content)}>Accept</button> 
                        </li>)}
                </ul>
            </div>
        </div>
    );
}

export default FriendRequests;