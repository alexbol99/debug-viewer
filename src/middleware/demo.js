import * as ActionTypes from '../actions/action-types';
import { Layers } from '../models/layers';
import { Model } from "../models/model";

import { parseODB } from "../models/parserODB";
// let {point, arc, segment, circle, Polygon} = Flatten;

function zoomHome(shape, stage) {
    let box = shape.box;
    let x = (box.xmin + box.xmax)/2;
    let y = (box.ymin + box.ymax)/2;
    stage.panToCoordinate(x, y);
    stage.zoomToLimits(box.xmax - box.xmin, box.ymax - box.ymin);
}

const demo = ({ dispatch, getState }) => next => action => {

    if (action.type === ActionTypes.NEW_STAGE_CREATED || action.type === ActionTypes.WINDOW_HASH_CHANGED) {
        if (document.location.href.split('#')[1] === 'demo') {
            // console.log(document.location.pathname);
            // console.log(getState());

            let stage = action.stage;
            let state = getState();

            let layers = state.layers;
            let layer = Layers.newLayer(stage, layers);
            layer.name = "features";
            layer.title = "features";
            layer.affected = true;
            layer.displayed = true;

            let xhr = new XMLHttpRequest();
            xhr.open('GET',process.env.PUBLIC_URL + '/features',true);
            xhr.onreadystatechange = function(event) {
                if (this.readyState === 4 && this.status === 200) {
                    let text = this.responseText;
                    let job = parseODB("features", text);

                    for (let shape of job.shapes) {
                        let model = new Model(shape, undefined, shape.label);
                        layer.add(model);
                    }

                    zoomHome(layer, stage);
                    state.layers.push(layer);

                    dispatch({
                        type: ActionTypes.PAN_AND_ZOOM_TO_SHAPE,
                        stage: stage,
                        shape: layer
                    })
                }
            };
            xhr.send();
        }
    }
    return next(action);
};


export default demo;
