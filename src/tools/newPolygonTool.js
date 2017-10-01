/**
 * Created by alexanderbol on 19/06/2017.
 */

import {Component} from 'react';
import * as createjs from '../../public/easeljs-NEXT.combined.js';

// import Flatten from 'flatten-js';
import { Shape } from '../models/shape';
import { Model } from '../models/model';
import '../models/graphics';

export class NewPolygonTool extends Component {
    constructor(params) {
        super();
        this.shape = new createjs.Shape();
        params.stage.addChild(this.shape);

        this.model = params.polygon;

        this.vertices = undefined;
        // this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleMouseOver(event) {
        this.props.onMouseOver(this.props.polygon);
    }

    handleMouseOut(event) {
        this.props.onMouseOut();
    }

    handleClick(event) {
        this.props.onClick(this.props.polygon);
    }

    createVertices(polygon) {
        let vertices = [];
        let parent = polygon.parent;

        for (let face of polygon.geom.faces) {
            for (let edge of face) {
                let geom = edge.start;   // Point
                let vertex = new Shape(geom, parent);
                vertices.push(vertex);
            }
        }
        return vertices;
    }

    redraw(polygon) {
        // Draw polygon
        let color = (this.props.hovered || this.props.selected) ? "black" : this.props.color;
        let alpha = (this.props.hovered || this.props.selected) ? 1.0 : 0.6;

        let stage = this.props.stage;
        let geom = this.model.geom;
        let geomTransformed = Model.transformPolygon(geom, stage);

        this.shape.graphics.clear();
        this.shape.graphics = geomTransformed.graphics({
            stroke: color,     // this.props.color,
            fill: (this.props.widthOn && !this.props.displayVertices) ? this.props.color : "white",
            alpha: this.props.displayed ? alpha : 0.0
        });
        this.shape.alpha = alpha;

        // polygon.redraw({
        //     stroke: color,     // this.props.color,
        //     fill: (this.props.widthOn && !this.props.displayVertices) ? this.props.color : "white",
        //     alpha: this.props.displayed ? alpha : 0.0
        // });


        /* Update  vertices */
        // for (let vertex of this.vertices) {
        //     vertex.redraw({
        //         stroke: color,    // this.props.color,
        //         fill: color,      // this.props.color,
        //         alpha: this.props.displayed && this.props.displayVertices ? 1.0 : 0.0
        //     });
        // }
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.shape.on("mouseover",this.handleMouseOver);
        this.shape.on("mouseout",this.handleMouseOut);
        this.shape.on("click",this.handleClick);
        // this.vertices = this.createVertices(this.props.polygon);
        // this.redraw(this.props.polygon);
        this.redraw();
    }

    componentWillReceiveProps(nextProps) {
        this.model = nextProps.polygon;
    }


    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.polygon === this.model) {
            return false;
        }
        // do not update graphics if it was not displayed and stay not displayed
        if (nextProps.polygon.alpha === 0 && !nextProps.displayed)
            return false;
        return true;  // nextProps.polygon.parent.needToBeUpdated;
    }

    componentDidUpdate() {
        this.redraw();

        // working method redraw
        //this.redraw(this.props.polygon);
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
