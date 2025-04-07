import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import sphere from "./components/sphere";
import { acceleratedRaycast, MeshBVH, MeshBVHHelper } from "three-mesh-bvh";
import Stats from "stats.js";
import { DRACOLoader, GLTFLoader } from "three/examples/jsm/Addons.js";

let scene, camera, renderer, raycaster, mouse, transformControls;
let mouseOverObject = null;
let mouseClickObject = null;
const object_arr = [];

// Scene setup
scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

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
raycaster.firstHitOnly = true;
mouse = new THREE.Vector2();

object_arr.push(sphere(scene, [-2, 0, 0]));
object_arr.push(sphere(scene, [2, 0, 0]));

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/"); // or use local path

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);
loader.load(
  "rabbit.glb", // Must be in the same server path or in `public/` if using a bundler
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(1, 1, 1);
    model.position.set(0, 0, 3);
    scene.add(model);

    const mesh = model.children[0];
    mesh.raycast = acceleratedRaycast;
    mesh.geometry.boundsTree = new MeshBVH(mesh.geometry);

    // 🔍 Add the BVH visual helper
    const helper = new MeshBVHHelper(mesh);
    helper.depth = 2;

    helper.update();
    helper.visible = true; // set to false if you want to toggle later
    scene.add(helper);
  },
  undefined,
  (error) => {
    console.error("An error happened loading the GLB:", error);
  }
);

object_arr.forEach((group) => {
  const mesh = group.children[0];
  mesh.raycast = acceleratedRaycast;
  mesh.geometry.boundsTree = new MeshBVH(mesh.geometry);

  // 🔍 Add the BVH visual helper
  const helper = new MeshBVHHelper(mesh);
  helper.depth = 2;
  helper.update();
  helper.visible = true; // set to false if you want to toggle later
  scene.add(helper);
});

transformControls = new TransformControls(camera, renderer.domElement);
// Prevent OrbitControls while dragging
transformControls.addEventListener("dragging-changed", (event) => {
  controls.enabled = !event.value;
});

const snapThreshold = 0.2; // Adjust this as needed

transformControls.addEventListener("change", () => {
  const movingObject = transformControls.object;
  if (!movingObject) return;

  // Get the moving object's bounding box
  const movingBox = new THREE.Box3().setFromObject(movingObject);
  const movingCenter = new THREE.Vector3();
  movingBox.getCenter(movingCenter);
  const movingSize = new THREE.Vector3();
  movingBox.getSize(movingSize);

  object_arr.forEach((otherObject) => {
    if (otherObject.children[0] === movingObject) return;

    // Get the other object's bounding box
    const otherBox = new THREE.Box3().setFromObject(otherObject.children[0]);
    const otherCenter = new THREE.Vector3();
    otherBox.getCenter(otherCenter);
    const otherSize = new THREE.Vector3();
    otherBox.getSize(otherSize);

    // **Calculate snapping threshold dynamically**
    const snapThresholdX = (movingSize.x + otherSize.x) / 2;
    const snapThresholdY = (movingSize.y + otherSize.y) / 2;
    const snapThresholdZ = (movingSize.z + otherSize.z) / 2;

    // **Snap to the closest edge of the other object**
    if (Math.abs(movingBox.min.x - otherBox.max.x) < snapThreshold) {
      movingObject.position.x = otherBox.max.x + movingSize.x / 2;
    }
    if (Math.abs(movingBox.max.x - otherBox.min.x) < snapThreshold) {
      movingObject.position.x = otherBox.min.x - movingSize.x / 2;
    }

    if (Math.abs(movingBox.min.y - otherBox.max.y) < snapThreshold) {
      movingObject.position.y = otherBox.max.y + movingSize.y / 2;
    }
    if (Math.abs(movingBox.max.y - otherBox.min.y) < snapThreshold) {
      movingObject.position.y = otherBox.min.y - movingSize.y / 2;
    }

    if (Math.abs(movingBox.min.z - otherBox.max.z) < snapThreshold) {
      movingObject.position.z = otherBox.max.z + movingSize.z / 2;
    }
    if (Math.abs(movingBox.max.z - otherBox.min.z) < snapThreshold) {
      movingObject.position.z = otherBox.min.z - movingSize.z / 2;
    }
  });

  // **Update BoxHelper after moving the object**
  movingObject.parent.children[1].setFromObject(movingObject);
});

const gizmo = transformControls.getHelper();
scene.add(gizmo);

// Animation loop
function animate() {
  stats.begin();

  requestAnimationFrame(animate);

  object_arr.forEach((e) => e.children[1].update());

  renderer.render(scene, camera);

  stats.end();
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
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  let intersects = raycaster.intersectObjects(object_arr);
  intersects = intersects.filter((e) => e.object.type !== "BoxHelper");

  if (intersects.length > 0) {
    const group = intersects[0].object.parent;
    const boxHelper = group.children[1];

    if (mouseOverObject && mouseOverObject !== mouseClickObject) {
      mouseOverObject.visible = false; // Hide previous hover helper unless clicked
    }

    if (boxHelper !== mouseClickObject) {
      boxHelper.visible = true; // Show white highlight on hover
      boxHelper.material.color.set("white");
    }

    mouseOverObject = boxHelper;
  } else {
    if (mouseOverObject && mouseOverObject !== mouseClickObject) {
      mouseOverObject.visible = false;
    }
    mouseOverObject = null;
  }
});

window.addEventListener("click", (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  let intersects = raycaster.intersectObjects(object_arr);
  intersects = intersects.filter((e) => e.object.type !== "BoxHelper");

  if (intersects.length > 0) {
    const group = intersects[0].object.parent;
    const boxHelper = group.children[1];

    if (mouseClickObject) {
      mouseClickObject.material.color.set("white"); // Reset previous clicked helper to white
      mouseClickObject.visible = false;
    }

    boxHelper.material.color.set("blue"); // Set clicked helper to blue
    boxHelper.visible = true;
    mouseClickObject = boxHelper;

    // ✅ Attach transform controls to this sphere
    transformControls.attach(group.children[0]); // attach the sphere
  } else {
    if (mouseClickObject) {
      mouseClickObject.material.color.set("white"); // Reset previous clicked helper to white
      mouseClickObject.visible = false;
      mouseClickObject = null;
    }

    // If clicking empty space, detach controls
    transformControls.detach();
  }
});
