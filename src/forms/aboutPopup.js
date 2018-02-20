/**
 * Created by alexanderbol on 13/04/2017.
 */

import React from 'react';
import '../../public/styles/App.css';

export const AboutPopup = (props) => {
    let onCloseButtonPressed = () => {
        props.onCloseAboutPopupPressed();
    };

    let handleKeyDown = (ev) => {
        if (ev.code === "Escape") {
            props.onCloseAboutPopupPressed();
        }
    };

    document.addEventListener('keydown', handleKeyDown);

    return (
        <div className="modal">
            <div className="App-modal-popup"
                 id="aboutPopup"
                 draggable="true"
            >
                <h2>{props.title} v{props.version}</h2>
                <h4>Build 04186c88 20/02/2018</h4>
                <button onClick={onCloseButtonPressed}>Close</button>
            </div>
        </div>
    )
};
