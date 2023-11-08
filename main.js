import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

objectsGroup = new THREE.Group();

function main() {

	if (positionYSTEM != 3) {
		positionYSTEM++;
	}

	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

	const fov = 45;
	const aspect = 2; // the canvas default
	const near = 1;
	const far = 1000;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.set( 0, 10, 20 );

	const controls = new OrbitControls( camera, canvas );
	controls.target.set( 0, 5, 0 );
	controls.update();

	const scene = new THREE.Scene();
	scene.background = new THREE.Color( 'black' );

	{

		const planeSize = 40;

		const loader = new THREE.TextureLoader();
		const texture = loader.load( 'checker.png' );
		texture.colorSpace = THREE.SRGBColorSpace;
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.magFilter = THREE.NearestFilter;
		const repeats = planeSize / 2;
		texture.repeat.set( repeats, repeats );

		const planeGeo = new THREE.PlaneGeometry( planeSize, planeSize );
		const planeMat = new THREE.MeshPhongMaterial( {
			map: texture,
			side: THREE.DoubleSide,
		} );
		const mesh = new THREE.Mesh( planeGeo, planeMat );
		mesh.rotation.x = Math.PI * - .5;
		scene.add( mesh );

	}

	{

		const skyColor = 0xB1E1FF; // light blue
		const groundColor = 0xB97A20; // brownish orange
		const intensity = 2;
		const light = new THREE.HemisphereLight( skyColor, groundColor, intensity );
		scene.add( light );

	}

	{

		const color = 0xFFFFFF;
		const intensity = 2.5;
		const light = new THREE.DirectionalLight( color, intensity );
		light.position.set( 0, 10, 0 );
		light.target.position.set( - 5, 0, 0 );
		scene.add( light );
		scene.add( light.target );

	}

	{
		const objLoaderCYLINDER = new OBJLoader();
		const objLoaderSTEM = new OBJLoader();
		const objLoaderSHOULDER = new OBJLoader();
		const objLoaderFOREARM1 = new OBJLoader();
		const objLoaderFOREARM2 = new OBJLoader();
		const objLoaderFOREARM3 = new OBJLoader();
		const objLoaderFINGER = new OBJLoader();

		function modelPlacement(root, modelName) {
			const desiredSize = 0.05;
			root.scale.set(desiredSize, desiredSize, desiredSize);

			objectsGroup.add( root );
			const boundingBox = new THREE.Box3().setFromObject(root);

			// Get the dimensions
			const objectDimensions = new THREE.Vector3();
			boundingBox.getSize(objectDimensions);
			
			console.log(`Length of ${modelName}:`, objectDimensions.x);
			console.log(`Width of ${modelName}:`, objectDimensions.y);
			console.log(`Height of ${modelName}:`, objectDimensions.z);
		}


		// objLoader.load( 'https://threejs.org/manual/examples/resources/models/windmill/windmill.obj', ( root ) => {
		objLoaderCYLINDER.load( 'models/Cylinder.obj', ( root ) => {
			root.position.set(-3, 0, -5);
			modelPlacement(root, 'cylinder');
			scene.add( root );
		} );

		objLoaderSTEM.load( 'models/Stem.obj', ( root ) => {
			root.position.set(-3, positionYSTEM, -5);
			modelPlacement(root, 'stem');
			scene.add( root );
		} );

		objLoaderSHOULDER.load( 'models/Shoulder.obj', ( root ) => {
			root.position.set(-20, 0, -20);
			modelPlacement(root, 'shoulder');
			scene.add( root );
		} );

		objLoaderFOREARM1.load( 'models/Forearm1.obj', ( root ) => {
			root.position.set(-20, 0, 20);
			modelPlacement(root, 'forearm 1');
			scene.add( root );
		} );

		objLoaderFOREARM2.load( 'models/Forearm2.obj', ( root ) => {
			root.position.set(20, 0, -20);
			modelPlacement(root, 'forearm 2');
			scene.add( root );
		} );

		objLoaderFOREARM3.load( 'models/Forearm3.obj', ( root ) => {
			root.position.set(20, 0, 0);
			modelPlacement(root, 'forearm 3');
			scene.add( root );
		} );

		objLoaderFINGER.load( 'models/Finger.obj', ( root ) => {
			root.position.set(20, 0, 20);
			modelPlacement(root, 'finger');
			scene.add( root );
		} );

	}

	function resizeRendererToDisplaySize( renderer ) {

		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if ( needResize ) {

			renderer.setSize( width, height, false );

		}

		return needResize;

	}

	function render() {

		if ( resizeRendererToDisplaySize( renderer ) ) {

			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();

		}

		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );

}

main();

