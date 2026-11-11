import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface Farm3DCanvasProps {
  animalId: string;
  frenzyActive: boolean;
  onAnimalClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const Farm3DCanvas: React.FC<Farm3DCanvasProps> = ({
  animalId,
  frenzyActive,
  onAnimalClick,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animalGroupRef = useRef<THREE.Group | null>(null);
  const squishRef = useRef<{ scaleY: number; scaleXZ: number; vy: number }>({
    scaleY: 1,
    scaleXZ: 1,
    vy: 0,
  });
  const haloRef = useRef<THREE.Group | null>(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  // Trigger 3D squish animation when clicked
  const trigger3DSquish = () => {
    squishRef.current.scaleY = 0.7;
    squishRef.current.scaleXZ = 1.25;
    squishRef.current.vy = 8.0;
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xfcf8f2); // warm pastoral sky/canvas

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 2.8, 6.2);
    camera.lookAt(0, 0.7, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 4. OrbitControls for friendly 3D inspection
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enablePan = false;
    controls.minDistance = 3.5;
    controls.maxDistance = 8.5;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // prevent going below ground
    controls.target.set(0, 0.7, 0);

    // 5. Lighting
    const hemiLight = new THREE.HemisphereLight(0xfff8ee, 0x86b049, 1.4);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfff3d6, 2.2);
    dirLight.position.set(4, 8, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 20;
    dirLight.shadow.camera.left = -3;
    dirLight.shadow.camera.right = 3;
    dirLight.shadow.camera.top = 3;
    dirLight.shadow.camera.bottom = -3;
    dirLight.shadow.bias = -0.0008;
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x93c5fd, 0.8);
    rimLight.position.set(-4, 3, -4);
    scene.add(rimLight);

    // 6. Pastoral Ground & Contact Shadow
    const groundGeo = new THREE.CylinderGeometry(2.6, 2.8, 0.3, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x8ec965,
      roughness: 0.8,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.15;
    ground.receiveShadow = true;
    scene.add(ground);

    // Cute rustic wooden fence posts around ground
    const fenceGroup = new THREE.Group();
    const postGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.5, 8);
    const postMat = new THREE.MeshStandardMaterial({ color: 0x8d5b2d, roughness: 0.9 });
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const post = new THREE.Mesh(postGeo, postMat);
      post.position.set(Math.cos(angle) * 2.3, 0.25, Math.sin(angle) * 2.3);
      post.castShadow = true;
      fenceGroup.add(post);
    }
    scene.add(fenceGroup);

    // Soft Contact Shadow Plane beneath animal
    const shadowGeo = new THREE.PlaneGeometry(2.4, 2.4);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x2e4418,
      transparent: true,
      opacity: 0.28,
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.005;
    scene.add(contactShadow);

    // 7. Golden Frenzy Halo Ring
    const haloGroup = new THREE.Group();
    haloRef.current = haloGroup;
    const ringGeo = new THREE.TorusGeometry(1.4, 0.04, 12, 32);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.8,
      roughness: 0.3,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.8;
    haloGroup.add(ring);

    // Little floating golden sparkle cubes
    for (let i = 0; i < 6; i++) {
      const spGeo = new THREE.BoxGeometry(0.08, 0.08, 0.08);
      const sp = new THREE.Mesh(spGeo, ringMat);
      const a = (i / 6) * Math.PI * 2;
      sp.position.set(Math.cos(a) * 1.4, 0.8, Math.sin(a) * 1.4);
      haloGroup.add(sp);
    }
    haloGroup.visible = false;
    scene.add(haloGroup);

    // 8. Build 3D Animal Model
    const animalRoot = new THREE.Group();
    animalGroupRef.current = animalRoot;
    buildAnimal3DModel(animalRoot, animalId);
    scene.add(animalRoot);

    // Animation Loop
    let animationFrameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      controls.update();

      // Damped spring physics for click squish
      const sq = squishRef.current;
      const k = 35.0; // stiffness
      const d = 5.5; // damping
      const forceY = -k * (sq.scaleY - 1.0) - d * sq.vy;
      sq.vy += forceY * delta;
      sq.scaleY += sq.vy * delta;
      sq.scaleXZ = 1.0 + (1.0 - sq.scaleY) * 0.8;

      if (animalGroupRef.current) {
        // Idle gentle breathing bob
        const idleBob = Math.sin(elapsed * 3.5) * 0.03;
        animalGroupRef.current.position.y = idleBob;

        // Idle slow rotation
        animalGroupRef.current.rotation.y = Math.sin(elapsed * 0.8) * 0.15;

        // Apply squish scale
        animalGroupRef.current.scale.set(
          sq.scaleXZ,
          Math.max(0.4, sq.scaleY),
          sq.scaleXZ
        );
      }

      // Halo animation
      if (haloRef.current) {
        haloRef.current.rotation.y += delta * 1.5;
        haloRef.current.position.y = 0.7 + Math.sin(elapsed * 4) * 0.08;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Animal Model when animalId changes
  useEffect(() => {
    if (!animalGroupRef.current) return;
    // Clear existing children
    while (animalGroupRef.current.children.length > 0) {
      const child = animalGroupRef.current.children[0];
      animalGroupRef.current.remove(child);
    }
    buildAnimal3DModel(animalGroupRef.current, animalId);
    trigger3DSquish();
  }, [animalId]);

  // Update Halo when frenzyActive changes
  useEffect(() => {
    if (haloRef.current) {
      haloRef.current.visible = frenzyActive;
    }
  }, [frenzyActive]);

  const handlePointerDown = (e: React.MouseEvent<HTMLDivElement>) => {
    trigger3DSquish();
    onAnimalClick(e);
  };

  return (
    <div
      ref={mountRef}
      onMouseDown={handlePointerDown}
      className="relative w-full h-72 sm:h-84 cursor-grab active:cursor-grabbing select-none rounded-3xl overflow-hidden"
    >
      {/* 3D Orbit hint overlay */}
      <div className="absolute top-2.5 right-3 bg-stone-900/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full pointer-events-none z-10 flex items-center gap-1">
        <span>🔄 드래그하여 3D 회전</span>
      </div>
    </div>
  );
};

/* =========================================================================
 * Procedural 3D Animal Model Builder using Three.js Meshes & PBR Materials
 * ========================================================================= */

function buildAnimal3DModel(group: THREE.Group, id: string) {
  switch (id) {
    case 'chicken':
      build3DChicken(group);
      break;
    case 'duck':
      build3DDuck(group);
      break;
    case 'pig':
      build3DPig(group);
      break;
    case 'sheep':
      build3DSheep(group);
      break;
    case 'cow':
      build3DCow(group);
      break;
    case 'goat':
      build3DGoat(group);
      break;
    case 'alpaca':
      build3DAlpaca(group);
      break;
    case 'horse':
      build3DHorse(group);
      break;
    default:
      build3DChicken(group);
  }
}

// 1. 3D CHICKEN
function build3DChicken(g: THREE.Group) {
  // Straw Nest
  const nestGeo = new THREE.TorusGeometry(0.85, 0.22, 12, 28);
  const nestMat = new THREE.MeshStandardMaterial({ color: 0xd4a359, roughness: 0.9 });
  const nest = new THREE.Mesh(nestGeo, nestMat);
  nest.rotation.x = Math.PI / 2;
  nest.position.y = 0.2;
  nest.receiveShadow = true;
  g.add(nest);

  // Plump Body
  const bodyGeo = new THREE.SphereGeometry(0.75, 24, 20);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.set(0, 0.85, 0);
  body.scale.set(1, 1.15, 1.1);
  body.castShadow = true;
  g.add(body);

  // Red Comb
  const combGeo = new THREE.SphereGeometry(0.18, 16, 12);
  const redMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 });
  const comb1 = new THREE.Mesh(combGeo, redMat);
  comb1.position.set(0, 1.75, 0.1);
  comb1.scale.set(0.6, 1.4, 0.9);
  g.add(comb1);

  const comb2 = new THREE.Mesh(combGeo, redMat);
  comb2.position.set(0, 1.7, -0.15);
  comb2.scale.set(0.6, 1.2, 0.8);
  g.add(comb2);

  // Golden Beak
  const beakGeo = new THREE.ConeGeometry(0.14, 0.35, 12);
  const beakMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.3 });
  const beak = new THREE.Mesh(beakGeo, beakMat);
  beak.rotation.x = Math.PI / 2;
  beak.position.set(0, 1.05, 0.85);
  g.add(beak);

  // Wattle
  const wattleGeo = new THREE.SphereGeometry(0.1, 12, 12);
  const wattle = new THREE.Mesh(wattleGeo, redMat);
  wattle.position.set(0, 0.85, 0.75);
  wattle.scale.set(0.6, 1.2, 0.7);
  g.add(wattle);

  // Eyes
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2 });
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), eyeMat);
  eyeL.position.set(0.3, 1.25, 0.65);
  const eyeR = eyeL.clone();
  eyeR.position.x = -0.3;
  g.add(eyeL, eyeR);

  // Cheeks
  const blushMat = new THREE.MeshStandardMaterial({ color: 0xfda4af, roughness: 0.8 });
  const blushL = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), blushMat);
  blushL.position.set(0.42, 1.1, 0.62);
  blushL.scale.set(1, 0.6, 0.5);
  const blushR = blushL.clone();
  blushR.position.x = -0.42;
  g.add(blushL, blushR);

  // Wings
  const wingGeo = new THREE.SphereGeometry(0.4, 16, 12);
  const wingMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });
  const wingL = new THREE.Mesh(wingGeo, wingMat);
  wingL.position.set(0.72, 0.85, 0);
  wingL.scale.set(0.25, 0.8, 1.1);
  wingL.rotation.z = -0.2;
  const wingR = wingL.clone();
  wingR.position.x = -0.72;
  wingR.rotation.z = 0.2;
  g.add(wingL, wingR);

  // 3D Eggs in Nest
  const eggGeo = new THREE.SphereGeometry(0.18, 14, 14);
  const eggMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.4 });
  const egg1 = new THREE.Mesh(eggGeo, eggMat);
  egg1.scale.set(0.8, 1.15, 0.8);
  egg1.position.set(0.6, 0.35, 0.5);
  const egg2 = egg1.clone();
  egg2.position.set(-0.55, 0.35, 0.55);
  g.add(egg1, egg2);
}

// 2. 3D DUCK
function build3DDuck(g: THREE.Group) {
  // Water Ripple Base
  const pond = new THREE.Mesh(
    new THREE.CylinderGeometry(1.0, 1.05, 0.08, 32),
    new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.3 })
  );
  pond.position.y = 0.05;
  g.add(pond);

  // Duck Body
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.72, 24, 20),
    new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.5 })
  );
  body.position.set(0, 0.65, 0);
  body.scale.set(1.0, 0.9, 1.3);
  body.castShadow = true;
  g.add(body);

  // Emerald Green Head
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.46, 20, 18),
    new THREE.MeshStandardMaterial({ color: 0x0d9488, roughness: 0.35, metalness: 0.15 })
  );
  head.position.set(0, 1.35, 0.4);
  head.castShadow = true;
  g.add(head);

  // Orange Wide Bill
  const bill = new THREE.Mesh(
    new THREE.BoxGeometry(0.38, 0.12, 0.45),
    new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4 })
  );
  bill.position.set(0, 1.25, 0.85);
  bill.rotation.x = 0.15;
  g.add(bill);

  // Eyes
  const eyeL = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
  );
  eyeL.position.set(0.3, 1.45, 0.65);
  const pupil = new THREE.Mesh(
    new THREE.SphereGeometry(0.035, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0x000000 })
  );
  pupil.position.z = 0.04;
  eyeL.add(pupil);
  const eyeR = eyeL.clone();
  eyeR.position.x = -0.3;
  g.add(eyeL, eyeR);
}

// 3. 3D PIG
function build3DPig(g: THREE.Group) {
  // Muddy Patch with Truffle
  const truffle = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.2, 1),
    new THREE.MeshStandardMaterial({ color: 0x292524, roughness: 0.9 })
  );
  truffle.position.set(0.7, 0.2, 0.6);
  g.add(truffle);

  // Chubby Body
  const pigPink = new THREE.MeshStandardMaterial({ color: 0xfbcfe8, roughness: 0.6 });
  const darkPink = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.5 });

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.85, 24, 20), pigPink);
  body.position.set(0, 0.85, 0);
  body.scale.set(1.05, 0.95, 1.2);
  body.castShadow = true;
  g.add(body);

  // 4 Little Legs
  const legGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.35, 12);
  const legFL = new THREE.Mesh(legGeo, darkPink);
  legFL.position.set(0.4, 0.2, 0.45);
  const legFR = legFL.clone();
  legFR.position.x = -0.4;
  const legBL = legFL.clone();
  legBL.position.z = -0.45;
  const legBR = legFR.clone();
  legBR.position.z = -0.45;
  g.add(legFL, legFR, legBL, legBR);

  // Pig Snout
  const snout = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.3, 0.18, 16), darkPink);
  snout.rotation.x = Math.PI / 2;
  snout.position.set(0, 0.8, 1.05);
  g.add(snout);

  // Nostrils
  const nosMat = new THREE.MeshBasicMaterial({ color: 0x831843 });
  const nosL = new THREE.Mesh(new THREE.CircleGeometry(0.045, 10), nosMat);
  nosL.position.set(0.09, 0.8, 1.15);
  const nosR = nosL.clone();
  nosR.position.x = -0.09;
  g.add(nosL, nosR);

  // Floppy Ears
  const earGeo = new THREE.ConeGeometry(0.22, 0.45, 12);
  const earL = new THREE.Mesh(earGeo, darkPink);
  earL.position.set(0.48, 1.45, 0.45);
  earL.rotation.set(-0.3, 0, -0.6);
  const earR = earL.clone();
  earR.position.x = -0.48;
  earR.rotation.set(-0.3, 0, 0.6);
  g.add(earL, earR);

  // Eyes
  const eyeL = new THREE.Mesh(
    new THREE.SphereGeometry(0.065, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0x831843, roughness: 0.2 })
  );
  eyeL.position.set(0.28, 1.05, 0.95);
  const eyeR = eyeL.clone();
  eyeR.position.x = -0.28;
  g.add(eyeL, eyeR);

  // Curly Tail
  const tail = new THREE.Mesh(
    new THREE.TorusGeometry(0.12, 0.04, 8, 16, Math.PI * 1.5),
    darkPink
  );
  tail.position.set(0, 0.95, -1.15);
  g.add(tail);
}

// 4. 3D SHEEP
function build3DSheep(g: THREE.Group) {
  const woolMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
  const faceMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.7 });

  // Fluffy Wool Body (Group of intersecting cloud spheres)
  const woolGroup = new THREE.Group();
  const offsets = [
    [0, 0.85, 0, 0.65],
    [0.35, 0.85, 0.3, 0.45],
    [-0.35, 0.85, 0.3, 0.45],
    [0.35, 0.85, -0.3, 0.45],
    [-0.35, 0.85, -0.3, 0.45],
    [0, 1.15, 0, 0.48],
    [0, 0.95, 0.45, 0.42],
  ];
  offsets.forEach(([x, y, z, r]) => {
    const s = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 14), woolMat);
    s.position.set(x, y, z);
    s.castShadow = true;
    woolGroup.add(s);
  });
  g.add(woolGroup);

  // 4 Dark Little Hooves
  const hoofMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.6 });
  const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.4, 10), hoofMat);
  leg.position.set(0.35, 0.2, 0.35);
  const l2 = leg.clone();
  l2.position.x = -0.35;
  const l3 = leg.clone();
  l3.position.z = -0.35;
  const l4 = l2.clone();
  l4.position.z = -0.35;
  g.add(leg, l2, l3, l4);

  // Cute Sheep Face
  const face = new THREE.Mesh(new THREE.SphereGeometry(0.36, 18, 16), faceMat);
  face.position.set(0, 1.05, 0.8);
  face.scale.set(0.85, 1.1, 0.9);
  g.add(face);

  // Fluffy Bangs on top of face
  const bangs = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 12), woolMat);
  bangs.position.set(0, 1.4, 0.8);
  g.add(bangs);

  // Droopy Ears
  const earL = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 10), faceMat);
  earL.scale.set(1.5, 0.45, 0.4);
  earL.position.set(0.42, 1.15, 0.7);
  earL.rotation.z = -0.35;
  const earR = earL.clone();
  earR.position.x = -0.42;
  earR.rotation.z = 0.35;
  g.add(earL, earR);

  // Eyes
  const eyeL = new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0x1e293b })
  );
  eyeL.position.set(0.18, 1.15, 1.05);
  const eyeR = eyeL.clone();
  eyeR.position.x = -0.18;
  g.add(eyeL, eyeR);
}

// 5. 3D COW
function build3DCow(g: THREE.Group) {
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
  const blackMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
  const muzzleMat = new THREE.MeshStandardMaterial({ color: 0xfecdd3, roughness: 0.4 });

  // Cow Body
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.9, 1.6), whiteMat);
  body.position.set(0, 0.9, 0);
  body.castShadow = true;
  g.add(body);

  // Black Spots on body
  const spot1 = new THREE.Mesh(new THREE.SphereGeometry(0.4, 12, 12), blackMat);
  spot1.position.set(0.5, 1.1, 0.2);
  spot1.scale.set(0.5, 0.8, 1.1);
  const spot2 = spot1.clone();
  spot2.position.set(-0.55, 0.85, -0.3);
  g.add(spot1, spot2);

  // 4 Legs
  const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.5, 12), whiteMat);
  leg.position.set(0.45, 0.25, 0.55);
  const hoof = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.1, 12), blackMat);
  hoof.position.y = -0.2;
  leg.add(hoof);
  const l2 = leg.clone();
  l2.position.x = -0.45;
  const l3 = leg.clone();
  l3.position.z = -0.55;
  const l4 = l2.clone();
  l4.position.z = -0.55;
  g.add(leg, l2, l3, l4);

  // Cow Head
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.75), whiteMat);
  head.position.set(0, 1.35, 0.85);
  head.castShadow = true;
  g.add(head);

  // Pink Muzzle
  const muzzle = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.35, 0.4), muzzleMat);
  muzzle.position.set(0, 1.15, 1.25);
  g.add(muzzle);

  // Horns
  const hornMat = new THREE.MeshStandardMaterial({ color: 0xfcd34d, roughness: 0.3 });
  const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.3, 10), hornMat);
  hornL.position.set(0.35, 1.85, 0.75);
  hornL.rotation.set(-0.2, 0, -0.4);
  const hornR = hornL.clone();
  hornR.position.x = -0.35;
  hornR.rotation.set(-0.2, 0, 0.4);
  g.add(hornL, hornR);

  // Brass Bell
  const bell = new THREE.Mesh(
    new THREE.ConeGeometry(0.15, 0.22, 12),
    new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.2, metalness: 0.8 })
  );
  bell.position.set(0, 0.8, 1.15);
  g.add(bell);
}

// 6. 3D GOAT
function build3DGoat(g: THREE.Group) {
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });
  const hornMat = new THREE.MeshStandardMaterial({ color: 0xa16207, roughness: 0.4 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.75, 1.3), whiteMat);
  body.position.set(0, 0.85, 0);
  g.add(body);

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.55, 0.65), whiteMat);
  head.position.set(0, 1.35, 0.7);
  g.add(head);

  // Long Curved Horns
  const hornL = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 0.6, 10), hornMat);
  hornL.position.set(0.2, 1.8, 0.45);
  hornL.rotation.set(-0.6, 0, 0.2);
  const hornR = hornL.clone();
  hornR.position.x = -0.2;
  hornR.rotation.set(-0.6, 0, -0.2);
  g.add(hornL, hornR);

  // Beard
  const beard = new THREE.Mesh(
    new THREE.ConeGeometry(0.1, 0.3, 8),
    new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.8 })
  );
  beard.position.set(0, 1.0, 0.95);
  g.add(beard);
}

// 7. 3D ALPACA
function build3DAlpaca(g: THREE.Group) {
  const woolMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.75, 20, 18), woolMat);
  body.position.set(0, 0.8, 0);
  body.scale.set(0.9, 0.8, 1.2);
  g.add(body);

  // Tall Fluffy Neck
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.32, 1.1, 16), woolMat);
  neck.position.set(0, 1.45, 0.45);
  neck.rotation.x = -0.15;
  g.add(neck);

  // Cute Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.38, 18, 16), woolMat);
  head.position.set(0, 2.05, 0.55);
  g.add(head);

  // Scarf
  const scarf = new THREE.Mesh(
    new THREE.TorusGeometry(0.32, 0.08, 10, 24),
    new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.5 })
  );
  scarf.rotation.x = Math.PI / 2;
  scarf.position.set(0, 1.35, 0.45);
  g.add(scarf);
}

// 8. 3D HORSE
function build3DHorse(g: THREE.Group) {
  const coatMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 });
  const maneMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.5 });

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.55, 1.5, 16), coatMat);
  body.rotation.x = Math.PI / 2;
  body.position.set(0, 0.95, 0);
  g.add(body);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.38, 0.9, 14), coatMat);
  neck.position.set(0, 1.55, 0.65);
  neck.rotation.x = -0.35;
  g.add(neck);

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.5, 0.8), coatMat);
  head.position.set(0, 1.95, 0.9);
  g.add(head);

  // Mane
  const mane = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.1, 0.3), maneMat);
  mane.position.set(0, 1.7, 0.45);
  mane.rotation.x = -0.35;
  g.add(mane);

  // Golden Horseshoe on base
  const horseshoe = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.06, 10, 24, Math.PI * 1.4),
    new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2, metalness: 0.8 })
  );
  horseshoe.rotation.x = Math.PI / 2;
  horseshoe.position.set(0, 0.1, 0.8);
  g.add(horseshoe);
}
