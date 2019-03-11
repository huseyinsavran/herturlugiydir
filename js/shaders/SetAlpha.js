/**
 * @author hüseyin savran
 *
 * shows alha of texture as gray scale, to the white means opaque
 */

THREE.SetAlpha = {

	uniforms: {

		"tDiffuse": { value: null },
		"tAlphaMask": { value: null }



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
		"uniform sampler2D tAlphaMask;",


		"varying vec2 vUv;",

		"void main() {",

			"vec4 tex 		= texture2D( tDiffuse, vUv );",
			"vec4 texAlpha  = texture2D( tAlphaMask, vUv );",
			"if(tex[3] > 0.0) tex /= tex[3];",
			"tex *= texAlpha[0];",
			"gl_FragColor = tex;",

		"}"

	].join( "\n" )

};
