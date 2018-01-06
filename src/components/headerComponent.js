/**
 * Created by alexanderbol on 13/04/2017.
 */

import React from 'react';
// import logo from './logo.svg';
import '../../public/styles/App.css';

export const HeaderComponent = (props) => {
    let state = props.store.getState();
    return (
        <header className="App-header">
            <h2>{state.app.title}</h2>
        </header>
    )
};