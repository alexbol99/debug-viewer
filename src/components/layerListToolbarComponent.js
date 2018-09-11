/**
 * Created by alexanderbol on 17/04/2017.
 */
import React from 'react';
import FontAwesome from 'react-fontawesome';

import '../../public/styles/App.css';
import '@fortawesome/fontawesome-free/css/all.css';

export const LayerListToolbarComponent = (props) => {
    return (
        <div className="App-toolbar">
            <button title="Add layer" onClick={props.onAddLayerButtonClicked}>
                {/*<img src={icon_add} alt="add_layer" />*/}
                <FontAwesome
                    name='plus'
                    size='2x'
                    style={{color: "grey"}}
                />
            </button>
            <button title="Edit selected layer's name and info" onClick={props.onEditLayerButtonClicked}>
                {/*<img src={icon_edit} alt="edit_layer" />*/}
                <FontAwesome
                    name='pencil-alt'
                    size='2x'
                    style={{color: "grey"}}
                />
            </button>
            <button title="Delete selected layer" onClick={props.onDeleteLayerButtonClicked}>
                {/*<img src={icon_delete} alt="add_layer" />*/}
                <FontAwesome
                    name='times'
                    size='2x'
                    style={{color: "grey"}}
                />
            </button>
            <button title="Sort layer list" onClick={props.onSortLayersButtonClicked}>
                {/*<img src={icon_sort} alt="toggle_sorting_layer_list" />*/}
                <FontAwesome
                    name='sort-alpha-down'
                    size='2x'
                    style={{color: "grey"}}
                />
            </button>
        </div>
    )
};
