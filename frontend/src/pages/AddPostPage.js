import React from 'react';
import { useState } from 'react';

import Page from '../components/Page';
import ArtUpload from '../components/AddPostComponents/ArtUpload';
import ArtInfo from '../components/AddPostComponents/ArtInfo';

import background from "../background.jpg";

function AddPostPage() {
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
        if (!file) {
            setError('Please upload an image before posting');
            return;
        }
        if (title.trim() === '') {
            setError('Please add a title before posting');
            return;
        }
        setError('');
        
        let base64File = await convertFileToBase64(file);

        console.log('File: ' + base64File);
        console.log('Title: ' + title);
        console.log('Description: ' + description);
        console.log('IsPublic: ' + isPublic);
    }

    return(
        <div className="background" style={{ backgroundImage: `url(${background})` }}>
            <Page classname='leftpage'>
                <ArtUpload setFile={setFile} />
            </Page>
            <Page classname='rightpage'>
                <ArtInfo setTitle={setTitle} setDescription={setDescription} 
                    setIsPublic={setIsPublic} error={error} />
                
                <button type='button' onClick={post}>Post</button>
            </Page>
        </div>
    )
}

export default AddPostPage;