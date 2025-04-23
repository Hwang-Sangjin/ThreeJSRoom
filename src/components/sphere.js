import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/Addons.js";

const Sphere = (scene, position, transformControls, object_arr) => {
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const sphere = new THREE.Mesh(sphereGeometry, material);

  sphere.position.set(...position);

  const boxHelper = new THREE.BoxHelper(sphere, 0xffffff);
  boxHelper.visible = false;

  // Create a CSS2DObject for the label
  const labelDiv = document.createElement("div");
  labelDiv.className = "label";
  labelDiv.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill-rule="nonzero"><path fill="white" d="M7.333 8h-.777v10.4c0 .884.696 1.6 1.555 1.6h7.778c.859 0 1.555-.716 1.555-1.6V8H7.334Z"></path><path fill-opacity="0.48" fill="white" d="M15.592 5.6 14.333 4H9.667L8.408 5.6H5v1.6h14V5.6z"></path></g></svg>';
  labelDiv.style.background = "rgba(175, 175, 175, 0.75)";
  labelDiv.style.color = "white";
  labelDiv.style.padding = "5px";
  labelDiv.style.borderRadius = "5px";
  labelDiv.style.pointerEvents = "auto"; // Ensure SVG is clickable
  labelDiv.style.cursor = "pointer"; // Indicate clickability

  const label = new CSS2DObject(labelDiv);
  label.position.set(0, 2, 0); // Position above the sphere
  label.visible = false;

  // Make SVG clickable
  labelDiv.addEventListener("click", (event) => {
    console.log("SVG clicked for sphere at", position);
    event.stopPropagation(); // Prevent click from triggering background hide
    // Example action: Toggle SVG color
    sphere.remove(label);
    scene.remove(group);
    transformControls.detach();

    const filtered = object_arr.filter((e) => e.uuid !== group.uuid);
    object_arr.length = 0; // Clear original array
    filtered.forEach((e) => object_arr.push(e)); // Repopulate
  });

  sphere.add(label);

  const group = new THREE.Group();
  group.add(sphere);
  group.add(boxHelper);

  scene.add(group);

  return group;
};

export default Sphere;
