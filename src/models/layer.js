/**
 * Created by alexanderbol on 17/04/2017.
 */

import Flatten from 'flatten-js';
import { Shape } from '../models/shape';

export class Layer {
    constructor(stage) {
        // super();
        // cannot define Layer as extension of PlanarSet due to bug in compiler ?
        this.stage = stage;
        this.shapes = new Flatten.PlanarSet();
        this.name = "";
        this.displayed = true;
        this.edited = false;
        this.affected = false;
    }

    clone() {
        let layer = new Layer(this.stage);
        return Object.assign(layer, this);
    }

    add(geom) {
        let shape = new Shape(geom, this.stage);
        this.shapes.add(shape);
        return shape;
    }

    toggleDisplayed() {
        return Object.assign(this.clone(),
            {
                displayed : !this.displayed
            });
    }

    setAffected(affected) {
        let layer = new Layer(this.stage);
        layer = Object.assign(layer, this,
            {
                affected : affected
            });
        return layer;
    }

    setAlpha() {
        for(let shape of this.shapes) {
            shape.alpha = this.displayed ? 1 : 0;
        }
        return this.shapes;
    }
}