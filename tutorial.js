import * as THREE from 'three';
import gsap from "gsap";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const canvas = document.querySelector('.canvas')

class BasicWorldDemo {
    constructor() {
        this._Initialize();
    }

    _Initialize() {
        this._threejs = new THREE.WebGLRenderer({
            canvas,
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

        this._camera = new THREE.PerspectiveCamera(45, 1920/1080);
        this._camera.position.set(0, 25, 0);

        this._scene = new THREE.Scene();

        let light = new THREE.DirectionalLight(0xFFFFFF);
        light.position.set(100, 100, 100);
        light.intensity = 2.25;
        light.target.position.set(0, 0, 0);
        this._scene.add(light);

        const controls = new OrbitControls(
            this._camera, this._threejs.domElement);
        controls.target.set(0, 0, 0);
        controls.enableDamping = true;
        controls.enablePan = false;
        controls.enableZoom = false;
        controls.update();

        const sphere = new THREE.SphereGeometry(3, 64, 64);
        const material = new THREE.MeshStandardMaterial({
            color: "#00ff83",
            roughness: 0.4,
        })
        const mesh = new THREE.Mesh(sphere, material);
        this._scene.add(mesh);

        const tl = gsap.timeline({defaults: {duration: 1 } });
        tl.fromTo(mesh.scale, {z: 0, x:0, y:0}, {z:1, x:1, y:1});
        tl.fromTo('nav', {y: '-100%'}, {y: '0%'});
        tl.fromTo('.title', {opacity: 0}, {opacity: 1});

        //mouse anumation color
        let mouseDown = false;
        let rgb = [];
        window.addEventListener('mousedown', () => (mouseDown = true));
        window.addEventListener('mouseup', () => (mouseDown = false));

        window.addEventListener('mousemove', (event) => {
            if (mouseDown) {
                rgb = [
                    Math.round((event.pageX / innerWidth) * 255),
                    Math.round((event.pageY / innerHeight) * 255),
                    150,
                ]
                let newColor = new THREE.Color(`rgb(${rgb.join(',')})`);
                gsap.to(mesh.material.color, {
                    r: newColor.r,
                    g: newColor.g,
                    b: newColor.b,
                })
            }
        })
        
        this._OnWindowResize();
        this._RAF();
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