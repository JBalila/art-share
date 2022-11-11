import React from 'react';
import { useState } from 'react';

import bp from '../Path';
import functions from '../../functions';

function ProfileSettings(props) {
    let accessToken = JSON.parse(localStorage.getItem('accessToken'));

    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    const handleChanges = async function() {
        if (username.trim() !== '')
            handleChangeUsername();

        if (password.trim() !== '' || confirmPassword.trim() !== '')
            handleChangePassword();
    }

    const handleChangeUsername = async function() {
        let obj = {userID: props.id, newUsername: username, accessToken: accessToken};
        let jsonPayload = JSON.stringify(obj);

        try {
            const response = await fetch(bp.buildPath('/api/changeUsername'), {
                method:'PATCH', body:jsonPayload, headers: {
                    'Content-Type':'application/json'
                }
            });

            let res = JSON.parse(await response.text());

            // JWT expired, return User to login page
            if (res.jwtExpired) {
                localStorage.removeItem('userData');
                localStorage.removeItem('accessToken');
                window.location.href='/';
            }

            if (res.error) {
                setUsernameMessage(res.error);
                return;
            }

            setUsernameMessage('Username successfully changed!');
            setUsername('');
            props.changeUsername(username);
            localStorage.setItem('accessToken', JSON.stringify(res.accessToken));
        }
        catch(e) {
            console.error(e);
        }
    }

    const handleChangePassword = async function() {
        if (password.trim() === '' || confirmPassword.trim() === '') {
            setPasswordMessage('Please fill in both password fields');
            return;
        }

        if (password !== confirmPassword) {
            setPasswordMessage('Your passwords do not match');
            return;
        }

        let hashedPassword = await functions.hash(password);
        let obj = {userID: props.id, password: hashedPassword};
        let jsonPayload = JSON.stringify(obj);

        try {
            const response = await fetch(bp.buildPath('/api/resetPassword'), {
                method:'PATCH', body:jsonPayload, headers: {
                    'Content-Type':'application/json'
                }
            });

            let res = JSON.parse(await response.text());
            if (res.error) {
                setPasswordMessage(res.error);
                return;
            }

            setPasswordMessage('Password successfully changed');
            setPassword('');
            setConfirmPassword('');
        }
        catch(e) {
            console.error(e);
        }
    }

    const logout = function() {
        localStorage.removeItem('userData');
        localStorage.removeItem('accessToken');
        window.location.href = '/';
    }

    return(
        <div>
            <div className='profile-content'>
                <div className="input-container">
                    <div className='input-format'>
                        <div className="change-user">
                            <label htmlFor='changeUsername' className='label'>Change Username</label>
                            <input type='text' className='form-control' id='changeUsername' placeholder='New Username'
                                value={username} onChange={(e) => setUsername(e.target.value)} />
                            <span>{usernameMessage}</span>
                        </div>
            
                        <div className="change-pass">
                            <label htmlFor='changePassword' className='label'>New Password</label>
                            <input type='password' className='form-control' id='changePassword' placeholder='Password'
                                value={password} onChange={(e) => setPassword(e.target.value)} />

                            <label htmlFor='confirmPassword' className='label'>Confirm Password</label>
                            <input type='password' className='form-control' id='confirmPassword' placeholder='Confirm Password'
                                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            <span>{passwordMessage}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='profile-footer'>
                <button className="save-button" onClick={handleChanges}>
                  Save Changes
                </button>
                <button className="button" onClick={logout}>
                  Log Out
                </button>
            </div>
        </div>
    );
};

export default ProfileSettings;
