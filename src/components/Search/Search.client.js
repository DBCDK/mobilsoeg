'use strict';
import React from 'react';
import Search from './Search.react';
import '../../styles/app.scss';

/**
 * Client side rendering of the QueryString component
 *
 * THIS IS A DUMMY IMPLEMENTATION
 * This component should implemented in the main search field
 *
 */
const data = [
  {label: 'hest'},
  {label: 'æble'},
  {label: 'banan'},
  {label: 'test'},
  {label: 'fisk'}
];

React.render(<Search query={window.QUERYSTRING_PROPS || []} elements={data}/>, document.getElementById('search'));
