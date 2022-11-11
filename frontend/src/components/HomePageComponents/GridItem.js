import React from 'react';



function GridItem({ post }) {
    return(
        <div>
            <h1>{post.Title}</h1>
        </div>
    );
}

export default GridItem;