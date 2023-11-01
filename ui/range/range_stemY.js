import * as THREE from 'three';

window.onload = () => {
    const range_stemY = document.getElementById("range_stemY");

    range_stemY.addEventListener("input", event => {
        if (stemObject) {
            stemObject.position.set(-3, Number(range_stemY.value), -5);
            stemObject.scale.set(0.05, 0.05, 0.05);
            const boundingBox = new THREE.Box3().setFromObject(stemObject);

            // Get the dimensions
            const objectDimensions = new THREE.Vector3();
            boundingBox.getSize(objectDimensions);

            console.log('Length:', objectDimensions.x);
            console.log('Width:', objectDimensions.y);
            console.log('Height:', objectDimensions.z);
        }
    });
};
