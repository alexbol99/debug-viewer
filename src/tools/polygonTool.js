/**
 * Created by alexanderbol on 19/06/2017.
 */

import {Component} from 'react';
// import createjs from 'easel-js';

import '../App.css';

// import { Shape } from '../models/shape';

// import { Stage } from '../models/stage';
// import {Layer} from '../models/layer';
// import {Layers} from '../models/layers';

// import * as ActionTypes from '../actions/action-types';

export class PolygonTool extends Component {
    constructor() {
        super();
        this.state = {
            polygon: null,
            vertices: []
        };
        // this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseOver = this.handleMouseOver.bind(this);
        this.handleMouseOut = this.handleMouseOut.bind(this);
    }

    handleMouseOver(event) {
        this.props.onMouseOver(this.state.polygon);
    }

    handleMouseOut(event) {
        this.props.onMouseOut();
    }

    addVertices(polygon) {
        // let parent = polygon.parent;
        let vertices = [];
        // for (let face of polygon.geom.faces) {
        //     let edge = face.first;
        //     do {
        //         let vertex = new Shape(edge.start, parent);
        //         vertices.push(vertex);
        //         edge = edge.next;
        //     } while(edge !== face.first);
        // }
        return vertices;
    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps) {
        let oldVertices = this.state.vertices;
        let polygon = nextProps.polygon.redraw(nextProps.displayed);
        this.setState({
            polygon: polygon,
            vertices: nextProps.displayVertices ? this.addVertices(polygon) : []
        });
        for (let oldVertex of oldVertices) {
            oldVertex.parent.removeChild(oldVertex);
        }
    }

    componentDidMount() {
        // let shape = new Shape(geom, this.stage);
        this.props.polygon.on("mouseover",this.handleMouseOver);
        this.props.polygon.on("mouseout",this.handleMouseOut);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    componentDidUpdate() {

        // this.props.polygon.alpha = this.props.displayed ? 1 : 0;
        // this.props.polygon.redraw();

    }

    componentWillUnmount() {

    }

    render() {
        return null
    }
}
