import React from 'react';
import { useState, useEffect } from 'react';

import Page from '../components/Page';
import MenuTabs from '../components/MenuTabs';
import GridItem from '../components/HomePageComponents/GridItem';

import '../components/HomePageComponents/HomePage.css';
import background from "../background.jpg";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";

const bp = require('../components/Path');

const POSTS_PER_PAGE = 2;
const POSTS_PER_SCREEN = POSTS_PER_PAGE * 2;

function HomePage() {
  const userID = JSON.parse(localStorage.getItem('userData'))._id;

  // For determining which posts to display
  const [search, setSearch] = useState('');
  const [displayParams, setDisplayParams] = useState('All');
  const [sortParams, setSortParams] = useState('Date Created');

  // For displaying posts
  const [posts, setPosts] = useState([]);
  const [leftPagePosts, setLeftPagePosts] = useState([]);
  const [rightPagePosts, setRightPagePosts] = useState([]);
  const [page, setPage] = useState(0);

  const getFeed = async function() {
    let obj = {
      userID: userID,
      search: search,
      displayParams: displayParams,
      sortParams: sortParams,
      offset: page * POSTS_PER_SCREEN,
      limit: POSTS_PER_SCREEN + 1
    };
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

      let leftPage = res.slice(0, POSTS_PER_PAGE);
      let rightPage = res.slice(POSTS_PER_PAGE, POSTS_PER_SCREEN);
      setLeftPagePosts(leftPage);
      setRightPagePosts(rightPage);
    }
    catch(e) {
      console.error(e);
    }
  }

  const incrementPage = function() {
    setPage(currPage => currPage + 1);
  }

  const decrementPage = function() {
    setPage(currPage => currPage - 1);
  }

  const doSearch = function() {
    setPage(0);
    getFeed();
  }

  const handleDisplayChange = function(e) {
    setPage(0);
    setDisplayParams(e.target.value);
  }

  const handleSortChange = function(e) {
    setPage(0);
    setSortParams(e.target.value);
  }

  // Refetch feed when User moves page
  useEffect(() => {
    getFeed();
  }, [page, displayParams, sortParams]);

  return(
    <div className="background" style={{ backgroundImage: `url(${background})` }}>
      <MenuTabs />
      <div className='search-bar'>
        <input type='text' placeholder='Search'
          value={search} onChange={(e) => setSearch(e.target.value)} />
        <button type='button' onClick={doSearch}>Search</button>
      </div>
      <Page className="leftPage">
        <div className='post-format'>
          {leftPagePosts.map((post) => <GridItem key={post._id} post={post} />)}
        </div>
        <div>
          {page > 0 ?
              <button className='decrement-button' type='button' onClick={decrementPage}>
                <FaArrowAltCircleLeft className='decrement-icon' />
              </button>
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
          {posts.length > POSTS_PER_SCREEN ?
              <button className='increment-button' type='button' onClick={incrementPage}>
                <FaArrowAltCircleRight className='increment-icon' />
              </button>
            :
              <p></p>
          }
        </div>
      </Page>
      <div className='display-and-sort'>
        <span>Display Options</span>
        <div className='display-options' onChange={(e) => handleDisplayChange(e)}>
          <div className='input'>
            <input type='radio' name='display' id='all'
              value='All' defaultChecked />
            <label htmlFor='all'>All</label>
          </div>

          <div className='input'>
            <input type='radio' name='display' id='friends'
              value='Friends' />
            <label htmlFor='friends'>Friends</label>
          </div>

          <div className='input'>
            <input type='radio' name='display' id='self'
              value='Self' />
            <label htmlFor='self'>Self</label>
          </div>
        </div>

        <br /> <br />

        <span>Sort Options</span>
        <div className='sort-options' onChange={(e) => handleSortChange(e)}>
          <div className='input'>
            <input type='radio' name='sort' id='date'
              value='Date' defaultChecked />
            <label htmlFor='date'>Date</label>
          </div>

          <div className='input'>
            <input type='radio' name='sort' id='likes'
              value='Likes' />
            <label htmlFor='likes'>Likes</label>
          </div>

          <div className='input'>
            <input type='radio' name='sort' id='title'
              value='Title' />
            <label htmlFor='title'>Title</label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage;
