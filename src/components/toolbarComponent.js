/**
 * Created by alexanderbol on 17/04/2017.
 */

import React, {Component} from 'react';

// import { ButtonToolbar, Button } from 'react-bootstrap';
import logo from '../logo.svg';
import setting from '../../public/icons/Setting.png';
import about from '../../public/icons/About.png';
import home from '../../public/icons/homeIcon20x20.png';
import width from '../../public/icons/WidthOff.png';

import '../App.css';


export class ToolbarComponent extends Component {

    render() {
        return (
            <div className="App-toolbar">
                <h4>Toolbar</h4>
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