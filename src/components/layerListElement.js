/**
 * Created by alexanderbol on 17/04/2017.
 */

import React, { Component } from 'react';
// import logo from './logo.svg';
import '../App.css';


export class LayerListElement extends Component {
   render() {
         // let style = this.props.layer.displayed ?
         //     styleSheet.displayed : styleSheet.undisplayed;

        let displayed = this.props.layer.displayed ? "Layer-displayed" : "Layer-undisplayed"
        let alpha = this.props.layer.affected ? 1 : 0.5;
        return this.props.layer.edited ? (
            <div
                className={`Layer ${displayed}`}
                onClick={this.props.onLayerClicked}
            >
                <input val={this.props.layer.name}/>
            </div>
        ) : (
                <div
                    className={`Layer ${displayed}`}
                    onClick={this.props.onLayerClicked}
                    onDoubleClick={this.props.onLayerDoubleClicked}
                >
                    <h4
                        style={{flex:8}}
                    >
                        {this.props.layer.name}
                    </h4>
                    <h4
                        onClick={this.props.onAffectedBoxClicked}
                        style={{flex: 2, opacity: alpha}}
                    >
                        V
                    </h4>
                </div>
            )


    }
}
