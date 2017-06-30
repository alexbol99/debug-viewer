/**
 * Created by alexanderbol on 17/04/2017.
 */

import React, {Component} from 'react';
// import logo from './logo.svg';
import '../App.css';

import {LayerListElement} from './layerListElement';

import * as ActionTypes from '../actions/action-types';
// import { Layers } from '../models/layers';

export class LayersListComponent extends Component {
    constructor() {
        super();
        this.onLayerClicked = this.onLayerClicked.bind(this);
        this.onLayerDoubleClicked = this.onLayerDoubleClicked.bind(this);
        this.onAddLayerSelected = this.onAddLayerSelected.bind(this);
        this.onAffectedBoxClicked = this.onAffectedBoxClicked.bind(this);
    }

    componentWillMount() {
        this.dispatch = this.props.store.dispatch;
        this.setState(this.props.store.getState());
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.store.getState());
    }

    onLayerClicked(layer) {
        this.dispatch({
            type: ActionTypes.TOGGLE_DISPLAY_LAYER_PRESSED,
            layer: layer
        });
    }

    onLayerDoubleClicked(layer) {
        this.dispatch({
            type: ActionTypes.EDIT_LAYER_NAME_PRESSED,
            layer: layer
        });
    }

    onAffectedBoxClicked(layer) {
        this.dispatch({
            type: ActionTypes.TOGGLE_AFFECTED_LAYER_PRESSED,
            layer: layer
        });
    }

    onAddLayerSelected() {
        this.dispatch({
            type: ActionTypes.ADD_LAYER_PRESSED,
            stage: this.state.stage
        })
    }

    render() {
        let addLayer =
            (<div
                style={{padding:4, backgroundColor: "lightgray"}}
                onClick={this.onAddLayerSelected}>
                <h4 style={{margin:0}}>Add layer</h4>
            </div>)

        return (
            <div className="App-layers">
                {/*<h4>Layers List</h4>*/}
                { this.state.layers.map((layer) =>
                    <LayerListElement
                        onLayerClicked={() => this.onLayerClicked(layer)}
                        onLayerDoubleClicked={() => this.onLayerDoubleClicked(layer)}
                        onAffectedBoxClicked={() => this.onAffectedBoxClicked(layer)}
                        key={layer.name}
                        layer={layer}
                    />)
                }
                { addLayer }
            </div>
        )

    }
}