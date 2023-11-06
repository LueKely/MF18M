
#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
varying vec3 vPosition;
uniform sampler2D positionTexture;
float PI = 3.141592653589793238;
uniform float time;
attribute vec2 reference;


void main() {
	vUv = reference;
	vec3 pos = texture( positionTexture, reference ).xyz;
	
	vec4 mvPosition = modelViewMatrix * vec4( position, 1. );

	
	gl_PointSize = 30. * ( 1. / - mvPosition.z );
	gl_Position = projectionMatrix * mvPosition;
}