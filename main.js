import * as WORLD from "./world";
import "./public/css/style.css";

let world = new WORLD.WORLD('.webgl');

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
// world.CreateCone(boxConfig, material);
// world.CreateRing(boxConfig, material);
// world.CreateCylinder(boxConfig, material);
// world.CreateSphere(boxConfig, material);
const config = {
    type: 'sphere',
    size: [1, 1, 1], // radius, height, depth (for spheres, only radius is used)
    pos: [0, 0, 0], // initial position
    move: true, // allow movement
    density: 0.1, // density of the object
    friction: 0.8, // friction
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
                if (obj.contactLink) {
                    console.log("JUMP");
                    obj.linearVelocity.y = 10;
                }
            } 
            const keysState = {};
            let rotation;
            // Функция для обработки состояния клавиш
            const movement = (physicsOBJ) => {
                keysState[event.code] = true;
                if (physicsOBJ) {
                    const speed = 4;
                    // Инициализация линейной скорости, если она еще не была установлена
                    physicsOBJ.linearVelocity.x = 0;
                    physicsOBJ.linearVelocity.z = 0;
                    if (keysState['ArrowRight'] || keysState['KeyD']) {
                        physicsOBJ.setRotation({x:physicsOBJ.orientation.x, y:physicsOBJ.orientation.y , z:physicsOBJ.orientation.z});
                        physicsOBJ.controlRot = false;
                        physicsOBJ.linearVelocity.x = -speed;
                    }
                    if (keysState['ArrowLeft'] || keysState['KeyA']) {
                        physicsOBJ.setRotation({x:physicsOBJ.orientation.x, y:physicsOBJ.orientation.y , z:physicsOBJ.orientation.z});
                        physicsOBJ.controlRot = false;
                        physicsOBJ.linearVelocity.x = speed;
                    }
                    if (keysState['ArrowDown'] || keysState['KeyS']) {
                        physicsOBJ.linearVelocity.z = -speed;
                    }
                    if (keysState['ArrowUp'] || keysState['KeyW']) {
                        physicsOBJ.linearVelocity.z = speed;
                    }
                    if (keysState['KeyQ']) {
                        // const orientation = physicsOBJ.orientation;
                        // physicsOBJ.resetQuaternion({x:orientation.x, y:orientation.y + 0.1, z:orientation.z, w:orientation.w});
                        rotation = world.Rotate(physicsOBJ, 0.1);
                        physicsOBJ.resetQuaternion(rotation);
                        console.log(rotation);
                    }
                    if (keysState['KeyE']) {
                        rotation = world.Rotate(physicsOBJ, -0.1);
                        physicsOBJ.resetQuaternion(rotation);
                        console.log(rotation);
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
world.AddAxisHelper(12);
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