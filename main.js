import * as WORLD from "./world";
import "./public/css/style.css";

let world = new WORLD.WORLD('.webgl');
const maxspeed = 7.5;
const defaultSpeed = 3;
const keysState = {};
let speed = defaultSpeed;
const movement = (physicsOBJ) => {
    keysState[event.code] = true;
    if (physicsOBJ) {
        if (keysState['ShiftLeft']) {
            if (speed <= maxspeed) {
                speed += 0.1;
            } 
        } 
        console.log(speed);
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
        if (keysState['KeyR']) {
            world.Stop(physicsOBJ);
        }
        if (keysState['Space']) {
            jump(physicsOBJ);
        }
    }
};
const stopmovement = (physicsOBJ) => {
    keysState[event.code] = false;
};
const KeysControl = (phy) => {
    if (phy) {
        console.log('loaded');
        const jump = (obj) => {
            if (obj.contactLink) {
                console.log("JUMP");
                obj.linearVelocity.y = 10;
            }
        } 
        let rotation;
        // world.BindFunction(phy, jump);
        world.BindFunction(window, phy, movement, "keydown");
        world.BindFunction(window, phy, stopmovement, "keyup");
    }
}

const boxConfig = {
    type: 'sphere',
    size: [1.5, 1.5, 1.5], // radius, height, depth (for spheres, only radius is used)
    pos: [4, 4, 0], // initial position
    move: true, // allow movement
    density: 0.1, // density of the object
    friction: 0.01, // friction
    restitution: 0, // bounciness
    onload: (graphic, phy) => {
        KeysControl(phy);
    }
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
    friction: 0.95, // friction
    density: 0.1, // density of the object
};
// world.CreateSphere(boxConfig, material);
world.CreateBox(floorConfig, material);
world.CreateSphere(boxConfig, material);
const config = {
    type: 'sphere',
    size: [1, 1, 1], // radius, height, depth (for spheres, only radius is used)
    pos: [0, 4, 0], // initial position
    move: true, // allow movement
    density: 125.1, // density of the object
    friction: 0.91, // friction
    restitution: 0, // bounciness
    createcopy: false,
    scale: [1, 1, 1],
    dirpath: './public/models/',
    namefile: 'bird.gltf',
    name: 'bird',
    wireframe: true,
    onload: (gltf, phy) => { 
        KeysControl(phy);
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

let lastPressTime = 0;
document.addEventListener('keydown', (event) => {
    if (event.code === 'KeyR') {
        const currentTime = new Date().getTime();
        if (currentTime - lastPressTime < 300) {
            world.Restart();
            lastPressTime = 0;
        } else {
            lastPressTime = currentTime;
        }
    }
})

document.getElementById('stop').addEventListener('click', () => {
    world.StopAll();
})

const loop = () => {
	world.Loop();
    if (keysState['ShiftLeft'] === false) {
        if (speed >= defaultSpeed) {
            speed -= 0.01;
        }
    }
    window.requestAnimationFrame(loop);
}

loop();