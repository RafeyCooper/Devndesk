import * as THREE from 'https://unpkg.com/three@0.127.0/build/three.module.js';
import { UnrealBloomPass } from 'https://unpkg.com/three@0.127.0/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'https://unpkg.com/three@0.127.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/three@0.127.0/examples/jsm/postprocessing/RenderPass.js';

const canvas = document.querySelector('#webgl-canvas');
const renderer = new THREE.WebGLRenderer({ canvas });
const container = document.getElementById('servicePageContainer');

renderer.setSize(container.clientWidth, container.clientHeight);

// Create the scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 0;

// Create the stars
const POINTS_COUNT = 70000;
const positions = new Float32Array(POINTS_COUNT * 3);
const colors = new Float32Array(POINTS_COUNT * 3);
const sizes = new Float32Array(POINTS_COUNT);

const palette = ['#ff5733', '#D8FF36', '#ffffff'];

// const palette = ['#ff5733', '#33ff57', '#3357ff'];

const geometry = new THREE.BufferGeometry();
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },  // Mouse uniform
    uTexture: { value: new THREE.TextureLoader().load('https://assets.codepen.io/33787/sprite.png') }
  },
  vertexShader: `
    uniform float uTime;
    uniform vec2 uMouse;
    attribute vec3 color;
    attribute float size;
    varying vec4 vColor;
    void main(){
      vColor = vec4(color, 1.0);
      vec3 p = vec3(position);
      
      // Apply mouse movement as a slight position offset
      p.x += uMouse.x * 3.0; // Reduced factor for smoother effect
      p.y += uMouse.y * 3.0;

      p.z += mod(uTime * 100.0, 300.0); // Move forward based on time
      if (p.z > 150.0) {
        p.z -= 300.0; // Seamless reset at z > 150
      }
      vec4 mvPosition = modelViewMatrix * vec4( p, 1.0 );
      gl_PointSize = size * (-50.0 / mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform sampler2D uTexture;
    varying vec4 vColor;
    void main() {
      gl_FragColor = vColor * texture2D(uTexture, gl_PointCoord);
    }
  `,
  depthTest: false,
  blending: THREE.AdditiveBlending,
});

// Populate star positions and colors
const v3 = new THREE.Vector3();
const color = new THREE.Color();
for (let i = 0; i < POINTS_COUNT; i++) {
  v3.set(
    THREE.MathUtils.randFloatSpread(200),
    THREE.MathUtils.randFloatSpread(200),
    THREE.MathUtils.randFloatSpread(300) - 150
  );
  v3.toArray(positions, i * 3);
  color.set(palette[Math.floor(Math.random() * palette.length)]);
  color.toArray(colors, i * 3);
  sizes[i] = THREE.MathUtils.randFloat(5, 20);
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

const points = new THREE.Points(geometry, material);
scene.add(points);

// Set background color
scene.background = new THREE.Color(0x000000);

// Postprocessing setup
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new UnrealBloomPass(undefined, 2, 0, 0));

// Clock for animation
const clock = new THREE.Clock();

// Mouse tracking variables
let mouseX = 0;
let mouseY = 0;
let targetMouseX = 0;
let targetMouseY = 0;

// Add mouse movement event listener
window.addEventListener('mousemove', (event) => {
  // Normalize mouse coordinates between -1 and 1
  targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
  targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
  requestAnimationFrame(animate);
  
  // Smooth the mouse movement using interpolation (lerp)
  mouseX += (targetMouseX - mouseX) * 0.03; // Adjust the 0.05 value for more or less smoothness
  mouseY += (targetMouseY - mouseY) * 0.03;

  // Update the shader uniforms with the smooth mouse values
  material.uniforms.uMouse.value.x = -mouseX;
  material.uniforms.uMouse.value.y = -mouseY;

  const delta = clock.getDelta();
  material.uniforms.uTime.value += delta * 0.03; // Adjust speed factor here

  composer.render();
}

animate();

// // Handle window resizing
// window.addEventListener('resize', () => {
//   const width = window.innerWidth;
//   const height = window.innerHeight;
//   renderer.setSize(width, height);
//   camera.aspect = width / height;
//   camera.updateProjectionMatrix();
// });
