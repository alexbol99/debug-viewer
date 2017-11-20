import Flatten from 'flatten-js';

import * as createjs from '../../public/easeljs-NEXT.combined.js';

let {Point, Segment, Circle, Arc, Polygon} = Flatten;

/* Provide conversion methods from FlattenJS objects to CreateJS Graphics */

Point.prototype.graphics = function(style) {
    let radius = (style && style.radius) ? style.radius : 3;
    let fill = style && style.fill ? style.fill : "#FF0303";
    let graphics = new createjs.Graphics();
    graphics.fill = graphics.beginFill(fill).command;
    graphics.circle = graphics.drawCircle(this.x, this.y, radius).command;
    return graphics;
};

Segment.prototype.graphics = function(style) {
    let graphics = new createjs.Graphics();
    let strokeStyle = style && style.strokeStyle !== undefined ? style.strokeStyle : 2;
    let ignoreScale = style && style.ignoreScale !== undefined ? style.ignoreScale : true;
    let stroke = style && style.stroke ? style.stroke : "black";
    return graphics
        .setStrokeStyle(strokeStyle,1,0,10,ignoreScale)
        .beginStroke(stroke)
        .moveTo(this.ps.x, this.ps.y)
        .lineTo(this.pe.x, this.pe.y)
        .endStroke();
};

Arc.prototype.graphics = function(style) {
    // let startAngle = 2 * Math.PI - this.startAngle;
    // let endAngle =  2 * Math.PI - this.endAngle;
    let graphics = new createjs.Graphics();
    let strokeStyle = style && style.strokeStyle ? style.strokeStyle : 2;
    let ignoreScale = style && style.ignoreScale !== undefined ? style.ignoreScale : true;
    let stroke = style && style.stroke ? style.stroke : "black";
    return graphics
        .setStrokeStyle(strokeStyle,1,0,10,ignoreScale)
        .beginStroke(stroke)
        .arc(this.pc.x, this.pc.y, this.r, this.startAngle, this.endAngle, !this.counterClockwise)
        .endStroke();
};

Circle.prototype.graphics = function(style) {
    let graphics = new createjs.Graphics();
    let strokeStyle = style && style.strokeStyle ? style.strokeStyle : 2;
    let stroke = style && style.stroke ? style.stroke : "black";
    // graphics.setStrokeStyle(2).beginStroke("black").beginFill("red").drawCircle(pcx, pcy, r);
    return graphics
        .setStrokeStyle(strokeStyle,0,0,10,true)
        .beginStroke(stroke)
        .drawCircle(this.pc.x, this.pc.y, this.r)
        .endStroke();
};

function setGraphicsEdgeSegment(graphics, segment) {
    graphics.lineTo(segment.pe.x, segment.pe.y);
}

function setGraphicsEdgeArc(graphics, arc) {
    // let startAngle = 2 * Math.PI - arc.startAngle;
    // let endAngle = 2 * Math.PI - arc.endAngle;
    graphics.arc(arc.pc.x, arc.pc.y, arc.r, arc.startAngle, arc.endAngle, !arc.counterClockwise);
}

function setGraphicsEdge(graphics, edge) {
    if (edge.shape instanceof Segment) {
        setGraphicsEdgeSegment(graphics, edge.shape);
    }
    else if (edge.shape instanceof Arc) {
        setGraphicsEdgeArc(graphics, edge.shape);
    }
}

function setGraphicsFace(graphics, face) {
    let ps = face.first.start;
    graphics.moveTo(ps.x, ps.y);

    for (let edge of face) {
        setGraphicsEdge(graphics, edge);
    }
}

Polygon.prototype.graphics = function(style) {
    let graphics = new createjs.Graphics();
    let strokeStyle = style && style.strokeStyle ? style.strokeStyle : 1;
    let stroke = style && style.stroke ? style.stroke : "#FF0303";
    let fill = style && style.fill ? style.fill : "#FF0303";
    graphics.setStrokeStyle(strokeStyle,0,0,10,true);
    graphics.stroke = graphics.beginStroke(stroke).command;
    graphics.fill = graphics.beginFill(fill).command;

    for (let face of this.faces) {
        setGraphicsFace(graphics, face);
    }

    graphics.endStroke();
    return graphics;
};

