varying vec4 v_position;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_mouse;

#define MAX_ITERATIONS 100

vec2 cmul(vec2 a, vec2 b) {
  return vec2(a.x*b.x - a.y*b.y, a.x*b.y + a.y*b.x);
}

vec2 cdiv(vec2 a, vec2 b) {
  float denominator = b.x*b.x + b.y*b.y;
  if (denominator == 0.) return a;
  return cmul(a, vec2(b.x, -b.y)) / denominator;
}

vec2 cpow(vec2 z, float n) {
  float r = length(z);
  float theta = atan(z.y, z.x);
  return pow(r, n) * vec2(cos(n * theta), sin(n * theta));
}

void main() {
  float time = mod(1.1 + mod(u_time * 1000.0, 100000.0) / 10000.0, 10.);
  // float time = 2.0;

  float ratio = u_resolution.x / u_resolution.y;
  vec2 pos = v_position.xy/vec2(1.0, ratio);

  vec2 z = 2.0 * (pos - vec2(0., 0.));
  int i;

  vec2 prevZ = z;
  for (i = 0; i < MAX_ITERATIONS; i++) {
    prevZ = z;
    vec2 value = cpow(z, 3.0) + vec2(1., 0.);
    vec2 value_der = 3.0 * cpow(z, 2.0);
    z = z - time * cdiv(value, value_der);

    if (length(z - prevZ) > 30.0) {
      break;
    }
  }

  gl_FragColor = vec4(0., 0., 0., 1.);

  float diff = length(z - prevZ);

  if (diff > 10.0) {
    gl_FragColor = vec4(97., 42., 191., 255.0) / 255.;
  } else if (diff > 1.0) {
    gl_FragColor = vec4(150., 191., 69., 255.0) / 255.;
  } else if (diff > 0.0) {
    gl_FragColor = vec4(27., 14., 50., 255.0) / 255.;
  }
}

