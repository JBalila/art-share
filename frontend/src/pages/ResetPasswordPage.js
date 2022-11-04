import React from 'react';
import { useState } from 'react';

import Page from '../components/Page';
import bp from '../components/Path';
import functions from '../functions';

import background from '../background.jpg'

function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const resetPassword = async function() {
        if (password.trim() === '' || confirmPassword.trim() === '') {
            setMessage('Please fill in all fields');
            return;
        }
        if (password !== confirmPassword) {
            setMessage('Your passwords do not match');
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        const userID = urlParams.get('id');
        let hashedPassword = await functions.hash(password);

        let obj = {userID: userID, password: hashedPassword};
        let jsonPayload = JSON.stringify(obj);

        try {
            const response = await fetch(bp.buildPath('/api/resetPassword'), {
                method:'PATCH', body:jsonPayload, headers: {
                    'Content-Type':'application/json'
                }
            });

            let res = JSON.parse(await response.text());
            if (res.error) {
                setMessage(res.error);
                return;
            }
        }
        catch(e) {
            console.error(e);
        }

        setMessage('Successfully reset your password');
    }

    return(
        <div className="background" style={{ backgroundImage: `url(${background})` }}>
            <Page className='leftPage'>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input type='password' id='password' placeholder='Password'
                        value={password} onChange={(e) => setPassword(e.target.value)} />
                    <br />
                </div>

                <div>
                    <label htmlFor='confirmPassword'>Confirm Password</label>
                    <input type='password' id='confirmPassword' placeholder='Confirm Password' 
                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <br />
                    <span>{message}</span>
                    <br /> <br />
                </div>

                <button type='button' onClick={resetPassword}>Reset Password</button>
            </Page>

            <Page className='rightPage'>

            </Page>
        </div>
    );
}

export default ResetPasswordPage;