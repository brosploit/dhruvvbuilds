/**
 * DhruvBuilds - 3D Interactive WebGL Scene Engine
 * Powered by Three.js with pure Canvas fallback
 * Built for 100% reliability on InfinityFree and modern browsers
 */

class Hero3DScene {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.currentMode = 'quantum'; // 'quantum' | 'torus' | 'matrix' | 'neural'
    this.isWireframe = false;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0, isDown: false, prevX: 0, prevY: 0 };
    this.rotation = { x: 0, y: 0, velX: 0.003, velY: 0.005 };
    this.particles = [];
    this.shockwaveActive = false;
    this.shockwaveRadius = 0;
    this.clock = null;

    this.init();
  }

  init() {
    // Check if Three.js is available
    if (typeof THREE !== 'undefined') {
      this.initThreeJS();
    } else {
      console.warn('Three.js CDN not yet loaded or blocked. Initializing high-performance 3D Canvas Fallback.');
      this.initCanvasFallback();
    }
  }

  initThreeJS() {
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();

    const width = this.container.clientWidth || 500;
    const height = this.container.clientHeight || 500;

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.z = 7;

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    // Clear previous children
    this.container.innerHTML = '';
    this.container.appendChild(this.renderer.domElement);

    // Setup Lighting
    this.setupLighting();

    // Setup Object Root Group
    this.objectGroup = new THREE.Group();
    this.scene.add(this.objectGroup);

    // Setup Ambient Dust / Particles
    this.setupBackgroundParticles();

    // Build Initial 3D Model
    this.buildCurrentModel();

    // Event Listeners
    this.bindEvents();

    // Start Render Loop
    this.animate();
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.5);
    this.scene.add(ambientLight);

    this.dirLight1 = new THREE.DirectionalLight(0x00f2fe, 3.5);
    this.dirLight1.position.set(5, 5, 4);
    this.scene.add(this.dirLight1);

    this.dirLight2 = new THREE.DirectionalLight(0xa855f7, 3.0);
    this.dirLight2.position.set(-5, -5, -2);
    this.scene.add(this.dirLight2);

    this.pointLight = new THREE.PointLight(0x38bdf8, 2, 12);
    this.pointLight.position.set(0, 0, 2);
    this.scene.add(this.pointLight);
  }

  setupBackgroundParticles() {
    const particleCount = 450;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color('#00f2fe');
    const color2 = new THREE.Color('#8b5cf6');

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14;

      const mixedColor = color1.clone().lerp(color2, Math.random());
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    this.dustParticles = new THREE.Points(geometry, material);
    this.scene.add(this.dustParticles);
  }

  clearObjectGroup() {
    while (this.objectGroup.children.length > 0) {
      const obj = this.objectGroup.children[0];
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
      this.objectGroup.remove(obj);
    }
  }

  buildCurrentModel() {
    this.clearObjectGroup();

    const cyanMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      emissive: 0x00f2fe,
      emissiveIntensity: 0.35,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: this.isWireframe
    });

    const purpleMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x7c3aed,
      emissiveIntensity: 0.4,
      roughness: 0.25,
      metalness: 0.9,
      wireframe: this.isWireframe
    });

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });

    if (this.currentMode === 'quantum') {
      // 1. Central Core
      const coreGeo = new THREE.OctahedronGeometry(1.2, 0);
      this.coreMesh = new THREE.Mesh(coreGeo, cyanMat);
      this.objectGroup.add(this.coreMesh);

      // 2. Outer Wireframe Icosahedron
      const outerGeo = new THREE.IcosahedronGeometry(1.85, 1);
      this.outerCage = new THREE.Mesh(outerGeo, wireMat);
      this.objectGroup.add(this.outerCage);

      // 3. Floating Orbital Rings
      this.ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.3, 0.025, 16, 100), purpleMat);
      this.ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.7, 0.02, 16, 100), cyanMat);
      this.ring1.rotation.x = Math.PI / 3;
      this.ring2.rotation.y = Math.PI / 4;
      this.objectGroup.add(this.ring1);
      this.objectGroup.add(this.ring2);

      // 4. Orbiting nodes
      this.satellites = new THREE.Group();
      for (let i = 0; i < 6; i++) {
        const sat = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), cyanMat);
        const angle = (i / 6) * Math.PI * 2;
        sat.position.set(Math.cos(angle) * 2.3, Math.sin(angle) * 2.3, (Math.random() - 0.5) * 0.5);
        this.satellites.add(sat);
      }
      this.objectGroup.add(this.satellites);

    } else if (this.currentMode === 'torus') {
      // Torus Knot
      const knotGeo = new THREE.TorusKnotGeometry(1.4, 0.38, 140, 24, 2, 3);
      this.torusKnot = new THREE.Mesh(knotGeo, purpleMat);
      this.objectGroup.add(this.torusKnot);

      const knotWireGeo = new THREE.TorusKnotGeometry(1.43, 0.39, 90, 16, 2, 3);
      this.torusWire = new THREE.Mesh(knotWireGeo, wireMat);
      this.objectGroup.add(this.torusWire);

    } else if (this.currentMode === 'matrix') {
      // Matrix Hypercube Grid
      this.cubeGroup = new THREE.Group();
      const cubeSize = 0.45;
      const spacing = 0.85;

      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            // Keep center hollow for sleek look
            if (x === 0 && y === 0 && z === 0) continue;
            const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
            const mat = (x + y + z) % 2 === 0 ? cyanMat : purpleMat;
            const cube = new THREE.Mesh(cubeGeo, mat);
            cube.position.set(x * spacing, y * spacing, z * spacing);
            cube.userData = { initialY: y * spacing, offset: (x + y + z) * 0.4 };
            this.cubeGroup.add(cube);
          }
        }
      }
      this.objectGroup.add(this.cubeGroup);

    } else if (this.currentMode === 'neural') {
      // Neural Constellation Point Cloud
      const count = 350;
      const pointsGeo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = Math.cbrt(Math.random()) * 2.4;
        const sinPhi = Math.sin(phi);
        pos[i * 3] = r * sinPhi * Math.cos(theta);
        pos[i * 3 + 1] = r * sinPhi * Math.sin(theta);
        pos[i * 3 + 2] = r * Math.cos(phi);
      }

      pointsGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const pointsMat = new THREE.PointsMaterial({
        color: 0x00f2fe,
        size: 0.1,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
      });
      this.neuralCloud = new THREE.Points(pointsGeo, pointsMat);
      this.objectGroup.add(this.neuralCloud);

      // Connecting wireframe sphere cage
      const cageGeo = new THREE.IcosahedronGeometry(2.4, 2);
      this.neuralCage = new THREE.Mesh(cageGeo, wireMat);
      this.objectGroup.add(this.neuralCage);
    }
  }

  switchMode(modeName) {
    if (this.currentMode === modeName) return;
    this.currentMode = modeName;
    this.buildCurrentModel();

    // Trigger visual shockwave
    this.triggerShockwave();
  }

  toggleWireframe() {
    this.isWireframe = !this.isWireframe;
    this.buildCurrentModel();
    return this.isWireframe;
  }

  triggerShockwave() {
    this.shockwaveActive = true;
    this.shockwaveRadius = 0;
    if (window.soundFX) window.soundFX.playWarp();
  }

  bindEvents() {
    const el = this.renderer.domElement;

    // Mouse Move Parallax
    window.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
      this.mouse.targetX = x;
      this.mouse.targetY = y;
    });

    // Mouse Drag to Spin in 3D
    el.addEventListener('mousedown', (e) => {
      this.mouse.isDown = true;
      this.mouse.prevX = e.clientX;
      this.mouse.prevY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      this.mouse.isDown = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.mouse.isDown) return;
      const deltaX = e.clientX - this.mouse.prevX;
      const deltaY = e.clientY - this.mouse.prevY;
      this.rotation.velY = deltaX * 0.006;
      this.rotation.velX = deltaY * 0.006;
      this.mouse.prevX = e.clientX;
      this.mouse.prevY = e.clientY;
    });

    // Touch Support for Mobile
    el.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.mouse.isDown = true;
        this.mouse.prevX = e.touches[0].clientX;
        this.mouse.prevY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.mouse.isDown = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (!this.mouse.isDown || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - this.mouse.prevX;
      const deltaY = e.touches[0].clientY - this.mouse.prevY;
      this.rotation.velY = deltaX * 0.006;
      this.rotation.velX = deltaY * 0.006;
      this.mouse.prevX = e.touches[0].clientX;
      this.mouse.prevY = e.touches[0].clientY;
    }, { passive: true });

    // Click on 3D object triggers energy pulse
    el.addEventListener('click', () => {
      this.triggerShockwave();
    });

    // Resize handling
    window.addEventListener('resize', () => {
      if (!this.renderer || !this.camera) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock ? this.clock.getDelta() : 0.016;
    const time = this.clock ? this.clock.getElapsedTime() : Date.now() * 0.001;

    // Smooth Mouse Lerp
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Inertia & Continuous Rotation
    if (!this.mouse.isDown) {
      this.rotation.velX *= 0.96;
      this.rotation.velY *= 0.96;
      this.rotation.x += this.rotation.velX + 0.004;
      this.rotation.y += this.rotation.velY + 0.008;
    } else {
      this.rotation.x += this.rotation.velX;
      this.rotation.y += this.rotation.velY;
    }

    if (this.objectGroup) {
      this.objectGroup.rotation.x = this.rotation.x + this.mouse.y * 0.4;
      this.objectGroup.rotation.y = this.rotation.y + this.mouse.x * 0.4;

      // Model-specific micro-animations
      if (this.currentMode === 'quantum') {
        if (this.coreMesh) {
          this.coreMesh.rotation.y -= 0.015;
          this.coreMesh.scale.setScalar(1 + Math.sin(time * 3) * 0.05);
        }
        if (this.outerCage) {
          this.outerCage.rotation.y += 0.008;
          this.outerCage.rotation.x += 0.004;
        }
        if (this.ring1) this.ring1.rotation.z += 0.012;
        if (this.ring2) this.ring2.rotation.z -= 0.016;
        if (this.satellites) this.satellites.rotation.z += 0.018;

      } else if (this.currentMode === 'torus') {
        if (this.torusKnot) {
          this.torusKnot.rotation.z = time * 0.2;
          this.torusWire.rotation.z = -time * 0.15;
        }

      } else if (this.currentMode === 'matrix' && this.cubeGroup) {
        this.cubeGroup.children.forEach(cube => {
          cube.rotation.x += 0.02;
          cube.rotation.y += 0.02;
          cube.position.y = cube.userData.initialY + Math.sin(time * 2 + cube.userData.offset) * 0.12;
        });

      } else if (this.currentMode === 'neural') {
        if (this.neuralCloud) this.neuralCloud.rotation.y -= 0.005;
        if (this.neuralCage) this.neuralCage.rotation.y += 0.004;
      }
    }

    // Background Dust Drift
    if (this.dustParticles) {
      this.dustParticles.rotation.y = time * 0.02;
      this.dustParticles.rotation.x = time * 0.01;
    }

    // Shockwave pulse
    if (this.shockwaveActive) {
      this.shockwaveRadius += delta * 6;
      if (this.objectGroup) {
        const pulse = 1 + Math.sin(this.shockwaveRadius * Math.PI) * 0.25;
        this.objectGroup.scale.set(pulse, pulse, pulse);
      }
      if (this.shockwaveRadius >= 1) {
        this.shockwaveActive = false;
        if (this.objectGroup) this.objectGroup.scale.set(1, 1, 1);
      }
    }

    // Render Scene
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  // Pure Canvas Fallback if Three.js fails or is offline
  initCanvasFallback() {
    this.container.innerHTML = '<canvas id="fallback-3d-canvas" style="width:100%;height:100%;"></canvas>';
    const canvas = document.getElementById('fallback-3d-canvas');
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = this.container.clientWidth * (window.devicePixelRatio || 1);
      canvas.height = this.container.clientHeight * (window.devicePixelRatio || 1);
    };
    resize();
    window.addEventListener('resize', resize);

    // 3D Wireframe Icosahedron vertices
    const phi = (1 + Math.sqrt(5)) / 2;
    const rawVertices = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
    ];
    const edges = [
      [0,11],[0,5],[0,1],[0,7],[0,10],[1,5],[1,9],[1,8],[1,7],[2,11],
      [2,4],[2,6],[2,10],[3,9],[3,4],[3,6],[3,8],[4,5],[4,9],[5,11],
      [6,7],[6,8],[7,10],[8,9],[10,11]
    ];

    let angleX = 0;
    let angleY = 0;

    const render = () => {
      requestAnimationFrame(render);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      angleX += 0.008;
      angleY += 0.012;

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const scale = Math.min(canvas.width, canvas.height) * 0.22;

      // Project vertices
      const projected = rawVertices.map(v => {
        let x = v[0], y = v[1], z = v[2];

        // Rot Y
        let x1 = x * Math.cos(angleY) + z * Math.sin(angleY);
        let z1 = -x * Math.sin(angleY) + z * Math.cos(angleY);

        // Rot X
        let y2 = y * Math.cos(angleX) - z1 * Math.sin(angleX);
        let z2 = y * Math.sin(angleX) + z1 * Math.cos(angleX);

        // Perspective
        const fov = 4;
        const pz = z2 + fov;
        return {
          x: cx + (x1 / pz) * scale * 2.5,
          y: cy + (y2 / pz) * scale * 2.5,
          z: z2
        };
      });

      // Draw Edges
      ctx.lineWidth = 2 * (window.devicePixelRatio || 1);
      edges.forEach(([i, j]) => {
        const p1 = projected[i];
        const p2 = projected[j];
        const alpha = Math.max(0.2, (p1.z + p2.z + 4) / 8);

        ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      // Draw Nodes
      projected.forEach(p => {
        ctx.fillStyle = '#a855f7';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4 * (window.devicePixelRatio || 1), 0, Math.PI * 2);
        ctx.fill();
      });
    };
    render();
  }
}

// Global initialization helper
window.initHero3D = function(containerId) {
  return new Hero3DScene(containerId);
};

