/**
 * @author hüseyin savran / http://alteredqualia.com/
 */

THREE.ShaderPassAdaptive = function(shader, textureID, width, height) {
    THREE.Pass.call(this)
    this.aspect = 960 / 540; // height / width

    this.textureID = textureID !== undefined ? textureID : 'tDiffuse';

    if (shader instanceof THREE.ShaderMaterial) {
        this.uniforms = shader.uniforms;

        this.material = shader;

    } else if (shader) {
        this.uniforms = THREE.UniformsUtils.clone(shader.uniforms);

        this.material = new THREE.ShaderMaterial({
            defines: Object.assign({}, shader.defines),
            uniforms: this.uniforms,
            vertexShader: shader.vertexShader,
            fragmentShader: shader.fragmentShader
        })
    }

    //this.camera = new THREE.OrthographicCamera(-1, 1, this.aspect, -this.aspect, 0, 1);
    //this.camera = new THREE.OrthographicCamera(-1.77, 1.77, 1, -1, 0, 1);
    this.camera = new THREE.OrthographicCamera(-0.5, 0.5, 1.77 / 2, -1.77 / 2, 0, 1);
    //this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    //this.camera.position.set(0.0, 1.0, 0.0);
    //console.log(this.camera.position);
    this.scene = new THREE.Scene();

    this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), null);
    this.quad.frustumCulled = false; // Avoid getting clipped

    // this.quad.position.set(0.0, -1.0, 0.0);
    //this.quad.scale.set(1.0, 1.0, this.aspect);
    //this.quad.scale.set(this.aspect, 1.0, 1.0);;
    //    this.quad.scale.set(1.0, 1.0, this.aspect);
    this.quad.scale.set(1.0, this.aspect, 1.0);
    //console.log(this.quad.position);
    console.log(this.quad.scale);
    this.scene.add(this.quad);
}

THREE.ShaderPassAdaptive.prototype = Object.assign(
    Object.create(THREE.Pass.prototype), {
        constructor: THREE.ShaderPassAdaptive,

        render: function(renderer, writeBuffer, readBuffer, delta, maskActive) {
            if (this.uniforms[this.textureID]) {
                this.uniforms[this.textureID].value = readBuffer.texture;
            }

            this.quad.material = this.material;

            if (this.renderToScreen) {
                renderer.render(this.scene, this.camera);
            } else {
                renderer.render(this.scene, this.camera, writeBuffer, this.clear);
            }
        }
    }
);