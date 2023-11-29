import * as WORLD from "./world";
import "./public/css/style.css";

let world = new WORLD.WORLD('webgl');

const boxConfig = {
    type: 'cone',
    size: [1.5, 3, 3], // radius, height, depth (for spheres, only radius is used)
    pos: [0, 4, 0], // initial position
    move: true, // allow movement
    density: 0.1, // density of the object
    friction: 0.2, // friction
    restitution: 0.6, // bounciness
};

const material = {
    color: '#fa0000',
    roughness: 0.2,
    metalness: 0.3,
	wireframe: true
};

const floorConfig = {
    type: 'box',
    size: [10, 5.5, 10], // radius, height, depth (for spheres, only radius is used)
    pos: [0, -4, 0], // initial position
    move: false, // allow movement
};
// world.CreateSphere(boxConfig, material);
world.CreateBox(floorConfig, material);
world.LoadGLTF('./public/models/','scene1.gltf');

document.getElementById('range').addEventListener('input', () => {
	if (world.loadedGLTF) {
		world.loadedGLTF.scene.traverse(child => {
			if (child.name == "Forearm1STL") {
				child.rotation.set(Number(document.getElementById('range').value), 0, 0);
			}
			if (child.name == "arm3_04") {
				child.rotation.set(Number(document.getElementById('range').value), 0, 0);
			}
		})
	}
})

world.SetBackgroundImage('./public/8Crzsx5pVvk.jpg');

const loop = () => {
	world.Loop();
    window.requestAnimationFrame(loop);
}

loop();