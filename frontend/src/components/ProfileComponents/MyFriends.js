import React from 'react';
import { useState } from 'react';
import ReactScrollableList from 'react-scrollable-list';

function MyFriends(props) {
    let addFriendUsername;

    const addFriend = async event => {
        event.preventDefault();
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
        </div>
    );
}

export default MyFriends;