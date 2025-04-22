import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/Addons.js";

const Sphere = (scene, position) => {
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const sphere = new THREE.Mesh(sphereGeometry, material);

  sphere.position.set(...position);

  const boxHelper = new THREE.BoxHelper(sphere, 0xffffff);
  boxHelper.visible = false;

  // Create a CSS2DObject for the label
  const labelDiv = document.createElement("div");
  labelDiv.className = "label";
  labelDiv.textContent = position;
  labelDiv.style.background = "rgba(0, 0, 0, 0.75)";
  labelDiv.style.color = "white";
  labelDiv.style.padding = "5px";
  labelDiv.style.borderRadius = "5px";

  const label = new CSS2DObject(labelDiv);
  label.position.set(0, 1, 0); // Position above the cube
  label.visible = false;
  sphere.add(label);

  const group = new THREE.Group();
  group.add(sphere);
  group.add(boxHelper);

  scene.add(group);

  return group;
};

export default Sphere;
