/**
 * @author WestLangley / http://github.com/WestLangley
 *
 * Gamma Correction Shader
 * http://en.wikipedia.org/wiki/gamma_correction
 */

THREE.GammaUncorrect = {

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
			
			"if (tex[3] > 0.0) {",
				"tex[0] /= tex[3];",
				"tex[1] /= tex[3];",
				"tex[2] /= tex[3];",
			"}",

			"/* check for negative to avoid nan's */",			
			"tex[0] = tex[0] > 0.0 ? sqrt(tex[0]) : 0.0;",
			"tex[1] = tex[1] > 0.0 ? sqrt(tex[1]) : 0.0;",
			"tex[2] = tex[2] > 0.0 ? sqrt(tex[2]) : 0.0;",
			"tex[3] = tex[3];",

			"if (tex[3] > 0.0) {",
				"tex[0] *= tex[3];",
				"tex[1] *= tex[3];",
				"tex[2] *= tex[3];",
			"}",
			"gl_FragColor = tex;",

		"}"

	].join( "\n" )

};