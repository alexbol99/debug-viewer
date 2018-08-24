import React, {Component} from 'react';
import '../public/styles/App.css';

import {HeaderComponent} from './components/headerComponent';
import {MainComponent} from './components/mainComponent';
import {LayersListComponent} from './components/layersListComponent';
import {AsideComponent} from './components/asideComponent';

import * as ActionTypes from './actions/action-types';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.store.getState();
        this.props.store.subscribe(() => {
            this.setState(this.props.store.getState());
        });
    }

    handlePaste = (event) => {
        this.props.store.dispatch({
            type: ActionTypes.DATA_FROM_BUFFER_PASTED,
            data: event.clipboardData
        });
    };

    handleHashChange = (event) => {
        this.props.store.dispatch({
            type: ActionTypes.WINDOW_HASH_CHANGED,
            stage: this.state.stage
        });
    };

    componentWillMount() {
        // this.dispatch = this.props.store.dispatch;
        this.setState(this.props.store.getState());
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.store.getState());
    }

    componentDidMount(e) {
        window.onhashchange = this.handleHashChange;
    }

    render() {
        return (
            <div className="App">
                <HeaderComponent {...this.props} />
                <div className="App-body" onPaste={this.handlePaste}>
                    <MainComponent {...this.props} />
                    <LayersListComponent
                        dispatch={this.props.store.dispatch}
                        stage={this.state.stage}
                        layers={this.state.layers}
                    />
                    <AsideComponent />
                </div>
            </div>
        );
    }
}

export default App;

// TODO: Fix bug when Point2PointMeasurementTool is not released
// TODO: Fix bug (?) with display circle