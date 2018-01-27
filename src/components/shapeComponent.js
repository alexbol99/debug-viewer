/**
 * Created by alexanderbol on 19/06/2017.
 */

import {Component} from 'react';
import * as createjs from '../../public/easeljs-NEXT.combined.js';
import '../models/graphics';
import Utils from '../utils';

export class ShapeComponent extends Component {
    constructor(params) {
        super();

        this.shape = new createjs.Shape();
        params.stage.addChild(this.shape);

        this.vertexShapes = [];
        this.labelShape = undefined;

        // this.level = [params.model.geom.edges.index.root];
        // this.boxShapes = [];

        for (let vertex of params.model.geom.vertices) {
            let vertexShape = new createjs.Shape();
            vertexShape.geom = vertex;   // augment Shape with geom struct
            vertexShape.mouseEnabled = false;
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

            this.labelShape.geom = params.model.geom;     // augment label Shape with geom struct
            params.stage.addChild(this.labelShape);
        }

        // this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.handleClick = this.handleClick.bind(this);
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
        let dy = 4. / (stage.zoomFactor * stage.resolution);

        this.labelShape.htmlElement.style.font = "16px Arial";
        let unscale = 1. / (stage.zoomFactor * stage.resolution);
        let tx = stage.canvas.offsetLeft / (stage.zoomFactor * stage.resolution) + point.x + dx;
        let ty = -stage.canvas.offsetTop / (stage.zoomFactor * stage.resolution) + point.y + dy;
        this.labelShape.setTransform(tx, ty, unscale, -unscale);

    }

    redraw() {
        // Draw shape
        let stage = this.props.stage;
        let color = (this.props.hovered || this.props.selected) ? "black" : this.props.color;
        let alpha = (this.props.hovered || this.props.selected) ? 1.0 : 0.6;
        let widthOn = this.props.widthOn;

        let strokeStyle = this.props.model.geom.aperture ? this.props.model.geom.aperture : undefined;
        let fill = (widthOn && !this.props.displayVertices) ? this.props.color : "white";

        if (this.shape.graphics.isEmpty()) {
            this.shape.graphics = this.props.model.geom.graphics({
                strokeStyle: strokeStyle,
                ignoreScale: true,
                stroke: color,
                fill: fill,
                radius: 3. / (stage.zoomFactor * stage.resolution)
            });

            // this.skeletonShape = new createjs.Shape();
            // this.skeletonShape.graphics = this.props.model.geom.graphics({
            //     strokeStyle: 1,
            //     ignoreScale: true,
            //     stroke: color,
            //     fill: fill,
            //     radius: 3. / (stage.zoomFactor * stage.resolution)
            // });
            // this.skeletonShape.alpha = 1;
            // this.props.stage.addChild(this.skeletonShape);
        }
        else {
            if (this.shape.graphics.stroke) this.shape.graphics.stroke.style = color;
            if (this.shape.graphics.fill) this.shape.graphics.fill.style = fill;
            if (this.shape.graphics.circle) this.shape.graphics.circle.radius =
                3. / (stage.zoomFactor * stage.resolution);
        }
        this.shape.alpha = this.props.displayed ? alpha : 0.0;

        // let box = this.props.model.geom.box;
        // this.shape.cache(box.xmin, box.ymin, box.xmax - box.xmin, box.ymax - box.ymin);

        // Draw vertices
        alpha = this.props.displayed && this.props.displayVertices ? 1.0 : 0.0;
        this.redrawVertices(color, color, alpha);

        // Draw labels
        let showLabel = this.props.displayed && this.props.displayLabels;
        this.redrawLabels(showLabel);

        // this.drawTree();
    }

    drawTree() {
        // let poly = this.props.model.geom;
        // let root = poly.edges.index.root;
        for (let shape of this.boxShapes) {
            this.props.stage.removeChild(shape);
        }
        this.boxShapes = [];
        // this.drawTreeLevel([root]);
        let newLevel = this.drawTreeLevel(this.level);
        this.level = newLevel;
    }

    drawTreeLevel(level) {
        if (level.length === 0) return;
        let stage = this.props.stage;
        let newLevel = [];
        for (let node of level) {
            let graphics;
            if (node.max) {
                graphics = node.max.graphics();
            }
            if (graphics) {
                let shape = new createjs.Shape(graphics);
                stage.addChild(shape);
                this.boxShapes.push(shape);
            }
            if (node.left) {
                newLevel.push(node.left);
            }
            if (node.right) {
                newLevel.push(node.right);
            }
        }
        // this.drawTreeLevel(newLevel);
        return newLevel;
    }

    componentDidMount() {
        this.shape.on("mouseover", this.handleMouseOver);
        this.shape.on("mouseout", this.handleMouseOut);
        this.shape.on("click", this.handleClick);

        // this.shape.mouseEnabled = false;

        this.redraw();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (Utils.is_equal(this.props, nextProps)) {
            return false;
        }
        return true;
    }

    componentDidUpdate() {
        this.redraw();
    }

    componentWillUnmount() {
        this.shape.off("mouseover", this.handleMouseOver);
        this.shape.off("mouseout", this.handleMouseOut);
        this.shape.off("click", this.handleClick);
        this.props.stage.removeChild(this.shape);
        this.shape.graphics.clear();
        this.props.stage.removeChild(this.labelShape);
        this.labelShape = undefined;
        for (let vertexShape of this.vertexShapes) {
            this.props.stage.removeChild(vertexShape);
        }
        this.vertexShapes = [];
    }

    render() {
        return null;
    }
}
