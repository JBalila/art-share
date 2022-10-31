import React from 'react';

function ProfileHeader(props) {
    return(
        <div>
            <h1>{props.name}'s Profile</h1>
        </div>
    );
}

export default ProfileHeader;