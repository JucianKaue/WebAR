import * as THREE from '../libs/three125/three.module.js';
import { OrbitControls } from '../libs/three125/OrbitControls.js';
import { GLTFLoader } from '../libs/three125/GLTFLoader.js';
import { Stats } from '../libs/stats.module.js';
import { CanvasUI } from '../libs/three125/CanvasUI.js';
import { ARButton } from '../libs/ARButton.js';
import { LoadingBar } from '../libs/LoadingBar.js';
import { Player } from '../libs/three125/Player.js';
import { ControllerGestures } from '../../libs/three125/ControllerGestures.js';
class App{
    constructor() {
        const container = document.createElement('div')
        document.body.appendChild(container)

        this.clock = new THREE.Clock()

        // This code creates the camera 
        // https://threejs.org/docs/#api/en/cameras/PerspectiveCamera
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth/window.innerHeight, 0.1, 100)

        // Creates the scene
        this.scene = new THREE.Scene()

        this.scene.add(this.camera)
        this.scene.add(new THREE.HemisphereLight(0x606060, 0x404040))

        const light = new THREE.DirectionalLight( 0xffffff )
        this.scene.add(light)

        this.renderer = new THREE.WebGLRenderer({antialias: true})
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.outputEncoding = THREE.sRGBEncoding

        container.appendChild(this.renderer.domElement)

        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.target.set(0, 3.5, 0)
        this.controls.update()

        this.stats = new Stats()

        this.origin = new THREE.Vector3()
        this.euler = new THREE.Euler()
        this.quaternion = new THREE.Quaternion()

        this.initScene()
        this.setupXR()

        window.addEventListener('rezise', this.resize.bind(this))

    }

    initScene() {

        this.assetsPath = './assets/';
        const loader = new GLTFLoader().setPath(this.assetsPath)
        const self = this

        
    }

    setupXR() {
        this.renderer.xr.enabled = true;

        const self = this;

        function onSessionStart() {
            self.quaternion.mesh.position.set(0, -0.2, -0.3);
            self.camera.add(self.quaternion.mesh);
        }

        function onSessionEnd() {
            self.camera.remove(self.quaternion.mesh);
        }

        const btn = new ARButton(this.renderer, {onSessionStart, onSessionEnd});

        this.gestures = new ControllerGestures(this.renderer);
        this.gestures.addEventListener('tap', (ev) => {
            console.log('tap')
            self.quaternion.updateElement('info', 'tap')

        })

    }

    resize(){
    }
    
	render( ) {   
    }
}

export { App };