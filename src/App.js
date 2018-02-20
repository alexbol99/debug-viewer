import React, {Component} from 'react';
// import logo from './logo.svg';
import '../public/styles/App.css';

import {HeaderComponent} from './components/headerComponent';
import {MainComponent} from './components/mainComponent';
import {LayersListComponent} from './components/layersListComponent';
import {AsideComponent} from './components/asideComponent';

import * as ActionTypes from './actions/action-types';

export class App extends Component {
    constructor(props) {
        super(props);
        this.state = this.props.store.getState();
        this.props.store.subscribe(() => {
            this.setState(this.props.store.getState());
        });
        this.handlePaste = this.handlePaste.bind(this);
        this.handleHashChange = this.handleHashChange.bind(this);
    }

    handlePaste(event) {
        this.props.store.dispatch({
            type: ActionTypes.DATA_FROM_BUFFER_PASTED,
            data: event.clipboardData
        });
    }

    handleHashChange(event) {
        this.props.store.dispatch({
            type: ActionTypes.WINDOW_HASH_CHANGED,
            stage: this.state.stage
        });
    }

    componentWillMount() {
        // this.dispatch = this.props.store.dispatch;
        this.setState(this.props.store.getState());
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.store.getState());
    }

    componentDidMount() {
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
                    <AsideComponent {...this.props} />
                </div>
            </div>
        );
    }
}

// export default App;

/*
 <div className="App">
 <div className="App-header">
 <h2>Debug Viewer</h2>
 </div>

 </div>
*/

/*
 <img src={logo} className="App-logo" alt="logo" />
 */