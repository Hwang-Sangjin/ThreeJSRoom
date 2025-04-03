import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import sphere from "./components/sphere";

let scene, camera, renderer, raycaster, mouse;
let mouseOverObject = null;
let mouseClickObject = null;
const object_arr = [];

// Scene setup
scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Camera setup
camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 2, 5);

// Renderer setup
renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(sizes.width, sizes.height);
document.body.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5).normalize();
scene.add(light);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// Raycaster & Mouse Setup
raycaster = new THREE.Raycaster();
mouse = new THREE.Vector2();

sphere(scene, object_arr, [-2, 0, 0]);
sphere(scene, object_arr, [2, 0, 0]);
// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("mousemove", (event) => {
  // Convert mouse position to normalized device coordinates (-1 to +1)
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;

  // Raycasting
  raycaster.setFromCamera(mouse, camera);
  let intersects = raycaster.intersectObjects(object_arr);
  intersects = intersects.filter((e) => {
    return e.object.type !== "BoxHelper";
  });

  if (intersects.length > 0) {
    const group = intersects[0].object.parent;

    if (mouseOverObject) {
      mouseOverObject.visible = false;
    }

    group.children[1].visible = true;
    mouseOverObject = group.children[1];
  } else {
    if (mouseOverObject) {
      mouseOverObject.visible = false;
      mouseOverObject = null;
    }
  }
});

window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;

  // Raycasting
  raycaster.setFromCamera(mouse, camera);
  let intersects = raycaster.intersectObjects(object_arr);
  intersects = intersects.filter((e) => {
    return e.object.type !== "BoxHelper";
  });

  if (intersects.length > 0) {
    const group = intersects[0].object.parent;

    console.log(group.children[1].material.color.set(new THREE.Color("blue")));

    // if (mouseClickObject) {
    //   mouseClickObject.Color.set("0xffffff");
    // }

    // group.children[1].visible = true;
    // mouseOverObject = group.children[1];
  }
});
