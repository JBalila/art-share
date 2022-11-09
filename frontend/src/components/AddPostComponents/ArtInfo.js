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
        <div>
            <div className='add-post-form'>
                <span className='add-post-title'>Title</span> <br />
                <input type='text' className='add-post-input' placeholder='Title' 
                    value={title} onChange={handleTitleChange} />
            </div>

            <div className='add-post-form'>
                <span className='add-post-title'>Description</span> <br />
                <textarea placeholder='Description' className='add-post-textarea'
                    value={description} onChange={handleDescriptionChange} />
            </div>

            <div className='add-post-visibility'>
                <div>
                    <span>Public</span>
                    <input type='checkbox' id='public' className='add-post-checkbox'
                        checked={isPublic} onChange={handleVisibilityChange} />
                </div>

                <div>
                    <span>Private</span>
                    <input type='checkbox' id='private' className='add-post-checkbox'
                        checked={isPrivate} onChange={handleVisibilityChange} />
                </div>
            </div>

            <br />
            <span className='add-post-message'>{props.error}</span>
        </div>
    );
}

export default ArtInfo;