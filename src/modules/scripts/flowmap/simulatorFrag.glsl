uniform sampler2D u_defaultTexture;
uniform vec2 u_mouse_pos;
uniform float u_range;
uniform float u_viscosity;

vec2 lerp(vec2 original, vec2 target, float alpha) {
  return original * alpha + target * (1.0 - alpha);
}

void main()	{
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 tmp = texture2D(motionTexture, uv);
  vec4 defTmp = texture2D(u_defaultTexture, uv);

  float dist = 1.0 - smoothstep(0.0, u_range, distance(u_mouse_pos, uv));

  if(0.0 < dist) {
    vec2 speed = u_mouse_pos - tmp.zw;
    vec2 distortion = speed * dist * 5.0;
    tmp.xy += distortion;
  }

  vec4 result;
  result.xy = lerp(defTmp.xy, tmp.xy, u_viscosity);
  result.xy = clamp(result.xy, -1.0, 1.0);
  result.zw = u_mouse_pos;
  
  gl_FragColor = result;
}