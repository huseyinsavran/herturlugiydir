/**
 * @author hüseyin savran 
 */

THREE.TexturePassAdaptive = function(map, opacity) {

    THREE.Pass.call(this);

    if (THREE.CopyShader === undefined)
        console.error("THREE.TexturePassAdaptive relies on THREE.CopyShader");

    var shader = THREE.CopyShader;

    this.map = map;
    this.opacity = (opacity !== undefined) ? opacity : 1.0;
    this.aspect = 960 / 540; // height / width

    this.uniforms = THREE.UniformsUtils.clone(shader.uniforms);

    this.material = new THREE.ShaderMaterial({

        uniforms: this.uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader,
        depthTest: false,
        depthWrite: false

    });

    this.needsSwap = false;

    //this.camera = new THREE.OrthographicCamera(-1, 1, this.aspect, -this.aspect, 0, 1);
    //this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.scene = new THREE.Scene();
    console.log('camera pos ');
    console.log(this.camera.position);
    this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), null);
    this.quad.frustumCulled = false; // Avoid getting clipped
    //    this.quad.scale.set(1.0, 1.0, this.aspect);
    //this.quad.scale.set(this.aspect, 1.0, 1.0);
    // this.quad.scale.set(this.aspect, 1.0, 1.0);
    this.scene.add(this.quad);

    /*
    tex.repeat.x = 100 / 800;
    tex.repeat.y = 100 / 2000;
    tex.offset.x = ( 300 / 100 ) * tex.repeat.x;
    tex.offset.y = ( 400 / 100 ) * tex.repeat.y;
    */

};

THREE.TexturePassAdaptive.prototype = Object.assign(Object.create(THREE.Pass.prototype), {

    constructor: THREE.TexturePassAdaptive,

    render: function(renderer, writeBuffer, readBuffer, delta, maskActive) {

        var oldAutoClear = renderer.autoClear;
        renderer.autoClear = false;

        this.quad.material = this.material;

        this.uniforms["opacity"].value = this.opacity;
        this.uniforms["tDiffuse"].value = this.map;
        this.material.transparent = (this.opacity < 1.0);

        renderer.render(this.scene, this.camera, this.renderToScreen ? null : readBuffer, this.clear);

        renderer.autoClear = oldAutoClear;
    }

});