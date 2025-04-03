import * as THREE from "three";

const Sphere = (scene, object_arr, position) => {
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const sphere = new THREE.Mesh(sphereGeometry, material);

  sphere.position.set(position[0], position[1], position[2]);
  console.log(sphere);

  const boxHelper = new THREE.BoxHelper(sphere, 0xffffff);
  boxHelper.visible = false;

  const group = new THREE.Group();
  group.add(sphere);
  group.add(boxHelper);

  scene.add(group);

  object_arr.push(group);
};

export default Sphere;
