import * as WORLD from "./world";
import "./public/css/style.css";

let world = new WORLD.WORLD('webgl');

const boxConfig = {
    type: 'cone',
    size: [1.5, 1.5, 1.5], // radius, height, depth (for spheres, only radius is used)
    pos: [4, 4, 0], // initial position
    move: true, // allow movement
    density: 15.5, // density of the object
    friction: 0.1, // friction
    restitution: 0, // bounciness
};

const material = {
    color: '#fa0000',
    roughness: 0.2,
    metalness: 0.3,
};

const floorConfig = {
    name: 'floor',
    type: 'box',
    size: [130, 5.5, 130], // radius, height, depth (for spheres, only radius is used)
    pos: [0, -4, 0], // initial position
    move: false, // allow movement
    friction: 0.5, // friction
    density: 0.1, // density of the object
};
// world.CreateSphere(boxConfig, material);
world.CreateBox(floorConfig, material);
world.CreateSphere(boxConfig, material);
world.CreateCone(boxConfig, material);
world.CreateRing(boxConfig, material);
world.CreateCylinder(boxConfig, material);
world.CreateSphere(boxConfig, material);
const config = {
    type: 'box',
    size: [1, 1, 1], // radius, height, depth (for spheres, only radius is used)
    pos: [0, 0, 0], // initial position
    move: true, // allow movement
    density: 0.1, // density of the object
    friction: 0.2, // friction
    restitution: 0, // bounciness
    createcopy: false,
    scale: [1, 1, 1],
    dirpath: './public/models/',
    namefile: 'bird.gltf',
    name: 'bird',
    wireframe: true,
    onload: (gltf, phy) => { 
        console.log('gltf loaded'); 
        if (phy) {
            const jump = (obj) => {
                console.log(obj.contactLink);
                if (obj.contactLink) {
                    console.log("JUMP");
                    obj.linearVelocity.y = 10;
                }
            } 
            const keysState = {};

            // Функция для обработки состояния клавиш
            const movement = (physicsOBJ) => {
                keysState[event.code] = true;
                console.log(keysState);
                if (physicsOBJ) {
                    const speed = 3;
                    console.log(event.code);
                    // Инициализация линейной скорости, если она еще не была установлена
                    physicsOBJ.linearVelocity.x = physicsOBJ.linearVelocity.x || speed / 2;
                    physicsOBJ.linearVelocity.z = physicsOBJ.linearVelocity.z || speed / 2;
                    if (keysState['ArrowRight'] || keysState['KeyD']) {
                        physicsOBJ.linearVelocity.x = -speed;
                    }
                    if (keysState['ArrowLeft'] || keysState['KeyA']) {
                        physicsOBJ.linearVelocity.x = speed;
                    }
                    if (keysState['ArrowDown'] || keysState['KeyS']) {
                        physicsOBJ.linearVelocity.z = -speed;
                    }
                    if (keysState['ArrowUp'] || keysState['KeyW']) {
                        physicsOBJ.linearVelocity.z = speed;
                    }
                    if (keysState['Space']) {
                        jump(physicsOBJ);
                    }

                }
            };
            const stopmovement = (physicsOBJ) => {
                keysState[event.code] = false;
            };
            // world.BindFunction(phy, jump);
            world.BindFunction(window, phy, movement, "keydown");
            world.BindFunction(window, phy, stopmovement, "keyup");
        }
    }
}

world.LoadGLTF(config);


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

const loop = () => {
	world.Loop();
    window.requestAnimationFrame(loop);
}

loop();