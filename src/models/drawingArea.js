/**
 * Created by alexanderbol on 21/04/2017.
 */

import Flatten from 'flatten-js';

export class DrawingArea {
    constructor(canvas) {
        this.canvas = canvas;
        this.origin = new Flatten.Point(this.canvas.width / 2, this.canvas.height / 2);
        this.resolution = 400;  // MM 2 Pixels when zoomFactor = 1;
        this.zoomFactor = 1.0;
    }

    scalingFactor() {
        return this.resolution * this.zoomFactor;
    }

    C2W_Scalar(scalar) {
        return (scalar / this.scalingFactor());
    }

    W2C_Scalar = function(scalar) {
        return (this.scalingFactor() * scalar);
    }

    C2W_X(canvasX) {
        return ((canvasX - this.origin.x) / this.scalingFactor());
    }

    C2W_Y(canvasY) {
        return ((this.origin.y - canvasY) / this.scalingFactor());
    }

    W2C_X(worldX) {
        return (this.scalingFactor() * worldX + this.origin.x);
    }

    W2C_Y(worldY) {
        return (this.origin.y - this.scalingFactor() * worldY);
    }

    W2C(point) {
        return {x: this.W2C_X(point.x), y: this.W2C_Y(point.y)}
    }

    get box() {
        let minX = this.C2W_X(0);
        let minY = this.C2W_Y(this.canvas.height);
        let maxX = this.C2W_X(this.canvas.width);
        let maxY = this.C2W_Y(0);

        return ( new Flatten.Box(minX, minY, maxX, maxY) );
    }

    panTo(newOrigin) {
        this.origin.x = newOrigin.x;
        this.origin.y = newOrigin.y;
    }

    panBy(deltaX, deltaY) {
        this.origin.x += deltaX;
        this.origin.y += deltaY;
    }

    // zoom by 10% each time
    zoomIn(ratio) {
        let curRatio = ratio || 1.1;
        this.zoomFactor = Math.min(100000, curRatio * this.zoomFactor);
    }

    zoomOut(ratio) {
        let curRatio = ratio || 1.1;
        this.zoomFactor = Math.max(0.1, this.zoomFactor / curRatio);
    }

    // ZoomIn/Out + "Focus follows mouse"
    zoom(focusX, focusY, bIn, ratio) {
        let worldX = this.C2W_X(focusX);    // world coordinate of mouse focus before zoom
        let worldY = this.C2W_Y(focusY);

        bIn ? this.zoomIn(ratio) : this.zoomOut(ratio);

        let newFocusX = this.W2C_X(worldX); // canvas coordinate after zoom
        let newFocusY = this.W2C_Y(worldY);

        this.panBy(focusX - newFocusX, focusY - newFocusY);
    }

    resize() {
        this.origin.x = this.canvas.width / 2;
        this.origin.y = this.canvas.height / 2;
    }

}