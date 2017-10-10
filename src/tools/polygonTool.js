/**
 * Created by alexanderbol on 19/06/2017.
 */

import {Component} from 'react';
import * as createjs from '../../public/easeljs-NEXT.combined.js';
import '../models/graphics';

export class PolygonTool extends Component {
    constructor(params) {
        super();

        this.shape = new createjs.Shape();
        params.stage.addChild(this.shape);

        this.vertexShapes = [];
        this.labelShape = undefined;

        for (let vertex of params.polygon.geom.vertices) {
            let vertexShape = new createjs.Shape();
            vertexShape.geom = vertex;   // augment Shape with geom struct
            params.stage.addChild(vertexShape);
            this.vertexShapes.push(vertexShape);
        }

        if (params.polygon.label && params.polygon.label.trim() !== "") {
            var html = document.createElement('div');
            html.innerText = params.polygon.label;
            html.style.position = "absolute";
            html.style.top = 0;
            html.style.left = 0;

            document.body.appendChild(html);

            this.labelShape = new createjs.DOMElement(html);

            // let labelShape = new createjs.Text();
            // labelShape.text = params.polygon.label;
            // labelShape.textBaseline = "alphabetic";

            this.labelShape.geom = params.polygon.geom;     // augment label Shape with geom struct
            params.stage.addChild(this.labelShape);
        }

        this.state = {
            polygon: params.polygon,
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
        this.props.onMouseOver(this.props.polygon);
    }

    handleMouseOut(event) {
        this.props.onMouseOut();
    }

    handleClick(event) {
        this.props.onClick(this.props.polygon, this.props.layer);
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

        let box = this.props.polygon.geom.box;
        let point = {x: (box.xmin + box.xmax) / 2, y: (box.ymin + box.ymax) / 2};
        let dx = 6. / (stage.zoomFactor * stage.resolution);
        let dy = 4. / (stage.zoomFactor * stage.resolution);

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
        let widthOn = this.props.widthOn;
        let fill = (widthOn && !this.props.displayVertices) ? this.props.color : "white";

        if (this.shape.graphics.isEmpty()) {
            this.shape.graphics = this.state.polygon.geom.graphics({
                stroke: color,
                fill: fill
            });
        }
        else {
            this.shape.graphics.stroke.style = color;
            this.shape.graphics.fill.style = fill;
        }
        this.shape.alpha = this.props.displayed ? alpha : 0.0;

        // Draw vertices
        alpha = this.props.displayed && this.props.displayVertices ? 1.0 : 0.0;
        this.redrawVertices(color, color, alpha);

        // Draw labels
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
        // let redraw = (this.state.zoomFactor !== nextProps.zoomFactor &&
        //     nextProps.displayVertices);

        this.setState({
            polygon: nextProps.polygon,
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
