/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Blend two textures
 */

THREE.MultiplyShader3 = {

	uniforms: {

		"tDiffuse": { value: null },
		"tBase": { value: null },
		"opacityImage": { value: null },
		"useBlendAlpha":  { value: false },
		"useOpacityImage":  { value: false },
		"opacity":   { value: 1.0 }

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
		"uniform sampler2D opacityImage;",
		"uniform bool useBlendAlpha;",
		"uniform bool useOpacityImage;",
		"uniform float opacity;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 blend = texture2D( tDiffuse, vUv );",
			"vec4 base  = texture2D( tBase,   vUv );",

			"float value = opacity;",

			"if( useOpacityImage)",
			"{",
				"value = texture2D( opacityImage, vUv ).x;",
			"}",

			"if( useBlendAlpha)",
			"{",
				"value *= blend[3];",
			"}",
			"if(blend[3] > 0.0) blend /= blend[3];",

			"float valuem = 1.0 - value;",
			"vec4 netice = vec4(0.0);",
			"netice[0] = base[0] * (valuem + value * blend[0]);",
			"netice[1] = base[1] * (valuem + value * blend[1]);",
			"netice[2] = base[2] * (valuem + value * blend[2]);",
			"netice[3] = base[3];								",
			"gl_FragColor = netice;",

		"}"

	].join( "\n" )

};
