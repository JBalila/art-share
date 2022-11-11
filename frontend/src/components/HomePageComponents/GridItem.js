import React from 'react';
import { useState, useEffect } from 'react';

const bp = require('../Path.js');

function GridItem({ post }) {
    const [authorName, setAuthorName] = useState('');
    const [altText, setAltText] = useState('');

    const imageBinary = `data:image/png;base64,${post.Image}`;

    useEffect(() => {
        getUsername();
    }, []);

    const getUsername = async function() {
        let obj = {userID: post.AuthorID};
        let jsonPayload = JSON.stringify(obj);

        try {
            const response = await fetch(bp.buildPath('/api/getUsername'), {
                method:'POST', body:jsonPayload, headers: {
                    'Content-Type':'application/json'
                }
            });

            let res = JSON.parse(await response.text());
            if (res.error) {
                console.error(res.error);
            }

            setAuthorName(res);
            setAltText(`Image by ${res}`);
        }
        catch(e) {
            console.error(e);
        }
    }

    const viewPost = function() {
        console.log(post._id);
    }

    return(
        <div className='grid-item' onClick={viewPost}>
            <img src={imageBinary} alt={altText} />
            <div className='post-info'>
                <span id='title-and-author'>{post.Title} by {authorName}</span>
                <span id='post-likes'>{post.Likes} Likes</span>
            </div>
        </div>
    );
}

export default GridItem;