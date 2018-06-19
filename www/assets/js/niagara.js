///////////////////////////////////////////////////////////////////////////////
// Niagara extension
// by Denis Grigor, April 2018
//
///////////////////////////////////////////////////////////////////////////////

class NiagaraExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this.viewer = viewer;
        this.tree = null;

        this.customize = this.customize.bind(this);
    }

    load() {
        console.log('NiagaraExtension is loaded!');
        this.viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
            this.customize);

        return true;
    }
    unload() {
        console.log('NiagaraExtension is now unloaded!');

        return true;
    }

    customize() {
        this.viewer.removeEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT,
            this.customize)

        //Start coding here ...
        this.viewer.setTheme("light-theme");
        this.viewer.setLightPreset(7);

        const perefered_state = `{"seedURN":"dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bmlhZ2FyYS1wb2MvQlRJQl9vZmZpY2UucnZ0","objectSet":[{"id":[],"isolated":[],"hidden":[3901,3151,370],"explodeScale":0,"idType":"lmv"}],"viewport":{"name":"","eye":[67.43053123752978,-59.62952441474627,39.90054465754402],"target":[22.925590526563695,-12.744087811184427,2.289543370719744],"up":[-0.346216467887204,0.3647350158638663,0.8643509273243675],"worldUpVector":[0,0,1],"pivotPoint":[-3.0918644810023324,-2.059913967870152,6.711115319939665],"distanceToOrbit":94.74626892536052,"aspectRatio":2.962962962962963,"projection":"perspective","isOrthographic":false,"fieldOfView":45},"renderOptions":{"environment":"Boardwalk","ambientOcclusion":{"enabled":true,"radius":10,"intensity":0.4},"toneMap":{"method":1,"exposure":-7,"lightMultiplier":-1e-20},"appearance":{"ghostHidden":true,"ambientShadow":true,"antiAliasing":true,"progressiveDisplay":true,"swapBlackAndWhite":false,"displayLines":true,"displayPoints":true}},"cutplanes":[]}`;
        this.viewer.restoreState(JSON.parse(perefered_state));
        this.viewer.disableSelection(true);
        this.viewer.disableHighlight(true);
    }

}

Autodesk.Viewing.theExtensionManager.registerExtension('NiagaraExtension',
    NiagaraExtension);