import Flatten from 'flatten-js';
import * as ActionTypes from '../actions/action-types';
import { Layers } from '../models/layers';
// import { Model } from "../models/model";
// import * as createjs from '../../public/easeljs-NEXT.combined.js';

let {point, circle, segment, Polygon, BooleanOp} = Flatten;
let {union, subtract, intersect, arrange} = BooleanOp;

function zoomHome(shape, stage) {
    let box = shape.box;
    let x = (box.xmin + box.xmax)/2;
    let y = (box.ymin + box.ymax)/2;
    stage.panToCoordinate(x, y);
    stage.zoomToLimits(box.xmax - box.xmin, box.ymax - box.ymin);
}

const boolean_test = ({ dispatch, getState }) => next => action => {

    if (action.type === ActionTypes.NEW_STAGE_CREATED) {
        if (document.location.href.split('#')[1] === 'boolean_test') {

            let stage = action.stage;
            let state = getState();
            let layers = state.layers;

            let layer = Layers.newLayer(stage, layers);
            layer.name = "polygon1";
            layer.title = "data";

            // let axeX = segment(-10,0, 10, 0);
            // let axeY = segment(0, -10, 0, 10);
            //
            // layer.add(axeX);
            // layer.add(axeY);

            let polygon1 = new Polygon();
            polygon1.addFace( [
                point(-10,0),
                point(-10, 20),
                point(10, 20),
                point(10, 0)
            ]);
            // polygon1.addFace(
            //     [circle(point(0,10),5).toArc(true)]
            // );
            layer.add(polygon1);
            state.layers.push(layer);

            let polygon2 = new Polygon();
            // polygon2.addFace(
            //     [circle(point(0,10),5).toArc(false)]
            // );
            polygon2.addFace( [
                point(5,10),
                point(5,30),
                point(15,30),
                point(15,10)
            ]);

            layer = Layers.newLayer(stage, layers);
            layer.name = "polygon2";
            layer.add(polygon2);
            state.layers.push(layer);

            let polygon3 = intersect(polygon1, polygon2);

            layer = Layers.newLayer(stage, layers);
            layer.name = "union";
            layer.add(polygon3);

            zoomHome(layer, stage);
            state.layers.push(layer);

        }
    }
    return next(action);
};

export default boolean_test;
