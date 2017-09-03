/**
 * Created by alexanderbol on 19/06/2017.
 */

import {Component} from 'react';
// import createjs from 'easel-js';
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

    createGraphics(geom, style) {
        let graphics = new createjs.Graphics();
        let strokeStyle = style && style.strokeStyle ? style.strokeStyle : 1;
        let stroke = style && style.stroke ? style.stroke : "#FF0303";
        let fill = style && style.fill ? style.fill : "#FF0303";
        graphics.setStrokeStyle(strokeStyle);
        graphics.beginStroke(stroke);
        graphics.beginFill(fill);

        for (let face of geom.faces) {
            this.setGraphicsFace(graphics, face);
        }

        graphics.endStroke();
        return graphics;
    }

    setGraphicsFace(graphics, face) {
        let ps = face.first.start;
        graphics.moveTo(ps.x, ps.y);

        let edge = face.first;
        do {
            this.setGraphicsEdge(graphics, edge);
            edge = edge.next;
        } while(edge !== face.first);
    }

    setGraphicsEdge(graphics, edge) {
        if (edge.shape instanceof Flatten.Segment) {
            this.setGraphicsEdgeSegment(graphics, edge.shape);
        }
        else if (edge.shape instanceof Flatten.Arc) {
            this.setGraphicsEdgeArc(graphics, edge.shape);
        }
    }

    setGraphicsEdgeSegment(graphics, segment) {
        graphics.lineTo(segment.pe.x, segment.pe.y);
    }

    setGraphicsEdgeArc(graphics, arc) {
        let startAngle = 2 * Math.PI - arc.startAngle;
        let endAngle = 2 * Math.PI - arc.endAngle;
        graphics.arc(arc.pc.x, arc.pc.y, arc.r, startAngle, endAngle, arc.counterClockwise);
    }

    transformPoint(pt, a, d, tx, ty) {
        return new Flatten.Point(
            pt.x * a + tx,
            pt.y * d + ty
        );
    }

    transformSegment(segment, a, d, tx, ty) {a
        return new Flatten.Segment(
            this.transformPoint(segment.ps, a, d, tx, ty),
            this.transformPoint(segment.pe, a, d, tx, ty)
        )
    }

    transformArc(arc, a, d, tx, ty) {
        return new Flatten.Arc(
            this.transformPoint(arc.pc, a, d, tx, ty),
            arc.r * a,
            arc.startAngle,
            arc.endAngle,
            arc.counterClockwise
        )
    }

    transformEdge(edge, a, d, tx, ty) {
        if (edge instanceof Flatten.Segment) {
            return this.transformSegment(edge, a, d, tx, ty);
        }
        else if (edge instanceof Flatten.Arc) {
            return this.transformArc(edge, a, d, tx, ty);
        }
    }

    transformFace(face, a, d, tx, ty) {
        // Get edges of face as array
        let edges = [];
        let edge = face.first;
        do {
            edges.push(edge.shape);
            edge = edge.next;
        } while (edge !== face.first);

        // Transform array of edges
        return edges.map(edge => this.transformEdge(edge, a, d, tx, ty));
    }

    transformPolygon(polygon, a, d, tx, ty) {
        let newPolygon = new Flatten.Polygon();
        let edges = [];
        for (let face of polygon.faces) {
            edges = this.transformFace(face, a, d, tx, ty);
            newPolygon.addFace(edges);
        }
        return newPolygon;
    }

    redraw3(polygon) {
        let scale = this.props.scale;   // stage.scalingFactor();
        let tx = this.props.origin.x;
        let ty = this.props.origin.y;

        let style = {
            stroke: this.props.color,
            fill: (this.props.widthOn && !this.props.displayVertices) ? this.props.color : "white",
            alpha: this.props.displayed ? 0.6 : 0.0
        };

        polygon.graphics.clear();
        polygon.graphics = this.createGraphics(polygon.geom, style);

        polygon.transformMatrix = new createjs.Matrix2D(
            /* a   b  c     d    tx  ty*/
            scale, 0, 0, -scale, tx, ty
        );
    }
    redraw2(polygon) {
        let stage = polygon.parent;

        let scale = stage.scalingFactor();
        let tx = this.props.origin.x;
        let ty = this.props.origin.y;

        let trGeom= this.transformPolygon(polygon.geom, scale, -scale, tx, ty);
        let box = [...trGeom.faces][0].box;

        let style = {
            stroke: this.props.color,
            fill: (this.props.widthOn && !this.props.displayVertices) ? this.props.color : "white",
            alpha: this.props.displayed ? 0.6 : 0.0
        };

        polygon.graphics.clear();
        polygon.graphics = this.createGraphics(trGeom, style);

        let width = box.xmax - box.xmin;
        let height = box.ymax - box.ymin;
        polygon.cache(box.xmin, box.ymin, width, height);
    }

    redraw(polygon) {
        // Draw polygon
        polygon.redraw({
            stroke: this.props.color,
            fill: (this.props.widthOn && !this.props.displayVertices) ? this.props.color : "white",
            alpha: this.props.displayed ? 0.6 : 0.0
        });

        if (!this.props.displayed)
            return;

        /* Update  vertices */
        for (let vertex of this.vertices) {
            vertex.redraw({
                stroke: this.props.color,
                fill: this.props.color,
                alpha: this.props.displayVertices ? 1.0 : 0.0
            });
        }
    }

    redraw4(polygon) {
        // let scale = 1.0; // this.props.scale;   // stage.scalingFactor();

        if (this.props.tx !== undefined && this.props.ty !== undefined &&
            polygon.oldX !== undefined && polygon.oldY !== undefined) {
            // polygon.transformMatrix = polygon.oldMatrix
            //     .append(1, 0, 0, 1, this.props.tx, this.props.ty);
            polygon.x = polygon.oldX + this.props.tx;
            polygon.y = polygon.oldY + this.props.ty;
        }
        else {
            polygon.oldX = polygon.x;
            polygon.oldY = polygon.y;
        }

        polygon.scaleX = this.props.scale;
        polygon.scaleY = this.props.scale;

        // let matrix = polygon.getMatrix();
        // if (matrix === null) {
        //     polygon.transformMatrix = new createjs.Matrix2D(
        //         /* a   b  c     d    tx  ty*/
        //         1, 0, 0, 1, this.props.tx, this.props.ty
        //     );
        // }
        // else {
        //     matrix.append(1, 0, 0, 1, this.props.tx, this.props.ty);
        // }


    }

    draw(polygon) {
        let scale = this.props.initialScale;
        let tx = this.props.origin.x;
        let ty = this.props.origin.y;

        // let geom = polygon.geom;
        let transGeom = this.transformPolygon(polygon.geom, scale, -scale, tx, ty);
        let box = [...transGeom.faces][0].box;

        let style = {
            stroke: this.props.color,
            fill: (this.props.widthOn && !this.props.displayVertices) ? this.props.color : "white",
            alpha: this.props.displayed ? 0.6 : 0.0
        };

        polygon.graphics.clear();
        polygon.graphics = this.createGraphics(transGeom, style);

        let width = box.xmax - box.xmin;
        let height = box.ymax - box.ymin;

        polygon.cache(box.xmin, box.ymin, width, height);
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
        // no changed
        // if (nextProps.origin.x === this.state.origin.x &&
        //     nextProps.origin.y === this.state.origin.y &&
        //     nextProps.scale === this.state.scale) {
        //     return true;
        // }
        return true; // nextProps.polygon.parent.needToBeUpdated;
    }

    componentDidUpdate() {
        // this.redraw4(this.props.polygon);

        this.redraw(this.props.polygon);

        // this.redraw2(this.props.polygon);

        // this.props.polygon.cache(0,0,
        //     this.props.polygon.parent.canvas.width,
        //     this.props.polygon.parent.canvas.width);

        // let vertices = this.props.polygon.vertices;

        // // Remove old vertices
        // for (let oldVertex of vertices) {
        //     oldVertex.parent.removeChild(oldVertex);
        // }
        //
        // // Create new vertices
        // if (this.props.displayVertices) {
        //     this.vertices = this.createVertices(polygon);
        // }
        // polygon.vertices = vertices;

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
