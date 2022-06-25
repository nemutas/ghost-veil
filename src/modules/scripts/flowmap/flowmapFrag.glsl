uniform sampler2D tDiffuse;
uniform sampler2D u_motionTexture;
uniform float u_powar;
uniform float u_aspect;
uniform bool u_pixelMode;
uniform float u_pixel;
varying vec2 v_uv;

void main() {
	vec2 st = v_uv;
	if (u_pixelMode) {
		vec2 pixel = vec2(u_aspect * u_pixel, u_pixel);
		st = floor(v_uv * pixel) / pixel;
	}
  vec4 motionTexture = texture2D(u_motionTexture, st);
	
	vec2 distortion = -motionTexture.xy * u_powar;
	vec2 uv = v_uv + distortion;
  vec4 tex = texture2D(tDiffuse, uv);
	
	float a = smoothstep(0.05, 0.0, length(distortion));
	a *= tex.a;
  
  gl_FragColor = vec4(tex.rgb * a, a);
}