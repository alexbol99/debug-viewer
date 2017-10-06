import React, {Component} from 'react';
import Flatten from 'flatten-js';
import {PolygonTool} from '../tools/polygonTool';
import {SegmentTool} from "../tools/segmentTool";

export class LayerComponent extends Component {
    constructor(params) {
        super();
        this.state = {
            layer: params.layer,
            color: params.color,
            displayed: params.displayed,
            displayVertices: params.displayVertices,
            hovered: params.hovered,
            selected: params.selected,
            widthOn: params.widthOn,
            origin: params.stage.origin,
            zoomFactor: params.stage.zoomFactor,
            hoveredShape: params.hoveredShape,
            firstMeasuredShape: params.firstMeasuredShape,
            secondMeasuredShape: params.secondMeasuredShape
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            layer: nextProps.layer,
            color: nextProps.color,
            displayed: nextProps.displayed,
            displayVertices: nextProps.displayVertices,
            hovered: nextProps.hovered,
            selected: nextProps.selected,
            widthOn: nextProps.widthOn,
            origin: nextProps.stage.origin,
            zoomFactor: nextProps.stage.zoomFactor,
            hoveredShape: nextProps.hoveredShape,
            firstMeasuredShape: nextProps.firstMeasuredShape,
            secondMeasuredShape: nextProps.secondMeasuredShape
        })
    }

    equalState(nextState) {
        let equal = true;
        for (let key of Object.keys(nextState)) {
            if (nextState[key] !== this.state[key]) {
                equal = false;
                break;
            }
        }
        return equal;
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.equalState(nextState)) {
            return false;
        }
        return true;
    }

    render() {
        return (
            this.props.layer.shapes.map((shape, index) => {
                if (shape.geom instanceof Flatten.Polygon) {
                    return (
                        <PolygonTool
                            key={index}
                            stage={this.props.stage}
                            layer={this.state.layer}
                            polygon={shape}
                            displayed={this.state.layer.displayed}
                            hovered={shape === this.state.hoveredShape}
                            selected={
                                shape === this.state.firstMeasuredShape ||
                                shape === this.state.secondMeasuredShape
                            }
                            color={this.state.layer.color}
                            widthOn={this.state.widthOn}
                            displayVertices={this.state.displayVertices}
                            onMouseOver={this.props.onMouseOver}
                            onMouseOut={this.props.onMouseOut}
                            onClick={this.props.onClick}
                        />)
                }
                else {
                    return (
                        <SegmentTool
                            key={index}
                            stage={this.props.stage}
                            layer={this.state.layer}
                            model={shape}
                            displayed={this.state.layer.displayed}
                            hovered={shape === this.state.hoveredShape}
                            selected={
                                shape === this.state.firstMeasuredShape ||
                                shape === this.state.secondMeasuredShape
                            }
                            color={this.state.layer.color}
                            widthOn={this.state.widthOn}
                            displayVertices={this.state.displayVertices}
                            onMouseOver={this.props.onMouseOver}
                            onMouseOut={this.props.onMouseOut}
                            onClick={this.props.onClick}
                        />
                    )
                }
            })
        )
    }
}