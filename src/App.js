import React, {Component} from 'react';
import '../public/styles/App.css';

class App extends Component {
    constructor() {
        super();
        this.state = {
            seconds: 7
        }
    }
    componentDidMount() {
        setInterval( () => {
            if (this.state.seconds == 1) {
                window.location.href = "https://debugviewer.com";
            }
            this.setState({seconds: this.state.seconds - 1})
        }, 1000);
    }

    render() {
        return (
            <div className="App">
                <h4>You will be redirected in {this.state.seconds} seconds</h4>
                <h4>to the new version of the Debug Viewer</h4>
            </div>
        );
    }
}

export default App;
