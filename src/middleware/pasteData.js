import * as ActionTypes from "../actions/action-types";
import {Layers} from "../models/layers";

const pasteData = ({ dispatch, getState }) => next => action => {

    if (action.type !== ActionTypes.DATA_FROM_BUFFER_PASTED) {
        return next(action);
    }

    let state = getState();
    let stage = state.stage;
    let layers = state.layers;
    let parser = state.app.parser;

    let layer = undefined;
    if (layers.length === 0) {
        layer = Layers.newLayer(stage, layers);
        layer.name = "layer";
        layer.affected = true;
        layers.push(layer);
    }
    else {
        layer = layers.find((lay) => lay.affected);
    }
    if (!layer) return;

    // Paste data from ClipBoard
    for (let item of action.data.items) {
        item.getAsString((string) => {
            let shapesArray = parser.parse(string);
            // TODO: add something like poly.valid()
            if (shapesArray.length > 0) {
                // let watch = parser.parseToWatchArray(string);

                // let shape = new Shape(poly, this.state.stage, {}, watch);
                // let shape = new Model(poly);

                for (let shape of shapesArray) {
                    layer.add(shape);
                }

                // dispatch({
                //     type: ActionTypes.NEW_SHAPE_PASTED,
                //     shapesArray: shapesArray
                // });

                dispatch({
                    type: ActionTypes.PAN_AND_ZOOM_TO_SHAPE,
                    shape: layer,
                    stage: stage
                });
            }

        });

        break;
    }

};

export default pasteData;
