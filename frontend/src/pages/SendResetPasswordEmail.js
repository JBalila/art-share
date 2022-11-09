import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import Page from '../components/Page';
import bp from '../components/Path';

import background from '../background.jpg'

function SendResetPasswordEmail() {
    const [userOrEmail, setUserOrEmail] = useState('');
    const [message, setMessage] = useState('');

    const sendEmail = async function() {
        if (userOrEmail.trim() === '') {
            setMessage('Please fill in the field');
            return;
        }

        let obj = {usernameOrEmail: userOrEmail};
        let jsonPayload = JSON.stringify(obj);

        try {
            const response = await fetch(bp.buildPath('/api/sendResetPasswordEmail'), {
                method:'POST', body:jsonPayload, headers: {
                    'Content-Type':'application/json'
                }
            });

            let res = JSON.parse(await response.text());
            
            if (res.error) {
                setMessage(res.error);
                return;
            }

            setUserOrEmail('');
            setMessage('An email has been sent to reset your password');
        }
        catch(e) {
            console.error(e);
        }
    }

    return(
        <div className="background" style={{ backgroundImage: `url(${background})` }}>
            <Page className='leftPage'>
                <div className='page-format'>
                    <div className='title' style={{paddingBottom:'150px'}}>
                        Reset Password
                    </div>

                    <div className='input-format'>
                        <label className='label' htmlFor='userOrEmail'>Username/Email</label>
                        <input type='text' className='form-control' id='userOrEmail' placeholder='Username/Email'
                            value={userOrEmail} onChange={(e) => setUserOrEmail(e.target.value)} />
                        <br />
                    </div>
                    <span>{message}</span>

                    <button type='button' className='button' style={{width:'200px'}} onClick={sendEmail}>
                        Send Email
                    </button>

                    <div className="footer">
                        <Link to="/" className="link">Go to Log In</Link>
                    </div>
                </div>
            </Page>

            <Page className='rightPage'>
                <div className="page-format">
                    <div className="title">
                        <div className="title-color"><b>Art Share</b></div>
                    </div>
                </div>
            </Page>
        </div>
    );
}

export default SendResetPasswordEmail;