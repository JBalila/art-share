import React from 'react';
import { useState } from 'react';

function MyFriends(props) {
    let myUsername = '';
    let accessToken = '';
    let addFriendUsername;

    const [addFriendError, setAddFriendError] = useState('');
    const [removeFriendError, setRemoveFriendError] = useState('');

    const addFriend = async event => {
        event.preventDefault();

        let obj = {username: myUsername, friendUsername: addFriendUsername.value, accessToken: accessToken};
        let jsonPayload = JSON.stringify(obj);

        try {
            const response = await fetch('http://localhost:5000/api/sendFriendRequest', {
                method:'POST', body:jsonPayload, headers:{
                    'Content-Type':'application/json'
                }
            });

            let res = JSON.parse(await response.text());
            if (res.error) {
                setAddFriendError(res.error);
                return;
            }

            setAddFriendError('');
            // TODO: Store newly sent friend-request into local-storage
            // TODO: Restore accessToken into token-storage
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
            const response = await fetch('http://localhost:5000/api/removeFriend', {
                method:'POST', body:jsonPayload, headers: {
                    'Content-Type':'application/json'
                }
            });

            let res = JSON.parse(await response.text());
            if (res.error) {
                setRemoveFriendError(res.error);
                return;
            }

            setRemoveFriendError('');
            // TODO: Remove friend from local-storage
            // TODO: Restore accessToken in localStorage
        }
        catch(e) {
            console.error(e.message);
        }
    }

    return(
        <div>
            <h2>Friends</h2>
            <div style={{scrollBehavior: 'smooth'}}>
                <ul style={{paddingLeft:'10px', listStyle:'none'}}>
                    {props.clique.map((friend) => 
                        <li style={{paddingBottom:'10px'}} key={friend.id}>{friend.content}
                        <button style={{float:'right'}} type='button' onClick={() => removeFriend(friend.content)}>Remove Friend</button>
                        </li>)}
                </ul>
                <span>{removeFriendError}</span>
            </div>

            <form onSubmit={ addFriend }>
                <span>Add a Friend   </span>
                <input type='text' id='addFriend' placeholder='Username of friend...' 
                    ref={(c) => addFriendUsername = c} />
                <input type='submit' onClick={ addFriend } />
            </form>
            <span>{addFriendError}</span>
        </div>
    );
}

export default MyFriends;