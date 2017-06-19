/**
 * Created by alexanderbol on 17/04/2017.
 */

import React, { Component } from 'react';
import '../App.css';

import { ToolbarComponent } from './toolbarComponent';
// import { CanvasComponent } from './canvasComponent';
import { StageComponent } from './stageComponent';
import { StatusComponent } from './statusComponent';

import * as ActionTypes from '../actions/action-types';
// import {Stage} from '../models/stage';
import {Layer} from '../models/layer';
import {Layers} from '../models/layers';

export class MainComponent extends Component {
    constructor() {
        super();
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseWheelMove = this.handleMouseWheelMove.bind(this);
        this.registerStage = this.registerStage.bind(this);
        this.toggleUnits = this.toggleUnits.bind(this);

        this.buttonClicked = this.buttonClicked.bind(this);
    }

    registerStage(stage) {
        let layer = new Layer(stage);
        layer.name = Layers.getNewName(this.state.layers);
        layer.affected = true;

        this.dispatch({
            type: ActionTypes.NEW_STAGE_CREATED,
            stage: stage,
            layer: layer
        });
    }

    toggleUnits() {
        this.dispatch({
            type: ActionTypes.TOGGLE_UNITS_CLICKED
        });
    }

    handleMouseMove(stageX, stageY) {
        this.dispatch({
            type: ActionTypes.MOUSE_MOVED_ON_STAGE,
            x: stageX,
            y: stageY,
            dx: this.state.mouse.startX ? stageX - this.state.mouse.startX : undefined,
            dy: this.state.mouse.startY ? stageY - this.state.mouse.startY : undefined
        });
    }

    handleMouseDown(stageX, stageY) {
        // start pan stage
        this.dispatch({
            type: ActionTypes.MOUSE_DOWN_ON_STAGE,
            x: stageX,
            y: stageY
        })
    }

    handleMouseUp(stageX, stageY) {
        // stop pan stage
        this.dispatch({
            type: ActionTypes.MOUSE_UP_ON_STAGE,
            x: event.stageX,
            y: event.stageY
        })
    }

    handleMouseWheelMove(stageX, stageY, delta) {
        if (delta !== 0) {
            this.dispatch({
                type: ActionTypes.MOUSE_WHEEL_MOVE_ON_STAGE,
                x: stageX,
                y: stageY,
                delta: delta
            });
        }
    }

    buttonClicked() {
        alert("button clicked")
    }

    componentWillMount() {
        this.dispatch = this.props.store.dispatch;
        this.setState(this.props.store.getState());
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.store.getState());
    }

    render() {
        // let state = this.props.store.getState();
        let stage = this.state.stage;

        let decimals = this.state.app.decimals;
        let divisor = this.state.app.divisor;
        let coordX = 0;
        let coordY = 0;
        if (stage) {
            coordX = (stage.C2W_X(this.state.mouse.x)/divisor).toFixed(decimals);
            coordY = (stage.C2W_Y(this.state.mouse.y)/divisor).toFixed(decimals);
        }

        return (
            <main className="App-content">
                <ToolbarComponent
                    {...this.props }
                    buttonClicked={this.buttonClicked}
                />
                <StageComponent
                    canvasId="mainCanvas"
                    stage={this.state.stage}
                    layers={this.state.layers}
                    onStageCreated={this.registerStage}
                    onMouseDown={this.handleMouseDown}
                    onMouseMove={this.handleMouseMove}
                    onMouseUp={this.handleMouseUp}
                    onMouseWheelMove={this.handleMouseWheelMove}
                />

                <StatusComponent
                    units={this.state.app.units}
                    decimals={this.state.app.decimals}
                    coordX={coordX}
                    coordY={coordY}
                    onUnitClicked={this.toggleUnits}
                />
            </main>
        )
    }
}
