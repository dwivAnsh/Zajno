import LocomotiveScroll from 'locomotive-scroll';
import * as THREE from 'three';
import vertex from './src/Experience/Shaders/vertex.glsl';
import fragment from './src/Experience/Shaders/fragment.glsl';

const scroll = new LocomotiveScroll({
  el: document.querySelector('[data-scroll-container]'),
  smooth: true,
  lerp: 0.05,
  multiplier: 0.2 
});

const scene = new THREE.Scene();
const distance = 600;
const fov = 2*Math.atan(window.innerHeight / 2 / distance) * (180 / Math.PI);
const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);

const canvas = document.querySelector('#canvas');
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // for high DPI displays
renderer.setSize(window.innerWidth, window.innerHeight);

// const geometry = new THREE.PlaneGeometry(100,100);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const plane = new THREE.Mesh(geometry, material);
// scene.add(plane);

// image ki height and width ko lekar hum plane bana rahe hain aur plane ko scene mein add karenge fir unko correctly place karengey
const image = document.querySelectorAll('img');
const planes = [];
image.forEach(img => {
  const imgbounds = img.getBoundingClientRect();
  const texture = new THREE.TextureLoader().load(img.src);
  const geometry = new THREE.PlaneGeometry(imgbounds.width, imgbounds.height);
  const material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
      uTexture: { value: texture }
    }
  });
  const plane = new THREE.Mesh(geometry, material);
  // Planes ko website me original position par laa rahe hain
  plane.position.set(imgbounds.left - window.innerWidth / 2 + imgbounds.width / 2, -imgbounds.top + window.innerHeight / 2 - imgbounds.height / 2, 0);  
  planes.push(plane);
  scene.add(plane);
})

camera.position.z = distance;

function updatePlanesPosition(){
  planes.forEach((plane, i) => {
    const img = image[i];
    const imgbounds = img.getBoundingClientRect();
    plane.position.set(imgbounds.left - window.innerWidth / 2 + imgbounds.width / 2, -imgbounds.top + window.innerHeight / 2 - imgbounds.height / 2, 0);
})
}

function animate() {
  requestAnimationFrame(animate);
  updatePlanesPosition();
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  const newFov = 2*Math.atan(window.innerHeight / 2 / distance) * (180 / Math.PI);
  camera.fov = newFov;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();  
  renderer.setSize(window.innerWidth, window.innerHeight);
  updatePlanesPosition();
});




