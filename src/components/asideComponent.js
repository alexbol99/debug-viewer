/**
 * Created by alexanderbol on 06/05/2017.
 */

import React, {Component} from 'react';
import '../App.css';
import * as ActionTypes from '../actions/action-types';
import { debug_str } from '../sample';
import {Layers} from '../models/layers';
import {Shape} from '../models/shape';
import { parseXML } from '../models/parserXML';

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
        this.addSamplePolygon = this.addSamplePolygon.bind(this);
        this.handleFileSelect = this.handleFileSelect.bind(this);
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

    addSamplePolygon() {
        let parser = this.state.app.parser;
        let poly = parser.parseToPolygon(debug_str);
        let watch = parser.parseToWatchArray(debug_str);

        let shape = new Shape(poly, this.state.stage, {}, watch);

        this.dispatch({
            type: ActionTypes.NEW_SHAPE_PASTED,
            shape: shape
        });

        this.dispatch({
            type: ActionTypes.PAN_AND_ZOOM_TO_SHAPE,
            shape: shape
        });
    }

    readFile(file) {
        if (!file.type.match('text.*')) return;   // validate type is text

        let reader = new FileReader();

        let self = this;
        // Closure to capture file information and "this" component
        reader.onload = (function(theFile, thisComponent) {
            return (event) => {
                let string = event.target.result;
                // let name = theFile.name;

                // let parser = thisComponent.state.app.parser;
                let stage = thisComponent.state.stage;
                // let poly = parser.parseToPolygon(string);

                let poly = parseXML(string);

                // TODO: add something like poly.valid()
                if (poly.edges.size > 0 && poly.faces.size > 0) {
                    let watch = undefined; //  parser.parseToWatchArray(string);

                    let shape = new Shape(poly, stage, {}, watch);

                    thisComponent.dispatch({
                        type: ActionTypes.NEW_SHAPE_PASTED,
                        shape: shape
                    });

                    thisComponent.dispatch({
                        type: ActionTypes.PAN_AND_ZOOM_TO_SHAPE,
                        shape: shape
                    });
                }
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
        this.height = this.refs.aside.clientHeight;
        // let container = this.refs.watchContainer;
        // let parentHeight = container.parentElement.clientHeight;
        // container.style.maxHeight = 0.7*parentHeight;
    }

    render() {
        let layer = Layers.getAffected(this.state.layers);
        let shapes = layer ? [...layer.shapes] : undefined;
        let watchContainerHeight = 0.75*this.height;
        return (
            <aside className="App-aside" ref="aside">
                {/*<h4>Aside</h4>*/}
                <input style={{fontSize:16, marginTop:5, marginBottom:5}}
                       type="file" id="files" name="files[]" multiple
                       onChange={this.handleFileSelect}
                />
                <h3>... or paste data here</h3>
                <div
                    className="Watch-container"
                    style={{maxHeight:watchContainerHeight}}
                >
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
                <button className="Aside-add-sample-polygon"
                     onClick={this.addSamplePolygon}
                >
                    Add sample polygon
                </button>
            </aside>
        )
    }
}