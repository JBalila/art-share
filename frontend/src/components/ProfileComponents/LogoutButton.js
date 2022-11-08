import React from 'react';

function LogoutButton() {
    const logout = function() {
        localStorage.removeItem('userData');
        localStorage.removeItem('accessToken');
        window.location.href = '/';
    }

    return(
        <div style={{margin:'auto'}}>
            <button type='button' className='button' onClick={logout}>Log Out</button>
        </div>
    );
}

export default LogoutButton;