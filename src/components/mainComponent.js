/**
 * Created by alexanderbol on 17/04/2017.
 */

import React, { Component } from 'react';
import '../App.css';

import { ToolbarComponent } from './toolbarComponent';
// import { CanvasComponent } from './canvasComponent';
import { StageComponent } from './stageComponent';
import { StatusComponent } from './statusComponent';
// import { LayerComponent } from './layerComponent';
import * as ActionTypes from '../actions/action-types';
// import {Stage} from '../models/stage';
// import {Layer} from '../models/layer';
import {Layers} from '../models/layers';

import { PolygonTool } from '../tools/polygonTool';
import { MeasurePointsTool } from '../tools/measurePointsTool';

export class MainComponent extends Component {
    constructor() {
        super();
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseWheelMove = this.handleMouseWheelMove.bind(this);
        this.registerStage = this.registerStage.bind(this);
        this.toggleUnits = this.toggleUnits.bind(this);

        this.onMouseRollOverShape = this.onMouseRollOverShape.bind(this);
        this.onMouseRollOutShape = this.onMouseRollOutShape.bind(this);

        this.resizeStage = this.resizeStage.bind(this);

        this.handleFileSelect = this.handleFileSelect.bind(this);
        this.setHomeView = this.setHomeView.bind(this);
        this.toggleWidthMode = this.toggleWidthMode.bind(this);
        this.toggleDisplayVertices = this.toggleDisplayVertices.bind(this);
        this.onMeasurePointsButtonPressed = this.onMeasurePointsButtonPressed.bind(this);
        this.onMeasureBetweenContoursButtonPressed = this.onMeasureBetweenContoursButtonPressed.bind(this);
        this.onPanByDragPressed = this.onPanByDragPressed.bind(this);
    }

    registerStage(stage) {
        // let layer = Layers.newLayer(stage, this.state.layers);
        this.dispatch({
            type: ActionTypes.NEW_STAGE_CREATED,
            stage: stage,
            /*layer: layer*/
        });
    }

    resizeStage() {
        // alert("resized")
        this.dispatch({
            type: ActionTypes.STAGE_RESIZED
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
        // Patch bug in Firefox when dispatch is not fired
        this.state.stage.panByMouseStop();
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

    onMouseRollOverShape(shape) {
        this.dispatch({
            type: ActionTypes.MOUSE_ROLL_OVER_SHAPE,
            shape: shape
        })
    }

    onMouseRollOutShape() {
        this.dispatch({
            type: ActionTypes.MOUSE_ROLL_OUT_SHAPE,
        })
    }

    handleFileSelect(event) {
        if (!(File && FileReader && FileList)) return;

        let files = event.target.files; // FileList object

        this.dispatch({
            type: ActionTypes.FILENAME_LIST_SELECTED,
            files: files,
            stage: this.state.stage,
            layers: this.state.layers
        });
    }

    setHomeView() {
        let layer = Layers.getAffected(this.state.layers);
        if (!layer) return;
        // TODO: dispatch PAN_AND_ZOOM instead ?
        this.dispatch({
            type: ActionTypes.PAN_AND_ZOOM_TO_SHAPE,
            shape: layer
        })
    }

    onPanByDragPressed() {
        this.dispatch({
            type: ActionTypes.PAN_BY_DRAG_BUTTON_CLICKED
        })
    }

    toggleWidthMode() {
        this.dispatch({
            type: ActionTypes.TOGGLE_WIDTH_MODE_CLICKED
        })

    }

    toggleDisplayVertices() {
        if (this.state.app.widthOn)
            return;
        this.dispatch({
            type: ActionTypes.TOGGLE_DISPLAY_VERTICES_CLICKED
        })
    }

    onMeasurePointsButtonPressed() {
        this.dispatch({
            type: ActionTypes.MEASURE_POINTS_BUTTON_PRESSED
        });
    }

    onMeasureBetweenContoursButtonPressed() {
        this.dispatch({
            type: ActionTypes.MEASURE_CONTOURS_BUTTON_PRESSED
        });
        alert("Not implemented yet")
    }

    componentWillMount() {
        this.dispatch = this.props.store.dispatch;
        this.setState(this.props.store.getState());
    }

    componentDidMount() {
        window.onresize = this.resizeStage;
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.store.getState());
    }

    componentDidUpdate() {
        if (this.state.stage.canvas && this.state.stage.canvas.getContext('2d')) {
            this.state.stage.update();
        }
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
                    onFileSelected={this.handleFileSelect}
                    onHomeButtonPressed={this.setHomeView}
                    onPanByDragPressed={this.onPanByDragPressed}
                    onMeasurePointsButtonPressed={this.onMeasurePointsButtonPressed}
                    onMeasureBetweenContoursButtonPressed={this.onMeasureBetweenContoursButtonPressed}
                    onToggleWidthModePressed={this.toggleWidthMode}
                />
                <StageComponent
                    stage={this.state.stage}
                    onStageCreated={this.registerStage}
                    onMouseDown={this.handleMouseDown}
                    onMouseMove={this.handleMouseMove}
                    onMouseUp={this.handleMouseUp}
                    onMouseWheelMove={this.handleMouseWheelMove}
                    onHomeKeyPressed={this.setHomeView}
                    onToggleWidthModePressed={this.toggleWidthMode}
                    onToggleDisplayVerticesPressed={this.toggleDisplayVertices}
                />
                {
                    this.state.app.measurePointsActive ? (
                        <MeasurePointsTool
                            stage={this.state.stage}
                            divisor={this.state.app.divisor}
                            decimals={this.state.app.decimals}
                            onMouseWheelMove={this.handleMouseWheelMove}
                        />
                    ) : null
                }

                {
                    this.state.layers.map((layer) => {
                        /*
                        let initialScale = this.state.stage.scalingFactor();
                        let scale = this.state.stage.scalingFactor() / this.state.stage.initialScalingFactor;
                        let origin = this.state.stage.origin;
                        let tx = this.state.stage.tx;
                        let ty = this.state.stage.ty;*/
                        return (
                            [...layer.shapes].map((shape, index) =>
                                <PolygonTool
                                    key={index}
                                    polygon={shape}
                                    displayed={layer.displayed}
                                    color={layer.color}
                                    widthOn={this.state.app.widthOn}
                                    displayVertices={this.state.app.displayVertices}
                                    onMouseOver={this.onMouseRollOverShape}
                                    onMouseOut={this.onMouseRollOutShape}
                                />
                            )
                        )
                    })
                }

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
