import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import '../public/styles/index.css';

import { createStore, applyMiddleware, compose } from 'redux';
import { reducer } from './reducer';

// import about from './middleware/about';
import log from './middleware/log';
import readFiles from './middleware/readFiles';
import pasteData from './middleware/pasteData';
import demo from './middleware/demo';
import stageController from './middleware/stageController';
import matrix_test from './middleware/matrix-test';
// import webgl_test from './middleware/webgl-test';

const store = createStore(reducer, compose(applyMiddleware(
    log,
    readFiles,
    pasteData,
    demo,
    stageController,
    matrix_test
)));

ReactDOM.render(
  <App store={store} />,
  document.getElementById('root')
);
