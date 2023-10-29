#ifdef GL_ES
precision mediump float;
#endif


uniform float time; // basically u_time
uniform float u_resolution;
varying vec2 vUv; //the resolution

const float PI = 3.1415926535;

float circleShape(vec2 position, float radius){
// circle position (x,y) coords
vec2 circlePosition = vec2(0.5,0.5);

  return step( radius,length(position-circlePosition));
}


float rectShape(vec2 position, vec2 scale){
  scale = vec2(0.5) - scale * 0.5;
  vec2 shaper = vec2(step(scale.x, position.x),step(scale.y, position.y));
  shaper *= vec2(step(scale.x, 1.5 - position.x),step(scale.y, 1.0 - position.y));
  return shaper.x * shaper.y;
}

mat2 rotate( float angle){
  return mat2(cos(angle),-sin(angle),sin(angle),cos(angle));
}

// float polygonShape(vec2 position, float radius, float sides){
//   // position
//   position = position * 2.0 - 1.0;
//   float angle = atan(position.x,position.y);
//   // number of sides
//   float slice = PI * 2.0 / sides;

//   return step(radius,cos(floor(0.5 + angle / slice) * slice - angle) * length(position));
// }



// mat2 scale(vec2 scale){
//   return mat2(scale.x,0.0,0.0,scale.y);
// }


const int AMOUNT = 5;

void main() {
  vec2 coord = vUv * 6.0;
  // vec2 coord = vUv - u_resolution / min(u_resolution.x, u_resolution.y);
  vec3 color = vec3(0.0); 

  float len;

  for(int i = 0; i < AMOUNT; i++){
    
    len = length(vec2(coord.x, coord.y));
    coord.x = coord.x * 1.2 - cos(coord.y + sin(len)) + time / 10.0;
    coord.y = coord.y + 1.8 - sin(coord.x + cos(len)) + time / 10.5;

  }

  // gl_FragColor = vec4(cos(len * 3.0), cos(len - 2.0), cos(len / 2.0) , 1.0);
   gl_FragColor = vec4(cos(len * 3.0), 0.18, 0.5, 1.0);

}

// list of shit 

  // draw a circle
  // float circle = circleShape(vUv,0.3);
  // color = vec3(circle);

  // draw a rectangle
  // float rectangle = rectShape(vUv,vec2(0.5,0.5));
  // color = vec3(rectangle);  

  // draw polygon
  // float polygon = polygonShape(vUv, 0.3, 5.0);
  // color = vec3(polygon);

  // this moves the shape!
  // vec2 translate = vec2(0.0,0.0);
  // coord += translate;
 
  // animate scaling
  // coord -= vec2(0.5);
  // coord = scale(vec2(sin(time) + 2.0)) * coord;
  // coord += vec2(0.5);

  // color+= vec3(circleShape(coord,0.3));

  // rotating
  // coord -= vec2(0.05);
  // coord = rotate(sin(time)) * coord;
  // coord += vec2(0.07);
  
  // color += vec3(rectShape(coord,vec2(0.3)));

  // awesome wave effect
  // float distance = distance(vec2(0.5),coord);
  // float frequency = float(10.0);
  // float lightness = float(100.0);
  // color = vec3(fract(distance * frequency - time) / distance / lightness );
  // color +=  vec3(0.5,0.4,0.6);


  // cool wave
  // color += sin(coord.x * cos(time / 30.0) * 60.0 ) + sin(coord.y * cos(time / 15.0) * 10.0 );
  // color += cos(coord.y * sin(time / 30.0) * 60.0 ) + cos(coord.x * sin(time / 15.0) * 10.0 );
  // color *= sin(time / 10.0) * 0.5;

  // water color thing 
  // coord = vUv * 10.0;
  // for (int n = 1; n < 8; n++){
  //   float i = float(n);
  //   coord *= vec2(0.7 / i * sin( i * coord.y + time + 0.3 * i) + 0.8, 0.4 / i * sin(coord.x + time + 0.3 * i) + 1.6);
  // }
  // color = vec3(0.5 * sin(coord.x ) + 0.5 , 0.5 * sin(coord.y) + 0.5, sin(coord.x + coord.y));
  // color += vec3(sin(sin(coord.x + time)* 2.0),sin(sin(coord.y + time)* 2.0), sin(time * 0.5 + coord.x * coord.y));
  // color += vec3(sin(coord.x),sin(coord.y), sin(time ));
  // rgba