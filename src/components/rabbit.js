import * as THREE from "three";
import { DRACOLoader } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const rabbit = (scene) => {
  let model;

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/"); // or use local path

  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);
  loader.load(
    "rabbit.glb", // Must be in the same server path or in `public/` if using a bundler
    (gltf) => {
      model = gltf.scene;
      model.scale.set(1, 1, 1);
      model.position.set(0, 0, 0);
      scene.add(model);
    },
    undefined,
    (error) => {
      console.error("An error happened loading the GLB:", error);
    }
  );

  return model;
};

export default rabbit;
