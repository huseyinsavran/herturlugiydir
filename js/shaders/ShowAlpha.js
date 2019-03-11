/**
 * @author hüseyin savran 
 *
 * shows alha of texture as gray scale, to the white means opaque
 */

THREE.ShowAlpha = {

	uniforms: {

		"tDiffuse": { value: null }
		
		

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [		

		"uniform sampler2D tDiffuse;",
		

		"varying vec2 vUv;",

		"void main() {",

			"vec4 tex = texture2D( tDiffuse, vUv );",			
			"tex[0] = tex[3] > 0.0 ? tex[3] : 0.0;",
			"tex[1] = tex[3] > 0.0 ? tex[3] : 0.0;",
			"tex[2] = tex[3] > 0.0 ? tex[3] : 0.0;",
			"//tex[3] = tex[3] > 0.0 ? 1.0 : 0.0;",
			
			"gl_FragColor = tex;",

		"}"

	].join( "\n" )

};
