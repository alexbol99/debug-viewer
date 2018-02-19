/**
 * Created by alexanderbol on 21/04/2017.
 */

import {Component} from 'react';
// import createjs from 'easel-js';
import * as createjs from '../../public/easeljs-NEXT.combined.js';
import {graphics} from '../models/graphics';
import '../../public/styles/App.css';
export class MeasureShapesTool extends Component {
    constructor(params) {
        super();
        this.segment = new createjs.Shape();
        params.stage.addChild(this.segment);
    }
    draw() {
        if (this.props.shortestSegment) {
            this.segment.graphics = graphics(this.props.shortestSegment);
        }
    }
    componentDidMount() {
        this.draw();
    }
    componentDidUpdate() {
        this.segment.graphics.clear();
        if (this.props.firstMeasuredShape && this.props.secondMeasuredShape &&
            this.props.firstMeasuredLayer.displayed &&
            this.props.secondMeasuredLayer.displayed) {

            this.draw();
        }
    }

    componentWillUnmount() {
        if (this.segment) {
            this.props.stage.removeChild(this.segment);
            this.segment.graphics.clear();
        }
    }
    render() {
        return null
    }
}
