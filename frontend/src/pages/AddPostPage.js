import React from 'react';
import { useState } from 'react';

import Page from '../components/Page';
import MenuTabs from '../components/MenuTabs';
import ArtUpload from '../components/AddPostComponents/ArtUpload';
import ArtInfo from '../components/AddPostComponents/ArtInfo';
import '../PageStyles.css';
import '../components/AddPostComponents/AddPost.css';

import background from "../background.jpg";
import bp from '../components/Path';

const MAX_CHARS_IN_DESC = 500;
const MAX_FILE_SIZE = 2000000;

function AddPostPage() {
    const user = JSON.parse(localStorage.getItem('userData'));
    const accessToken = JSON.parse(localStorage.getItem('accessToken'));

    const [file, setFile] = useState();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [error, setError] = useState('');

    function convertFileToBase64(file) {
        let prom = new Promise((resolve, reject) => {
            const reader = new FileReader();
      
            reader.addEventListener('load', () => resolve(reader.result));
            reader.addEventListener('error', (err) => reject(console.log(err)));
      
            reader.readAsBinaryString(file);
        });
      
        return prom.then((bin) => btoa(bin)).catch((err) => err);
      }

    const post = async function() {
        if (title.trim() === '') {
            setError('Please add a title before posting');
            return;
        }
        if (description.length > MAX_CHARS_IN_DESC) {
            setError('Please limit your description to 500 characters');
            return;
        }
        if (!file) {
            setError('Please upload an image before posting');
            return;
        }
        if (file.size > MAX_FILE_SIZE) {
            setError('The uploaded file is too large (2MB max)');
            return;
        }
        setError('');

        let base64File = await convertFileToBase64(file);
        let obj = {
            image: base64File,
            authorID: user._id,
            title: title,
            description: description,
            ispublic: isPublic,
            accessToken: accessToken
        };
        let jsonPayload = JSON.stringify(obj);

        try {
            const response = await fetch(bp.buildPath('/api/addPost'), {
                method:'POST', body:jsonPayload, headers: {
                    'Content-Type':'application/json'
                }
            });

            let res = JSON.parse(await response.text());

            // JWT expired, return User to login page
            if (res.jwtExpired) {
                localStorage.removeItem('userData');
                localStorage.removeItem('accessToken');
                window.location.href = '/';
                return;
            }

            if (res.error) {
                setError(res.error);
                return;
            }

            localStorage.setItem('accessToken', JSON.stringify(res.accessToken));
            window.location.href = '/home';
        }
        catch(e) {
            console.error(e);
        }
    }

    return(
        <div className="background" style={{ backgroundImage: `url(${background})` }}>
          <MenuTabs />
            <Page classname='leftpage'>
                <div className='add-post-page'>
                    <ArtUpload setFile={setFile} />
                </div>
            </Page>
            <Page classname='rightpage'>
                <div className='add-post-page'>
                    <ArtInfo setTitle={setTitle} setDescription={setDescription}
                        setIsPublic={setIsPublic} error={error} />

                    <button type='button' className='button' id='addPost' onClick={post}>
                            Post
                    </button>
                </div>
            </Page>
        </div>
    )
}

export default AddPostPage;
