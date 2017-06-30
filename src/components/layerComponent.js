/**
 * Created by alexanderbol on 21/04/2017.
 */

import React, {Component} from 'react';
// import createjs from 'easel-js';
import { PolygonTool } from '../tools/polygonTool';
import '../App.css';

class ShapesContainer extends Component {
    render() {
        return null
    }
}
export class LayerComponent extends Component {
    componentWillMount() {
    }

    componentDidMount() {
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    componentDidUpdate() {
        // for (let shape of this.props.layer.shapes) {
        //     shape.alpha = this.props.layer.displayed ? 1 : 0;
        //     shape.redraw();
        // }
    }

    componentWillUnmount() {

    }

    render() {
        let displayed = this.props.layer.displayed;
        return (
            <ShapesContainer>
                {
                    [...this.props.layer.shapes].map( (shape, index) => {
                        <PolygonTool
                            key={index}
                            polygon={shape}
                            displayed={displayed}
                        />
                    })
                }
            </ShapesContainer>
        )
    }
}
