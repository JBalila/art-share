import React from 'react';
import { useState } from 'react';

function ArtInfo(props) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setPublic] = useState(true);
    const [isPrivate, setPrivate] = useState(false);

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
        props.setTitle(event.target.value);
    }

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
        props.setDescription(event.target.value);
    }

    const handleVisibilityChange = (event) => {
        if (event.target.id === 'public') {
            setPublic(true);
            setPrivate(false);
            props.setIsPublic(true);
        }
        else {
            setPublic(false);
            setPrivate(true);
            props.setIsPublic(false);
        }
    }

    return(
        <div className='artinfo-container'>

            <label className='art-info-label' htmlFor='Title'>Title</label>
            <input className='add-post-input' id='Title' placeholder='Title'
                value={title} onChange={handleTitleChange} />
            <label className='art-info-label' htmlFor='Description'>Description</label>
            <textarea className='add-post-textarea' id='Description' placeholder='Description'
                value={description} onChange={handleDescriptionChange} />

            <div className='add-post-visibility'>
                <span>Public</span>
                <input type='checkbox' id='public' className='add-post-checkbox'
                    checked={isPublic} onChange={handleVisibilityChange} />
                <span>Private</span>
                <input type='checkbox' id='private' className='add-post-checkbox'
                    checked={isPrivate} onChange={handleVisibilityChange} />
            </div>

            <br />
            <span className='add-post-message'>{props.error}</span>
        </div>
    );
}

export default ArtInfo;
