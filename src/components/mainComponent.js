/**
 * Created by alexanderbol on 17/04/2017.
 */

import React, { Component } from 'react';
import '../App.css';

import { ToolbarComponent } from './toolbarComponent';
import { CanvasComponent } from './canvasComponent';
import { StageComponent } from './stageComponent';

import * as ActionTypes from '../actions/action-types';

export class MainComponent extends Component {
    constructor() {
        super();
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseWheelMove = this.handleMouseWheelMove.bind(this);
    }

    componentWillMount() {
        this.dispatch = this.props.store.dispatch;
        this.setState(this.props.store.getState());
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.store.getState());
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

    render() {
        let stageComponent = this.state.stage ? (
            <StageComponent
                stage={this.state.stage}
                layers={this.state.layers}
                onMouseDown={this.handleMouseDown}
                onMouseMove={this.handleMouseMove}
                onMouseUp={this.handleMouseUp}
                onMouseWheelMove={this.handleMouseWheelMove}
            />
        ) : null;
        return (
            <main className="App-content">
                <ToolbarComponent {...this.props } />
                <CanvasComponent {...this.props } />
                {stageComponent}
            </main>
        )
    }

}
