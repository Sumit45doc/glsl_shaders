import { Clock, Color, Mesh, PerspectiveCamera, PlaneGeometry, Scene, ShaderMaterial, Vector2, WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import vertexShader from './shaders/test/ragging_sea/vertex.glsl'
import fragmentShader from './shaders/test/ragging_sea/fragment.glsl'
import './style.css'


const canvas = document.querySelector('canvas.webgl');

const scene = new Scene();

const waterGeometry = new PlaneGeometry(2, 2, 512, 512);

const waterMaterial = new ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms:
    {
        uTime: { value: 0 },
        
        uBigWavesElevation: { value: 0.2 },
        uBigWavesFrequency: { value: new Vector2(4, 1.5) },
        uBigWavesSpeed: { value: 0.75 },

        uSmallWavesElevation: { value: 0.15 },
        uSmallWavesFrequency: { value: 3 },
        uSmallWavesSpeed: { value: 0.2 },
        uSmallIterations: { value: 4 },

        uDepthColor: { value: new Color('#186691') },
        uSurfaceColor: { value: new Color('#9bd8ff') },
        uColorOffset: { value: 0.08 },
        uColorMultiplier: { value: 5 }
    }
})

const water = new Mesh(waterGeometry, waterMaterial);
water.rotation.x = - Math.PI * 0.5;
scene.add(water);


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
scene.add(camera)


const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

const renderer = new WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


const clock = new Clock();

const animate = () => {
    const elapsedTime = clock.getElapsedTime()

    waterMaterial.uniforms.uTime.value = elapsedTime

    controls.update()

    renderer.render(scene, camera)

    window.requestAnimationFrame(animate)

}

animate()