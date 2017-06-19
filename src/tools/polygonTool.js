/**
 * Created by alexanderbol on 19/06/2017.
 */
/**
 * Created by alexanderbol on 21/04/2017.
 */

import {Component} from 'react';
// import createjs from 'easel-js';

import '../App.css';

// import { Stage } from '../models/stage';
// import {Layer} from '../models/layer';
// import {Layers} from '../models/layers';

// import * as ActionTypes from '../actions/action-types';

export class PolygonTool extends Component {
    // constructor() {
    //     super();
    //     // this.handleMouseMove = this.handleMouseMove.bind(this);
    // }

    componentWillMount() {
        // this.dispatch = this.props.store.dispatch;
        // this.setState(this.props.store.getState());
    }

    componentDidMount() {
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    componentDidUpdate() {

        this.props.polygon.alpha = this.props.layer.displayed ? 1 : 0;
        this.props.polygon.redraw();

    }

    componentWillUnmount() {

    }

    render() {
        return null
    }
}
