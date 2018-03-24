/**
 * Created by alexanderbol on 21/04/2017.
 */
import React,{Component} from 'react';
export class DisplayCoordsTool extends Component {
    format(num) {
        return (num/this.props.divisor).toFixed(this.props.decimals);
    }
    render() {
        let mainCanvas = this.props.stage.canvas;
        let top = mainCanvas.offsetTop + 10;
        let left = mainCanvas.offsetLeft + 10;
        let x = this.props.stage.C2W_X(this.props.coordX);
        let y = this.props.stage.C2W_Y(this.props.coordY);
        return (
            <div style={{position: 'absolute', top: top, left: left}}>
                <h5 style={{margin:0, padding:3}}>
                    X: {this.format(x)}  Y: {this.format(y)}
                </h5>
            </div>
        )
    }
}
