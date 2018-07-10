///////////////////////////////////////////////////////////////////////////////
// CameraControl extension
// by Denis Grigor, July 2018
//
///////////////////////////////////////////////////////////////////////////////

class CameraControlExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this.viewer = viewer;
        this.tree = null;
        this.camera = null;

        this.widget = null;
        this.infoX = null;
        this.infoY = null;
        this.infoZ = null;
        this.infoDistance = null;

        this.processCamera = this.processCamera.bind(this);
        this.customize = this.customize.bind(this);

    }

    load() {
        console.log('CameraControlExtension is loaded!');
        this.viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
            this.customize);

        this.viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT,
            this.processCamera);

        return true;
    }
    unload() {
        console.log('CameraControlExtension is now unloaded!');
        this.viewer.removeEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT,
            this.processCamera());
        return true;
    }

    customize() {
        this.viewer.removeEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
            this.customize);

        //Start coding here ...
        this.camera = this.viewer.getCamera();

        this.widget = document.createElement('div');
        this.widget.id = "simpleWidget";
        this.widget.style.cssText = `
            position: absolute;
            right: 50%;
            bottom: 50%;
            width: 170px;
            height: 250px;
            z-index: 2;
            border: 2px solid #ccc;
            background-color: #ffffff;
            border-radius: 5px;
            padding: 10px;
            display: none;
            `;

        this.widget.innerHTML = `
        <p>Camera X: <span id="infoX"></span></p>
        <p>Camera Y: <span id="infoY"></span></p>
        <p>Camera Z: <span id="infoZ"></span></p>
        <hr/>
        <p>Distance to pivot: <span id="infoDistance"></span></p>
        `;

        document.body.appendChild(this.widget);
        this.infoX = document.getElementById("infoX");
        this.infoY = document.getElementById("infoY");
        this.infoZ = document.getElementById("infoZ");
        this.infoDistance = document.getElementById("infoDistance");

    }

    processCamera() {
        if (this.camera) {

            let distance = this.camera.position.distanceTo(this.camera.pivot);
            console.log("Distance Cam to pivot = ", distance);

            this.infoX.innerText = this.camera.position.x;
            this.infoY.innerText = this.camera.position.y;
            this.infoZ.innerText = this.camera.position.z;
            this.infoDistance.innerText = distance;

            // Restrict camera to not go underground - the simplest version
            if(this.camera.position.z <0 ) {
                this.camera.position.z = 0;
            }


            // add a small scale to the widget
            this.widget.style.transform = `scale(${(1-distance/100)})`;


            if (distance < 60) {
                this.widget.style.display = 'initial';
                if (distance < 30) {
                    this.widget.style.border = "5px solid #ffaa00";
                } else {
                    this.widget.style.border = "2px solid #ccc";
                }
            } else {
                this.widget.style.display = 'none';
            }


        }
    }

}

Autodesk.Viewing.theExtensionManager.registerExtension('CameraControlExtension',
    CameraControlExtension);