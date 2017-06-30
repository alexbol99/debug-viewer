/**
 * Created by alexanderbol on 06/05/2017.
 */

import React, {Component} from 'react';
import '../App.css';
import * as ActionTypes from '../actions/action-types';

import {Layers} from '../models/layers';

class WatchElement extends Component {
    render() {
        let watch = this.props.shape.watch;
        if (watch === undefined) return null;
        let expandedSign = this.props.shape.expanded ? '-' : '+';
        return (
            <div>
                { this.props.shape.expanded ?
                    watch.map( (edgeWatch, index) => {
                        return (
                            <div
                                key={index}
                                className="Watch-element-title"
                            >
                                <div
                                    style={{flex: 1}}
                                    onClick={(event) => this.props.onToggleWatchExpandButtonClicked(this.props.shape)}>
                                    -
                                </div>
                                <div
                                    title={edgeWatch}
                                    onClick={(event) => this.props.onSelectShapeClicked(this.props.shape)}>
                                    {edgeWatch}
                                </div>
                            </div>
                        )
                    }) :

                    <div className="Watch-element-title"
                    >
                        <div
                            style={{flex: 1}}
                            onClick={(event) => this.props.onToggleWatchExpandButtonClicked(this.props.shape)}>
                            {expandedSign}
                        </div>
                        <div
                            title={watch[0]}
                            onClick={(event) => this.props.onSelectShapeClicked(this.props.shape)}>
                            {watch[0]}
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export class AsideComponent extends Component {
    constructor() {
        super();
        this.onToggleWatchExpandButtonClicked = this.onToggleWatchExpandButtonClicked.bind(this);
        this.onSelectShapeClicked = this.onSelectShapeClicked.bind(this);
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
    }

    render() {
        let layer = Layers.getAffected(this.state.layers);
        let shapes = layer ? [...layer.shapes] : undefined;
        return (
            <aside className="App-aside">
                {/*<h4>Aside</h4>*/}
                <h3>Paste data here...</h3>
                <div className="Watch-container">
                    {
                        shapes ?
                            shapes.map((shape, index) =>
                                <WatchElement
                                    key={index}
                                    shape={shape}
                                    onToggleWatchExpandButtonClicked={this.onToggleWatchExpandButtonClicked}
                                    onSelectShapeClicked={this.onSelectShapeClicked}
                                />
                            ) : null
                    }
                </div>
            </aside>
        )
    }
}