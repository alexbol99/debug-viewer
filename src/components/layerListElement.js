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

    rgba(hex,opacity){
        let r,g,b, percent;
        if (hex) {
            hex = hex.replace('#', '');
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
            percent = opacity;
        }
        else {
            r = 147;
            g = 128;
            b = 108;
            percent = 0;
        }
        let result = `rgba(${r},${g},${b},${percent / 100})`;

        return result;
    }

    render() {
         // let style = this.props.layer.displayed ?
         //     styleSheet.displayed : styleSheet.undisplayed;

        let displayed = this.props.layer.displayed ? "Layer-displayed" : "Layer-undisplayed";
        let color = displayed ? this.rgba(this.props.layer.color,100) : this.rgba();
        let bgcolor = displayed ? this.rgba(this.props.layer.color,30) : this.rgba();
        let alpha = this.props.layer.affected ? 1 : 0;
        let layerNameOpacity = this.props.layer.shapes.length === 0 ? 0.6 : 1.0;
        return [
            <li key={1}
                className={`Layer ${displayed}`}
                onClick={this.props.onLayerClicked}
                onDoubleClick={this.props.onLayerDoubleClicked}>

                <div
                    style={{flex: 2, marginRight: 3}}
                    onClick={this.props.onAffectedBoxClicked}
                >
                    <h4 style={{opacity: alpha, color: color,
                        width: 16, marginLeft: 2, cursor: "default"
                    }}>
                        ✓
                    </h4>
                </div>

                <div style={{flex: 8, cursor: "default", padding: 3,
                    backgroundColor: bgcolor, opacity: layerNameOpacity }}>
                    <h4 ref="layerName"
                        title={this.props.layer.name}
                        tabIndex='1'
                    >
                        {this.props.layer.name}
                    </h4>
                </div>

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