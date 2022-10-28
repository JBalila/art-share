import React from 'react';
import PropTypes from 'prop-types';
import './Page.css';

export default function Page({children}) {
  return (
      <div id="outer-rectangle">
        <div id="inner-rectangle">
          {children}
        </div>
      </div>
    )
}

Page.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element.isRequired
  ])
}
