/**
 * Created by alexanderbol on 17/04/2017.
 */

import React, { Component } from 'react';
import '../../public/styles/App.css';
import {Modal} from "../components/modalPopupComponent";
import {LayerEditForm} from "../forms/layerEditForm";

export class LayerListElement extends Component {
    componentDidUpdate() {
        if (document.activeElement.nodeName === "CANVAS")
            return;
        let elem = this.refs.layerName;
        if (this.props.layer.affected) {
            elem.focus();
        }
    }

    render() {
         // let style = this.props.layer.displayed ?
         //     styleSheet.displayed : styleSheet.undisplayed;

        let displayed = this.props.layer.displayed ? "Layer-displayed" : "Layer-undisplayed"
        let color = displayed ? this.props.layer.color : "black";
        let alpha = this.props.layer.affected ? 1 : 0;
        return [
            <li key={1}
                className={`Layer ${displayed}`}
                onClick={this.props.onLayerClicked}
                onDoubleClick={this.props.onLayerDoubleClicked}>

                <div
                    style={{flex: 2, marginRight: 3}}
                    onClick={this.props.onAffectedBoxClicked}
                >
                    <h4 style={{
                        opacity: alpha, color: color, border: "1px solid black",
                        width: 16, cursor: "default"
                    }}>
                        ✓
                    </h4>
                </div>

                <h4 ref="layerName"
                    style={{flex: 8, color: color}}
                    title={this.props.layer.name}
                    tabIndex='1'
                >
                    {this.props.layer.name}
                </h4>

            </li>,
            this.props.layer.edited ? (
            <Modal key={2}>
                <LayerEditForm
                    layer={this.props.layer}
                    onSubmitLayerEditForm={this.props.onSubmitLayerEditForm}
                    onEscapeLayerEditForm={this.props.onEscapeLayerEditForm}
                />
            </Modal>) : null]
    }
}
/*
this.props.layer.edited ? (

            <div
                className={`Layer ${displayed}`}
                onClick={this.props.onLayerClicked}
            >
                <input val={this.props.layer.name}/>
            </div>
        ) : (
 */