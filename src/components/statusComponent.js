/**
 * Created by alexanderbol on 17/06/2017.
 */
import React, {Component} from 'react';
// import '../App.css';

export class StatusComponent extends Component {
    measurement() {
        let message = ""
        if (this.props.shortestSegment && this.props.distance) {
            let segment = this.props.shortestSegment;
            let dx = segment.end.x - segment.start.x;
            let dy = segment.end.y - segment.start.y;
            let dist = this.props.distance;

            message = "DX=" + this.format(dx) + ",DY=" + this.format(dy) + ",D=" + this.format(dist);
        }
        return message;
    }

    format(num) {
        return (num/this.props.divisor).toFixed(this.props.decimals);
    }

    render() {
        let stage = this.props.stage;
        let coordX = 0;
        let coordY = 0;
        if (stage) {
            coordX = this.format(stage.C2W_X(this.props.coordX));
            coordY = this.format(stage.C2W_Y(this.props.coordY));
        }
        let message = this.measurement();

        return (
            <div className="App-status-bar">
                <div style={{flex: 4, textAlign: "left", marginLeft: 10, padding: 5}}>
                    <h4>
                        {`X: ${coordX} Y: ${coordY}`}
                    </h4>
                </div>

                <div style={{flex: 8, textAlign: "center", marginLeft: 10, padding: 5}}>
                    <h4>
                        {message}
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
