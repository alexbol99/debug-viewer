/**
 * Created by alexanderbol on 21/04/2017.
 */

import React, {Component} from 'react';
// import createjs from 'easel-js';

import '../App.css';

// import { Stage } from '../models/stage';
// import {Layer} from '../models/layer';
// import {Layers} from '../models/layers';

// import * as ActionTypes from '../actions/action-types';

import { PolygonTool } from '../tools/polygonTool';

class ShapeContainerComponent extends Component {
    render() {
        return null;
    }
}

export class LayerComponent extends Component {
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
        for (let shape of this.props.layer.shapes) {
            shape.alpha = this.props.layer.displayed ? 1 : 0;
            shape.redraw();
        }
    }

    componentWillUnmount() {

    }

    render() {
        return <ShapeContainerComponent>
            {
                [...this.props.layer.shapes].map( shape => {
                    return (
                        <PolygonTool
                            key={shape.id}
                            polygon={shape}
                        />
                    )
                })
            }
        </ShapeContainerComponent>
    }
}
