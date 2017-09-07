/**
 * Created by alexanderbol on 17/04/2017.
 */

import React, {Component} from 'react';

// import { ButtonToolbar, Button } from 'react-bootstrap';
import logo from '../logo.svg';

import open from '../../public/icons/Browse.png';
import home from '../../public/icons/homeIcon20x20.png';
import width from '../../public/icons/WidthOn.png';
import measureContour from '../../public/icons/measureContour.png';
import measurePoints from '../../public/icons/measurePoints.png';
import setting from '../../public/icons/Setting.png';
import about from '../../public/icons/About.png';

import '../App.css';
import { ReadFilesComponent } from '../components/readFilesComponent';

export class ToolbarComponent extends Component {
    constructor() {
        super();
        this.openJobButtonClicked = this.openJobButtonClicked.bind(this);
        this.notImplemented = this.notImplemented.bind(this);
    }

    openJobButtonClicked() {
        document.getElementById("browseFiles").click();
    }

    notImplemented() {
        alert("Not implemented yet")
    }
    render() {
        return (
            <div className="App-toolbar">
                {/*<h4>Toolbar</h4>*/}
                <button title="Open file" onClick={this.openJobButtonClicked}>
                    <img src={open} alt="open" />
                </button>

                <ReadFilesComponent
                    store={this.props.store}
                />
                <button title="Zoom and pan to home view"
                        onClick={this.props.onHomeButtonPressed}>
                    <img src={home} alt="home" />
                </button>
                <button title="Width on/off" onClick={this.props.onToggleWidthModePressed}>
                    <img src={width} alt="width" />
                </button>
                <button title="Distance between points" onClick={this.notImplemented}>
                    <img src={measurePoints} alt="measurePoints" />
                </button>
                <button title="Distance between contours" onClick={this.notImplemented}>
                    <img src={measureContour} alt="measureContour" />
                </button>
                <button title="Settings" onClick={this.notImplemented}>
                    <img src={setting} alt="setting" />
                </button>
                <button title="About" onClick={this.notImplemented}>
                    <img src={about} alt="about" />
                </button>
            </div>
        )
    }
};

/*
            <ButtonToolbar className="App-toolbar">
                <Button>
                    <img src={setting} style={{height:20}} alt="setting" />
                </Button>
                <Button>
                    <img src={width} style={{height:20}} alt="width on/off" />
                </Button>
                <Button>
                    <img src={about} style={{height:20}} alt="about" />
                </Button>
            </ButtonToolbar>

 */
/*
 <button
 className="Button-select-feature"
 onClick={this.props.buttonClicked} />
 <button
 className="Button-drag"
 onClick={this.props.buttonClicked} />
 <button
 className="Button-zoom-area"
 onClick={this.props.buttonClicked} />
 <button
 className="Button-home"
 onClick={this.props.buttonClicked} />
 <button
 className="Button-pan-to-coordinated"
 onClick={this.props.buttonClicked} />
 <button
 className="Button-measure-between-points"
 onClick={this.props.buttonClicked} />
 <button
 className="Button-measure-between-features"
 onClick={this.props.buttonClicked} />



 */