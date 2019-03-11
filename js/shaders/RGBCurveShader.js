/**
 * @author hüseyin savran
 *  http://xuru.org/rt/PR.asp#Manually siatesinde curve fonksiyon hesabı yaptırılıp
 * katsayılar ooan göre verilir. ikinci dereceden eğriler için çalışır
 * Vector3(0.0, 1.0, 0.0) => y= x fonksiyonudur. yani etkisizdir
 * hue: -1 to 1 (-1 is 180 degrees in the negative direction, 0 is no change, etc.
 * saturation: -1 to 1 (-1 is solid gray, 0 is no change, and 1 is maximum contrast)
 */

THREE.RGBCurveShader = {

	uniforms: {

		"tDiffuse":   { value: null },
		"RKatsayi":   { value: new THREE.Vector3(0.0, 1.0, 0.0) },
		"GKatsayi":   { value: new THREE.Vector3(0.0, 1.0, 0.0) },
		"BKatsayi":   { value: new THREE.Vector3(0.0, 1.0, 0.0) },
		"RGBFlags":   { value: [0 , 0, 0] }

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
		"uniform vec3 RKatsayi;",
		"uniform vec3 GKatsayi;",
		"uniform vec3 BKatsayi;",
		"uniform bvec3 RGBFlags;",

		"varying vec2 vUv;",


		"void main() {",

			"vec4 tex = texture2D( tDiffuse, vUv );",

			"//ax^2 + bx + c => x(ax+b) + c daha hesaplı",
			"//R curve işleme sokulacaksa",
			"if(RGBFlags[0])",
			"{",
			"	tex.r =  tex.r * ( RKatsayi[0] * tex.r + RKatsayi[1]) + RKatsayi[2];",
			"}",

			"//G curve işleme sokulacaksa",
			"if(RGBFlags[1])",
			"{",
			"	tex.g =  tex.g * ( GKatsayi[0] * tex.g + GKatsayi[1]) + GKatsayi[2];",
			"}",

			"//B curve işleme sokulacaksa",
			"if(RGBFlags[2])",
			"{",
			"   tex.b =  tex.b * ( BKatsayi[0] * tex.b + BKatsayi[1]) + BKatsayi[2];",

			"}",
			"/*","*/",
			"gl_FragColor = tex ;",

		"}"

	].join( "\n" )

};
