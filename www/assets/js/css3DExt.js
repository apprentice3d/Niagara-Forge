///////////////////////////////////////////////////////////////////////////////
// CSS3D & 3D extension
// by Denis Grigor, July 2018
//
///////////////////////////////////////////////////////////////////////////////

let dbg_viewer = null;


class Css3dExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this.viewer = viewer;
        this.tree = null;
        this.cam = null;
        this.previous_camera_pos = null;
        this.getObjectTree = this.getObjectTree.bind(this);
        this.setupUI = this.setupUI.bind(this);
    }

    // Standard Load and Unload

    load() {
        console.log('Css3dExtension.js is loaded!');
        this.viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
            this.getObjectTree);

        return true;
    }
    unload() {
        console.log('Css3dExtension.js is now unloaded!');
    }

    getObjectTree() {
        this.viewer.removeEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
            this.getObjectTree);
        this.tree = this.viewer.model.getData().instanceTree;
        this.cam = this.viewer.getCamera();
        dbg_viewer = this.viewer;

        this.setupUI();

    }

    // Custom methods
    setupUI() {

        let customUI = document.createElement('div');
        customUI.id = "myUI";
        customUI.innerHTML = `
        <div class="element">
            <h4>Alpha</h4>
        </div>
        <div class="element">
            <h4>Beta</h4>
        </div>
        <div class="element">
            <h4>Gamma</h4>
        </div>
        <div class="element">
            <h4>Delta</h4>
        </div>
        <div class="element">
            <h4>Epsylon</h4>
        </div>
        <div  class="element">
        <!--<h4>Epsylon</h4>-->
            <input type="checkbox" id="checker"> Just checking   
        </div>
        `;

        let objectCSS = new THREE.CSS3DObject(customUI);

        objectCSS.rotation.x = Math.PI/2;
        objectCSS.position.z = 40;
        objectCSS.position.y = -70;


        let cssRenderer = new THREE.CSS3DRenderer();
        cssRenderer.setSize(this.viewer.container.clientWidth,
            this.viewer.container.clientHeight);

        cssRenderer.domElement.className = "cssOverlay";

        document.body.appendChild(cssRenderer.domElement);
        let cssScene = new THREE.Scene();
        cssScene.add(objectCSS);


        let updateUI = () => {
            requestAnimationFrame(updateUI);
            cssRenderer.render(cssScene, this.cam);
        };

        updateUI();

    }





}

Autodesk.Viewing.theExtensionManager.registerExtension('Css3dExtension',
    Css3dExtension);