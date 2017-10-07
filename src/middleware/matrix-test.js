import Flatten from 'flatten-js';
import * as ActionTypes from '../actions/action-types';
import { Layers } from '../models/layers';
// import { Model } from "../models/model";

let {point, segment, Polygon} = Flatten;

function zoomHome(shape, stage) {
    let box = shape.box;
    let x = (box.xmin + box.xmax)/2;
    let y = (box.ymin + box.ymax)/2;
    stage.panToCoordinate(x, y);
    stage.zoomToLimits(box.xmax - box.xmin, box.ymax - box.ymin);
}

const matrix_test = ({ dispatch, getState }) => next => action => {

    if (action.type === ActionTypes.NEW_STAGE_CREATED) {
        if (document.location.pathname === '/matrix_test') {

            let stage = action.stage;
            let state = getState();
            let layers = state.layers;

            let layer = Layers.newLayer(stage, layers);
            layer.name = "demo1";
            layer.title = "demo1";

            layer.add( segment(-100, 0, 100, 0) );
            layer.add( segment(0, -100, 0, 50) );

            let polygon = new Polygon();

            layer.add( point(20,20) );

            polygon.addFace( [
                segment(-50,-50, 50, -50),
                segment(50, -50, 100, 100),
                segment(100,100, -100, 100),
                segment(-100,100, -50, -50)
            ]);

            layer.add(polygon);

            zoomHome(layer, stage);
            state.layers.push(layer);
        }
    }
    return next(action);
};


export default matrix_test;
