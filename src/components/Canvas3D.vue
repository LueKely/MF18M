<script setup lang="ts">
	import * as THREE from 'three';
	import fragment from '../shaders/fragment.frag';
	import vertex from '../shaders/vertex.glsl';
	import { onMounted } from 'vue';
	import { ref } from 'vue';

	function resizeRendererToDisplaySize(renderer: THREE.WebGLRenderer) {
		const canvas = renderer.domElement;
		const pixelRatio = window.devicePixelRatio;
		const width = (canvas.clientWidth * pixelRatio) | 0;
		const height = (canvas.clientHeight * pixelRatio) | 0;
		const needResize = canvas.width !== width || canvas.height !== height;
		if (needResize) {
			renderer.setSize(width, height, false);
		}
		return needResize;
	}
	const canvas = ref<HTMLCanvasElement | null>(null);

	onMounted(() => {
		// checks whether the canvas exists
		if (canvas.value === null) {
			throw new Error('CANVAS ELEMENT DOES NOT EXIST');
		}

		// rederer
		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			canvas: canvas.value,
		});

		// camera
		const fov = 75;
		const aspect = 2; // the canvas default
		const near = 0.1;
		const far = 100;
		const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

		//camera position
		camera.position.z = 30;

		//scene
		const scene = new THREE.Scene();

		// light
		const color = 0xffffff;
		const intensity = 3;
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(-1, 2, 4);
		scene.add(light);

		//shape
		const geo = new THREE.PlaneGeometry(35, 35, 30, 30);
		const shapeMaterial = new THREE.ShaderMaterial({
			wireframe: true,
			side: THREE.DoubleSide,
			uniforms: {
				u_resolution: {
					value: new THREE.Vector2(),
				}, // This will be automatically set by Three.js
				time: { value: 0.0 }, // Initialize time to 0
			},
			vertexShader: vertex,
			fragmentShader: fragment,
		});

		// uniform variables
		const canvasSize = new THREE.Vector2(
			canvas.value?.width,
			canvas.value?.height
		);

		console.log(canvasSize);

		shapeMaterial.uniforms.u_resolution.value.copy(canvasSize);

		const shapeMesh = new THREE.Mesh(geo, shapeMaterial);
		scene.add(shapeMesh);

		// renderer
		renderer.render(scene, camera);

		// time
		const clock = new THREE.Clock();

		// animation
		function render() {
			const deltaTime = clock.getDelta();
			// resizes the display

			if (resizeRendererToDisplaySize(renderer)) {
				const canvas = renderer.domElement;
				camera.aspect = canvas.width / canvas.height;
				camera.updateProjectionMatrix();
			}

			// convert time to seconds
			// shapeMesh.rotation.x += deltaTime;
			// shapeMesh.rotation.y -= 1 * deltaTime;

			renderer.render(scene, camera);
			requestAnimationFrame(render);

			// update time from the fragment shader
			shapeMaterial.uniforms.time.value += 0.01;

			if (canvas.value == null) {
				throw new Error('CANVAS DOES NOT EXIST');
			}
			const resolution = new THREE.Vector2(
				canvas.value.width,
				canvas.value.height
			);
			shapeMaterial.uniforms.u_resolution.value.copy(resolution);
		}
		requestAnimationFrame(render);
	});
</script>

<template>
	<canvas ref="canvas" id="c"></canvas>
</template>

<style scoped>
	#c {
		/* background-color: #494545; */
		width: 100dvw;
		height: 100dvh;
		display: block;
	}
</style>
