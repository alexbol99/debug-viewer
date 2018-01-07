/**
 * Created by alexanderbol on 17/04/2017.
 */

import React, {Component} from 'react';
import FontAwesome from 'react-fontawesome';

// import icon_add from '../../public/icons/Add.png';
// import icon_edit from '../../public/icons/Delete.png';
// import icon_delete from '../../public/icons/Delete.png';
// import icon_sort from '../../public/icons/Delete.png';

import '../../public/styles/App.css';

export class LayerListToolbarComponent extends Component {
    constructor() {
        super();
        this.openJobButtonClicked = this.openJobButtonClicked.bind(this);
        this.notImplemented = this.notImplemented.bind(this);
    }

    openJobButtonClicked() {
        document.getElementById("browseFiles").click();
    }

    notImplemented() {
        alert("Not implemented yet")
    }

    render() {
        return (
            <div className="App-toolbar">
                <button title="Add layer" onClick={this.props.onAddLayerButtonClicked}>
                    {/*<img src={icon_add} alt="add_layer" />*/}
                    <FontAwesome
                        name='plus'
                        size='2x'
                        style={{color:"grey"}}
                    />
                </button>
                <button title="Edit selected layer's name and info" onClick={this.props.onEditLayerButtonClicked}>
                    {/*<img src={icon_edit} alt="edit_layer" />*/}
                    <FontAwesome
                        name='pencil'
                        size='2x'
                        style={{color:"grey"}}
                    />
                </button>
                <button title="Delete selected layer" onClick={this.props.onDeleteLayerButtonClicked}>
                    {/*<img src={icon_delete} alt="add_layer" />*/}
                    <FontAwesome
                        name='times'
                        size='2x'
                        style={{color:"grey"}}
                    />
                </button>
                <button title="Sort layer list" onClick={this.props.onSortLayersButtonClicked}>
                    {/*<img src={icon_sort} alt="toggle_sorting_layer_list" />*/}
                    <FontAwesome
                        name='sort-alpha-asc'
                        size='2x'
                        style={{color:"grey"}}
                    />
                </button>
            </div>
        )
    }
};
