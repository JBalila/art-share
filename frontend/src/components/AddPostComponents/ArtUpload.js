import React from 'react';
import { useState } from 'react';

import UploadImg from '../../UploadImg.png';

function ArtUpload(props) {
    const [file, setFile] = useState();
    const [isUploaded, setIsUploaded] = useState(false);

    const handleChange = (event) => {
        setFile(event.target.files[0]);
        setIsUploaded(true);
        props.setFile(event.target.files[0]);
    }

    return(
        <div className='add-post-file-upload'>
            <label className='art-upload-label' htmlFor='fileUpload'>
                <img src={UploadImg} id='image'/>
            </label>
            <form>
                <input type='file' accept='.jpg,.png' id='fileUpload' onChange={ handleChange } />
                <div className='add-post-upload-button'>
                    <p>Selected file: {isUploaded ? file.name : 'No file selected'}</p>
                </div>
            </form>
        </div>
    );
}

export default ArtUpload;
