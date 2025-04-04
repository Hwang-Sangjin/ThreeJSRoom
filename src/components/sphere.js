import * as THREE from "three";

const Sphere = (scene, position) => {
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const sphere = new THREE.Mesh(sphereGeometry, material);

  sphere.position.set(...position);

  const boxHelper = new THREE.BoxHelper(sphere, 0xffffff);
  boxHelper.visible = false;

  const group = new THREE.Group();
  group.add(sphere);
  group.add(boxHelper);

  scene.add(group);

  return group;
};

export default Sphere;
