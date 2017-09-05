/**
 * Created by alexanderbol on 19/06/2017.
 */

import {Component} from 'react';
import * as createjs from '../../public/easeljs-NEXT.combined.js';

import Flatten from 'flatten-js';
import { Shape } from '../models/shape';

export class PolygonTool extends Component {
    constructor(params) {
        super();
        this.vertices = undefined;
        // this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
    }

    handleMouseOver(event) {
        this.props.onMouseOver(this.props.polygon);
    }

    handleMouseOut(event) {
        this.props.onMouseOut();
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
        polygon.redraw({
            stroke: this.props.color,
            fill: (this.props.widthOn && !this.props.displayVertices) ? this.props.color : "white",
            alpha: this.props.displayed ? 0.6 : 0.0
        });

        // if (!this.props.displayed)
        //     return;

        /* Update  vertices */
        for (let vertex of this.vertices) {
            vertex.redraw({
                stroke: this.props.color,
                fill: this.props.color,
                alpha: this.props.displayed && this.props.displayVertices ? 1.0 : 0.0
            });
        }
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.props.polygon.on("mouseover",this.handleMouseOver);
        this.props.polygon.on("mouseout",this.handleMouseOut);
        this.vertices = this.createVertices(this.props.polygon);
        this.redraw(this.props.polygon);
    }

    componentWillReceiveProps(nextProps) {
    }


    shouldComponentUpdate(nextProps, nextState) {
        // do not update grpahics if it was not displayed and stay not displayed
        if (nextProps.polygon.alpha == 0 && !nextProps.displayed)
            return false;
        return true;  // nextProps.polygon.parent.needToBeUpdated;
    }

    componentDidUpdate() {
        this.redraw(this.props.polygon);
    }

    componentWillUnmount() {
        this.vertices = undefined;
        this.props.polygon.off("mouseover",this.handleMouseOver);
        this.props.polygon.off("mouseout",this.handleMouseOut);
    }

    render() {
        return null;
    }
}
