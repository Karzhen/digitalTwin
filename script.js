import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';


class BasicWorldDemo {
    constructor() {
        this._Initialize();
    }

    _Initialize() {
        this._threejs = new THREE.WebGLRenderer({
          antialias: true,
        });
        this._threejs.shadowMap.enabled = true;
        this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
        this._threejs.setPixelRatio(window.devicePixelRatio);
        this._threejs.setSize(window.innerWidth, window.innerHeight);
    
        document.body.appendChild(this._threejs.domElement);
    
        window.addEventListener('resize', () => {
          this._OnWindowResize();
        }, false);

        const fov = 60,
            aspect = 1920 / 1080,
            near = 1.0,
            far = 1000.0;

        this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this._camera.position.set(5, 5, 0);

        this._scene = new THREE.Scene();

        let light = new THREE.DirectionalLight(0xFFFFFF);
        light.position.set(10, 20, 10);
        light.target.position.set(0, 0, 0);
        light.castShadow = true;
        light.shadow.bias = -0.01;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.near = 1.0;
        light.shadow.camera.far = 500;
        light.shadow.camera.left = 200;
        light.shadow.camera.right = -200;
        light.shadow.camera.top = 200;
        light.shadow.camera.bottom = -200;
        this._scene.add(light);

        light = new THREE.DirectionalLight(0x404040);
        this._scene.add(light);

        const controls = new OrbitControls(
            this._camera, this._threejs.domElement);
        controls.target.set(0, 0, 0);
        controls.update();

        const loader = new THREE.CubeTextureLoader();
        const texture = loader.load([
            './resources/posx.jpg',
            './resources/negx.jpg',
            './resources/posy.jpg',
            './resources/negy.jpg',
            './resources/posz.jpg',
            './resources/negz.jpg',
        ]);
        this._scene.background = texture;

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100, 1, 1),
            new THREE.MeshStandardMaterial({
                color: 0x00FFFF,
                side: THREE.DoubleSide,
            })
        )

        this._hand = null;
        this._base = null;
        
        plane.castShadow = false;
        plane.receiveShadow = true;
        plane.rotation.x = -Math.PI / 2;
        this._scene.add(plane);

        this._LoadModel();
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowUp') {
                this._goForward();
            } else if (event.key === 'ArrowDown') {
                this._goBack();
            } else if (event.key === 'ArrowLeft') {
                this._goBaseLeft();
            } else if (event.key === 'ArrowRight') {
                this._goBaseRight();
            }
        });
        this._RAF();    
    }

    _LoadModel() {
        const loader = new GLTFLoader().setPath('/resources/lowPolyArm/');
        loader.load('scene.gltf', (root) => {
            root.scene.traverse(child => {
                child.castShadow = true;
                console.log(child.name);
                if (child.name === 'arm1_02') {
                    // child.position.z += 10;
                    // Store the loaded model in the class property
                    this._hand = child;
                } else if (child.name === 'base-1_01') {
                    // Store the wheel in the class property
                    this._base = child;
                }
            });
            // this._carModel = root.scene;
            console.log(root);
            root.scene.scale.set(0.030, 0.030, 0.030);
            root.scene.position.set(0, 0, 0);
            this._scene.add(root.scene);
        });
    }

    _goForward() {
        if (this._hand) {
            // Move the hand forward
            this._hand.rotateX(0.02);
        }
    }

    _goBack() {
        if (this._hand) {
            // Move the hand forward
            this._hand.rotateX(-0.02);
        }
    }

    _goBaseLeft() {
        if (this._base) {
            // Rotate the base
            this._base.rotateY(.2);
        }
    }

    _goBaseRight() {
        if (this._base) {
            // Rotate the base
            this._base.rotateY(-0.2);
        }
    }


    _OnWindowResize() {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._threejs.setSize(window.innerWidth, window.innerHeight);
    }

    _RAF() {
        requestAnimationFrame(() => {
            this._threejs.render(this._scene, this._camera);
            this._RAF();
        })
    }
}

let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new BasicWorldDemo();
});