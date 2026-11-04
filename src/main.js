
import * as THREE from 'three';
import './style.css';
import { GLTFLoader } from
'three/addons/loaders/GLTFLoader.js';

// ==============================
// 1. MEMBUAT SCENE
// ==============================

const scene = new THREE.Scene();
const loader = new GLTFLoader();

scene.background = new THREE.Color(0x8b7180);

scene.fog = new THREE.FogExp2(
    0x8b7180,
    0.018
);

// ==============================
// 2. MEMBUAT CAMERA
// ==============================

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 3, 7.5);
camera.fov = 50;
camera.updateProjectionMatrix();

camera.lookAt(0, 1.8, 0);

// ==============================
// 3. MEMBUAT RENDERER
// ==============================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

document.body.appendChild(renderer.domElement);

const interactionHint = document.createElement('div');
interactionHint.className = 'interaction-hint';
interactionHint.textContent = 'Klik pintu untuk memasuki dunia baru';
document.body.appendChild(interactionHint);

const arrivalOverlay = document.createElement('section');
arrivalOverlay.className = 'arrival-overlay';
arrivalOverlay.setAttribute('aria-label', 'Pesan penyemangat');
arrivalOverlay.setAttribute('aria-hidden', 'true');

const messageCard = document.createElement('div');
messageCard.className = 'message-card';

const floralAccent = document.createElement('div');
floralAccent.className = 'floral-accent';
floralAccent.setAttribute('aria-hidden', 'true');
floralAccent.innerHTML = '<span>✿</span><i></i><span>✿</span>';
messageCard.appendChild(floralAccent);

const messageEyebrow = document.createElement('p');
messageEyebrow.className = 'message-eyebrow';
messageEyebrow.textContent = 'PESAN KECIL UNTUKMU';
messageCard.appendChild(messageEyebrow);

const messageLines = [];

[
    'Semangat Kiii, Kamu pasti bisa memuaskan hasil kerja keras belajar untuk mencapai nilai yang kau ingin kan🌸🌸 dan juga yah semoga hasil kerja keras belajar kau itu terbayarkan oleh nilai🎀',
    'Dan untuk besok jangan ngeblank yah, tetep fokus ke satu tujuan.... kalau menurutmu soal yang susah tinggal skipp ke soaal yang mudah, nah kalau udah selesai dan ada beberapa soal yang susah dan tidak bisa menjawab maka tembak saja jawabannya😉😉',
    'Dah itu aja dari aku',
    'sekian',
    'Dan Nuhun😌'
].forEach((message) => {
    const paragraph = document.createElement('p');
    paragraph.className = 'message-line';
    paragraph.textContent = message;
    messageLines.push(paragraph);
    messageCard.appendChild(paragraph);
});

const replayButton = document.createElement('button');
replayButton.className = 'replay-button';
replayButton.type = 'button';
replayButton.textContent = 'ULANGI PERJALANAN';
replayButton.disabled = true;
messageCard.appendChild(replayButton);
arrivalOverlay.appendChild(messageCard);
document.body.appendChild(arrivalOverlay);

const messageRevealDelays = [500, 6000, 12000, 16000, 19500];
const revealTimeouts = [];
let messagesStarted = false;

function revealMessages() {
    if (messagesStarted) return;
    messagesStarted = true;

    messageLines.forEach((line, index) => {
        revealTimeouts.push(window.setTimeout(() => {
            line.classList.add('is-visible');
        }, messageRevealDelays[index]));
    });

    const finalMessageDelay = messageRevealDelays[messageRevealDelays.length - 1];
    revealTimeouts.push(window.setTimeout(() => {
        replayButton.classList.add('is-visible');
        replayButton.disabled = false;
    }, finalMessageDelay + 1800));
}

function resetMessageSequence() {
    revealTimeouts.forEach(window.clearTimeout);
    revealTimeouts.length = 0;
    messagesStarted = false;
    messageLines.forEach((line) => line.classList.remove('is-visible'));
    replayButton.classList.remove('is-visible');
    replayButton.disabled = true;
}

// ==============================
// 4. PENCAHAYAAN
// ==============================

const ambientLight = new THREE.AmbientLight(
    0xd7e9ff,
    1.35
);

scene.add(ambientLight);

const skyLight = new THREE.HemisphereLight(0xa8ddf5, 0x96815e, 0.8);
scene.add(skyLight);

const sunlight = new THREE.DirectionalLight(
    0xffbb79,
    2.6
);

sunlight.position.set(-5, 8, 5);
sunlight.castShadow = true;

scene.add(sunlight);

const portalLight = new THREE.PointLight(0xffd49a, 2.5, 24, 1.5);
portalLight.position.set(0, 3, -3);
scene.add(portalLight);

const glowCanvas = document.createElement('canvas');
glowCanvas.width = 256;
glowCanvas.height = 512;
const glowContext = glowCanvas.getContext('2d');
const glowGradient = glowContext.createRadialGradient(128, 256, 12, 128, 256, 250);
glowGradient.addColorStop(0, 'rgba(255, 242, 197, 0.95)');
glowGradient.addColorStop(0.35, 'rgba(255, 196, 123, 0.58)');
glowGradient.addColorStop(1, 'rgba(255, 168, 104, 0)');
glowContext.fillStyle = glowGradient;
glowContext.fillRect(0, 0, 256, 512);

const portalGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(7, 8),
    new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(glowCanvas),
        color: 0xffe6bd,
        transparent: true,
        opacity: 0.34,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
    })
);
portalGlow.position.set(0, 3.2, -5.2);
scene.add(portalGlow);

const clouds = [];
const cloudMaterial = new THREE.MeshStandardMaterial({
    color: 0xfff0df,
    roughness: 1,
    transparent: true,
    opacity: 0.78,
    depthWrite: false
});

for (let i = 0; i < 9; i++) {
    const cloud = new THREE.Group();
    const puffCount = 4 + Math.floor(Math.random() * 3);

    for (let puff = 0; puff < puffCount; puff++) {
        const size = 0.5 + Math.random() * 0.55;
        const mesh = new THREE.Mesh(
            new THREE.SphereGeometry(size, 16, 12),
            cloudMaterial
        );
        mesh.position.set((puff - puffCount / 2) * 0.65, Math.random() * 0.35, Math.random() * 0.25);
        mesh.scale.set(1.3, 0.65, 0.8);
        cloud.add(mesh);
    }

    cloud.position.set(
        (Math.random() - 0.5) * 22,
        6 + Math.random() * 5,
        -8 - Math.random() * 24
    );
    cloud.userData.drift = 0.12 + Math.random() * 0.18;
    cloud.userData.initialPosition = cloud.position.clone();
    clouds.push(cloud);
    scene.add(cloud);
}

const leafShape = new THREE.Shape();
leafShape.moveTo(0, 0);
leafShape.bezierCurveTo(0.28, 0.18, 0.44, 0.52, 0, 0.82);
leafShape.bezierCurveTo(-0.44, 0.52, -0.28, 0.18, 0, 0);
leafShape.moveTo(0, 0.03);
leafShape.lineTo(0, 0.72);
const leafGeometry = new THREE.ShapeGeometry(leafShape);
const leafColors = [0xe8a95c, 0xd78155, 0xc98e69, 0xf0c777];
const fallingLeaves = [];

function addFallingLeaf({ x, y, z, foreground = false }) {
    const leaf = new THREE.Mesh(
        leafGeometry,
        new THREE.MeshStandardMaterial({
            color: leafColors[Math.floor(Math.random() * leafColors.length)],
            side: THREE.DoubleSide,
            roughness: 0.8
        })
    );
    leaf.position.set(x, y, z);
    leaf.scale.setScalar(foreground ? 0.16 + Math.random() * 0.13 : 0.1 + Math.random() * 0.17);
    leaf.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    fallingLeaves.push({
        mesh: leaf,
        drift: (Math.random() > 0.5 ? 1 : -1) * (0.32 + Math.random() * 0.48),
        fallSpeed: 0.06 + Math.random() * 0.16,
        sway: Math.random() * Math.PI * 2,
        foreground,
        initialPosition: leaf.position.clone(),
        initialRotation: leaf.rotation.clone()
    });
    scene.add(leaf);
}

for (let i = 0; i < 12; i++) {
    addFallingLeaf({
        x: (Math.random() > 0.5 ? 1 : -1) * (3.2 + Math.random() * 5),
        y: 1.5 + Math.random() * 6,
        z: 2 + Math.random() * 4,
        foreground: true
    });
}

for (let i = 0; i < 90; i++) {
    addFallingLeaf({
        x: (Math.random() - 0.5) * 18,
        y: 1 + Math.random() * 10,
        z: -5 - Math.random() * 30
    });
}

// ==============================
// 5. MEMBUAT AIR DANGKAL
// ==============================

const groundGeometry = new THREE.PlaneGeometry(
    100,
    100
);
const waterSurfaceGeometry = new THREE.PlaneGeometry(100, 100, 120, 120);
const waterBasePositions = waterSurfaceGeometry.attributes.position.array.slice();

const waterBed = new THREE.Mesh(
    groundGeometry,
    new THREE.MeshStandardMaterial({
        color: 0xc2ad86,
        roughness: 0.95
    })
);
waterBed.rotation.x = -Math.PI / 2;
waterBed.position.y = -0.12;
waterBed.receiveShadow = true;
scene.add(waterBed);

function createWaterTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');

    context.fillStyle = '#c9e6df';
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 34; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = 8 + Math.random() * 45;
        context.beginPath();
        context.ellipse(x, y, radius, radius * 0.36, Math.random(), 0, Math.PI * 2);
        context.strokeStyle = `rgba(255, 255, 255, ${0.08 + Math.random() * 0.16})`;
        context.lineWidth = 1 + Math.random() * 2;
        context.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(12, 12);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}

const waterTexture = createWaterTexture();
const waterMaterial = new THREE.MeshStandardMaterial({
    color: 0x40a8c9,
    map: waterTexture,
    roughness: 0.2,
    metalness: 0.12,
    transparent: true,
    opacity: 0.82
});

const ground = new THREE.Mesh(
    waterSurfaceGeometry,
    waterMaterial
);

ground.rotation.x = -Math.PI / 2;
ground.position.y = 0.015;
ground.receiveShadow = true;

scene.add(ground);

const waveMaterial = new THREE.MeshBasicMaterial({
    color: 0xe9fff8,
    transparent: true,
    opacity: 0.48,
    depthWrite: false,
    side: THREE.DoubleSide
});
const waterWaves = [];

for (let i = 0; i < 14; i++) {
    const wave = new THREE.Mesh(
        new THREE.RingGeometry(0.82, 1, 64),
        waveMaterial.clone()
    );
    wave.rotation.x = -Math.PI / 2;
    wave.scale.set(2.6 + Math.random() * 1.5, 0.22 + Math.random() * 0.14, 1);
    wave.position.set((Math.random() - 0.5) * 8, 0.085, -28 + i * 2.6);
    wave.userData = {
        speed: 1.3 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        baseScaleX: wave.scale.x,
        baseScaleY: wave.scale.y,
        initialX: wave.position.x,
        initialZ: wave.position.z
    };
    waterWaves.push(wave);
    scene.add(wave);
}


// ==============================
// LOAD REALISTIC TREE
// ==============================

// =================================
// LOAD 3 VARIASI POHON
// =================================

const animatedTrees = [];


const treeTypes = [
    {
        path: `${import.meta.env.BASE_URL}models/tree1/island_tree_01_1k.gltf`,
        positions: [
            [-3.5, 0, -11],
            [3.5, 0, -11],
            [-8, 0, -21],
            [8, 0, -23],
            [-2.9, 0, -7],
            [2.9, 0, -7],
            [-6.5, 0, -5],
            [6.5, 0, -5],
            [-10.5, 0, -11],
            [10.5, 0, -12],
            [-5.5, 0, -17],
            [5.5, 0, -18],
            [-12, 0, -24],
            [12, 0, -25],
            [-2, 0, -31],
            [3, 0, -35]
        ],
        scale: 2.15

    },
    {
        path: `${import.meta.env.BASE_URL}models/tree2/island_tree_02_1k.gltf`,
        positions: [
            [4.5, 0, -1],
            [-5, 0, -8],
            [5, 0, -8],
            [0, 0, -28],
            [-7.5, 0, -3],
            [7.5, 0, -4],
            [-9, 0, -16],
            [9, 0, -18],
            [-4, 0, -25],
            [5, 0, -30],
            [13, 0, -31]
        ],
        scale: 1.95
    },
    {
        path: `${import.meta.env.BASE_URL}models/tree3/jacaranda_tree_1k.gltf`,
         positions: [
             [-4.5, 0, -1],
             [4, 0, -10],
             [-11, 0, -7],
             [11, 0, -9],
             [-1, 0, -20],
             [1, 0, -23]
         ],
          scale: 1.45
    }
];

treeTypes.forEach((type) => {
    loader.load(
        type.path,
        (gltf) => {
            const originalTree = gltf.scene;

            type.positions.forEach((position) => {
                const tree = originalTree.clone(true);

                tree.position.set(...position);
                tree.scale.setScalar(type.scale);

                tree.rotation.y = Math.random() * Math.PI * 2;

                tree.traverse((object) => {
                    if (object.isMesh) {
                        object.castShadow = true;
                        object.receiveShadow = true;
                    }
                });
                tree.traverse((object) => {
                    if (object.isMesh) {
                        object.castShadow = true;
                        object.receiveShadow = true;
                    }
                });

                // TAMBAHKAN BLOK INI:
                animatedTrees.push({
                    mesh: tree,
                    initialRotationZ: tree.rotation.z,
                    initialRotationX: tree.rotation.x,
                    offset: Math.random() * 100 // Agar waktu goyang tiap pohon berbeda
                });

                scene.add(tree);
            });
        },
        undefined,
        (error) => {
            console.error('Gagal memuat pohon:', type.path, error);
        }
    );
});

// ==============================
// 6. REALISTIC FANTASY WOODEN DOOR
// ==============================

// Pusat putaran pintu berada di sisi kiri
const doorPivot = new THREE.Group();
doorPivot.position.set(-1, 0, 0);
scene.add(doorPivot);

// ==============================
// PROCEDURAL WOOD TEXTURE
// ==============================

function createWoodTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 1024;

    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#50301f';
    ctx.fillRect(0, 0, 512, 1024);

    // Serat kayu
    for (let i = 0; i < 180; i++) {
        const x = Math.random() * 512;
        const width = Math.random() * 3 + 0.5;

        ctx.beginPath();
        ctx.moveTo(x, 0);

        ctx.bezierCurveTo(
            x - 20 + Math.random() * 40,
            300,
            x - 20 + Math.random() * 40,
            700,
            x + Math.random() * 20 - 10,
            1024
        );

        ctx.strokeStyle =
            Math.random() > 0.5
                ? 'rgba(20, 10, 5, 0.25)'
                : 'rgba(190, 125, 75, 0.18)';

        ctx.lineWidth = width;
        ctx.stroke();
    }

    // Detail serat kayu kecil
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 1024;

        ctx.beginPath();
        ctx.ellipse(
            x, y,
            Math.random() * 18 + 3,
            Math.random() * 5 + 1,
            Math.random(),
            0,
            Math.PI * 2
        );

        ctx.strokeStyle = 'rgba(20, 10, 5, 0.3)';
        ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    return texture;
}

const woodTexture = createWoodTexture();

// ==============================
// MATERIAL
// ==============================

const woodMaterial = new THREE.MeshStandardMaterial({
    map: woodTexture,
    bumpMap: woodTexture,
    bumpScale: 0.035,
    roughness: 0.85,
    metalness: 0.02
});

const darkWoodMaterial = new THREE.MeshStandardMaterial({
    color: 0x382117,
    roughness: 0.9
});

const trimMaterial = new THREE.MeshStandardMaterial({
    color: 0x69432b,
    roughness: 0.8,
    map: woodTexture
});

const bronzeMaterial = new THREE.MeshStandardMaterial({
    color: 0x987044,
    metalness: 0.8,
    roughness: 0.3
});

// ==============================
// HELPER BOX
// ==============================

function createBox(w, h, d, material, x, y, z, parent) {
    const geometry = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    parent.add(mesh);

    return mesh;
}

// ==============================
// MAIN DOOR
// ==============================

createBox(
    2, 3.5, 0.18,
    woodMaterial,
    1, 1.75, 0,
    doorPivot
);

// ==============================
// DOOR FRAME DETAILS
// ==============================

// Sisi kiri
createBox(
    0.2, 3.5, 0.12,
    trimMaterial,
    0.12, 1.75, 0.13,
    doorPivot
);

// Sisi kanan
createBox(
    0.2, 3.5, 0.12,
    trimMaterial,
    1.88, 1.75, 0.13,
    doorPivot
);

// Bagian tengah
createBox(
    0.12, 3.3, 0.12,
    darkWoodMaterial,
    1, 1.75, 0.13,
    doorPivot
);

// Bagian atas
createBox(
    1.8, 0.18, 0.12,
    trimMaterial,
    1, 3.32, 0.13,
    doorPivot
);

// Bagian bawah
createBox(
    1.8, 0.18, 0.12,
    trimMaterial,
    1, 0.18, 0.13,
    doorPivot
);

// ==============================
// RAISED WOODEN PANELS
// ==============================

// Panel kiri atas
createBox(
    0.68, 1.05, 0.07,
    trimMaterial,
    0.55, 2.55, 0.15,
    doorPivot
);

// Panel kanan atas
createBox(
    0.68, 1.05, 0.07,
    trimMaterial,
    1.45, 2.55, 0.15,
    doorPivot
);

// Panel kiri bawah
createBox(
    0.68, 1.05, 0.07,
    trimMaterial,
    0.55, 0.95, 0.15,
    doorPivot
);

// Panel kanan bawah
createBox(
    0.68, 1.05, 0.07,
    trimMaterial,
    1.45, 0.95, 0.15,
    doorPivot
);

// ==============================
// PANEL INNER DETAILS
// ==============================

const innerPanelMaterial = new THREE.MeshStandardMaterial({
    color: 0x43291c,
    roughness: 0.85,
    map: woodTexture,
    bumpMap: woodTexture,
    bumpScale: 0.025
});

const panelPositions = [
    [0.55, 2.55],
    [1.45, 2.55],
    [0.55, 0.95],
    [1.45, 0.95]
];

panelPositions.forEach(([x, y]) => {
    createBox(
        0.52, 0.88, 0.035,
        innerPanelMaterial,
        x, y, 0.195,
        doorPivot
    );
});

// ==============================
// OUTER DOOR FRAME
// ==============================

const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x302016,
    roughness: 0.9
});

// Tiang kiri
createBox(
    0.22, 3.74, 0.32,
    frameMaterial,
    -1.1, 1.87, 0,
    scene
);

// Tiang kanan
createBox(
    0.22, 3.74, 0.32,
    frameMaterial,
    1.1, 1.87, 0,
    scene
);

// Bagian atas
createBox(
    2.45, 0.24, 0.35,
    frameMaterial,
    0, 3.62, 0,
    scene
);

// ==============================
// BRONZE DOOR HANDLE
// ==============================

const handleBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.11, 0.08, 32),
    bronzeMaterial
);

handleBase.rotation.x = Math.PI / 2;
handleBase.position.set(1.72, 1.75, 0.22);
doorPivot.add(handleBase);

const handle = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 32, 32),
    bronzeMaterial
);

handle.position.set(1.72, 1.75, 0.31);
handle.castShadow = true;
doorPivot.add(handle);

// ==============================
// DECORATIVE HINGES
// ==============================

for (let i = 0; i < 3; i++) {
    const hingeY = 0.55 + i * 1.3;

    // Plat engsel
    createBox(
        0.2, 0.32, 0.045,
        bronzeMaterial,
        0.1, hingeY, 0.13,
        doorPivot
    );

    // Silinder engsel
    const hinge = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.055, 0.32, 20),
        bronzeMaterial
    );

    hinge.position.set(0.08, hingeY, 0.13);
    hinge.castShadow = true;
    doorPivot.add(hinge);
}


// ==============================
// INTERAKSI MASUK MELALUI PINTU
// ==============================

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const closedDoorRotation = 0;
const openDoorRotation = Math.PI * 0.52;
let targetRotation = closedDoorRotation;
let entryRequested = false;
let entering = false;
let travelProgress = 0;

const initialCameraPosition = camera.position.clone();
const initialCameraTarget = new THREE.Vector3(0, 1.8, 0);
const finalCameraPosition = new THREE.Vector3(0, 2.15, -6.8);
const finalCameraTarget = new THREE.Vector3(0, 2.2, -15);
const initialBackground = new THREE.Color(0x8b7180);
const destinationBackground = new THREE.Color(0xa6c5bd);
const initialFogColor = new THREE.Color(0x8b7180);
const destinationFogColor = new THREE.Color(0xa6c5bd);
let motionTimeOrigin = 0;

function resetJourney(elapsedTime) {
    resetMessageSequence();
    entryRequested = false;
    entering = false;
    travelProgress = 0;
    targetRotation = closedDoorRotation;
    doorPivot.rotation.y = closedDoorRotation;

    camera.position.copy(initialCameraPosition);
    camera.lookAt(initialCameraTarget);
    camera.fov = 50;
    camera.updateProjectionMatrix();

    scene.background.copy(initialBackground);
    scene.fog.color.copy(initialFogColor);
    renderer.toneMappingExposure = 1.2;
    portalGlow.material.opacity = 0.34;
    portalLight.intensity = 2.5;

    clouds.forEach((cloud) => {
        cloud.position.copy(cloud.userData.initialPosition);
    });

    fallingLeaves.forEach(({ mesh, initialPosition, initialRotation }) => {
        mesh.position.copy(initialPosition);
        mesh.rotation.copy(initialRotation);
    });

    waterWaves.forEach((wave) => {
        wave.position.x = wave.userData.initialX;
        wave.position.z = wave.userData.initialZ;
        wave.scale.set(wave.userData.baseScaleX, wave.userData.baseScaleY, 1);
        wave.material.opacity = waveMaterial.opacity;
    });

    const waterPositions = waterSurfaceGeometry.attributes.position;
    for (let i = 0; i < waterPositions.count; i++) {
        waterPositions.array[i * 3 + 2] = waterBasePositions[i * 3 + 2];
    }
    waterPositions.needsUpdate = true;
    waterSurfaceGeometry.computeVertexNormals();
    waterTexture.offset.set(0, 0);

    animatedTrees.forEach((treeObj) => {
        treeObj.mesh.rotation.x = treeObj.initialRotationX;
        treeObj.mesh.rotation.z = treeObj.initialRotationZ;
    });
    motionTimeOrigin = elapsedTime;

    arrivalOverlay.classList.remove('is-glowing', 'is-arrived');
    arrivalOverlay.setAttribute('aria-hidden', 'true');
    replayButton.disabled = true;
    interactionHint.classList.remove('is-hidden');
    document.body.classList.remove('door-hover');
}

replayButton.addEventListener('click', (event) => {
    event.stopPropagation();
    resetJourney(clock.getElapsed());
});

window.addEventListener('click', (event) => {
    if (entryRequested || arrivalOverlay.contains(event.target)) return;

    pointer.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(doorPivot, true);

    if (intersects.length === 0) return;

    entryRequested = true;
    targetRotation = openDoorRotation;
    interactionHint.classList.add('is-hidden');
});

window.addEventListener('pointermove', (event) => {
    if (entryRequested) return;

    pointer.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );
    raycaster.setFromCamera(pointer, camera);
    document.body.classList.toggle(
        'door-hover',
        raycaster.intersectObject(doorPivot, true).length > 0
    );
});


// ==============================
// 7. ANIMASI
// ==============================

const clock = new THREE.Timer();
clock.connect(document);

function animate() {
    requestAnimationFrame(animate);

    clock.update();
    const delta = Math.min(clock.getDelta(), 0.05);
    const elapsedTime = clock.getElapsed();
    const motionTime = elapsedTime - motionTimeOrigin;

    doorPivot.rotation.y +=
        (targetRotation - doorPivot.rotation.y) * (1 - Math.exp(-5 * delta));

    if (entryRequested && !entering && Math.abs(doorPivot.rotation.y - targetRotation) < 0.16) {
        entering = true;
    }

    if (entering) {
        travelProgress = Math.min(travelProgress + delta / 5, 1);
        const easedProgress = travelProgress * travelProgress * (3 - 2 * travelProgress);
        const cameraPosition = initialCameraPosition.clone().lerp(finalCameraPosition, easedProgress);
        const cameraTarget = initialCameraTarget.clone().lerp(finalCameraTarget, easedProgress);

        camera.position.copy(cameraPosition);
        camera.lookAt(cameraTarget);
        camera.fov = THREE.MathUtils.lerp(50, 58, easedProgress);
        camera.updateProjectionMatrix();
        scene.background.lerpColors(initialBackground, destinationBackground, easedProgress);
        scene.fog.color.lerpColors(initialFogColor, destinationFogColor, easedProgress);
        renderer.toneMappingExposure = THREE.MathUtils.lerp(1.2, 1.55, easedProgress);
    }

    if (travelProgress >= 0.72) {
        arrivalOverlay.classList.add('is-glowing');
    }

    if (travelProgress >= 1) {
        arrivalOverlay.classList.add('is-arrived');
        arrivalOverlay.setAttribute('aria-hidden', 'false');
        revealMessages();
    }

    const openAmount = THREE.MathUtils.clamp(doorPivot.rotation.y / openDoorRotation, 0, 1);
    portalGlow.material.opacity = 0.34 + openAmount * 0.48;
    portalLight.intensity = 2.5 + openAmount * 4 + travelProgress * 2;

    animatedTrees.forEach((treeObj) => {
        const time = motionTime + treeObj.offset;
        const windZ = Math.sin(time * 1.5) * 0.03 + Math.cos(time * 3) * 0.01;
        const windX = Math.cos(time * 1.2) * 0.02;

        treeObj.mesh.rotation.z = treeObj.initialRotationZ + windZ;
        treeObj.mesh.rotation.x = treeObj.initialRotationX + windX;
    });

    clouds.forEach((cloud) => {
        cloud.position.x += cloud.userData.drift * delta;
        if (cloud.position.x > 14) cloud.position.x = -14;
    });

    fallingLeaves.forEach(({ mesh, drift, fallSpeed, sway, foreground }) => {
        mesh.position.y -= fallSpeed * delta;
        mesh.position.x += drift * delta + Math.sin(motionTime * 0.8 + sway) * delta * 0.18;
        mesh.rotation.x += delta * 0.24;
        mesh.rotation.y += delta * 0.34;
        mesh.rotation.z += Math.sin(motionTime * 0.7 + sway) * delta * 0.22;

        if (mesh.position.x > 12 || mesh.position.x < -12) {
            mesh.position.x = Math.sign(drift) > 0 ? -12 : 12;
            mesh.position.y = 6 + Math.random() * 6;
        } else if (mesh.position.y < 0.5) {
            mesh.position.y = 7 + Math.random() * 5;
        }

        if (foreground && mesh.position.y < 1) {
            mesh.position.y = 6 + Math.random() * 4;
        }
    });

    waterWaves.forEach((wave) => {
        wave.position.z += wave.userData.speed * delta;
        const cycle = THREE.MathUtils.clamp((wave.position.z + 28) / 36, 0, 1);
        const pulse = 0.84 + Math.sin(motionTime * 2.6 + wave.userData.phase) * 0.16;
        const spread = 0.9 + cycle * 0.45;

        wave.scale.x = wave.userData.baseScaleX * spread;
        wave.scale.y = wave.userData.baseScaleY * spread;
        wave.material.opacity = (0.34 + Math.sin(Math.PI * cycle) * 0.3) * pulse;

        if (wave.position.z > 8) {
            wave.position.z = -28;
            wave.position.x = (Math.random() - 0.5) * 10;
        }
    });

    const waterPositions = waterSurfaceGeometry.attributes.position;
    for (let i = 0; i < waterPositions.count; i++) {
        const x = waterBasePositions[i * 3];
        const localY = waterBasePositions[i * 3 + 1];
        const worldZ = -localY;
        waterPositions.array[i * 3 + 2] =
            Math.sin(worldZ * 0.42 - motionTime * 2.4) * 0.045 +
            Math.sin(worldZ * 0.85 - motionTime * 3.2 + x * 0.22) * 0.022;
    }
    waterPositions.needsUpdate = true;
    waterSurfaceGeometry.computeVertexNormals();

    waterTexture.offset.x = motionTime * 0.003;
    waterTexture.offset.y = motionTime * 0.008;

    renderer.render(scene, camera);
}

animate();



// ==============================
// 8. RESPONSIVE
// ==============================

window.addEventListener('resize', () => {
    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );
});
