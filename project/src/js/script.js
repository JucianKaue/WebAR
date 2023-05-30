import * as THREE from '../../node_modules/three'; // Three.js module
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js'; // Module to control the camera with mouse
// import * as dat from 'dat.gui';
import { GLTFLoader } from '../../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import {ARButton} from '../../node_modules/three/examples/jsm/webxr/ARButton.js';

const blueBlendUrl = new URL('../assets/flyblueblend.glb', import.meta.url);

const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true; // Habilita as sombras do three.js
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.xr.enabled = true;
document.body.appendChild(ARButton.createButton( renderer ));

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);   // Creates the orbit control to control the camera

// const axesHelper = new THREE.AxesHelper(5);     // Helps to understand x, y and z coordinates
// scene.add(axesHelper);

camera.position.set(-20, 10, 0); // Set the position of the camera (x, y, z)
orbit.update(); // Update the camera every time we rotate it

// // Creates a box
// const boxGeometry = new THREE.BoxGeometry();    // Creates the format of the object
// const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00FF00});      // Creates the material of the object
// const box = new THREE.Mesh(boxGeometry, boxMaterial);           // Creates the mesh (format + material = object)
// scene.add(box);

//Creates a plane geometry
const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshBasicMaterial({ // MeshBasicMaterial does not needs light
    color: 0xFFFFFF,
    side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)
plane.rotation.x = -0.5  * Math.PI;
plane.receiveShadow = true;

// Creates a grid on the ground
const gridHelper = new THREE.GridHelper(30, 50); // (size, number of squares)
scene.add(gridHelper)

// Creates a sphere
// const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
// const sphereMaterial = new THREE.MeshStandardMaterial({
//     color: 0x0000FF,
//     wireframe: false
// }); // MeshStantardMarterial needs light to work
// const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
// scene.add(sphere);
// sphere.position.set(-10, 10, 0);
// sphere.castShadow = true;

// Creates an ambient light
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// Creates a direction light
const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
scene.add(directionalLight);
directionalLight.position.set(-30, 50, 0);
directionalLight.castShadow = true;

// // Creates a helper for the light
// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight);
// scene.add(dLightHelper);

// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(dLightShadowHelper)

const assetLoader = new GLTFLoader();
let blueblend;

assetLoader.load(blueBlendUrl.href, function(gltf) {
    const model = gltf.scene;
    scene.add(model);
    model.position.set(0, 0, 0);
}, undefined, function(error) {
    console.log(error)
});


// user input 
const gui = new dat.GUI();

const options = {
    sphereColor: '#ffea00',
    wireframe: false,
    speed: 0.01
};

gui.addColor(options, 'sphereColor').onChange(function(e) {
    sphere.material.color.set(e);
});

gui.add(options, 'wireframe').onChange(function(e) {
    sphere.material.wireframe = 0;
});

gui.add(options, 'speed', 0, 0.1);


let step = 0;

// Creates an animation
function animate(time) {
    // Animates the sphere
    step += options.speed;

    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight)
})
