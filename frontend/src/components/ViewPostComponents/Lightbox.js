import React from 'react';

import './ViewPost.css';

function Lightbox({ isVisible, image, closeImage }) {
    let display = isVisible ? '' : 'none';

    return(
        <div className='modal' style={{display:display}}>
            <span className='close-cursor' onClick={closeImage}>&times;</span>
            <img src={image} alt='' className='modal-content' />
        </div>
    );
}

export default Lightbox;