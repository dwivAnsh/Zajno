import LocomotiveScroll from "locomotive-scroll";

const locomotiveScroll = new LocomotiveScroll();

import * as THREE from "three";
import vertex from "./shaders/vertex.glsl";
import fragment from "./shaders/fragment.glsl";
import gsap from "gsap";

const scene = new THREE.Scene();
const distance = 20; // camera ki pos matter nahi karega 100 by 100 ka plane hi dikhega
const fov = Math.atan((window.innerHeight / 2) / distance) * 2 * (180 / Math.PI);
const camera = new THREE.PerspectiveCamera(
  fov,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("canvas"),
  antialias: true,
  alpha: true,
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

// Initialize raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// images ko plane par le aaye
const images = document.querySelectorAll("img");
const planes = [];
images.forEach((image) => {
  const imgbounds = image.getBoundingClientRect();
  const texture = new THREE.TextureLoader().load(image.src);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: texture },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uHover: { value: 0 },
    },
    vertexShader: vertex,
    fragmentShader: fragment,
  });
  const geometry = new THREE.PlaneGeometry(imgbounds.width, imgbounds.height);
  const plane = new THREE.Mesh(geometry, material);
  // humne sabhi planes ki position set kardi hai joh hai html images ke peeche
  plane.position.set(
    imgbounds.left - window.innerWidth / 2 + imgbounds.width / 2,
    -imgbounds.top + window.innerHeight / 2 - imgbounds.height / 2,
    0
  );
  planes.push(plane);
  scene.add(plane);
});

camera.position.z = distance;

function updatePlanesPosition() {
  planes.forEach((plane, index) => {
    const image = images[index];
    const imgbounds = image.getBoundingClientRect();
    plane.position.set(
      imgbounds.left - window.innerWidth / 2 + imgbounds.width / 2,
      -imgbounds.top + window.innerHeight / 2 - imgbounds.height / 2,
      0
    );
  });
}

function animate() {
  requestAnimationFrame(animate);
  updatePlanesPosition();
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  const newFov = Math.atan(window.innerHeight / 2 / 5) * 2 * (180 / Math.PI);
  camera.fov = newFov;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  updatePlanesPosition();
});

// Mouse move event to apply raycasting with GSAP hover effect
window.addEventListener("mousemove", (e) => {
  // Convert mouse position to normalized device coordinates (NDC)
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  // Cast a ray from the camera
  raycaster.setFromCamera(mouse, camera);

  // Check for intersections
  const intersects = raycaster.intersectObjects(planes);

  // Reset uHover for all planes smoothly
  planes.forEach((plane) => {
    gsap.to(plane.material.uniforms.uHover, {
      value: 0,
      duration: 0.3
    });
  });

  // Animate only the intersected plane's uniform
  if (intersects.length > 0) {
    const intersectedPlane = intersects[0];
    const uv = intersectedPlane.uv;
    gsap.to(intersectedPlane.object.material.uniforms.uMouse.value, {
      x: uv.x,
      y: uv.y,
      duration: 0.3
    });
    gsap.to(intersectedPlane.object.material.uniforms.uHover, {
      value: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  }
});
