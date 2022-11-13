import React from 'react';
import { useState, useEffect } from 'react';

import { CgHeart } from 'react-icons/cg'; 

const bp = require('../Path');

function Comment({ comment }) {
    const userID = JSON.parse(localStorage.getItem('userData'))._id;
    const accessToken = JSON.parse(localStorage.getItem('accessToken'));

    const [commentLikes, setCommentLikes] = useState(comment.Likes);
    const [commentLikedBy, setCommentLikedBy] = useState(comment.LikedBy);
    const [display, setDisplay] = useState(() => {
        if (comment.LikedBy.includes(userID))
            return {like:'none', unlike:''};
        else
            return {like:'', unlike:'none'};
    });

    const [commentAuthor, setCommentAuthor] = useState('');
    useEffect(() => {
        getCommentAuthor();
    }, []);
    
    const getCommentAuthor = async function() {
        let obj = {userID: comment.AuthorID};
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
                return;
            }

            setCommentAuthor(res);
        }
        catch(e) {
            console.error(e);
        }
    }

    const likeComment = async function() {
        let obj = {commentID: comment._id, likedBy: userID, accessToken: accessToken };
        let jsonPayload = JSON.stringify(obj);

        try {
            const response = await fetch(bp.buildPath('/api/likeComment'), {
                method:'PATCH', body:jsonPayload, headers: {
                    'Content-Type':'application/json'
                }
            });

            let res = JSON.parse(await response.text());

            // JWT expired, return User to login page
            if (res.jwtExpired) {
                localStorage.removeItem('userData');
                localStorage.removeItem('accessToken');
                window.location.href='/';
                return;
            }

            if (res.error) {
                console.error(res.error);
                return;
            }

            setCommentLikes(prevLikes => {
                return prevLikes + 1;
            });
            setCommentLikedBy(commentLikedBy => [...commentLikedBy, userID]);
            setDisplay({like:'none', unlike:''});

            localStorage.setItem('accessToken', JSON.stringify(res.accessToken));
        }
        catch(e) {
            console.error(e);
        }
    }
    
    const unlikeComment = async function() {
        let obj = {commentID: comment._id, likedBy: userID, accessToken: accessToken };
        let jsonPayload = JSON.stringify(obj);

        try {
            const response = await fetch(bp.buildPath('/api/unlikeComment'), {
                method:'PATCH', body:jsonPayload, headers: {
                    'Content-Type':'application/json'
                }
            });

            let res = JSON.parse(await response.text());

            // JWT expired, return User to login page
            if (res.jwtExpired) {
                localStorage.removeItem('userData');
                localStorage.removeItem('accessToken');
                window.location.href='/';
                return;
            }

            if (res.error) {
                console.error(res.error);
                return;
            }

            setCommentLikes(prevLikes => {
                return prevLikes - 1;
            });
            setCommentLikedBy(commentLikedBy.filter(id => id !== userID));
            setDisplay({like:'', unlike:'none'});

            localStorage.setItem('accessToken', JSON.stringify(res.accessToken));
        }
        catch(e) {
            console.error(e);
        }
    }

    return(
        <div className='comment'>
            <span><b>{commentAuthor}:</b> {comment.Text}</span> <br />
            <span>
                <CgHeart className='like-button' id='like'  style={{display:display.like}} onClick={likeComment} />
                <CgHeart className='like-button' id='unlike' style={{display:display.unlike}} onClick={unlikeComment} />
                {' ' + commentLikes}
            </span>
        </div>
    );   
}

export default Comment;