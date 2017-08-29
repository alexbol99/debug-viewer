/**
 * Created by alexanderbol on 17/06/2017.
 */
import React, {Component} from 'react';
// import '../App.css';

export class StatusComponent extends Component {
    render() {
        return (
            <div className="App-status-bar">
                <div style={{flex: 4, textAlign: "left", marginLeft: 10, padding: 5}}>
                    <h4>
                        {`X: ${this.props.coordX} Y: ${this.props.coordY}`}
                    </h4>
                </div>

                <div
                    style={{flex: 4, textAlign: "right", marginRight: 10, padding: 5}}
                    onClick={this.props.onUnitClicked}
                >
                    <h4>
                        {`Units: ${this.props.units}`}
                    </h4>
                </div>
            </div>
        )
    }
}
