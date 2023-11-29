import * as THREE from 'three';
import "./oimo.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"; // control for keys/mouse
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; // gtlf loader

/*
Здесь описан мир который является мостом для THREE и OIMO
*/

class WORLD {
    constructor(htlmCLASS) {
        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight,
        }
        this.scene = new THREE.Scene(); // основная сцена
        this.scene.background = new THREE.Color('white');
        this.world = new OIMO.World({  // физический мир
            timestep: 1 / 60, 
            iterations: 8, 
            broadphase: 2, // 1: brute force, 2: sweep and prune, 3: volume tree
            worldscale: 0.5, // scale full world
            random: true, // randomize sample
            info: false, // calculate statistic or not
        }); 
        // Lights
        this.light = new THREE.HemisphereLight(0xffffff);
        this.light.position.set(0, 40, 30);
        this.scene.add(this.light);
        // Camera
        this.camera = new THREE.PerspectiveCamera(
            50, 
            this.sizes.width / this.sizes.height, 
            0.1, 
            1000
        );
        this.camera.position.z = -20;
        this.scene.add(this.camera);
        // Render
        this.canvas = document.querySelector(`.${htlmCLASS}`);
        this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(2);
        this.renderer.render(this.scene, this.camera);
        // Controls
        this.controls = new OrbitControls(this.camera, this.canvas);
        // Resize
        window.addEventListener('resize', () => {
            // Update Sizes
            this.sizes.width = window.innerWidth;
            this.sizes.height = window.innerHeight;
            // Update Camera
            this.camera.aspect = this.sizes.width / this.sizes.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.sizes.width, this.sizes.height);
        })
        // массив объектов
        this.figures = [];
        this.lastLoadedGLTF;
    }

    UpdateWorld() { // need use in loop
        this.world.step();
    }
    
    Render() {
        this.renderer.render(this.scene,this.camera);
    }

    UpdateControls() {
        this.controls.update();
    }

    Loop() {
        this.UpdateControls();
        this.UpdateWorld();
        if (this.figures.length > 0) {
            this.UpdateFigures();
        }
        this.Render();
    }

    UpdateFigures() {
        for (let i = 0; i < this.figures.length; i++) {
            const figure = this.figures[i];
            if (figure.type === 'gltf') {
                continue;
            }
            this.UpdatePosition(figure.physicsOBJ, figure.graphicOBJ);
            this.UpdateQuaternion(figure.physicsOBJ, figure.graphicOBJ);
        }
    }

    UpdatePosition(physicsOBJ, graphicOBJ) {
        const position = physicsOBJ.getPosition();
        graphicOBJ.position.set(position.x, position.y, position.z);
    }

    UpdateQuaternion(physicsOBJ, graphicOBJ) {
        const quaternion = physicsOBJ.getQuaternion();
    }

    Bind(type, physicsOBJ, graphicOBJ) {
        this.figures.push({ type: type, physicsOBJ: physicsOBJ, graphicOBJ: graphicOBJ });
    }

    CreateBox(configGEOMETRY, configMATERIAL) {
        configGEOMETRY.type = 'box';
        const geometry = new THREE.BoxGeometry(configGEOMETRY.size[0], configGEOMETRY.size[1], configGEOMETRY.size[2]);
        const material = new THREE.MeshStandardMaterial(configMATERIAL);
        const box = new THREE.Mesh(geometry, material);
        this.scene.add(box);
        // phy
        const boxPHY = this.world.add(configGEOMETRY);
        this.Bind(configGEOMETRY.type, boxPHY, box);
    }

    CreateSphere(configGEOMETRY, configMATERIAL, configSPHERE) {
        configGEOMETRY.type = 'sphere';
        let geometry;
        if (configSPHERE) {
            console.log(configSPHERE);
            geometry = new THREE.SphereGeometry(configSPHERE.radius, configSPHERE.widthSegments, configSPHERE.heightSegments,
                configSPHERE.phiStart, configSPHERE.phiLenght, configSPHERE.thetaStart, configSPHERE.thetaLenght);
            configGEOMETRY.size = [configSPHERE.radius];
            
        } 
        else {
            geometry = new THREE.SphereGeometry(configGEOMETRY.size[0]);
        }
        const material = new THREE.MeshStandardMaterial(configMATERIAL);
        const sphere = new THREE.Mesh(geometry, material);
        this.scene.add(sphere);
        // phy
        const spherePHY = this.world.add(configGEOMETRY);
        this.Bind(configGEOMETRY.type, spherePHY, sphere);
    }

    CreateCylinder(configGEOMETRY, configMATERIAL) {
        configGEOMETRY.type = 'cylinder';
        const geometry = new THREE.CylinderGeometry(configGEOMETRY.size[0], configGEOMETRY.size[1], configGEOMETRY.size[2]);
        const material = new THREE.MeshStandardMaterial(configMATERIAL);
        const cylinder = new THREE.Mesh(geometry, material);
        this.scene.add(cylinder);
        // phy
        const cylinderPHY = this.world.add(configGEOMETRY);
        this.Bind(configGEOMETRY.type, cylinderPHY, cylinder);
    }

    CreateCone(configGEOMETRY, configMATERIAL) { // TODO: CUSTOM GEOMETRY!
        configGEOMETRY.type = 'box';
        const geometry = new THREE.ConeGeometry(configGEOMETRY.size[0], configGEOMETRY.size[1], configGEOMETRY.size[2]);
        const material = new THREE.MeshStandardMaterial(configMATERIAL);
        const cone = new THREE.Mesh(geometry, material);
        this.scene.add(cone);
        // phy
        const conePHY = this.world.add(configGEOMETRY);
        this.Bind(configGEOMETRY.type, conePHY, cone);
    }

    CreateRing(configGEOMETRY, configMATERIAL) { // TODO: CUSTOM GEOMETRY!
        configGEOMETRY.type = 'box';
        const geometry = new THREE.RingGeometry(configGEOMETRY.size[0]);
        const material = new THREE.MeshStandardMaterial(configMATERIAL);
        const sphere = new THREE.Mesh(geometry, material);
        this.scene.add(sphere);
        // phy
        const spherePHY = this.world.add(configGEOMETRY);
        this.Bind(configGEOMETRY.type, spherePHY, sphere);
    }

    LoadGLTF(dirpath, namefile, scale = [0.1, 0.1, 0.1], position = [0, 0, 0]) {
        const loader = new GLTFLoader().setPath(dirpath);
        loader.load(namefile, (gltf) => {
            console.log('gltf loaded!');
            gltf.scene.traverse(child => {
                child.castShadow = true;
            });
            gltf.scene.scale.set(scale[0], scale[1], scale[2]);
            gltf.scene.position.set(position[0], position[1], position[2]);
            // Traverse through the scene to set properties and get bounding box
            const boundingBox = new THREE.Box3().setFromObject(gltf.scene);
            // Get the size of the bounding box
            const size = new THREE.Vector3();
            boundingBox.getSize(size);
            this.scene.add(gltf.scene);
            const boxPHY = this.world.add({ type: 'box', size: [size.x, size.y, size.z], pos:[position[0], position[1], position[2]], move: false });
            this.CreateBox({ type: 'box', size: [size.x, size.y, size.z], pos:[position[0], position[1], position[2]], move: false }, {
                color: '#fa0000',
                wireframe: true
            }
            );
            this.Bind('gltf', boxPHY, gltf);
            this.lastLoadedGLTF = gltf;
        });
    }

    SetBackgroundImage(path) {
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(path);
        this.scene.background = texture;
    }

    GetObjects() {
        return this.figures;
    }
}

export { WORLD };