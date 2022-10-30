import React from 'react';
import ReactScrollableList from 'react-scrollable-list';

function FriendRequests(props) {
    return(
        <div>
            <h2>Sent Friend-Requests</h2>
            <ReactScrollableList 
                heightOfItem={20} listItems={props.sentRequests}
                maxItemsToRender={5} style={{}} />

            <h2>Pending Friend-Requests</h2>
            <ReactScrollableList 
                heightOfItem={20} listItems={props.pendingRequests}
                maxItemsToRender={5} style={{}} />
        </div>
    );
}

export default FriendRequests;