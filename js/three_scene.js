import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const loader = new GLTFLoader();

loader.load(
    'assets/formal_avatar.glb',
    (gltf) => {
        setupScene(gltf);
        document.getElementById('avatar-loading').style.display = 'none';
        console.log('avatar added to the scene.');
    },
    (xhr) => {
        // printing the progress
        const percentCompletion = Math.round((xhr.loaded / xhr.total) * 100);
        // document.getElementById('avatar-loading').innerText = `Loading... ${percentCompletion}%`;
        console.log(`Loading model: ${percentCompletion}%`);
    },
    (error) => {
        console.error("[Error]: "+error);
    }
);

function setupScene(gltf) {
    // Rendering setup
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true 
    });

    const container = document.getElementById('avatar-container');
    const ch = container.clientHeight;
    const cw = container.clientWidth;
    console.log(container.clientHeight, container.clientWidth, ch, cw);

    renderer.setSize(cw, ch);
    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.outputEncoding = THREE.sRGBEncoding;
    // renderer.toneMapping = THREE.ACESFilmicToneMapping;

    container.appendChild(renderer.domElement);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, cw / ch);
    camera.position.set(-0.2, 0.5, 1);  // x, y, z

    const controls = new OrbitControls(camera, renderer.domElement);
    // controls.enabled = false; // disbale camera movement
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minDistance = 3;
    controls.minPolarAngle = 1.4;
    controls.maxPolarAngle = 1.4;
    controls.target = new THREE.Vector3(0, 0.75, 0);
    controls.update();

    // Scene setup
    const scene = new THREE.Scene();

    // Lights setup
    scene.add(new THREE.AmbientLight(0xffffff, 1));

    // const spotlight = new THREE.SpotLight(0xffffff, 7, 8, Math.PI/2, 0.5);
    // spotlight.position.set(0, 4, 3);
    // spotlight.castShadow = true;
    // scene.add(spotlight);

    const keylight = new THREE.DirectionalLight(0xffffff, 0.6);
    keylight.position.set(1, 1, 2);
    keylight.lookAt(0, 0, 0);
    scene.add(keylight);

    const keylight2 = new THREE.DirectionalLight(0xffffff, 0.1);
    keylight2.position.set(-10, -1, -2);
    keylight2.lookAt(0, 0, 0);
    scene.add(keylight2);

    // Load the avatar
    const avatar = gltf.scene;
    avatar.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    scene.add(avatar);

    // Create pedestal
    const groundGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 64);
    const groundMaterial = new THREE.MeshStandardMaterial();
    groundMaterial.color = new THREE.Color(0x777777);

    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.castShadow = false;
    groundMesh.receiveShadow = true;
    groundMesh.position.y -= 0.05;
    scene.add(groundMesh);

    // Load animations
    const mixer = new THREE.AnimationMixer(avatar);
    const clips = gltf.animations;
    const waveClip = THREE.AnimationClip.findByName(clips, 'idle');
    const stumbleClip = THREE.AnimationClip.findByName(clips, 'fall');
    const waveAction = mixer.clipAction(waveClip);
    const stumbleAction = mixer.clipAction(stumbleClip);
    
    let isStumbling = false;
    
    container.addEventListener('mousedown', (ev) => {
      const coords = {
        x: (ev.offsetX / cw) * 2 - 1,
        y: -(ev.offsetY / ch) * 2 + 1
      };

      // console.log(coords);

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(coords, camera);
      const intersections = raycaster.intersectObject(avatar);
      // console.log(intersections);
  
      if (intersections.length > 0) {
        // console.log('Avatar clicked');
        // ignore if already stumbling
        if (isStumbling) return;

        isStumbling = true;
        stumbleAction.reset();
        stumbleAction.play();
        waveAction.crossFadeTo(stumbleAction, 0.3);

        setTimeout(() => {
          waveAction.reset();
          waveAction.play();
          stumbleAction.crossFadeTo(waveAction, 0);
          setTimeout(() => isStumbling = false, 1000);
        }, 2500)
      }
    });

    window.addEventListener('resize', () => {
      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
      renderer.setSize(cw, ch);
    });

    const clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);
      mixer.update(clock.getDelta());
      renderer.render(scene, camera);
    }

    animate();
    waveAction.play();
}