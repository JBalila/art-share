import React from 'react';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Page from '../components/Page';
import MenuTabs from '../components/MenuTabs';
import Buffer from '../components/Buffer';
import { CgHeart } from 'react-icons/cg';
import Lightbox from '../components/ViewPostComponents/Lightbox';
import Comment from '../components/ViewPostComponents/Comment';

import '../components/ViewPostComponents/ViewPost.css';
import background from "../background.jpg";
import { FaArrowAltCircleLeft } from "react-icons/fa";

const bp = require('../components/Path');

function ViewPostPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const userID = JSON.parse(localStorage.getItem('userData'))._id;
    const accessToken = JSON.parse(localStorage.getItem('accessToken'));

    let post = location.state.post;
    let authorName = location.state.authorName;
    const imageBinary = `data:image/png;base64,${post.Image}`;

    const [lightboxVisible, setLightboxVisible] = useState(false);

    const [imageLikes, setImageLikes] = useState(post.Likes);
    const [imageLikedBy, setImageLikedBy] = useState(post.LikedBy);
    const [display, setDisplay] = useState(() => {
        if (post.LikedBy.includes(userID))
            return {like:'none', unlike:''};
        else
            return {like:'', unlike:'none'};
    });

    const [comments, setComments] = useState([]);
    useEffect(() => {
        getComments();
    }, []);

    const [addCommentText, setAddCommentText] = useState('');

    const getComments = async function() {
        let obj = {postID: post._id, accessToken: accessToken};
        let jsonPayload = JSON.stringify(obj);

        try {
            const response = await fetch(bp.buildPath('/api/getComments'), {
                method:'POST', body:jsonPayload, headers: {
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

            setComments(res.comments);
            localStorage.setItem('accessToken', JSON.stringify(res.accessToken));
        }
        catch(e) {
            console.error(e);
        }
    }

    const likeImage = async function() {
        let obj = {postID: post._id, userID: userID, accessToken: accessToken};
        let jsonPayload = JSON.stringify(obj);

        try {
            const response = await fetch(bp.buildPath('/api/likePost'), {
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

            setImageLikes(prevLikes => {
                return prevLikes + 1;
            });
            setImageLikedBy(imageLikedBy => [...imageLikedBy, userID]);
            setDisplay({like:'none', unlike:''});

            localStorage.setItem('accessToken', JSON.stringify(res.accessToken));
        }
        catch(e) {
            console.error(e);
        }
    }

    const unlikeImage = async function() {
        let obj = {postID: post._id, userID: userID, accessToken: accessToken};
        let jsonPayload = JSON.stringify(obj);

        try {
            const response = await fetch(bp.buildPath('/api/unlikePost'), {
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

            setImageLikes(prevLikes => {
                return prevLikes - 1;
            });
            setImageLikedBy(imageLikedBy.filter(id => id !== userID));
            setDisplay({like:'', unlike:'none'});

            localStorage.setItem('accessToken', JSON.stringify(res.accessToken));
        }
        catch(e) {
            console.error(e);
        }
    }

    const addComment = async function() {
        let obj = {author: userID, post: post._id, comment: addCommentText, accessToken: accessToken};
        let jsonPayload = JSON.stringify(obj);

        try {
            const response = await fetch(bp.buildPath('/api/addComment'), {
                method:'POST', body:jsonPayload, headers: {
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

            setAddCommentText('');

            let newComment = {
                PostID: post._id,
                AuthorID: userID,
                Timestamp: new Date(),
                Text: addCommentText,
                Likes: 0,
                LikedBy: []
            };
            setComments(comments => [...comments, newComment]);

            localStorage.setItem('accessToken', JSON.stringify(res.accessToken));
        }
        catch(e) {
            console.error(e);
        }
    }

    const handleDelete = async function() {
        let confirmDelete = window.confirm('Are you sure you want to delete this post?');
        if (!confirmDelete) return;

        let obj ={postID: post._id, accessToken: accessToken};
        let jsonPayload = JSON.stringify(obj);

        try {
            const response = await fetch(bp.buildPath('/api/deletePost'), {
                method:'DELETE', body:jsonPayload, headers: {
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

            localStorage.setItem('accessToken', JSON.stringify(res.accessToken));
            window.location.href='/home';
        }
        catch(e) {
            console.error(e);
        }
    }

    const toggleFullImage = function() {
        setLightboxVisible(!lightboxVisible);
    }

    return(
        <div className="background" style={{ backgroundImage: `url(${background})` }}>
            <MenuTabs />
            <Lightbox isVisible={lightboxVisible} image={imageBinary} closeImage={toggleFullImage} />
                <Page className='leftPage'>
                  <button className='back-button' type='button' onClick={() => navigate(-1)}><FaArrowAltCircleLeft /></button>
                    <div className='post-container'>
                        <span id='post-title'>{post.Title}</span>
                        <div className='image-container'>
                            <img src={imageBinary} alt='' onClick={toggleFullImage} />
                        </div>
                        <div id='view-post-settings'>
                            {userID === post.AuthorID ?
                                    <button className='button' id='delete-post' onClick={handleDelete}>Delete</button>
                                :
                                    <p></p>}
                            <span id='view-post-likes'>
                                <CgHeart className='like-button' id='like'  style={{display:display.like}} onClick={likeImage} />
                                <CgHeart className='like-button' id='unlike' style={{display:display.unlike}} onClick={unlikeImage} />
                                {' ' + imageLikes}
                            </span>
                        </div>
                        <p id='view-post-description'>{post.Description}</p>
                    </div>
                </Page>
                <Page className='rightPage'>
                    <div className='comments-container'>
                        {comments.map(comment => <Comment key={comment._id} comment={comment} />)}
                    </div>
                    <div className='add-comment-form'>
                        <textarea id='add-comment-textarea' placeholder='Add comment here'
                                value={addCommentText} onChange={(e) => setAddCommentText(e.target.value)} />
                        <button className='button' id='add-comment-button' type='button' onClick={addComment}>
                            Add Comment
                        </button>
                    </div>
                </Page>
            <Buffer />
        </div>
    );
}

export default ViewPostPage;
