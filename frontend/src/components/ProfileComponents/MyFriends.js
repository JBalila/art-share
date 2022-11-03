import React from 'react';
import { useState } from 'react';

const bp = require('../Path');

function MyFriends(props) {
    let myUsername = JSON.parse(localStorage.getItem('userData')).Username;
    let accessToken = JSON.parse(localStorage.getItem('accessToken'));
    const [addFriendUsername, setAddFriendUsername] = useState('');

    const [addFriendError, setAddFriendMessage] = useState('');

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
        <div>
            <h2>Friends</h2>
            <div style={{height:'120px', overflowY:'auto', scrollBehavior: 'smooth'}}>
                <ul style={{paddingLeft:'10px', paddingRight:'10px', listStyle:'none'}}>
                    {props.clique.map((friend) => 
                        <li style={{paddingBottom:'10px'}} key={friend.id}>{friend.content}
                        <button style={{float:'right'}} type='button' onClick={() => removeFriend(friend.content)}>Remove Friend</button>
                        </li>)}
                </ul>
            </div>

            <form onSubmit={ addFriend }>
                <span>Add a Friend   </span>
                <input type='text' id='addFriend' placeholder='Username of friend...' 
                    value={addFriendUsername} onChange={(e) => setAddFriendUsername(e.target.value)} />
                <input type='submit' onClick={ addFriend } />
            </form>
            <span>{addFriendError}</span> <br />
        </div>
    );
}

export default MyFriends;