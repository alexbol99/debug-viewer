import React from 'react';
import ReactDOM from 'react-dom';

// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/css/bootstrap-theme.css';

import App from './App';
import './index.css';

import { createStore } from 'redux';
import { reducer } from './reducer';

const store = createStore(reducer);

ReactDOM.render(
  <App store={store} />,
  document.getElementById('root')
);
