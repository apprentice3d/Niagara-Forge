///////////////////////////////////////////////////////////////////////////////
// Template extension to be used as a reference for extension development
// by Denis Grigor, July 2018
//
///////////////////////////////////////////////////////////////////////////////

class CategoryExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this.viewer = viewer;
        this.tree = null;

        this.infoName = null;
        this.infoParent = null;
        this.infoId = null;

        this.doorList = null;
        this.addDoorButton = null;

        //just some starting data
        this.categoryDict = {
            "Windows": [798],
            "Doors": [{
                "id": 171,
                "name": "Int. Simple=>PP (0.83m x 2.04m)"
            }, {
                "id": 176,
                "name": "Int. Simple=>PP (0.83m x 2.04m)"
            }, {
                "id": 211,
                "name": "Int. Simple=>PP (0.83m x 2.04m)"
            }],
            "Rooms": []
        };

        this.getObjectTree = this.getObjectTree.bind(this);
        this.processSelection = this.processSelection.bind(this);
        this.findNodeNameById = this.findNodeNameById.bind(this);

        this.setupUI = this.setupUI.bind(this);
        this.addDoorToList = this.addDoorToList.bind(this);
        this.updateListUI = this.updateListUI.bind(this);


    }

    load() {
        console.log('CategoryExtension is loaded!');
        this.viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
            this.getObjectTree);
        this.viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT,
            this.processSelection);

        this.setupUI();


        return true;
    }


    setupUI() {



        // info panel part
        let infoPanel = document.createElement('div');
        infoPanel.id = "infoPanel";
        infoPanel.className = "infoPanel";
        infoPanel.style.cssText = `
            right: 15px;
            bottom: 55px;
            min-width: 120px;
            `;


        infoPanel.innerHTML = `
        <h4 style='text-align: center;'>Selection:</h4>
        <p>ID: <span id="infoId"></span></p>
        <p>Name: <span id="infoName"></span></p>
        <p>Parent: <span id="infoParent"></span></p>
        <hr>
        <p>Add to following list:</p>
            <button id="addDoor"> Door</button>
            <button id="addWindow">Window</button>
            <button id="addWall">Wall</button>
        `;

        document.body.appendChild(infoPanel);
        this.infoName = document.getElementById("infoName");
        this.infoParent = document.getElementById("infoParent");
        this.infoId = document.getElementById("infoId");
        this.addDoorButton = document.getElementById("addDoor");
        this.addDoorButton.onclick = this.addDoorToList;



        // door category panel part
        let doorPanel = document.createElement('div');
        doorPanel.id = "doorPanel";
        doorPanel.className = "infoPanel";
        doorPanel.style.cssText = `
            right: 15px;
            top: 155px;
            min-width: 120px;
            // max-height: 200px;
            `;


        doorPanel.innerHTML = `
        <h4 style='text-align: center;'>Door list</h4>
        <hr>
            <div style="max-height: 150px; overflow-y: scroll">
                <ul id="doorList" style="list-style-type: none; padding-left: 0;">
                </ul>
            </div>
        <hr>
        <a id="exporter">Export structure</a>
        `;

        document.body.appendChild(doorPanel);
        this.doorList = document.getElementById("doorList");

        this.exportButton = document.getElementById("exporter");
        this.exportButton.style.cssText = `
            text-decoration: none; font: menu;
            display: inline-block; padding: 2px 8px;
            background: ButtonFace; color: ButtonText;
            border-style: solid; border-width: 2px;
            border-color: ButtonHighlight ButtonShadow ButtonShadow ButtonHighlight;
        `;
        this.exportButton.setAttribute("download", "categories.json");
        this.exportButton.onclick = () => {
            // let file = new Blob(JSON.stringify(this.categoryDict), {type:'text/json'});

            let data = "data:text/json," + encodeURIComponent(JSON.stringify((this.categoryDict)));
            this.exportButton.href = data;
        }


        this.updateListUI();

    }




    unload() {
        console.log('CategoryExtension is now unloaded!');
        this.viewer.removeEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT,
            this.processSelection);

        return true;
    }

    processSelection(event) {
        let nodeData = {};
        if (event.nodeArray.length !== 0) {
            let selectedNode = event.nodeArray[0];
            nodeData.ID = selectedNode;
            nodeData.Name = this.findNodeNameById(selectedNode);
            nodeData.Parent = this.findNodeNameById(this.tree.getNodeParentId(selectedNode));

            console.log(nodeData);
            this.infoName.innerText = nodeData.Name;
            this.infoParent.innerText = nodeData.Parent;
            this.infoId.innerText = nodeData.ID;

        }

    }

    findNodeIdbyName(name) {
        let nodeList = Object.values(this.tree.nodeAccess.dbIdToIndex);
        for (let i = 1, len = nodeList.length; i < len; ++i) {
            let node_name = this.tree.getNodeName(nodeList[i]);
            if (node_name === name) {
                return nodeList[i];
            }
        }
        return null;
    }

    findNodeNameById(nodeId) {
        return this.tree.getNodeName(nodeId);
    }



    getObjectTree() {
        this.viewer.removeEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
            this.getObjectTree);
        this.tree = this.viewer.model.getData().instanceTree;

    }


    addDoorToList() {
        let currentlySelectedNode = this.viewer.getSelection()[0];
        let nodeName = this.tree.getNodeName(currentlySelectedNode);
        let parent = this.findNodeNameById(this.tree.getNodeParentId(currentlySelectedNode));
        let recorded_name = `${(nodeName)}=>${(parent)}`;
        // TODO: this can be overriden, by giving the option of setting the name
        this.categoryDict["Doors"].push({
            "id": currentlySelectedNode,
            "name" : recorded_name
        });

        //updated UI
        let newDoor = document.createElement("li");
        newDoor.appendChild(document.createTextNode(`[${(currentlySelectedNode)}] ${(recorded_name)}` ));
        newDoor.id = currentlySelectedNode;
        newDoor.onclick = (event) => {this.viewer.select(parseInt(event.target.id))};
        this.doorList.appendChild(newDoor)
    }

    updateListUI() {
        this.categoryDict.Doors.forEach( (door) => {
            let newDoor = document.createElement("li");
            newDoor.id = door.id;
            newDoor.appendChild(document.createTextNode(`[${(door.id)}] ${(door.name)}` ));
            newDoor.onclick = (event) => {
                this.viewer.select(parseInt(event.target.id));
                console.log("clicked: ", event.target.id);
            };
            this.doorList.appendChild(newDoor)
        })

    }

}

Autodesk.Viewing.theExtensionManager.registerExtension('CategoryExtension',
    CategoryExtension);