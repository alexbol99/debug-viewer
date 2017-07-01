/**
 * Created by alexanderbol on 19/06/2017.
 */

import {Component} from 'react';
// import createjs from 'easel-js';

import '../App.css';

import { Shape } from '../models/shape';

// import { Stage } from '../models/stage';
// import {Layer} from '../models/layer';
// import {Layers} from '../models/layers';

// import * as ActionTypes from '../actions/action-types';

export class PolygonTool extends Component {
    constructor() {
        super();
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
            let edge = face.first;
            let style = {
                fill: this.props.color
            };

            do {
                let geom = edge.start;   // Point
                let vertex = new Shape(geom, parent, style);
                vertices.push(vertex);
                edge = edge.next;
            } while (edge !== face.first);
        }
        return vertices;
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.props.polygon.on("mouseover",this.handleMouseOver);
        this.props.polygon.on("mouseout",this.handleMouseOut);
    }

    componentWillReceiveProps(nextProps) {
    }


    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    componentDidUpdate() {
        // Draw polygon
        let style = this.props.displayed ? {
            stroke: this.props.color,
            fill: this.props.displayVertices ? "white" : this.props.color,
            alpha: 0.6
        } : {
            alpha: 0.0
        };
        let polygon = this.props.polygon.redraw(style);

        if (!this.props.displayed)
            return;

        let vertices = this.props.polygon.vertices;

        // Remove old vertices
        for (let oldVertex of vertices) {
            oldVertex.parent.removeChild(oldVertex);
        }

        // Create new vertices
        vertices = [];
        if (this.props.displayVertices) {
            vertices = this.createVertices(polygon);
        }
        polygon.vertices = vertices;

    }

    componentWillUnmount() {

    }

    render() {
        return null;
    }
}
