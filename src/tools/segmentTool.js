/**
 * Created by alexanderbol on 19/06/2017.
 */

import {Component} from 'react';
import * as createjs from '../../public/easeljs-NEXT.combined.js';
import Flatten from 'flatten-js';
import '../models/graphics';

export class SegmentTool extends Component {
    constructor(params) {
        super();

        this.shape = new createjs.Shape();
        params.stage.addChild(this.shape);

        this.vertexShapes = [];
        if (params.model.geom instanceof Flatten.Segment) {
            let segment = params.model.geom;
            let vertices = [segment.ps, segment.pe];
            for (let vertex of vertices) {
                let vertexShape = new createjs.Shape();
                vertexShape.geom = vertex;   // augment Shape with geom struct
                params.stage.addChild(vertexShape);
                this.vertexShapes.push(vertexShape);
            }
        }
        else if (params.model.geom instanceof Flatten.Point) {
            let vertexShape = new createjs.Shape();
            vertexShape.geom = params.model.geom;   // augment Shape with geom struct
            params.stage.addChild(vertexShape);
            this.vertexShapes.push(vertexShape);
        }

        this.state = {
            model: params.model,
            color: params.color,
            displayed: params.displayed,
            displayVertices: params.displayVertices,
            hovered: params.hovered,
            selected: params.selected,
            widthOn: params.widthOn,
            zoomFactor: params.stage.zoomFactor
        };


        // this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.handleClick = this.handleClick.bind(this);
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

    handleMouseOver(event) {
        this.props.onMouseOver(this.props.model);
    }

    handleMouseOut(event) {
        this.props.onMouseOut();
    }

    handleClick(event) {
        this.props.onClick(this.props.model, this.props.layer);
    }

    redrawVertices(stroke, fill, alpha) {
        let stage = this.props.stage;

        for (let vertexShape of this.vertexShapes) {
            let vertex = vertexShape.geom;

            if (vertexShape.graphics.isEmpty()) {
                vertexShape.graphics = vertex.graphics({
                    stroke: stroke,     // this.props.color,
                    fill: fill,
                    radius: 3. / (stage.zoomFactor * stage.resolution)
                });
            }
            else {
                vertexShape.graphics.circle.radius = 3. / (stage.zoomFactor * stage.resolution)
            }
            vertexShape.alpha = alpha;
        }
    }

    redraw() {
        // Draw polygon
        let color = (this.props.hovered || this.props.selected) ? "black" : this.props.color;
        let alpha = (this.props.hovered || this.props.selected) ? 1.0 : 0.6;

        let stage = this.props.stage;
        let geom = this.props.model.geom;

        let widthOn = this.props.widthOn;

        this.shape.graphics.clear();
        this.shape.graphics = geom.graphics({
            stroke: color,     // this.props.color,
            fill: (widthOn && !this.props.displayVertices) ? this.props.color : "white",
            radius: 3./(stage.zoomFactor*stage.resolution)
        });
        this.shape.alpha = this.props.displayed ? alpha : 0.0;

        // Draw vertices
        alpha = this.props.displayed && this.props.displayVertices ? 1.0 : 0.0;
        this.redrawVertices(color, color, alpha);
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.shape.on("mouseover",this.handleMouseOver);
        this.shape.on("mouseout",this.handleMouseOut);
        this.shape.on("click",this.handleClick);

        this.redraw();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            model: nextProps.model,
            color: nextProps.color,
            displayed: nextProps.displayed,
            displayVertices: nextProps.displayVertices,
            hovered: nextProps.hovered,
            selected: nextProps.selected,
            widthOn: nextProps.widthOn,
            zoomFactor: nextProps.stage.zoomFactor
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.equalState(nextState)) {
            return false;
        }
        return true;  // nextProps.polygon.parent.needToBeUpdated;
    }

    componentDidUpdate() {
        this.redraw();
    }

    componentWillUnmount() {
        this.vertices = undefined;
        this.shape.off("mouseover",this.handleMouseOver);
        this.shape.off("mouseout",this.handleMouseOut);
        this.shape.off("click", this.handleClick);
    }

    render() {
        return null;
    }
}
