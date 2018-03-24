/**
 * Created by alexanderbol on 06/05/2017.
 */

import React, {Component} from 'react';
import '../../public/styles/App.css';
import * as ActionTypes from '../actions/action-types';
// import {Layers} from '../models/layers';
// import {Shape} from '../models/shape';

export class AsideComponent extends Component {
    constructor() {
        super();
        this.onToggleWatchExpandButtonClicked = this.onToggleWatchExpandButtonClicked.bind(this);
        this.onSelectShapeClicked = this.onSelectShapeClicked.bind(this);
        // this.addSamplePolygon = this.addSamplePolygon.bind(this);
        this.height = 0;
    }

    onToggleWatchExpandButtonClicked(shape) {
        if (!shape) return;
        this.dispatch({
            type: ActionTypes.TOGGLE_WATCH_EXPAND_CLICKED,
            shape: shape
        });
    }

    onSelectShapeClicked(shape) {
        if (!shape) return;
        this.dispatch({
            type: ActionTypes.PAN_AND_ZOOM_TO_SHAPE,
            shape: shape
        });
    }

    componentWillMount() {
        this.dispatch = this.props.store.dispatch;
        this.setState(this.props.store.getState());
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.store.getState());
    }

    componentDidUpdate() {
        this.height = this.refs.aside.clientHeight;
        // let container = this.refs.watchContainer;
        // let parentHeight = container.parentElement.clientHeight;
        // container.style.maxHeight = 0.7*parentHeight;
    }

    render() {
        // let layer = Layers.getAffected(this.state.layers);
        // let shapes = layer ? [...layer.shapes] : undefined;
        // let title = layer ? layer.title : "";
        // let watchContainerHeight = 0.75*this.height;
        return (
            <aside className="App-aside" ref="aside">
                <h5> </h5>
                {/*<h5>{title}</h5>*/}
            </aside>
        )
    }
}
