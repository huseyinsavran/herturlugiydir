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
		"vec4 KomsulugundaAra25(  sampler2D image, vec2 uv, float w, float h, inout bool sonuc)",
		"{",
		"	sonuc = false;",
		"   vec2 onePixel = vec2(1.0);",
		"	onePixel.x /= w;",
		"	onePixel.y /= h;",
		"	float enKucukMesafe = 100000.0;",
		"	float mesafe = 0.0;",
		"	vec4 outPut = vec4(1.0);",
		"	vec4 tex = vec4(1.0);",
		"	vec2 fark = vec2(1.0);",		
		"	vec2 uvGezen = vec2(uv.x - 12.0 * onePixel.x, uv.y + 12.0 * onePixel.y); //sol ust koseye taşıdık",		
		"	float bas = uvGezen.y;",
		"	for( int j = 0; j < 25; j++)",
		"	{",					
			"	for( int i = 0; i < 25; i++)",
			"	{",
			"		if(uvGezen.x < 0.0 || uvGezen.y < 0.0 || uvGezen.x >= 1.0 || uvGezen.y >= 1.0 )",
					"{",						
						"uvGezen.y -= onePixel.y;",
						"continue;",
					"}",
					
			"		tex = texture2D( image, uvGezen, 0.0 );",
			"		if(tex[3] > 0.0) // bu saydam değil demektir. rengi alınabilir",
			"		{",
						
			"			  fark = (uvGezen - uv);//piksel boyutuna dönüştür",
			"				fark.x *= onePixel.x;",
			"				fark.y *= onePixel.y;",
			"			  mesafe = fark.x * fark.x + fark.y * fark.y;",
			"			 //güncelleme",
			"			 if(mesafe < enKucukMesafe && i != 12 && j != 12)",
			"			 {",
			"				enKucukMesafe = mesafe;",
			"				outPut = tex;",
			"			 }",
			"		}",
			"		uvGezen.y -= onePixel.y;",
			"	}",
			"	uvGezen.x += onePixel.x;",
			"	uvGezen.y = bas;",
		"	}",
		"	if(enKucukMesafe < 100000.0) sonuc = true;",
		"	return outPut;",
		"}",
		
		
		
		"//verilen uv posizyonuna en yakın noktanın posizyonu aranır",
		"vec4 findTheClosestPixel(sampler2D image, vec2 uv, float w2, float h2,vec4 tex2)",
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
		"		//outPut = vec4(1.0, 0.0, 0.0, 1.0);",
		"		return tex2;",
		"	}",
		
			"//return tex2; //aynen döndür",
			
		"}",
		 
		"void main() {",
			"vec4 tex 		= texture2D( tDiffuse, vUv );",
			"vec4 texMask   = texture2D( tMask,    vUv );",	
			"if(texMask[0] > 0.0 && tex[3] == 0.0 )",
			"{",				
				"tex     = findTheClosestPixel(tDiffuse, vUv, w, h,tex);//alpha 1 yapılır gelir	",			
				"tex 	*= texMask[0];",				
				
			"}",
			"else if(tex[3] < 0.7 && tex[3] > 0.0){ //dif colorın kıyılarının alfaları değiştirilir",
				"tex /= tex[3];",
				"tex *=  texMask[0];",		
			"}",
			
			
			
			"gl_FragColor = tex;",		

		"}"

	].join( "\n" )

};
