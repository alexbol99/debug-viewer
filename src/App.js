import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

import { HeaderComponent } from './components/headerComponent';
import { MainComponent } from './components/mainComponent';
import { LayersListComponent } from './components/layersListComponent';
import { AsideComponent } from './components/asideComponent';

import * as ActionTypes from './actions/action-types';

// import Flatten from 'flatten-js';
// import { Parser } from './models/parser';
// import { Layer } from './models/layer';

// import { Shape } from './models/shape';
// import { Model } from "./models/model";

// let {Point} = Flatten;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.store.getState();
        this.props.store.subscribe(() => {
            this.setState(this.props.store.getState());
        });

    }
    handlePaste(event) {
        if (this.state.layers.length === 0) return;

        let layer = this.state.layers.find((lay) => lay.affected);
        if (!layer) return;

        let parser = this.state.app.parser;

        for (let item of event.clipboardData.items) {
            item.getAsString( (string) => {
                let shapesArray = parser.parse(string);
                // TODO: add something like poly.valid()
                if (shapesArray.length > 0) {
                    // let watch = parser.parseToWatchArray(string);

                    // let shape = new Shape(poly, this.state.stage, {}, watch);
                    // let shape = new Model(poly);

                    this.dispatch({
                        type: ActionTypes.NEW_SHAPE_PASTED,
                        shapesArray: shapesArray
                    });

                    // dispatch({
                    //     type: ActionTypes.PAN_AND_ZOOM_TO_SHAPE,
                    //     shape: shape
                    // });
                }

            });

            break;
        }

            // let point = new Point(0, 0);
            // let seg1 = new Segment(new Point(-10, 0), new Point(10, 0));
            // let seg2 = new Segment(new Point(0, -10), new Point(0, 10));

            // layer.add(point);
            // layer.add(seg1);
            // layer.add(seg2);
    }

    componentWillMount() {
        // this.dispatch = this.props.store.dispatch;
        this.setState(this.props.store.getState());
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.store.getState());
    }

    render() {
        return (
            <div className="App">
                <HeaderComponent {... this.props } />
                <div className="App-body"
                     onPaste={(e) => this.handlePaste(e)}>
                    <MainComponent {... this.props } />
                    <LayersListComponent
                        dispatch={this.props.store.dispatch}
                        stage={this.state.stage}
                        layers={this.state.layers}
                    />
                    <AsideComponent {... this.props} />
                </div>
            </div>
        );
    }
}

export default App;

/*
 <div className="App">
 <div className="App-header">
 <h2>Debug Viewer</h2>
 </div>

 </div>
*/

/*
 <img src={logo} className="App-logo" alt="logo" />
 */