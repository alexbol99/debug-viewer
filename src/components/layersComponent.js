/**
 * Created by alexanderbol on 17/04/2017.
 */

import React, {Component} from 'react';
// import logo from './logo.svg';
import '../App.css';

import { LayerComponent } from './layerComponent';

import * as ActionTypes from '../actions/action-types';
// import { Layers } from '../models/layers';

export class LayersComponent extends Component {
    constructor() {
        super();
        this.onLayerClicked = this.onLayerClicked.bind(this);
        this.onAddLayerSelected = this.onAddLayerSelected.bind(this);
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

        //debug remove later
        // let shape = new Shape();
        // shape.graphics.beginFill('red').drawRect(0, 0, 20, 20);

        // this.dispatch({
        //     type: ActionTypes.ADD_SHAPE_TO_STAGE,
        //     shape: shape
        // })
    }

    onAddLayerSelected() {
        this.dispatch({
            type: ActionTypes.ADD_LAYER_PRESSED,
            stage: this.state.stage
        })
    }

    render() {
        let layers = this.state.layers.map((layer) =>
            <LayerComponent {...this.props}
                onLayerClicked={() => this.onLayerClicked(layer)}
                            key={layer.name}
                            layer={layer}
            />
        );
        let addLayer =
            (<div onClick={this.onAddLayerSelected}>
                <h4>add layer</h4>
            </div>)

        return (
            <div className="App-layers">
                { layers }
                { addLayer }
            </div>
        )

    }
}