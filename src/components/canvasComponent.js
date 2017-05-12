/**
 * Created by alexanderbol on 17/04/2017.
 */

import React, { Component } from 'react';
import '../App.css';

import * as ActionTypes from '../actions/action-types';

export class CanvasComponent extends Component {

    componentWillMount() {
        this.dispatch = this.props.store.dispatch;
        this.setState(this.props.store.getState());
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.store.getState());
    }

    componentDidMount() {
        // stage.drawSomething();

        this.dispatch({
            type: ActionTypes.MAIN_CANVAS_MOUNTED,
            canvas: this.refs.canvas
        });
        // window.addEventListener("resize", this.setCanvasSize);

    }

    setCanvasSize() {
        if (this === window) return;
        if (!this.state.stage) return;
        let canvas = this.state.stage.canvas;
        let parent = canvas.parentNode;
        let styles = getComputedStyle(parent);
        let w = parseInt(styles.getPropertyValue("width"), 10);
        let h = parseInt(styles.getPropertyValue("height"), 10);

        canvas.width = w;
        canvas.height = h;
    }

    render() {
        return (
            <canvas ref="canvas" id="mainCanvas" className="App-graphics">
            </canvas>
        )
    }
}
