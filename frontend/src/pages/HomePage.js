import React from 'react';
import { useState, useEffect } from 'react';

import Page from '../components/Page';
import MenuTabs from '../components/MenuTabs';
import GridItem from '../components/HomePageComponents/GridItem';

import '../components/HomePageComponents/HomePage.css';
import background from "../background.jpg";

const bp = require('../components/Path');

const POSTS_PER_PAGE = 2;
const POSTS_PER_SCREEN = POSTS_PER_PAGE * 2;

function HomePage() {
  const myClique = JSON.parse(localStorage.getItem('userData')).Clique;
  
  const [posts, setPosts] = useState([]);
  const [leftPagePosts, setLeftPagePosts] = useState([]);
  const [rightPagePosts, setRightPagePosts] = useState([]);
  const [page, setPage] = useState(0);

  const getFeed = async function() {
    let obj = {clique: myClique};
    let jsonPayload = JSON.stringify(obj);

    try {
      const response = await fetch(bp.buildPath('/api/feed'), {
        method:'POST', body:jsonPayload, headers: {
          'Content-Type':'application/json'
        }
      });

      let res = JSON.parse(await response.text());
      if (res.error) {
        console.error(res.error);
        return;
      }

      setPosts(res);

      let base = page * POSTS_PER_SCREEN;
      let leftPage = res.slice(base, base + POSTS_PER_PAGE);
      let rightPage = res.slice(base + POSTS_PER_PAGE, base + POSTS_PER_SCREEN);
      setLeftPagePosts(leftPage);
      setRightPagePosts(rightPage);
    }
    catch(e) {
      console.error(e);
    }
  }

  // Splits <posts> into left-and-right pages based on page-number
  const setVisiblePosts = function() {
    let base = page * POSTS_PER_SCREEN;
    let leftPage = posts.slice(base, base + POSTS_PER_PAGE);
    let rightPage = posts.slice(base + POSTS_PER_PAGE, base + POSTS_PER_SCREEN);
    setLeftPagePosts(leftPage);
    setRightPagePosts(rightPage);
  }

  // Get initial list of posts
  useEffect(() => {
    getFeed();
  }, []);

  // Change displayed posts based on page number
  useEffect(() => {
    setVisiblePosts();
  }, [page]);

  const incrementPage = function() {
    setPage(currPage => {
      return currPage + 1;
    });
  }

  const decrementPage = function() {
    setPage(currPage => {
      return currPage - 1;
    });
  }

  return(
    <div className="background" style={{ backgroundImage: `url(${background})` }}>
      <MenuTabs />
        <Page className="leftPage">
          <div className='post-format'>
            {leftPagePosts.map((post) => <GridItem key={post._id} post={post} />)}
          </div>
          <div>
            {page > 0 ?
                <button type='button' onClick={decrementPage}>Decrement Page</button>
              :
                <p></p>
            }
          </div>
        </Page>
        <Page className="rightPage">
          <div className='post-format'>
            {rightPagePosts.map((post) => <GridItem key={post._id} post={post} />)}
          </div>
          <div>
            {((page+1)*POSTS_PER_SCREEN) < posts.length ?
                <button type='button' onClick={incrementPage}>Increment Page</button>
              :
                <p></p>
            }
          </div>
        </Page>
    </div>
  )
}

export default HomePage;
