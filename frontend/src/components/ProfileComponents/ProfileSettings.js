import React from 'react';
import { useState } from 'react';

import bp from '../Path';
import functions from '../../functions';

function ProfileSettings(props) {
    let accessToken = JSON.parse(localStorage.getItem('accessToken'));

    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [toggle, setToggle] = useState('none');
    const [buttonName, setButtonName] = useState('Change Password');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');

    const handleChangeUsername = async function() {
        if (username.trim() === '') {
            setUsernameMessage('Please fill in the field');
            return;
        }

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

    const handleToggle = function() {
        if (toggle === 'none') {
            setToggle('');
            setButtonName('Close');
        }
        else {
            setToggle('none');
            setButtonName('Change Password');
        }
    }

    const handleChangePassword = async function() {
        if (password.trim() === '' || confirmPassword.trim() === '') {
            setPasswordMessage('Please fill in all fields');
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

    return(
        <div>
            <div>
                <label htmlFor='changeUsername'>Change Username</label>
                <input type='text' id='changeUsername' placeholder='Change Username'
                    value={username} onChange={(e) => setUsername(e.target.value)} />

                <button type='button' onClick={handleChangeUsername}>Submit</button> <br />
                <span>{usernameMessage}</span>
            </div>
            <br /> <br /> <br />
            <button type='button' onClick={handleToggle}>{buttonName}</button>
            <div style={{display:toggle}}>
                <label htmlFor='changePassword'>Change Password</label>
                <input type='password' id='changePassword' placeholder='Password'
                    value={password} onChange={(e) => setPassword(e.target.value)} />

                <label htmlFor='confirmPassword'>Confirm Password</label>
                <input type='password' id='confirmPassword' placeholder='Confirm Password'
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                <br /> <button type='button' onClick={handleChangePassword}>Submit</button>
                <br /> <span>{passwordMessage}</span>
            </div>
        </div>
    );
};

export default ProfileSettings;