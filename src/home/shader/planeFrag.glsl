uniform sampler2D u_texture;
uniform float u_progress;
varying vec2 v_uv;

#include '../../modules/scripts/glsl/cnoise21.glsl'

void main() {
  vec4 tex = texture2D(u_texture, v_uv);  
  float gray = (tex.r + tex.g + tex.b) / 3.0;
  gray *= 0.5;

  float speed = (cnoise21(v_uv * 10.0) + 1.0) * 0.5; // 0 - 1
  speed = speed * (1.0 - 0.2) + 0.2; // 0.2 - 1
  float edge = pow(1.0 - u_progress, speed);
  float a = step(edge, v_uv.y);

  gl_FragColor = vec4(vec3(gray), a);
}