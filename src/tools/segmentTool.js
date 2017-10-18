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
        this.labelShape = undefined;

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
            vertexShape.geom = params.model.geom;   // augment vertex Shape with geom struct
            params.stage.addChild(vertexShape);
            this.vertexShapes.push(vertexShape);
        }

        if (params.model.label && params.model.label.trim() !== "") {
            var html = document.createElement('div');
            html.innerText = params.model.label;
            html.style.position = "absolute";
            html.style.top = 0;
            html.style.left = 0;

            document.body.appendChild(html);

            this.labelShape = new createjs.DOMElement(html);

            // let labelShape = new createjs.Text();
            // labelShape.text = params.model.label;
            // labelShape.textBaseline = "alphabetic";

            this.labelShape.geom = params.model.geom;     // augment label Shape with geom struct
            params.stage.addChild(this.labelShape);
        }

        this.state = {
            model: params.model,
            color: params.color,
            displayed: params.displayed,
            displayVertices: params.displayVertices,
            displayLabels: params.displayLabels,
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
                vertexShape.graphics.circle.radius = 3. / (stage.zoomFactor * stage.resolution);
                vertexShape.graphics.fill.style = fill;
            }
            vertexShape.alpha = alpha;
        }
    }

    redrawLabels(showLabel) {
        if (!this.labelShape) return;

        let stage = this.props.stage;

        this.labelShape.htmlElement.style.display = showLabel ? "block" : "none";

        let box = this.props.model.geom.box;
        let point = {x: (box.xmin + box.xmax) / 2, y: (box.ymin + box.ymax) / 2};
        let dx = 6. / (stage.zoomFactor * stage.resolution);
        let dy = 16. / (stage.zoomFactor * stage.resolution);

        this.labelShape.htmlElement.style.font = "16px Arial";
        let unscale = 1. / (stage.zoomFactor * stage.resolution);
        let tx = stage.canvas.offsetLeft / (stage.zoomFactor * stage.resolution) + point.x + dx;
        let ty = -stage.canvas.offsetTop / (stage.zoomFactor * stage.resolution) + point.y + dy;
        this.labelShape.setTransform(tx, ty, unscale, -unscale);
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

        // Redraw labels
        let showLabel = this.props.displayed && this.props.displayLabels;
        this.redrawLabels(showLabel);
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
            displayLabels: nextProps.displayLabels,
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
