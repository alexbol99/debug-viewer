/**
 * Created by alexanderbol on 17/04/2017.
 */

import React, {Component} from 'react';
import '../App.css';


export class ToolbarComponent extends Component {

    render() {
        return (
            <div className="App-toolbar">
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


            </div>
        )
    }
};
