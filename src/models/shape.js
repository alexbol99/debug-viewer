/**
 * Created by alexanderbol on 21/04/2017.
 */

import Flatten from 'flatten-js';

import createjs from 'easel-js';

let {Point, Segment, Line, Circle, Arc, Vector, Polygon} = Flatten;

export class Shape extends createjs.Shape {
    constructor(geom = undefined, stage = undefined) {
        super();
        this.geom = geom;
        stage.addChild(this);
        // this.stage = stage;
        this.graphics = this.setGraphics();
    }

    get box() {
        return this.geom.box;
    }

    redraw() {
        this.graphics.clear();
        this.graphics = this.setGraphics();
    }

    setGraphics() {
        if (!this.geom)
            return;
        if (this.geom instanceof Point) {
            return this.setGraphicsPoint();
        }
        else if (this.geom instanceof Segment) {
            return this.setGraphicsSegment();
        }
        else if (this.geom instanceof Line) {

        }
        else if (this.geom instanceof Circle) {
            return this.setGraphicsCircle();
        }
        else if (this.geom instanceof Arc) {
            return this.setGraphicsArc();

        }
        else if (this.geom instanceof Vector) {

        }
        else if (this.geom instanceof Polygon) {
            return this.setGraphicsPolygon();
        }
    }

    setGraphicsPoint() {
        let radius = 3;
        let pt = this.stage.W2C(this.geom);
        let graphics = new createjs.Graphics();
        return graphics.beginFill("red").drawCircle(pt.x, pt.y, radius);
    }

    setGraphicsSegment() {
        let ps = this.stage.W2C(this.geom.ps);
        let pe = this.stage.W2C(this.geom.pe);
        let graphics = new createjs.Graphics();
        return graphics.setStrokeStyle(2).beginStroke("black").moveTo(ps.x, ps.y).lineTo(pe.x, pe.y).endStroke();
    }

    setGraphicsArc() {
        let pc = this.stage.W2C(this.geom.pc);
        let r = this.stage.W2C_Scalar(this.geom.r);
        let startAngle = 2 * Math.PI - this.geom.startAngle;
        let endAngle =  2 * Math.PI - this.geom.endAngle;
        let graphics = new createjs.Graphics();
        return graphics.setStrokeStyle(2).beginStroke("black").arc(pc.x, pc.y, r, startAngle, endAngle, this.geom.counterClockwise).endStroke();
    }

    setGraphicsCircle() {
        let pc = this.stage.W2C(this.geom.pc);
        let r = this.stage.W2C_Scalar(this.geom.r);
        let graphics = new createjs.Graphics();
        // graphics.setStrokeStyle(2).beginStroke("black").beginFill("red").drawCircle(pcx, pcy, r);
        return graphics.setStrokeStyle(2).beginStroke("black").drawCircle(pc.x, pc.y, r);
    }

    setGraphicsPolygon() {
        let graphics = new createjs.Graphics();

        graphics.setStrokeStyle(2);
        graphics.beginStroke("black");
        graphics.beginFill("#C0FFFF");

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
