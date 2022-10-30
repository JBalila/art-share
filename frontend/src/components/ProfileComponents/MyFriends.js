import React from 'react';
import { useState } from 'react';
import ReactScrollableList from 'react-scrollable-list';

function MyFriends(props) {
    let myUsername = '';
    let accessToken = '';
    let addFriendUsername;

    const [addFriendError, setAddFriendError] = useState('');

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

        }
    }

    return(
        <div>
            <h2>Friends</h2>
            <ReactScrollableList 
                heightOfItem={20} listItems={props.clique}
                maxItemsToRender={5} style={{}} /> <br />

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