/**
 * Created by alexanderbol on 06/05/2017.
 */

import React, {Component} from 'react';
import '../App.css';

export class AsideComponent extends Component {
    render() {
        let state = this.props.store.getState();
        let stage = state.stage;

        let decimals = 3;   // Flatten.DECIMALS
        let coordX = 0;
        let coordY = 0;
        if (stage) {
            coordX = stage.C2W_X(state.mouse.x).toFixed(decimals);
            coordY = stage.C2W_Y(state.mouse.y).toFixed(decimals);
        }

        // this.state.coord.htmlElement.innerHTML = coordX + ', ' + coordY;

        return (
            <aside className="App-ads">
                <div>
                    <span>{`${coordX}, ${coordY}`}</span>
                </div>
                <div>Paste data here...</div>
            </aside>
        )
    }
}