/**
 * Created by alexanderbol on 21/04/2017.
 */

import { Component } from 'react';
// import createjs from 'easel-js';

import '../App.css';

// import { Stage } from '../models/stage';
// import * as ActionTypes from '../actions/action-types';

export class StageComponent extends Component {
    constructor() {
        super();
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseWheel = this.handleMouseWheel.bind(this);
        this.handleMouseWheelFox = this.handleMouseWheelFox.bind(this);
    }

    componentDidMount() {
        this.props.stage.on("stagemousemove", this.handleMouseMove);
        this.props.stage.on("stagemousedown", this.handleMouseDown);
        this.props.stage.on("stagemouseup", this.handleMouseUp);
        this.props.stage.canvas.addEventListener("mousewheel", this.handleMouseWheel);
        this.props.stage.canvas.addEventListener("DOMMouseScroll", this.handleMouseWheelFox);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.stage.needToBeUpdated;
    }

    handleMouseMove(event) {
        this.props.onMouseMove(event.stageX, event.stageY);
    }

    handleMouseDown(event) {
        this.props.onMouseDown(event.stageX, event.stageY);
    }

    handleMouseUp(event) {
        this.props.onMouseUp(event.stageX, event.stageY);
    }

    handleMouseWheel(event) {
        event.preventDefault();

        let delta = event.detail || event.wheelDelta;
        if (delta !== 0) {
            this.props.onMouseWheelMove(event.offsetX, event.offsetY, delta);
        }
    }

    handleMouseWheelFox(event) {
        event.preventDefault();
        if (event.detail !== 0) {
            this.props.onMousewheelMove(event.layerX, event.layerY, -event.detail);
        }
    }

    render() {
        for (let layer of this.props.layers) {
            for (let shape of layer.shapes) {
                shape.alpha = layer.displayed ? 1 : 0;
                shape.redraw();
            }
        }

        if (this.props.stage.canvas.getContext('2d')) {
            this.props.stage.update();
        }

        return null;
    }
}
