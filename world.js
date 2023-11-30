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
        this.light = new THREE.DirectionalLight(0xffffff);
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
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
        this.figures = []; // { type, physicsOBJ, graphicOBJ }
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

    /* camera
    config = {
        fov: 50,
        aspect: this.sizes.width / this.sizes.height,
        near: 0.1,
        far: 1000,
    }
    */
    SetCameraSettings(config) {
        camera = new THREE.PerspectiveCamera(
            config.fov, 
            config.aspect, 
            config.near, 
            config.far
        );
        this.camera = camera;
    }

    UpdateFigures() {
        for (let i = 0; i < this.figures.length; i++) {
            const figure = this.figures[i];
            if (figure.type === 'gltf') {
                this.UpdatePosition(figure.physicsOBJ, figure.graphicOBJ.scene);
                this.UpdateQuaternion(figure.physicsOBJ, figure.graphicOBJ.scene);
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

    BindFunction(domOBJECT,physicsOBJ, func, typeEvent = 'click') {
        console.log('bind');
        domOBJECT.addEventListener(typeEvent, (event) => {
            func(physicsOBJ);    
        })
    }

    CreateBox(configGEOMETRY, configMATERIAL) {
        configGEOMETRY.type = 'box';
        const geometry = new THREE.BoxGeometry(configGEOMETRY.size[0], configGEOMETRY.size[1], configGEOMETRY.size[2]);
        const material = new THREE.MeshStandardMaterial(configMATERIAL);
        const box = new THREE.Mesh(geometry, material);
        box.castShadow = true;
        this.scene.add(box);
        // phy
        const boxPHY = this.world.add(configGEOMETRY);
        if (configGEOMETRY.name) {
            boxPHY.name = configGEOMETRY.name;
        }
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
        sphere.castShadow = true;
        this.scene.add(sphere);
        // phy
        const spherePHY = this.world.add(configGEOMETRY);
        if (configGEOMETRY.name) {
            spherePHY.name = configGEOMETRY.name;
        }
        this.Bind(configGEOMETRY.type, spherePHY, sphere);
    }

    CreateCylinder(configGEOMETRY, configMATERIAL) {
        configGEOMETRY.type = 'cylinder';
        const geometry = new THREE.CylinderGeometry(configGEOMETRY.size[0], configGEOMETRY.size[1], configGEOMETRY.size[2]);
        const material = new THREE.MeshStandardMaterial(configMATERIAL);
        const cylinder = new THREE.Mesh(geometry, material);
        this.scene.add(cylinder);
        cylinder.castShadow = true;
        // phy
        const cylinderPHY = this.world.add(configGEOMETRY);
        if (configGEOMETRY.name) {
            cylinderPHY.name = configGEOMETRY.name;
        }
        this.Bind(configGEOMETRY.type, cylinderPHY, cylinder);
        if (configGEOMETRY.onload) {
            config.onload(cylinder, cylinderPHY);
        }
    }

    CreateCone(configGEOMETRY, configMATERIAL) { // TODO: CUSTOM GEOMETRY!
        configGEOMETRY.type = 'box';
        const geometry = new THREE.ConeGeometry(configGEOMETRY.size[0], configGEOMETRY.size[1], configGEOMETRY.size[2]);
        const material = new THREE.MeshStandardMaterial(configMATERIAL);
        const cone = new THREE.Mesh(geometry, material);
        this.scene.add(cone);
        cone.castShadow = true;
        // phy
        const conePHY = this.world.add(configGEOMETRY);
        if (configGEOMETRY.name) {
            conePHY.name = configGEOMETRY.name;
        }
        this.Bind(configGEOMETRY.type, conePHY, cone);
        if (configGEOMETRY.onload) {
            config.onload(cone, conePHY);
        }
    }

    CreateRing(configGEOMETRY, configMATERIAL) { // TODO: CUSTOM GEOMETRY!
        configGEOMETRY.type = 'box';
        const geometry = new THREE.RingGeometry(configGEOMETRY.size[0]);
        const material = new THREE.MeshStandardMaterial(configMATERIAL);
        const ring = new THREE.Mesh(geometry, material);
        this.scene.add(ring);
        ring.castShadow = true;
        // phy
        const ringPHY = this.world.add(configGEOMETRY);
        if (configGEOMETRY.name) {
            ringPHY.name = configGEOMETRY.name;
        }
        this.Bind(configGEOMETRY.type, ringPHY, ring);
        if (configGEOMETRY.onload) {
            config.onload(ring, ringPHY);
        }
    }

    /* Расширенный конфиг который принимает LoadGLTF 
    config = {
        type: 'box', // cylinder, box, sphere
        size: [1, 1, 1], // radius, height, depth (for spheres, only radius is used)
        pos: [0, 0, 0], // initial position
        move: false, // allow movement
        density: 0.1, // density of the object
        friction: 0.2, // friction
        restitution: 0.6, // bounciness
        createcopy: false,
        scale: [0.1, 0.1, 0.1],
        dirpath: '/',
        namefile: 'scene.gltf',
        name: 'scene',
        wireframe: false,
        onload: (gltf) => { console.log('gltf loaded'); }
    }
    */
    LoadGLTF(config) { 
        const loader = new GLTFLoader().setPath(config.dirpath);
        loader.load(config.namefile, (gltf) => {
            gltf.scene.traverse(child => {
                child.castShadow = true;
                console.log(child.name, child.position)
                if (child.isMesh) {
                    child.material.wireframe = config.wireframe;
                }
            });

            gltf.scene.scale.set(config.scale[0], config.scale[1], config.scale[2]);
            gltf.scene.position.set(config.pos[0], config.pos[1], config.pos[2]);
            const boundingBox = new THREE.Box3().setFromObject(gltf.scene);
            const size = new THREE.Vector3();
            boundingBox.getSize(size);
            this.scene.add(gltf.scene);
            const configPHY = { 
                type: config.type, 
                size: [size.x, size.y, size.z], 
                pos: config.pos, 
                move: config.move,
                density: config.density, // density of the object
                friction: config.friction, // friction
                restitution: config.restitution, // bounciness
            };
            const boxPHY = this.world.add(configPHY);
            if (config.name) {
                boxPHY.name = config.name;
            }
            if (config.createcopy) {
                switch (config.type) {
                    case 'box':
                        this.CreateBox(configPHY, {
                            color: '#fa0000',
                            wireframe: true
                        });
                        break;
                    case 'sphere':
                        this.CreateSphere(configPHY, {
                            color: '#fa0000',
                            wireframe: true
                        });
                        break;
                    case 'cylinder':
                        console.log(configPHY.size);
                        configPHY.size = [size.x, size.x, size.y];
                        this.CreateCylinder(configPHY, {
                            color: '#fa0000',
                            wireframe: true
                        });
                        break;
                }
            }
            this.Bind('gltf', boxPHY, gltf);
            this.lastLoadedGLTF = gltf;
            if (config.onload) {
                config.onload(gltf, boxPHY);
            }
            return boxPHY;
        });
    }

    SetBackgroundImage(path) {
        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load(path);
        this.scene.background = texture;
    }

    SetBackgroundColour(colour) {
        this.scene.background = new THREE.Color(colour);
    }

    SetBackgroundCubeTexture(array) {
        const loader = new THREE.CubeTextureLoader();
        const texture = loader.load([array]);
        this.scene.background = texture;
    }

    GetObjects() {
        return this.figures;
    }

    GetContacts() {
        return this.world.contacts;
    }

    CheckContact(obj1, obj2) {
        return this.world.checkContact(obj1, obj2);
    }


}

export { WORLD };