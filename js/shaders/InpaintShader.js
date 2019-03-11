/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 *
 * Two pass Gaussian blur filter (horizontal and vertical blur shaders)
 * - described in http://www.gamerendering.com/2008/10/11/gaussian-blur-filter-shader/
 *   and used in http://www.cake23.de/traveling-wavefronts-lit-up.html
 *
 * - 
 */

THREE.InpaintShader = {

	uniforms: {

		"tDiffuse": { value: null },
		"tMask": { value: null },
		"w": { value: null },
		"h": { value: null }

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
		"uniform sampler2D tMask;",
		"uniform float w;",
		"uniform float h;",

		"varying vec2 vUv;",	
		
		"//yukardan aşağı sol taraf	",
		"vec4 KomsulugundaAra25( in sampler2D image, vec2 uv2, float w2, float h2, inout bool sonuc)",
		"{",
		"	sonuc = false;",
		"	int w3 = int(w2);",
		"	int h3 = int(h2);",
		"	ivec2 uv = ivec2(int(uv2.x * w2) , int(uv2.y * h2));",		
		"	int enKucukMesafe = 100000;",
		"	int mesafe = 0;",
		"	vec4 outPut = vec4(1.0);",
		"	vec4 tex = vec4(1.0);",
		"	ivec2 fark = ivec2(1);",		
		"	ivec2 uvGezen = ivec2(uv.x - 12, uv.y + 12); //sol ust koseye taşıdık",		
		"	int bas = uvGezen.y;",
		"	for( int j = 0; j < 25; j++)",
		"	{",					
			"	for( int i = 0; i < 25; i++)",
			"	{",
			"		if(uvGezen.x < 0 || uvGezen.y < 0 || uvGezen.x >= w3 || uvGezen.y >= h3 )",
					"{",						
						"uvGezen.y -= 1;",
						"continue;",
					"}",
					
			"		tex = texelFetch( image, uvGezen, 0 );",
			"//		tex = texture2D( image, uvGezen, 0.0 ).xyz;",
			"		if(tex[3] > 0.0) // bu saydam değil demektir. rengi alınabilir",
			"		{",
						
			"			  fark = (uvGezen - uv);//piksel boyutuna dönüştür",
			"			  mesafe = fark.x * fark.x + fark.y * fark.y;",
			"			 //güncelleme",
			"			 if(mesafe < enKucukMesafe && i != 12 && j != 12)",
			"			 {",
			"				enKucukMesafe = mesafe;",
			"				outPut = tex;",
			"			 }",
			"		}",
			"		uvGezen.y -= 1;",
			"	}",
			"	uvGezen.x += 1;",
			"	uvGezen.y = bas;",
		"	}",
		"	if(enKucukMesafe < 100000) sonuc = true;",
		"	return outPut;",
		"}",
		
		
		
		"//verilen uv posizyonuna en yakın noktanın posizyonu aranır",
		"vec4 findTheClosestPixel(in sampler2D image, vec2 uv, float w2, float h2,vec4 tex2)",
		"{",
		"	bool basarili = false;",	
		"	vec4 outPut = KomsulugundaAra25(image, uv, w2, h2,basarili);",
		"	if(basarili)",
		"	{",
		"		//outPut = vec4(0.0, 1.0, 0.0, 1.0);",
		"		outPut[0] = outPut[3] > 0.0 ? outPut[0]/outPut[3] : outPut[0];",
		"		outPut[1] = outPut[3] > 0.0 ? outPut[1]/outPut[3] : outPut[1];",
		"		outPut[2] = outPut[3] > 0.0 ? outPut[2]/outPut[3] : outPut[2];",
		"		outPut[3] = 1.0;",
		"		return outPut;",
		"	}",
		"	else{",
		"		tex2 = vec4(1.0, 0.0, 0.0, 1.0);",
		"		return tex2;",
		"	}",
		
			
			"//return tex2; //aynen döndür",
			
		"}",
		 
		"void main() {",
			"vec4 tex 		= texture2D( tDiffuse, vUv );",
			"vec4 texMask   = texture2D( tMask,    vUv );",	
			"if(texMask[0] > 0.0 && tex[3] == 0.0 )",
			"{",				
				"tex = findTheClosestPixel(tDiffuse, vUv, w, h,tex);",
				
			"}",
			"else{",
				"tex[3] = texMask[0];",
			"}",
			"//tex *= 0.7;",
			
			"gl_FragColor = tex;",		

		"}"

	].join( "\n" )

};
