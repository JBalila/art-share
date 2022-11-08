import React from 'react';

function ProfileHeader(props) {
    return(
        <div className='title' style={{paddingBottom:'20px'}}>
            <b>{props.name}'s Profile</b>
        </div>
    );
}

export default ProfileHeader;