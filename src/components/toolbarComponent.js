/**
 * Created by alexanderbol on 17/04/2017.
 */

import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';

// import open from '../../public/icons/Browse.png';
// import home from '../../public/icons/homeIcon20x20.png';
// import pan from '../../public/icons/handDrag20.png';
import measureShapes from '../../public/icons/measureContour.png';
import measurePoints from '../../public/icons/measurePoints.png';
import width from '../../public/icons/WidthOn.png';
import vertices from '../../public/icons/editContourVertextOnOff.png';
// import label from '../../public/icons/label_icon.png';
// import setting from '../../public/icons/Setting.png';
// import about from '../../public/icons/About.png';

import '../../public/styles/App.css';

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
                    {/*<img src={open} alt="open" />*/}
                    <FontAwesome
                        name='folder-open-o'
                        size='2x'
                        style={{color:"grey"}}
                    />
                </button>

                <input style={{fontSize: 16, marginTop: 5, marginBottom: 5, display: "none"}}
                       type="file" id="browseFiles" name="files[]" multiple
                       onChange={this.props.onFileSelected}
                />

                <button title="Zoom and pan to home view" onClick={this.props.onHomeButtonPressed}>
                    {/*<img src={home} alt="home" />*/}
                    <FontAwesome
                        name='home'
                        size='2x'
                        style={{color:"grey"}}
                    />
                </button>
                <button title="Pan by drag" onClick={this.props.onPanByDragPressed}>
                    {/*<img src={pan} alt="panByDrag" />*/}
                    <FontAwesome
                        name='arrows'
                        size='2x'
                        style={{color:"grey"}}
                    />
                </button>
                <button title="Measure distance between points" onClick={this.props.onMeasurePointsButtonPressed}>
                    <img src={measurePoints} alt="measurePoints" />
                </button>
                <button title="Measure distance between shapes" onClick={this.props.onMeasureBetweenShapesButtonPressed}>
                    <img src={measureShapes} alt="measureShapes" />
                </button>
                <button title="Display solid or wire" onClick={this.props.onToggleWidthModePressed}>
                    <img src={width} alt="width" />
                </button>
                <button title="Display vertices on/off" onClick={this.props.onToggleVerticesPressed}>
                    <img src={vertices} alt="vertices" />
                </button>
                <button title="Display labels on/off" onClick={this.props.onToggleLabelsPressed}>
                    {/*<img src={label} alt="labels" />*/}
                    <FontAwesome
                        name='tag'
                        size='2x'
                        style={{color:"grey"}}
                    />
                </button>
                {/*<button title="Settings" onClick={this.notImplemented}>*/}
                    {/*<img src={setting} alt="setting" />*/}
                {/*</button>*/}
                {this.props.aabbDemoToolActivated ? (
                    <button title="AABB Tree Demo" onClick={this.props.onAabbToolNext}>
                        <FontAwesome
                            name='tree'
                            size='2x'
                            style={{color: "grey"}}
                        />
                    </button>
                ) : null}

                {this.props.showCollisionDemoToolButton ? (
                    <button title="Collision Distance Demo" onClick={this.props.onCollisionDemoButtonPressed}>
                        <FontAwesome
                            name='arrows-h'
                            size='2x'
                            style={{color: "grey"}}
                        />
                    </button>
                ) : null}

                <button title="About" onClick={this.props.onShowAboutPopupPressed}>
                    {/*<img src={about} alt="about" />*/}
                    <FontAwesome
                        name='info'
                        size='2x'
                        style={{color:"grey"}}
                    />
                </button>

                <button>
                    <FontAwesome
                        name='ellipsis-v'
                        size='2x'
                        style={{color:"white"}}
                    />
                </button>

                <span style={{position:"relative", top:-3}}>
                    Units:
                </span>
                <button
                    style={{position:"relative", top:-3}}
                    onClick={this.props.onUnitClicked}
                >
                    <h3>{this.props.units}</h3>
                </button>
            </div>
        )
    }
};
