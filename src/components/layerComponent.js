/**
 * Created by alexanderbol on 17/04/2017.
 */

import React, { Component } from 'react';
// import logo from './logo.svg';
import '../App.css';

let styleSheet = {
    displayed: {
        backgroundColor: "lightblue"
    },
    undisplayed: {
        backgroundColor: "lightgray"
    }
};

export class LayerComponent extends Component {
    // constructor() {
    //     super();
    // }

    componentWillMount() {
        this.dispatch = this.props.store.dispatch;
    }
    render() {
         let style = this.props.layer.displayed ?
             styleSheet.displayed : styleSheet.undisplayed;

        return (
            <div style={style}
                onClick={this.props.onLayerClicked}>
                <h4>{this.props.layer.name}</h4>
            </div>
        )

    }
}
