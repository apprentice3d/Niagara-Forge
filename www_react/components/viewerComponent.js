import React, {Component} from 'react';


class ViewerComponent extends Component {
    constructor(props) {
        super(props);
        let id = this.props.viewerID;
        let extensionList = this.props.extensions || [];
        console.log(extensionList);
        this.state = {
            viewerID: id,
            extensionList: extensionList
        }
    }

    componentDidMount() {

        const {viewerID, extensionList} = this.state;
        console.log("Received: ", );



        var viewerApp;
        let viewer = null;
        let tree = null;
        var options = {
            env: 'AutodeskProduction',
            getAccessToken: function (onGetAccessToken) {
                var token_fetcher = 'https://9irt90dm6j.execute-api.us-east-1.amazonaws.com/prod';
                var xmlHttp = new XMLHttpRequest();
                xmlHttp.open("GET", token_fetcher, false);
                xmlHttp.send(null);
                var data = JSON.parse(xmlHttp.responseText);

                var accessToken = data["access_token"];
                var expireTimeSeconds = data["expires_in"];
                onGetAccessToken(accessToken, expireTimeSeconds);
            },
            useADP: false,

        };
        var documentId = 'urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bmlhZ2FyYS1wb2MvQk9mZmljZV9uZXdfUm9vbXMubndk';
        Autodesk.Viewing.Initializer(options, function onInitialized() {
            viewerApp = new Autodesk.Viewing.ViewingApplication(viewerID);
            let config3d = {
                extensions: extensionList
            };
            viewerApp.registerViewer(viewerApp.k3D, Autodesk.Viewing.Private.GuiViewer3D, config3d);
            viewerApp.loadDocument(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
            viewer = viewerApp.getCurrentViewer();
        });

        function onDocumentLoadSuccess(doc) {

            // We could still make use of Document.getSubItemsWithProperties()
            // However, when using a ViewingApplication, we have access to the **bubble** attribute,
            // which references the root node of a graph that wraps each object from the Manifest JSON.
            var viewables = viewerApp.bubble.search({
                'type': 'geometry'
            });
            if (viewables.length === 0) {
                console.error('Document contains no viewables.');
                return;
            }

            // Choose any of the avialble viewables
            viewerApp.selectItem(viewables[0].data, onItemLoadSuccess, onItemLoadFail);
        }

        function onDocumentLoadFailure(viewerErrorCode) {
            console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
        }

        function onItemLoadSuccess(active_viewer, item) {
            console.log('Document loaded successfully');
            // active_viewer.loadExtension("NiagaraExtension");
            // active_viewer.loadExtension("MarkUp3DExtension");
        }

        function onItemLoadFail(errorCode) {
            console.error('onItemLoadFail() - errorCode:' + errorCode);
        }
    }

    render() {
        const {viewerID} = this.state;
        console.log(viewerID);
        return (
            <div id={viewerID} className="ForgeViewer"/>
        )
    }
}


export default ViewerComponent;