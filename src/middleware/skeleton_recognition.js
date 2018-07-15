import * as ActionTypes from '../actions/action-types';
import Algorithmia from 'algorithmia';

// import { Layers } from '../models/layers';
// import { Model } from "../models/model";

// let {point, arc, segment, circle, Polygon} = Flatten;

// function zoomHome(shape, stage) {
//     let box = shape.box;
//     let x = (box.xmin + box.xmax)/2;
//     let y = (box.ymin + box.ymax)/2;
//     stage.panToCoordinate(x, y);
//     stage.zoomToLimits(box.xmax - box.xmin, box.ymax - box.ymin);
// }

const skeleton_recognition = ({ dispatch, getState }) => next => action => {

    if (action.type === ActionTypes.NEW_STAGE_CREATED || action.type === ActionTypes.WINDOW_HASH_CHANGED) {
        if (document.location.href.split('#')[1] === 'skeleton') {
            console.log(document.location.pathname);

            let client = Algorithmia.client("simby4RUwqQmtMDaHAPj5wsQwlD1");
            let input = "Alex";

            client.algo("demo/Hello")
                .pipe(input)
                .then(function (output) {
                    if (output.error) return console.error("error: " + output.error);
                    console.log(output.result);
                });
        }
    }
    return next(action);
};


export default skeleton_recognition;
