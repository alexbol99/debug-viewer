/**
 * Created by alexanderbol on 21/04/2017.
 */

import {Component} from 'react';
// import createjs from 'easel-js';
import * as createjs from '../../public/easeljs-NEXT.combined.js';

import '../App.css';

// import Flatten from 'flatten-js';
// import {Shape} from '../models/shape';

import {Model} from '../models/model';

// let {Distance} = Flatten;

export class MeasureShapesTool extends Component {
    constructor(params) {
        super();
        this.distance = undefined;
        this.segment = undefined;
    }

    draw() {
        let canvas = this.refs.measureCanvas;
        let context = canvas.getContext('2d');
        let stage = this.props.stage;

        canvas.width = canvas.width;

        // Draw rectangle
        let pllX = Math.min(stage.W2C_X(this.startX), stage.W2C_X(this.endX));
        let pllY = Math.min(stage.W2C_Y(this.startY), stage.W2C_Y(this.endY));
        let width = Math.abs(stage.W2C_Scalar(this.startX - this.endX));
        let height = Math.abs(stage.W2C_Scalar(this.startY - this.endY));

        context.beginPath();
        context.rect(pllX, pllY, width, height);

        // Draw segment
        context.moveTo(stage.W2C_X(this.startX), stage.W2C_Y(this.startY));
        context.lineTo(stage.W2C_X(this.endX), stage.W2C_Y(this.endY));

        context.lineWidth = 1;
        context.strokeStyle = 'black';
        context.stroke();

        // Draw text
        let textX, textY, textHeight, textWidth;
        let backX, backY;                      // background rectangle
        let text = this.measurement();

        context.font = "12pt Arial";

        textHeight = 12;
        /* font size*/
        textWidth = context.measureText(text).width;

        // Rectangle to the right of current point, text aligned left
        if (Math.abs(stage.W2C_X(this.endX) - pllX) <= 2) {
            context.textAlign = "left";
            textX = pllX + 3;
            backX = pllX;
        }
        // Rectangle to the left of current point, text aligned right
        else {
            context.textAlign = "right";
            textX = pllX + width - 3;
            backX = textX - textWidth - 3;
        }

        if (Math.abs(stage.W2C_Y(this.endY) - pllY) <= 2) {
            textY = pllY - 3;
        }
        else {
            textY = pllY + height + textHeight + 3;
        }
        backY = textY - textHeight - 3;

        context.fillStyle = 'white';
        context.globalAlpha = 0.4;
        context.fillRect(backX, backY, textWidth + 6, textHeight + 6);

        context.fillStyle = "black";
        context.globalAlpha = 1;
        context.fillText(this.measurement(), textX, textY);
    }

    measurement() {
        let dx = this.endX - this.startX;
        let dy = this.endY - this.startY;
        let dist = Math.sqrt(dx * dx + dy * dy);
        let message = "DX=" + this.format(dx) + ",DY=" + this.format(dy) + ",D=" + this.format(dist);
        return message;
    }

    format(num) {
        return (num / this.props.divisor).toFixed(this.props.decimals);
    }

    componentDidUpdate() {
        if (this.props.firstMeasuredShape && this.props.secondMeasuredShape &&
            this.props.firstMeasuredLayer.displayed &&
            this.props.secondMeasuredLayer.displayed) {

            if (this.props.shortestSegment && this.props.stage) {
                let shortest_segment = this.props.shortestSegment;
                let geomTransformed = Model.transformSegment(shortest_segment, this.props.stage);

                if (!this.segment) {
                    this.segment = new createjs.Shape();
                    this.props.stage.addChild(this.segment);
                }
                this.segment.graphics.clear();
                this.segment.graphics = geomTransformed.graphics();
            }
        }
        else {
            if (this.segment) {
                this.segment.graphics.clear();
            }
        }
    }

    render() {
        return null
    }
}
