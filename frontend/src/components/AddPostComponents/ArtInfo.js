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
            <div>
                <span>Title</span> <br />
                <input type='text' placeholder='Title' 
                    value={title} onChange={handleTitleChange} />
            </div>

            <div>
                <span>Description</span> <br />
                <textarea placeholder='Description' 
                    value={description} onChange={handleDescriptionChange} />
            </div>

            <div>
                <span>Public</span>
                <input type='checkbox' id='public' 
                    checked={isPublic} onChange={handleVisibilityChange} />

                <span>Private</span>
                <input type='checkbox' id='private' 
                    checked={isPrivate} onChange={handleVisibilityChange} />
                
                <br /> <br />
                <span>{props.error}</span>
            </div>
        </div>
    );
}

export default ArtInfo;