import React from 'react';
// import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';

import {App} from './App';

// import * as ActionTypes from './actions/action-types';
// import { Parser } from './models/parser';
// import { Shape } from './models/shape';
// import { Model } from "./models/model";
// import Flatten from 'flatten-js';
// let {Point, Segment, Polygon} = Flatten;

import { createStore } from 'redux';
import { reducer } from './reducer';
const store = createStore(reducer);

it('shallow renders without crashing', () => {
    shallow(<App store={store}/>)
});

// it('renders without crashing', () => {
//     const div = document.createElement('div');
//     ReactDOM.render(<App store={store}/>, div);
// });


/*
it('expect stage to be defined', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App store={store}/>, div);
    let state = store.getState();
    expect(state.stage).toBeDefined();
});
it('expect layers to be defined and empty', () => {
    let state = store.getState();
    expect(state.layers).toBeDefined();
    expect(state.layers.length).toEqual(0);
});
it('can create new layer', () => {
    let state = store.getState();
    let dispatch = store.dispatch;
    dispatch({
        type: ActionTypes.ADD_LAYER_PRESSED,
        stage: state.stage
    });
    state = store.getState();
    expect(state.layers).toBeDefined();
    expect(state.layers.length).toEqual(1);
});
it('can create add shapes to layer', () => {
    let state = store.getState();
    let dispatch = store.dispatch;
    dispatch({
        type: ActionTypes.ADD_LAYER_PRESSED,
        stage: state.stage
    });
    state = store.getState();
    let layer = state.layers[0];
    let seg1 = new Segment(new Point(-1, 0), new Point(1, 0));
    let seg2 = new Segment(new Point(0, -1), new Point(0, 1));
    layer.add(seg1);
    layer.add(seg2);
    expect(layer.shapes.size).toEqual(2);
});
it('can parse debug string to polygon', () => {
    let parser = new Parser();
    let poly = parser.parseDebugString("123");
    expect(poly instanceof Polygon).toEqual(true);
    expect(poly.faces.size).toEqual(1);
    expect(poly.edges.size).toEqual(23);
});
it('can create graphics for polygon', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App store={store}/>, div);
    let state = store.getState();
    let stage = state.stage;

    let parser = new Parser();
    let poly = parser.parseDebugString("123");
    // let shape = new Shape(poly, stage);
    let shape = new Model(poly);

    expect(shape.graphics).toBeDefined();
});
*/