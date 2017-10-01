import * as ActionTypes from '../actions/action-types';
import { Layers } from '../models/layers';
import { Shape } from '../models/shape';

import poly1 from '../../public/polygon.txt';
import poly2 from '../../public/poly2.txt';
import poly3 from '../../public/poly3.txt';
import poly4 from '../../public/poly234.txt';

const demo = ({ dispatch, getState }) => next => action => {

    if (action.type === ActionTypes.NEW_STAGE_CREATED) {
        if (document.location.pathname === '/demo') {

            let state = getState();
            let parser = state.app.parser;
            let str64 = [poly1, poly2, poly3, poly4];

            for (let i = 0; i < 3; i++) {
                let str = str64[i];
                let text = atob(str.split(',')[1]);
                let polygon = parser.parseToPolygon(text);
                let layer = Layers.newLayer(action.stage, state.layers);
                layer.name = "demo"+i;
                layer.title = "demo"+i;

                // let watch = undefined; //  parser.parseToWatchArray(string);
                let shape = new Shape(polygon, action.stage);
                layer.add(shape);

                state.layers.push(layer);

                // dispatch({
                //     type: ActionTypes.PAN_AND_ZOOM_TO_SHAPE,
                //     shape: layer
                // })
            }
        }
    }
    return next(action);
};


export default demo;
