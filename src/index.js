import React from 'react';
import ReactDOM from 'react-dom';

// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/css/bootstrap-theme.css';

import App from './App';
import './index.css';

import { createStore, applyMiddleware, compose } from 'redux';
import { reducer } from './reducer';
import log from './middleware/log';
import readFiles from './middleware/readFiles';
import demo from './middleware/demo';
import test from './middleware/test';

const store = createStore(reducer, compose(applyMiddleware(
    log,
    readFiles,
    demo,
    test
)));

ReactDOM.render(
  <App store={store} />,
  document.getElementById('root')
);
