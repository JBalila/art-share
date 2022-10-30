import React from 'react';

function FriendRequests(props) {
    return(
        <div>
            <h2>Sent Friend-Requests</h2>
            <div style={{scrollBehavior: 'smooth'}}>
                <ul style={{listStyle:'none'}}>
                    {props.sentRequests.map((friend) => <li key={friend.id}>{friend.content}</li>)}
                </ul>
            </div>

            <h2>Pending Friend-Requests</h2>
            <div style={{scrollBehavior: 'smooth'}}>
                <ul style={{listStyle:'none'}}>
                    {props.pendingRequests.map((friend) => <li key={friend.id}>{friend.content}</li>)}
                </ul>
            </div>
        </div>
    );
}

export default FriendRequests;