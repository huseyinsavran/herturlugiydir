/**
 * @author hüseyin savran / huseyinsavran2006@gmail.com
 *
 * fast gauss blur shader
 */

THREE.FastGaussBlur = {

	uniforms: {

		"tDiffuse": { value: null },
		"resolution": { value: new THREE.Vector3( 0, 0, 0 ) },
		"flip": { value: 0 },
		"direction": { value: new THREE.Vector2( 0, 0 ) }

	},

	vertexShader: [

		"varying  vec2 vUv;",

		"void main() {",

		"vUv = uv;",
		"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",		
		"uniform vec3 resolution;",
		"uniform vec2 direction;",
		"uniform bool flip;",

		"varying  vec2 vUv;",
		
		"vec4 blur9(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {",
		  "vec4 color = vec4(0.0);",
		  "vec2 off1 = vec2(1.3846153846) * direction;",
		  "vec2 off2 = vec2(3.2307692308) * direction;",
		  "color += texture2D(image, uv) * 0.2270270270;",
		  "color += texture2D(image, uv + (off1 / resolution)) * 0.3162162162;",
		  "color += texture2D(image, uv - (off1 / resolution)) * 0.3162162162;",
		  "color += texture2D(image, uv + (off2 / resolution)) * 0.0702702703;",
		  "color += texture2D(image, uv - (off2 / resolution)) * 0.0702702703;",
		  "return color;",
		"}",

		"void main(){",

		"vec2 uv = vec2(gl_FragCoord.xy / resolution.xy);",
		"if (flip) {",
			"uv.y = 1.0 - uv.y;",
		"}",
		"gl_FragColor = blur9(tDiffuse, uv, resolution.xy, direction);",

		"}"

	].join( "\n" )
};
