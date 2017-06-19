/**
 * Created by alexanderbol on 21/04/2017.
 */

import React, {Component} from 'react';
// import createjs from 'easel-js';

import '../App.css';

import { LayerComponent } from '../components/layerComponent';
import { Stage } from '../models/stage';

// import {Layer} from '../models/layer';
// import {Layers} from '../models/layers';

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

    componentWillMount() {
        // this.dispatch = this.props.store.dispatch;
        // this.setState(this.props.store.getState());
    }

    componentDidMount() {
        let stage = new Stage(this.refs.canvas);

        stage.on("stagemousemove", this.handleMouseMove);
        stage.on("stagemousedown", this.handleMouseDown);
        stage.on("stagemouseup", this.handleMouseUp);
        stage.canvas.addEventListener("mousewheel", this.handleMouseWheel);
        stage.canvas.addEventListener("DOMMouseScroll", this.handleMouseWheelFox);

        this.props.onStageCreated(stage);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.stage ? nextProps.stage.needToBeUpdated : true;
    }

    componentDidUpdate() {
        if (this.props.stage.canvas && this.props.stage.canvas.getContext('2d')) {
            this.props.stage.update();
        }
    }

    componentWillUnmount() {

    }

    render() {
        return (
            <canvas ref="canvas" id="mainCanvas" className="App-graphics">
                {
                    this.props.layers.map((layer) =>
                        <LayerComponent
                            key={layer.name}
                            layer={layer}
                        />)
                }
            </canvas>
        )
    }
}
