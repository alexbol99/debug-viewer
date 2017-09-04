/**
 * Created by alexanderbol on 17/04/2017.
 */

import React, { Component } from 'react';

// import { ListGroupItem } from 'react-bootstrap';

import '../App.css';


export class LayerListElement extends Component {
   render() {
         // let style = this.props.layer.displayed ?
         //     styleSheet.displayed : styleSheet.undisplayed;

        let displayed = this.props.layer.displayed ? "Layer-displayed" : "Layer-undisplayed"
        let color = displayed ? this.props.layer.color : "black";
        let alpha = this.props.layer.affected ? 1 : 0;
        return this.props.layer.edited ? (
            <div
                className={`Layer ${displayed}`}
                onClick={this.props.onLayerClicked}
            >
                <input val={this.props.layer.name}/>
            </div>
        ) : (
                <li
                    className={`Layer ${displayed}`}
                    onClick={this.props.onLayerClicked}
                    onDoubleClick={this.props.onLayerDoubleClicked}>

                    <div
                        style={{flex: 2}}
                        onClick={this.props.onAffectedBoxClicked}
                    >
                        <h4 style={{opacity: alpha, color: color}}>
                        V
                        </h4>
                    </div>

                    <h4 style={{flex:8, color: color, }}
                        title={this.props.layer.name}
                        tabIndex='1'
                    >
                        {this.props.layer.name}
                    </h4>

                </li>
            )


    }
}
