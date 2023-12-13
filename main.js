import * as WORLD from "./world";
import "./public/css/style.css";
import { KeysControl, keysState, defaultSpeed, speed } from "./movement/movement";

let world = new WORLD.WORLD('.webgl');
let listOfChilds = [];
let namesOfChilds = [];
const material = {
    color: '#fa0000',
    roughness: 0.2,
    metalness: 0.3,
};

const ControlHand = (gltf) => {
    gltf.scene.traverse(child => {
        namesOfChilds.push(child.name.toLowerCase());
        listOfChilds.push(child);
    })
    console.log(namesOfChilds);
    const menu = document.querySelector('.menu');
    if (menu) {
        const rangeInputs = menu.querySelectorAll('input[type="range"]');
        rangeInputs.forEach(input => {
            if (namesOfChilds.includes(input.id)) {
                input.addEventListener('input', e => {
                    const index = namesOfChilds.indexOf(input.id);
                    const child = (listOfChilds[index]);
                    const rotation = child.rotation;
                    child.rotation.set(rotation.x, Number(input.value), rotation.z);
                    console.log(child.rotation);
                    if (input.id === "rotator") {
                        listOfChilds[namesOfChilds.indexOf("finger_out_1")].rotation.set(listOfChilds[namesOfChilds.indexOf("finger_out_1")].rotation.x, Number(input.value), listOfChilds[namesOfChilds.indexOf("finger_out_1")].rotation.z);
                        listOfChilds[namesOfChilds.indexOf("finger_out_1")].position.set(listOfChilds[namesOfChilds.indexOf("finger_out_1")].position.x, listOfChilds[namesOfChilds.indexOf("finger_out_1")].position.y, listOfChilds[namesOfChilds.indexOf("finger_out_1")].position.z);
                        // listOfChilds[namesOfChilds.indexOf("finger_out_2")].rotation.set(listOfChilds[namesOfChilds.indexOf("finger_out_2")].rotation.x, Number(input.value), listOfChilds[namesOfChilds.indexOf("finger_out_2")].rotation.z);
                        // listOfChilds[namesOfChilds.indexOf("finger_inner_1001")].rotation.set(listOfChilds[namesOfChilds.indexOf("finger_inner_1001")].rotation.x, Number(input.value), listOfChilds[namesOfChilds.indexOf("finger_inner_1001")].rotation.z);
                        // listOfChilds[namesOfChilds.indexOf("finger_inner_2")].rotation.set(listOfChilds[namesOfChilds.indexOf("finger_inner_2")].rotation.x, Number(input.value), listOfChilds[namesOfChilds.indexOf("finger_inner_2")].rotation.z);
                    }
                })
            }
        })
    }
}

const hand_config = {
    type: 'sphere',
    size: [1, 1, 1], // radius, height, depth (for spheres, only radius is used)
    pos: [0, 0, 0], // initial position
    move: false, // allow movement
    density: 125.1, // density of the object
    friction: 0.91, // friction
    restitution: 0, // bounciness
    createcopy: false,
    scale: [8, 8, 8],
    meshesToRemove: [],
    dirpath: './public/models/mgm-7/',
    namefile: 'Manipulator_004 (2).gltf',
    name: 'hand',
    onload: (gltf, phy) => { 
        ControlHand(gltf);
        KeysControl(world, phy);
    }
}

world.LoadGLTF(hand_config);
world.SetBackgroundImage("./vivid-blurred-colorful-background.jpg");
let light = world.AddLight("HemisphereLight");
world.AddAxisHelper(12);



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