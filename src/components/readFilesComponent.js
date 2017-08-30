/**
 * Created by alexanderbol on 06/05/2017.
 */

import React, {Component} from 'react';
import '../App.css';
import * as ActionTypes from '../actions/action-types';
import {Layers} from '../models/layers';
import { Shape } from '../models/shape';
import { parseXML } from '../models/parserXML';

export class ReadFilesComponent extends Component {
    constructor() {
        super();
        this.handleFileSelect = this.handleFileSelect.bind(this);
    }

    readFile(file) {
        if (!file.type.match('text.*')) return;   // validate type is text

        let reader = new FileReader();

        let self = this;
        // Closure to capture file information and "this" component
        reader.onload = (function(theFile, thisComponent) {
            return (event) => {
                let string = event.target.result;
                let stage = thisComponent.state.stage;
                let layers = thisComponent.state.layers;

                let job = parseXML(theFile.name, string);

                let layer = Layers.newLayer(stage, layers);
                if (theFile.name !== "") {
                    layer.name = theFile.name;
                }
                // layer.displayed = true;
                // layer.affected = true;
                layer.title = job.title;


                for (let polygon of job.profiles) {
                    if (polygon.edges.size > 0 && polygon.faces.size > 0) {
                        let watch = undefined; //  parser.parseToWatchArray(string);
                        let shape = new Shape(polygon, stage, polygon.style, watch);

                        layer.add(shape);
                        // thisComponent.dispatch({
                        //     type: ActionTypes.NEW_SHAPE_PASTED,
                        //     shape: shape
                        // });
                        //
                        // thisComponent.dispatch({
                        //     type: ActionTypes.PAN_AND_ZOOM_TO_SHAPE,
                        //     shape: shape
                        // });
                    }
                }

                for (let polygon of job.materials) {
                    if (polygon.edges.size > 0 && polygon.faces.size > 0) {
                        let watch = undefined; //  parser.parseToWatchArray(string);
                        let shape = new Shape(polygon, stage, polygon.style, watch);

                        layer.add(shape);

                        // thisComponent.dispatch({
                        //     type: ActionTypes.NEW_SHAPE_PASTED,
                        //     shape: shape
                        // });
                        /*
                        thisComponent.dispatch({
                            type: ActionTypes.PAN_AND_ZOOM_TO_SHAPE,
                            shape: shape
                        });*/
                    }
                }

                thisComponent.dispatch({
                    type: ActionTypes.ADD_LAYER_PRESSED,
                    stage: stage,
                    layer: layer
                });
                thisComponent.dispatch({
                    type: ActionTypes.PAN_AND_ZOOM_TO_SHAPE,
                    shape: layer
                })

            }
        })(file, self);

        reader.readAsText(file);
    }

    handleFileSelect(event) {
        if (!(File && FileReader && FileList)) return;

        let files = event.target.files; // FileList object

        for (let file of files) {
            this.readFile(file);
        }
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
        return (
            <input style={{fontSize:16, marginTop:5, marginBottom:5}}
                   type="file" id="files" name="files[]" multiple
                   onChange={this.handleFileSelect}
            />
        )
    }
}
