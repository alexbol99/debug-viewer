import React, {Component} from 'react';
import {ShapeComponent} from './shapeComponent';
import {ImageComponent} from "./imageComponent";
import Utils from "../utils";

export class LayerComponent extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        if (Utils.is_equal(this.props, nextProps)) {
            return false;
        }
        return true;
    }

    render() {
        return (
            this.props.layer.shapes.map((shape, index) => {
                return shape.geom.uri ? (
                    <ImageComponent
                        key={index}
                        stage={this.props.stage}
                        layer={this.props.layer}
                        model={shape}
                        displayed={this.props.layer.displayed}
                        hovered={shape === this.props.hoveredShape}
                        selected={
                            shape === this.props.firstMeasuredShape ||
                            shape === this.props.secondMeasuredShape
                        }
                        color={this.props.layer.color}
                        widthOn={this.props.widthOn}
                        displayLabels={this.props.displayLabels}
                        zoomFactor={this.props.zoomFactor}
                        onMouseOver={this.props.onMouseOver}
                        onMouseOut={this.props.onMouseOut}
                        onClick={this.props.onClick}
                    />
                    ) : (
                    <ShapeComponent
                        key={index}
                        stage={this.props.stage}
                        layer={this.props.layer}
                        model={shape}
                        displayed={this.props.layer.displayed}
                        hovered={shape === this.props.hoveredShape}
                        selected={
                            shape === this.props.firstMeasuredShape ||
                            shape === this.props.secondMeasuredShape
                        }
                        color={this.props.layer.color}
                        widthOn={this.props.widthOn}
                        displayVertices={this.props.displayVertices}
                        displayLabels={this.props.displayLabels}
                        zoomFactor={this.props.zoomFactor}
                        onMouseOver={this.props.onMouseOver}
                        onMouseOut={this.props.onMouseOut}
                        onClick={this.props.onClick}
                    /> )
                }
            )
        )
    }
}
