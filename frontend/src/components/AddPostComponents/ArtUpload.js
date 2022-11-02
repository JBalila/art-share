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
        <div>
            <label htmlFor='fileUpload'>
                <img style={{width:'375px', height:'390px', cursor:'pointer'}} src={UploadImg} />
            </label>
            <input style={{display:'none'}} type='file' accept='.jpg,.png' id='fileUpload' onChange={ handleChange } />
        </div>
    );
}

export default ArtUpload;