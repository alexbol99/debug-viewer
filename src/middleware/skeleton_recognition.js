import * as ActionTypes from '../actions/action-types';
import {Layers} from "../models/layers";

let Algorithmia = Window.Algorithmia;

// import { Model } from "../models/model";

import Flatten from '@flatten-js/core';
let {point, arc, segment} = Flatten;

// function zoomHome(shape, stage) {
//     let box = shape.box;
//     let x = (box.xmin + box.xmax)/2;
//     let y = (box.ymin + box.ymax)/2;
//     stage.panToCoordinate(x, y);
//     stage.zoomToLimits(box.xmax - box.xmin, box.ymax - box.ymin);
// }

const skeleton_recognition = ({ dispatch, getState }) => next => action => {

    if (action.type === ActionTypes.NEW_STAGE_CREATED || action.type === ActionTypes.WINDOW_HASH_CHANGED ||
        action.type === ActionTypes.SKELETON_RECOGNITION_BUTTON_PRESSED) {
        if (document.location.href.split('#')[1] === 'skeleton') {
            // console.log(document.location.pathname);
            if (action.type === ActionTypes.SKELETON_RECOGNITION_BUTTON_PRESSED) {
                let state = getState();
                let stage = state.stage;

                let layers = state.layers;
                let currentLayer = Layers.getAffected(layers);
                let shapes = currentLayer.shapes;
                let input = shapes.map( shape =>
                    [shape.geom.x/400.,shape.geom.y/400.,shape.geom.nx,shape.geom.ny]
                );

                let client = Algorithmia.client("simby4RUwqQmtMDaHAPj5wsQwlD1");
                let algorithm = "alexbol99/SeketonRecognition"   // demo/Hello

                client.algo(algorithm)
                    .pipe(input)
                    .then(function (output) {
                        if (output.error) return console.error("error: " + output.error);

                        let newLayer = Layers.newLayer(stage, layers);
                        newLayer.name = "recognized";
                        newLayer.title = "recognized";
                        // newLayer.displayed = true;

                        for (let row of output.result) {
                            let shape;
                            if (row[0] instanceof Array && row[0].length === 2) {
                                let pc = point(row[0][0]*400,row[0][1]*400);
                                let r = row[1]*400;
                                /********center radius startAng endAng **********/
                                shape = arc(pc, r, row[2], row[3], Flatten.CCW)
                            }
                            else {
                                shape = segment(
                                    point(row[0] * 400, row[1] * 400),
                                    point(row[2] * 400, row[3] * 400))
                            }
                            if (row[4]) {
                                shape.label = row[4]
                            }
                            newLayer.add(shape)
                        }
                        layers.push(newLayer);

                        dispatch({
                            type: ActionTypes.PAN_AND_ZOOM_TO_SHAPE,
                            stage: stage,
                            shape: currentLayer
                        })
                    });

            }
            else {
                dispatch({
                    type: ActionTypes.SKELETON_RECOGNITION_URI
                })
            }
        }
    }
    return next(action);
};


export default skeleton_recognition;
