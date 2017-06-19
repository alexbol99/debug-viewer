/**
 * Created by alexanderbol on 20/04/2017.
 */

import { Layer } from '../models/layer';

export class Layers {

    static newLayer(layers, stage) {
        let layer = new Layer(stage);
        layer.name = Layers.getNewName(layers);
        return layer;
    }

    static get defaultName() {
        return "layer";
    }

    static getNewName(layers) {
        let name = Layers.defaultName;
        let inc = 1;
        let comparator = (layer) => layer.name === name;
        while (layers.find(comparator) ) {
            name = Layers.defaultName + inc;
            inc++;
        }
        return name;
    }

}