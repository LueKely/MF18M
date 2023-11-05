<script setup lang="ts">
	// three
	import * as THREE from 'three';
	import fragment from '../shaders/fragment.frag';
	import vertex from '../shaders/vertex.glsl';
	import vertexParticles from '../shaders/vertexParticles.glsl';
	import fragmentSimulation from '../shaders/fragmentSimulation.glsl';
	import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js';
	// vue
	import { onMounted } from 'vue';
	import { ref } from 'vue';

	// resize renderer to display size
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

	// init GPGPU
	function initGPGPU(renderer: THREE.WebGLRenderer) {
		const gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, renderer);
		const dtPosition = gpuCompute.createTexture();

		fillPosition(dtPosition);

		const positionVariable = gpuCompute.addVariable(
			'texturePosition',
			fragmentSimulation,
			dtPosition
		);

		positionVariable.material.uniforms['time'] = { value: 0.0 };
		positionVariable.wrapS = THREE.RepeatWrapping;
		positionVariable.wrapT = THREE.RepeatWrapping;

		console.log(gpuCompute);
		console.log(positionVariable);
		gpuCompute.init();
	}

	function fillPosition(dtPosition: THREE.DataTexture) {
		let arr: Uint8ClampedArray = dtPosition.image.data;
		console.log(arr);
		for (let i = 0; i < arr.length; i = i + 4) {
			let x = Math.random() * 2 - 1;
			let y = Math.random() * 2 - 1;
			let z = Math.random() * 2 - 1;
			arr[i] = x;
			arr[i + 1] = y;
			arr[i + 2] = z;
			arr[i + 3] = 1;
		}
	}

	const canvas = ref<HTMLCanvasElement | null>(null);
	const fov = 75;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 100;

	const WIDTH = 32;

	onMounted(() => {
		// checks whether the canvas exists
		if (canvas.value === null) {
			throw new Error('CANVAS ELEMENT DOES NOT EXIST');
		}

		// renderer
		const renderer = new THREE.WebGLRenderer({
			antialias: true,
			canvas: canvas.value,
		});
		// camera
		const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
		camera.position.z = 2;
		//scene
		const scene = new THREE.Scene();
		// light
		const color = 0xffffff;
		const intensity = 3;
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(-1, 2, 4);
		scene.add(light);

		//shape
		const geo = new THREE.PlaneGeometry(1, 1, 1, 10);
		const shapeMaterial = new THREE.ShaderMaterial({
			// wireframe: true,
			side: THREE.DoubleSide,
			uniforms: {
				u_resolution: {
					value: new THREE.Vector2(),
				},
				time: { value: 0.0 }, // Initialize time to 0
			},
			vertexShader: vertexParticles,
			fragmentShader: fragment,
		});
		const shapeMesh = new THREE.Points(geo, shapeMaterial);

		scene.add(shapeMesh);

		// renderer
		renderer.render(scene, camera);

		// time
		const clock = new THREE.Clock();

		// gpgpu stuff
		initGPGPU(renderer);

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

			// update resolution from the fragment shader
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
