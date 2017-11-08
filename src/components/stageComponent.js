/**
 * Created by alexanderbol on 21/04/2017.
 */

import React, {Component} from 'react';
// import * as createjs from '../../public/easeljs-NEXT.combined.js';

import '../App.css';
import {Stage} from '../models/stage';

export class StageComponent extends Component {
    constructor() {
        super();
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleMouseWheel = this.handleMouseWheel.bind(this);
        this.handleMouseWheelFox = this.handleMouseWheelFox.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    handleMouseMove(event) {
        this.props.stage.canvas.focus();
        this.props.onMouseMove(event.stageX, event.stageY);
    }

    handleMouseDown(event) {
        this.props.onMouseDown(event.stageX, event.stageY);
    }

    handleMouseUp(event) {
        event.stopPropagation();
        event.preventDefault();
        this.props.onMouseUp(event.stageX, event.stageY);
    }

    handleMouseLeave(event) {   // nothing works except click
        this.props.stage.canvas.blur();
        document.body.focus();
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

    handleKeyDown(e) {
        // let ctrl = e.ctrlKey;
        if (e.target.id !== "mainCanvas")
            return;
        switch (e.code) {
            case "KeyH":
                this.props.onHomeKeyPressed();
                break;

            case "KeyW":
                this.props.onToggleWidthModePressed();     // toggle width On/Off in graphics model
                break;

            case "KeyE":
                this.props.onToggleDisplayVerticesPressed();  // toggle vertices On/Off
                break;

            case "ArrowRight":
                break;
            case "ArrowLeft":
                break;
            case "ArrowUp":
                break;
            case "ArrowDown":
                break;
            default:
                break;
        }

    }

    handleKeyUp(event) {

    }

    componentWillMount() {
        // this.dispatch = this.props.store.dispatch;
        // this.setState(this.props.store.getState());
    }

    componentDidMount() {
        let stage = new Stage(this.refs.canvas);

        // stage.setClearColor("#FFFFFF");
        // stage.update();

        stage.on("stagemousemove", this.handleMouseMove);
        stage.on("stagemousedown", this.handleMouseDown);
        stage.on("stagemouseup", this.handleMouseUp);
        stage.on("mouseleave", this.handleMouseLeave);
        stage.canvas.addEventListener("mousewheel", this.handleMouseWheel);
        stage.canvas.addEventListener("DOMMouseScroll", this.handleMouseWheelFox);

        // Keyboard event
        // var _keydown = _.throttle(this.keydown, 100);
        document.addEventListener('keydown', this.handleKeyDown);
        // var _keyup = _.throttle(this.keyup, 500);
        document.addEventListener('keyup', this.handleKeyUp);

        this.props.onStageCreated(stage);
    }

    componentDidUpdate() {
        // if (this.props.stage.canvas && this.props.stage.canvas.getContext('2d')) {
        // this.props.stage.update();
        // }
    }

    componentWillUnmount() {

    }

    render() {
        return (
            <canvas tabIndex="1" ref="canvas" id="mainCanvas" className="App-canvas">
            </canvas>
    )
    }
}