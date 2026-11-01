export const vertexShader = `
attribute vec2 position;
varying vec2 uv;
void main() { uv = position * .5 + .5; gl_Position = vec4(position, 0., 1.); }
`;

export const fragmentShader = `
precision mediump float;
uniform sampler2D picture;
uniform vec2 resolution;
uniform float time;
uniform float interference;
uniform float power;
uniform float effects;
varying vec2 uv;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec2 warp(vec2 p) {
  vec2 aspect = vec2(resolution.x / resolution.y, 1.);
  aspect /= length(aspect) / 1.41421356;
  vec2 c = (p * 2. - 1.) * aspect;
  return (c * (1. + .0875 * dot(c,c)) * .94 / aspect) * .5 + .5;
}
vec3 sampleGlass(vec2 p) {
  vec2 q = abs(p - .5) - vec2(.459, .448) + .035;
  float edge = length(max(q, 0.)) + min(max(q.x,q.y), 0.) - .035;
  float mask = 1. - smoothstep(-.002, .002, edge);
  return texture2D(picture, clamp(p, .0, 1.)).rgb * mask;
}
void main() {
  vec2 p = warp(uv);
  float field = floor(time * 24.);
  float grain = hash(floor(p * resolution / 2.) + field);
  float band = exp(-pow((p.y - fract(time * .7)) * 22., 2.));
  p.x += (hash(vec2(floor(p.y * resolution.y / 3.),field)) - .5) * .012 * interference * band;
  vec2 ray = p - .5;
  float d = dot(ray, ray) * 2.;
  vec2 spread = ray * .0575 * (d + d*d) * effects;
  vec3 col = vec3(0.);
  vec3 weights = vec3(0.);
  for (int i = -4; i <= 4; i++) {
    float t = float(i) / 4.;
    vec3 w = max(vec3(0.), 1. - abs(2. * (vec3(t) - vec3(.5,0.,-.5))));
    col += sampleGlass(p + spread * t) * w;
    weights += w;
  }
  col /= max(weights, vec3(.001));
  col = mix(col, vec3(grain * .65), interference * (.18 + band * .65));
  float scan = .9 + .1 * cos(p.y * resolution.y * 3.14159265);
  col *= mix(1., scan, effects);
  col += (grain - .5) * .018 * effects;
  vec2 c = (p - .5) * 2.;
  col *= 1. - smoothstep(.32, 1.35, dot(c,c)) * .68 * effects;
  col *= power;
  gl_FragColor = vec4(max(col, 0.), 1.);
}
`;
