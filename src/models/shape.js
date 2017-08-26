/**
 * Created by alexanderbol on 21/04/2017.
 */

import Flatten from 'flatten-js';

// import createjs from 'easel-js';
import * as createjs from '../../public/easeljs-NEXT.combined.js';

let {Point, Segment, Line, Circle, Arc, Vector, Polygon} = Flatten;

export class Shape extends createjs.Shape {
    constructor(geom = undefined, stage = undefined, style={}, watch = undefined ) {
        super();
        this.geom = geom;
        stage.addChild(this);
        // this.stage = stage;
        this.graphics = this.setGraphics(style);
        this.watch = watch;
        this.expanded = false;
    }

    get box() {
        // TODO: add method box to Polygon
        return this.geom instanceof Polygon ?
            [...this.geom.faces][0].box :
            this.geom.box;
    }

    get center() {
        let box = this.box;
        return new Point((box.xmin + box.xmax)/2, (box.ymin + box.ymax)/2);
    }

    redraw(style={}) {
        this.alpha = style && style.alpha !== undefined ? style.alpha : 1.0;
        this.graphics.clear();
        this.graphics = this.setGraphics(style);
        return this;
    }

    setGraphics(style) {
        if (!this.geom)
            return;
        if (this.geom instanceof Point) {
            return this.setGraphicsPoint(style);
        }
        else if (this.geom instanceof Segment) {
            return this.setGraphicsSegment(style);
        }
        else if (this.geom instanceof Line) {

        }
        else if (this.geom instanceof Circle) {
            return this.setGraphicsCircle(style);
        }
        else if (this.geom instanceof Arc) {
            return this.setGraphicsArc(style);

        }
        else if (this.geom instanceof Vector) {

        }
        else if (this.geom instanceof Polygon) {
            return this.setGraphicsPolygon(style);
        }
    }

    setGraphicsPoint(style) {
        let pt = this.stage.W2C(this.geom);
        let graphics = new createjs.Graphics();
        let radius = (style && style.radius) ? style.radius : 3;
        let fill = style && style.fill ? style.fill : "red";
        return graphics.beginFill(fill).drawCircle(pt.x, pt.y, radius);
    }

    setGraphicsSegment(style) {
        let ps = this.stage.W2C(this.geom.ps);
        let pe = this.stage.W2C(this.geom.pe);
        let graphics = new createjs.Graphics();
        let strokeStyle = style && style.strokeStyle ? style.strokeStyle : 2;
        let stroke = style && style.stroke ? style.stroke : "black";
        return graphics.setStrokeStyle(strokeStyle).beginStroke(stroke).moveTo(ps.x, ps.y).lineTo(pe.x, pe.y).endStroke();
    }

    setGraphicsArc(style) {
        let pc = this.stage.W2C(this.geom.pc);
        let r = this.stage.W2C_Scalar(this.geom.r);
        let startAngle = 2 * Math.PI - this.geom.startAngle;
        let endAngle =  2 * Math.PI - this.geom.endAngle;
        let graphics = new createjs.Graphics();
        let strokeStyle = style && style.strokeStyle ? style.strokeStyle : 2;
        let stroke = style && style.stroke ? style.stroke : "black";
        return graphics.setStrokeStyle(strokeStyle).beginStroke(stroke).arc(pc.x, pc.y, r, startAngle, endAngle, this.geom.counterClockwise).endStroke();
    }

    setGraphicsCircle(style) {
        let pc = this.stage.W2C(this.geom.pc);
        let r = this.stage.W2C_Scalar(this.geom.r);
        let graphics = new createjs.Graphics();
        let strokeStyle = style && style.strokeStyle ? style.strokeStyle : 2;
        let stroke = style && style.stroke ? style.stroke : "black";
        // graphics.setStrokeStyle(2).beginStroke("black").beginFill("red").drawCircle(pcx, pcy, r);
        return graphics.setStrokeStyle(strokeStyle).beginStroke(stroke).drawCircle(pc.x, pc.y, r);
    }

    setGraphicsPolygon(style) {
        let graphics = new createjs.Graphics();
        let strokeStyle = style && style.strokeStyle ? style.strokeStyle : 1;
        let stroke = style && style.stroke ? style.stroke : "#FF0303";
        let fill = style && style.fill ? style.fill : "#FF0303";
        graphics.setStrokeStyle(strokeStyle);
        graphics.beginStroke(stroke);
        graphics.beginFill(fill);

        for (let face of this.geom.faces) {
            this.setGraphicsFace(graphics, face);
        }

        graphics.endStroke();
        return graphics;
    }

    setGraphicsFace(graphics, face) {
        let ps = this.stage.W2C(face.first.start);
        graphics.moveTo(ps.x, ps.y);

        let edge = face.first;
        do {
            this.setGraphicsEdge(graphics, edge);
            edge = edge.next;
        } while(edge !== face.first);
    }

    setGraphicsEdge(graphics, edge) {
        if (edge.shape instanceof Segment) {
            this.setGraphicsEdgeSegment(graphics, edge.shape);
        }
        else if (edge.shape instanceof Arc) {
            this.setGraphicsEdgeArc(graphics, edge.shape);
        }
    }

    setGraphicsEdgeSegment(graphics, segment) {
        let pe = this.stage.W2C(segment.pe);
        graphics.lineTo(pe.x, pe.y);
    }

    setGraphicsEdgeArc(graphics, arc) {
        let pc = this.stage.W2C(arc.pc);
        let r = this.stage.W2C_Scalar(arc.r);
        let startAngle = 2 * Math.PI - arc.startAngle;
        let endAngle = 2 * Math.PI - arc.endAngle;
        graphics.arc(pc.x, pc.y, r, startAngle, endAngle, arc.counterClockwise);
    }
}
