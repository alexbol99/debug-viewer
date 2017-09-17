import * as ActionTypes from '../actions/action-types';
import { Layers } from '../models/layers';
import { Shape } from '../models/shape';
import { parseXML } from '../models/parserXML';

const readFile = (file, stage, layers, dispatch) => {
    if (!file.type.match('text.*')) return;   // validate type is text

    let reader = new FileReader();

    // Closure to capture file information and parameters
    reader.onload = (function(theFile, stage, layers, dispatch) {
        return (event) => {
            let string = event.target.result;

            let job = parseXML(theFile.name, string);
            let layer = Layers.newLayer(stage, layers);
            if (theFile.name !== "") {
                layer.name = theFile.name;
            }
            layer.title = job.title;

            for (let polygon of job.profiles) {
                if (polygon.edges.size > 0 && polygon.faces.size > 0) {
                    let watch = undefined; //  parser.parseToWatchArray(string);
                    let shape = new Shape(polygon, stage, polygon.style, watch);

                    layer.add(shape);
                }
            }

            for (let polygon of job.materials) {
                if (polygon.edges.size > 0 && polygon.faces.size > 0) {
                    let watch = undefined; //  parser.parseToWatchArray(string);
                    let shape = new Shape(polygon, stage, polygon.style, watch);

                    layer.add(shape);
                }
            }

            layers.push(layer);

            dispatch({
                type: ActionTypes.PAN_AND_ZOOM_TO_SHAPE,
                shape: layer
            })

        }
    })(file, stage, layers, dispatch);

    reader.readAsText(file);
};

const readFiles = ({ dispatch, getState }) => next => action => {

    if (action.type !== ActionTypes.FILENAME_LIST_SELECTED) {
        return next(action);
    }

    let stage = action.stage;
    let layers = action.layers;

    // Load and parse files
    for (let file of action.files) {
        readFile(file, stage, layers, dispatch);
    }
};


export default readFiles;
