import React from 'react';
import {render} from 'react-dom';
import ViewerComponent from './components/viewerComponent';
import './viewer_extensions/transExploreExt'

class MainUI extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {title} = this.props;
        return (
            <div>
                <h2 style={{textAlign:'center'}}>{title}</h2>
                    <ViewerComponent viewerID="myViewer" extensions={['TransExplorerExtension']}/>
            </div>
        )
    }
}

render(<MainUI title="Viewer in React example"/>, document.getElementById("root"));
