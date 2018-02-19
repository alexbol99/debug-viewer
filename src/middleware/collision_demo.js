import * as ActionTypes from '../actions/action-types';
// import { parseXML } from "../models/parserXML";
// import { Layers } from '../models/layers';
// import { Model } from "../models/model";

// let {point, arc, segment, circle, Polygon} = Flatten;

const collision_demo = ({ dispatch, getState }) => next => action => {

    if (action.type === ActionTypes.NEW_STAGE_CREATED) {
        if (document.location.href.split('#')[1] === 'collision_demo') {
            dispatch({
                type: ActionTypes.COLLISION_DEMO_URI
            })
        }
    }
    return next(action);
};


export default collision_demo;
