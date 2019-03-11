/**
 * @author hüseyin savran
 *
 * Lapha over two textures
 */

THREE.AlphaOver = {

	uniforms: {

		"tDiffuse": { value: null },
		"tBase": { value: null },
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
		"uniform sampler2D tBase;",

		"varying vec2 vUv;",

		"void main() {",

		"vec4 texOver = texture2D( tDiffuse, vUv );",
		"vec4 texBase = texture2D( tBase, vUv );",
		"float premul  = texOver[3];",
		"float mul     = 1.0 - premul;",

		"gl_FragColor[0] = (mul * texBase[0]) + premul * texOver[0];",
		"gl_FragColor[1] = (mul * texBase[1]) + premul * texOver[1];",
		"gl_FragColor[2] = (mul * texBase[2]) + premul * texOver[2];",
		"gl_FragColor[3] = (mul * texBase[3]) + texOver[3];",


		"}"

	].join( "\n" )

};
