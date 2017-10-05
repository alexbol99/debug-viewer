/**
 * Created by alexanderbol on 17/04/2017.
 */

import React, {Component} from 'react';
import '../App.css';
import Flatten from 'flatten-js';
import {ToolbarComponent} from './toolbarComponent';
import {StageComponent} from './stageComponent';
import {StatusComponent} from './statusComponent';
import * as ActionTypes from '../actions/action-types';
import {Layers} from '../models/layers';
import {PolygonTool} from '../tools/polygonTool';
import {SegmentTool} from "../tools/segmentTool";
import {MeasurePointsTool} from '../tools/measurePointsTool';
import {MeasureShapesTool} from "../tools/measureShapesTool";

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
        this.onClickOnShape = this.onClickOnShape.bind(this);

        this.resizeStage = this.resizeStage.bind(this);

        this.handleFileSelect = this.handleFileSelect.bind(this);
        this.setHomeView = this.setHomeView.bind(this);
        this.toggleWidthMode = this.toggleWidthMode.bind(this);
        this.toggleDisplayVertices = this.toggleDisplayVertices.bind(this);
        this.onMeasurePointsButtonPressed = this.onMeasurePointsButtonPressed.bind(this);
        this.onMeasureBetweenShapesButtonPressed = this.onMeasureBetweenShapesButtonPressed.bind(this);
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
            type: ActionTypes.STAGE_RESIZED,
            stage: this.state.stage
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
            stage: this.state.stage,
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
            stage: this.state.stage,
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
            state: this.state.stage,
            x: event.stageX,
            y: event.stageY
        })
    }

    handleMouseWheelMove(stageX, stageY, delta) {
        if (delta !== 0) {
            this.dispatch({
                type: ActionTypes.MOUSE_WHEEL_MOVE_ON_STAGE,
                stage: this.state.stage,
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

    onClickOnShape(shape, layer) {
        this.dispatch({
            type: ActionTypes.MOUSE_CLICKED_ON_SHAPE,
            shape: shape,
            layer: layer
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
            stage: this.state.stage,
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
            type: ActionTypes.TOGGLE_WIDTH_MODE_CLICKED,
            widthOn: this.state.app.widthOn
        })

    }

    toggleDisplayVertices() {
        // if (this.state.app.widthOn)
        //     return;
        this.dispatch({
            type: ActionTypes.TOGGLE_DISPLAY_VERTICES_CLICKED
        })
    }

    onMeasurePointsButtonPressed() {
        this.dispatch({
            type: ActionTypes.MEASURE_POINTS_BUTTON_PRESSED
        });
    }

    onMeasureBetweenShapesButtonPressed() {
        this.dispatch({
            type: ActionTypes.MEASURE_SHAPES_BUTTON_PRESSED
        });
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
        return (
            <main className="App-content">
                <ToolbarComponent
                    onFileSelected={this.handleFileSelect}
                    onHomeButtonPressed={this.setHomeView}
                    onPanByDragPressed={this.onPanByDragPressed}
                    onMeasurePointsButtonPressed={this.onMeasurePointsButtonPressed}
                    onMeasureBetweenShapesButtonPressed={this.onMeasureBetweenShapesButtonPressed}
                    onToggleWidthModePressed={this.toggleWidthMode}
                    onToggleVerticesPressed={this.toggleDisplayVertices}
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
                    this.state.layers.map((layer) => {
                        return (
                            [...layer.shapes].map((shape, index) => {
                                    if (shape.geom instanceof Flatten.Polygon) {
                                        return (
                                            <PolygonTool
                                                key={index}
                                                stage={this.state.stage}
                                                layer={layer}
                                                polygon={shape}
                                                displayed={layer.displayed}
                                                hovered={shape === this.state.app.hoveredShape}
                                                selected={
                                                    shape === this.state.app.firstMeasuredShape ||
                                                    shape === this.state.app.secondMeasuredShape
                                                }
                                                color={layer.color}
                                                widthOn={this.state.app.widthOn}
                                                displayVertices={this.state.app.displayVertices}
                                                onMouseOver={this.onMouseRollOverShape}
                                                onMouseOut={this.onMouseRollOutShape}
                                                onClick={this.onClickOnShape}
                                            />
                                        )
                                    }
                                    else /*if (shape.geom instanceof Flatten.Segment ||
                                    shape.geom instanceof Flatten.Point) */{
                                        return (
                                            <SegmentTool
                                                key={index}
                                                stage={this.state.stage}
                                                layer={layer}
                                                model={shape}
                                                displayed={layer.displayed}
                                                hovered={shape === this.state.app.hoveredShape}
                                                selected={
                                                    shape === this.state.app.firstMeasuredShape ||
                                                    shape === this.state.app.secondMeasuredShape
                                                }
                                                color={layer.color}
                                                widthOn={this.state.app.widthOn}
                                                displayVertices={this.state.app.displayVertices}
                                                onMouseOver={this.onMouseRollOverShape}
                                                onMouseOut={this.onMouseRollOutShape}
                                                onClick={this.onClickOnShape}
                                            />
                                        )
                                    }
                                }
                            )
                        )
                    })
                }

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

                <MeasureShapesTool
                    stage={this.state.stage}
                    firstMeasuredShape={this.state.app.firstMeasuredShape}
                    secondMeasuredShape={this.state.app.secondMeasuredShape}
                    firstMeasuredLayer={this.state.app.firstMeasuredLayer}
                    secondMeasuredLayer={this.state.app.secondMeasuredLayer}
                    distance={this.state.app.distance}
                    shortestSegment={this.state.app.shortestSegment}
                    divisor={this.state.app.divisor}
                    decimals={this.state.app.decimals}
                />

                <StatusComponent
                    stage={this.state.stage}
                    units={this.state.app.units}
                    divisor={this.state.app.divisor}
                    decimals={this.state.app.decimals}
                    distance={this.state.app.distance}
                    shortestSegment={this.state.app.shortestSegment}
                    coordX={this.state.mouse.x}
                    coordY={this.state.mouse.y}
                    onUnitClicked={this.toggleUnits}
                />
            </main>
        )
    }
}
