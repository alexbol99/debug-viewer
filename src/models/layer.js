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
        this.color = "";
        this.displayed = false;
        this.edited = false;
        this.affected = false;
    }

    clone() {
        let layer = new Layer(this.stage);
        return Object.assign(layer, this);
    }

    add(shape) {
        if (shape instanceof Shape) {
            this.shapes.add(shape)
        }
        else {
            let geom = shape;
            let newShape = new Shape(geom, this.stage);
            this.shapes.add(newShape);
        }
        return this;
    }

    toggleDisplayed(color) {
        return Object.assign(this.clone(),
            {
                displayed : !this.displayed,
                color: color
            });
    }

    setAffected(affected) {
        return Object.assign(this.clone(),
            {
                affected : affected
            });
    }

    setAlpha() {
        for(let shape of this.shapes) {
            shape.alpha = this.displayed ? 1 : 0;
        }
        return this.shapes;
    }

    toggleExpanded(shapeToggle) {
        for(let shape of this.shapes) {
            if (shape === shapeToggle) {
                shape.expanded = !shape.expanded;
            }
        }
        return this;
    }
}