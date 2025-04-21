import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/Addons.js";

const Sphere = (scene, position) => {
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const sphere = new THREE.Mesh(sphereGeometry, material);

  const objectDiv = document.createElement("div");
  objectDiv.className = "label";
  objectDiv.textContent = "test";
  const objectLabel = new CSS2DObject(objectDiv);
  objectLabel.position.set(0, 1.2, 0);

  sphere.position.set(...position);

  const boxHelper = new THREE.BoxHelper(sphere, 0xffffff);
  boxHelper.visible = false;

  const group = new THREE.Group();
  group.add(sphere);
  group.add(boxHelper);
  group.add(objectLabel);

  scene.add(group);

  return group;
};

export default Sphere;
