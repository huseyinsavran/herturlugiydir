/**
 * @author hüseyin savran / http://alteredqualia.com/
 *
 * Blend two textures
 */

THREE.AddShader2 = {

	uniforms: {

		"tDiffuse": { value: null },
		"tBase": { value: null },
		"preMultiplied": { value: false }
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
		"uniform bool preMultiplied;",
		"varying vec2 vUv;",

		"void main() {",

			"vec4 blend = texture2D( tDiffuse, vUv );",
			"vec4 base  = texture2D( tBase,   vUv );",
			"if(preMultiplied) {",
					"if(blend[3] > 0.0) blend /= blend[3];",
		      "if(base[3] > 0.0)  base  /= base[3];",
			"}",
			"blend[0] = blend[0] > 0.0 ? blend[0] * blend[0] : 0.0;",
			"blend[1] = blend[1] > 0.0 ? blend[1] * blend[1] : 0.0;",
			"blend[2] = blend[2] > 0.0 ? blend[2] * blend[2] : 0.0;",

			"base[0] = base[0] > 0.0 ? base[0] * base[0] : 0.0;",
			"base[1] = base[1] > 0.0 ? base[1] * base[1] : 0.0;",
			"base[2] = base[2] > 0.0 ? base[2] * base[2] : 0.0;",

			"vec3 renk = base.rgb +  blend.rgb;",

			"renk[0] = renk[0] > 0.0 ? sqrt(renk[0]) : 0.0;",
			"renk[1] = renk[1] > 0.0 ? sqrt(renk[1]) : 0.0;",
			"renk[2] = renk[2] > 0.0 ? sqrt(renk[2]) : 0.0;",

			"gl_FragColor[3] = base[3];",
			"gl_FragColor[0] = clamp(renk[0], 0.0, 1.0);",
			"gl_FragColor[1] = clamp(renk[1], 0.0, 1.0);",
			"gl_FragColor[2] = clamp(renk[2], 0.0, 1.0);",

		"}"

	].join( "\n" )

};
