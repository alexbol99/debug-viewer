/**
 * Created by alexanderbol on 17/04/2017.
 */

import React, {Component} from 'react';
import '../../public/styles/App.css';
import {LayerListToolbarComponent} from "./layerListToolbarComponent";
import {LayerListElement} from './layerListElement';
import * as ActionTypes from '../actions/action-types';
import { Layers } from '../models/layers';

export class LayersListComponent extends Component {
    constructor(param) {
        super();
        this.onLayerListClicked = this.onLayerListClicked.bind(this);
        this.onLayerClicked = this.onLayerClicked.bind(this);
        this.onLayerDoubleClicked = this.onLayerDoubleClicked.bind(this);
        this.onSubmitLayerEditForm = this.onSubmitLayerEditForm.bind(this);
        this.onEscapeLayerEditForm = this.onEscapeLayerEditForm.bind(this);

        this.onAddLayerSelected = this.onAddLayerSelected.bind(this);
        this.onEditLayerSelected = this.onEditLayerSelected.bind(this);
        this.onDeleteLayerSelected = this.onDeleteLayerSelected.bind(this);
        this.onSortLayersSelected = this.onSortLayersSelected.bind(this);

        this.onAffectedBoxClicked = this.onAffectedBoxClicked.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.height = 0;
        this.dispatch = param.dispatch;
    }

    onLayerListClicked() {
        this.dispatch({
            type: ActionTypes.LAYER_LIST_PANEL_PRESSED
        });
    }

    onLayerClicked(layer) {
        this.dispatch({
            type: ActionTypes.TOGGLE_DISPLAY_LAYER_PRESSED,
            layer: layer
        });
    }

    onLayerDoubleClicked(layer) {
        this.dispatch({
            type: ActionTypes.OPEN_LAYER_EDIT_FORM_PRESSED,
            layer: layer
        });
    }

    onSubmitLayerEditForm(layer, newLayer) {
        this.dispatch({
            type: ActionTypes.SUBMIT_LAYER_EDIT_FORM_PRESSED,
            layer: layer,
            newLayer: newLayer
        });
    };

    onEscapeLayerEditForm(layer) {
        this.dispatch({
            type: ActionTypes.ESCAPE_LAYER_EDIT_FORM_PRESSED,
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
        let layer = Layers.newLayer(this.props.stage, this.props.layers);

        this.dispatch({
            type: ActionTypes.ADD_LAYER_PRESSED,
            stage: this.props.stage,
            layer: layer
        })
    }

    onEditLayerSelected() {
        let layer = Layers.getAffected(this.props.layers);
        if (!layer) return;

        this.dispatch({
            type: ActionTypes.OPEN_LAYER_EDIT_FORM_PRESSED,
            layer: layer
        });
    }

    onDeleteLayerSelected() {
        let layer = Layers.getAffected(this.props.layers);
        if (!layer) return;

        this.dispatch({
            type: ActionTypes.DELETE_LAYER_BUTTON_PRESSED,
            layers: this.props.layers,
            layer: layer
        });
    }

    onSortLayersSelected() {
        this.dispatch({
            type: ActionTypes.SORT_LAYERS_BUTTON_PRESSED,
            layers: this.props.layers
        });
    }

    handleKeyDown(e) {
        // e.stopPropagation();
        // e.preventDefault();

        if (e.target.parentElement.parentElement &&
            e.target.parentElement.parentElement.id &&
            e.target.parentElement.parentElement.id === "layersList") {


            switch (e.code) {
                case "ArrowRight":
                case "ArrowDown":
                    this.dispatch({
                        type: ActionTypes.LAYERS_LIST_ARROW_DOWN_PRESSED
                    });
                    break;
                case "ArrowLeft":
                case "ArrowUp":
                    this.dispatch({
                        type: ActionTypes.LAYERS_LIST_ARROW_UP_PRESSED
                    });
                    break;
                /* tab does not work properly
            case "Tab":
                if (e.shiftKey) {
                    this.dispatch({
                        type: ActionTypes.LAYERS_LIST_ARROW_UP_PRESSED
                    });
                }
                else {
                    this.dispatch({
                        type: ActionTypes.LAYERS_LIST_ARROW_DOWN_PRESSED
                    });
                }
                break;
                */
                default:
                    break;
            }
        }

    }

    componentDidMount() {
        // Keyboard event
        // var _keydown = _.throttle(this.keydown, 100);
        document.addEventListener('keydown', this.handleKeyDown);
        // var _keyup = _.throttle(this.keyup, 500);
        // document.addEventListener('keyup', this.handleKeyUp);
    }

    componentDidUpdate() {
        this.height = this.refs.layersComponent.clientHeight;
        // let container = this.refs.watchContainer;
        // let parentHeight = container.parentElement.clientHeight;
        // container.style.maxHeight = 0.7*parentHeight;
    }

    render() {
        // let addLayer =
        //     (<div
        //         style={{padding:4, backgroundColor: "lightgray"}}
        //         onClick={this.onAddLayerSelected}>
        //         <h5 style={{margin:0}}>Add layer</h5>
        //     </div>)

        // let layers = this.props.layers.slice();
        // layers.sort( function(l1, l2) {
        //     let name1 = l1.name.toUpperCase();
        //     let name2 = l2.name.toUpperCase();
        //     if (name1 < name2) {
        //         return -1;
        //     }
        //     if (name1 > name2) {
        //         return 1;
        //     }
        //     return 0;
        // });

        return (
            <div className="App-layers"
                 ref="layersComponent"
                 onClick={this.onLayerListClicked}
            >
                {/*<h5>Layers</h5>*/}
                <LayerListToolbarComponent
                    onAddLayerButtonClicked={this.onAddLayerSelected}
                    onEditLayerButtonClicked={this.onEditLayerSelected}
                    onDeleteLayerButtonClicked={this.onDeleteLayerSelected}
                    onSortLayersButtonClicked={this.onSortLayersSelected}
                />
                <ul id="layersList"
                    style={{maxHeight:0.82*(this.height-40),padding:0,overflow:'auto'}}>
                { this.props.layers.map((layer) =>
                    <LayerListElement
                        onLayerClicked={() => this.onLayerClicked(layer)}
                        onLayerDoubleClicked={() => this.onLayerDoubleClicked(layer)}
                        onAffectedBoxClicked={() => this.onAffectedBoxClicked(layer)}
                        onSubmitLayerEditForm={this.onSubmitLayerEditForm}
                        onEscapeLayerEditForm={this.onEscapeLayerEditForm}
                        key={layer.name}
                        layer={layer}
                    />)
                }
                </ul>
                {/*{addLayer}*/}
            </div>
        )

    }
}