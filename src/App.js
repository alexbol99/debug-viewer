import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

import { HeaderComponent } from './components/headerComponent';
import { MainComponent } from './components/mainComponent';
import { LayersListComponent } from './components/layersListComponent';
import { AsideComponent } from './components/asideComponent';

import * as ActionTypes from './actions/action-types';

import Flatten from 'flatten-js';

import { Parser } from './models/parser';

// import { Layer } from './models/layer';
// import { Shape } from './models/shape';

let {Point, Segment} = Flatten;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.store.getState();
        this.props.store.subscribe(() => {
            this.setState(this.props.store.getState());
        });

        // this.handlePaste = this.handlePaste.bind.this;
        this.clickOnShape = this.clickOnShape.bind(this);

        // this.showImportFilesPopup = this.showImportFilesPopup.bind(this);
        // this.showDownloadFilesPopup = this.showDownloadFilesPopup.bind(this);
    }
    componentWillMount() {
        this.dispatch = this.props.store.dispatch;
        this.setState(this.props.store.getState());
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.store.getState());
    }

    handlePaste(event) {
        for (let item of event.clipboardData.items) {
            item.getAsString(function(string) {
                // console.log('Pasted: ', string)
            })
        }

        if (this.state.layers.length > 0) {
            let point = new Point(0, 0);
            let seg1 = new Segment(new Point(-10, 0), new Point(10, 0));
            let seg2 = new Segment(new Point(0, -10), new Point(0, 10));

            // let layer = this.state.layers[0];

            let layer = this.state.layers.find((lay) => lay.affected)

            if (!layer) return;

            layer.add(point);
            layer.add(seg1);
            layer.add(seg2);

            // layer.add(new Point(50,0)).on("click", this.clickOnShape);
            // layer.add(new Point(50,50)).on("click", this.clickOnShape);
            // layer.add(new Point(0,50)).on("click", this.clickOnShape);
            // layer.add(new Point(-50,50)).on("click", this.clickOnShape);
            // layer.add(new Point(-50,0)).on("click", this.clickOnShape);

            let parser = new Parser();
            let poly = parser.parseDebugString("123");

            layer.add(poly);

            let box;
            for (let face of poly.faces) {
                box = face.box;
            }

            let center = new Point((box.xmin + box.xmax)/2, (box.ymin + box.ymax)/2);

            // this.dispatch({
            //     type: ActionTypes.PAN_TO_COORDINATE,
            //     x: center.x,
            //     y: center.y
            // })

            this.dispatch({
                type: ActionTypes.PAN_AND_ZOOM_TO_SHAPE,
                x: center.x,
                y: center.y,
                width: box.xmax - box.xmin,
                height: box.ymax - box.ymin
            });
        }
    }

    clickOnShape(event) {
        let shape = event.target;
        this.dispatch({
            type: ActionTypes.PAN_TO_COORDINATE,
            x: shape.geom.x,
            y: shape.geom.y
        })
    }

    render() {
        return (
            <div className="App">
                <HeaderComponent {... this.props } />
                <div className="App-body"
                     onPaste={(e) => this.handlePaste(e)}>
                    <MainComponent {... this.props } />
                    <LayersListComponent {... this.props} />
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