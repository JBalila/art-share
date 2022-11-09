import React from 'react';

const logoutStyle = {
    width: '200px',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: '-100px'
};

function LogoutButton() {
    const logout = function() {
        localStorage.removeItem('userData');
        localStorage.removeItem('accessToken');
        window.location.href = '/';
    }

    return(
        <div>
            <button type='button' className='button' style={logoutStyle} onClick={logout}>Log Out</button>
        </div>
    );
}

export default LogoutButton;