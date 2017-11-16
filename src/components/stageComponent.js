import React, {Component} from 'react';
import {LayerComponent} from './layerComponent';
import Utils from "../utils";

export class StageComponent extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        if (Utils.is_equal(this.props, nextProps)) {
            return false;
        }
        return true;
    }

    componentDidUpdate() {
        if (this.props.stage.canvas && this.props.stage.canvas.getContext('2d')) {

            let origin = this.props.stage.origin;
            let zoomFactor = this.props.stage.zoomFactor*this.props.stage.resolution;
            this.props.stage.setTransform(origin.x, origin.y, zoomFactor, -zoomFactor);

            this.props.stage.update();
        }
    }

    render() {
        return (
            this.props.layers.map((layer) =>
                <LayerComponent
                    key={layer.name}
                    stage={this.props.stage}
                    layer={layer}
                    color={layer.color}
                    displayed={layer.displayed}
                    displayVertices={this.props.displayVertices}
                    displayLabels={this.props.displayLabels}
                    widthOn={this.props.widthOn}
                    hoveredShape={this.props.hoveredShape}
                    firstMeasuredShape={this.props.firstMeasuredShape}
                    secondMeasuredShape={this.props.secondMeasuredShape}
                    zoomFactor={this.props.zoomFactor}
                    onMouseOver={this.props.onMouseOver}
                    onMouseOut={this.props.onMouseOut}
                    onClick={this.props.onClick}
                />
            )
        )
    }
}