
varying vec2 vUv;
uniform sampler2D uTexture;
uniform float uHover;
uniform vec2 uMouse;

void main(){
  float blocks = 20.0;
  vec2 blockUv = floor(vUv * blocks) / blocks;
  float distance = length(blockUv-uMouse);
  float effect = smoothstep(0.4, 0.0, distance);
  vec2 distortion = vec2(0.03) * effect;

  vec4 color = texture2D(uTexture, vUv + distortion*uHover);
  gl_FragColor = color;
}




/* 
vUv hota hai 0 to 1 jaise 0,0 to 1,1
vUv hogaya r g aur blue 0
but yeh linear increase karta hai 0 to 1
aur hum smoothstep se blocks create karengey
*/