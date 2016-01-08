
<script id="vertex_PNT" type="vertex">
	attribute vec3 aVertex;
	attribute vec3 aNormal;
	attribute vec2 aTexCoord;

	varying vec3 vNormal;
	varying vec3 vViewVec;
	varying vec2 vTexCoord;
	varying float vFogFactor;
	
	uniform mat4 uWVP;
	// Assume that there is no scaling
	uniform mat4 uWorld;
	
	uniform vec3 uCamPos;
	
	void main(void) {
		gl_Position = uWVP * vec4(aVertex, 1.);
		vNormal = (uWorld * vec4(aNormal, 0.)).xyz;
		vViewVec = (uWorld * vec4(aVertex, 1.)).xyz - uCamPos;
		vTexCoord = aTexCoord;
		
		vFogFactor = clamp(abs(vViewVec.z) / (18.), 0., 1.);
		//vFogFactor = pow(vFogFactor, 16.);
	}
</script>
	
<script id="frag_PNT" type="frag">
    precision mediump float;
	
	varying vec3 vNormal;
	varying vec3 vViewVec;
	varying vec2 vTexCoord;
	varying float vFogFactor;
	
	uniform vec4 uLightAmb;
	uniform vec4 uLightDif;
	uniform vec4 uLightSpe;
	uniform vec3 uLightVec;
	
	uniform vec4 uMatAmb;
	uniform vec4 uMatDif;
	uniform vec4 uMatSpe;
	uniform float uMatPow;
	
	uniform sampler2D uTexSamp;
	
	void main(void) {
		vec4 color = texture2D(uTexSamp, vTexCoord);
		//if (color.a < .3) {discard;}

		vec3 nor = normalize(vNormal).xyz;
		vec3 vVec = normalize(vViewVec).xyz;
		
		// Ambient
		vec4 amb = (uMatAmb*uLightAmb);
		
		// Diffuse
		float perDif = max(0., dot(-uLightVec, nor));
		vec4 dif = perDif*(uMatDif*uLightDif);
		
		// Specular
		vec3 rVec = reflect(-uLightVec, nor);
		float perSpe = pow(max(0., dot(vVec, rVec)), uMatPow);
		vec4 spe = perSpe*(uMatSpe*uLightSpe);

		gl_FragColor = color*(amb+dif) + spe;
		float fFactor = pow(vFogFactor, 32.);
		vec4 fogColor = vec4(1., 1., 1., 1.);
		gl_FragColor = (1.0 - fFactor) * gl_FragColor + fFactor * fogColor;
		gl_FragColor.a = 1.;
	}
</script>

