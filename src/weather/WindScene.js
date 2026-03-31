import * as THREE from 'three';
import { WeatherScene } from './WeatherScene.js';
import { noise3D } from '../utils/noise.js';
import { lerp, smoothstep } from '../utils/math.js';

const PARTICLE_COUNT = 10000;
const STREAK_COUNT = 60;
const LEAF_COUNT = 20;

export class WindScene extends WeatherScene {
  constructor(scene, camera) {
    super(scene, camera);
    this.backgroundColor = new THREE.Color(0x8899aa);
    this.particles = null;
    this.particleVelocities = null;
    this.streaks = [];
    this.leaves = [];
    this.windSpeed = 0;
  }

  init() {
    // Lighting
    const ambient = new THREE.AmbientLight(0xaabbcc, 0.5);
    this.group.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xccddee, 0.3);
    dirLight.position.set(5, 8, 3);
    this.group.add(dirLight);

    this._createFlowParticles();
    this._createStreaks();
    this._createLeaves();
    this._createGround();
  }

  _createFlowParticles() {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    this.particleVelocities = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 40;
      positions[i3 + 1] = Math.random() * 15;
      positions[i3 + 2] = (Math.random() - 0.5) * 30;
      this.particleVelocities[i] = 0.5 + Math.random() * 0.5;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uOpacity: { value: 0.3 },
        uSize: { value: 0.04 },
      },
      vertexShader: `
        uniform float uSize;
        varying float vAlpha;
        void main() {
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = uSize * (200.0 / -mvPos.z);
          gl_Position = projectionMatrix * mvPos;
          vAlpha = smoothstep(-30.0, -3.0, mvPos.z);
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        varying float vAlpha;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float alpha = (1.0 - d * 2.0) * uOpacity * vAlpha;
          gl_FragColor = vec4(0.9, 0.93, 0.97, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.particles = new THREE.Points(geo, mat);
    this.group.add(this.particles);
  }

  _createStreaks() {
    for (let i = 0; i < STREAK_COUNT; i++) {
      const points = [];
      const startX = (Math.random() - 0.5) * 50 - 10;
      const y = Math.random() * 12;
      const z = (Math.random() - 0.5) * 20;
      const length = 3 + Math.random() * 5;

      for (let j = 0; j < 10; j++) {
        const t = j / 9;
        points.push(new THREE.Vector3(
          startX + t * length,
          y + Math.sin(t * Math.PI) * 0.3,
          z
        ));
      }

      const curve = new THREE.CatmullRomCurve3(points);
      const geo = new THREE.TubeGeometry(curve, 10, 0.015, 4, false);
      const mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0,
      });

      const streak = new THREE.Mesh(geo, mat);
      streak.userData.speed = 4 + Math.random() * 8;
      streak.userData.baseX = startX;
      streak.userData.y = y;
      streak.userData.z = z;
      streak.userData.length = length;
      this.streaks.push(streak);
      this.group.add(streak);
    }
  }

  _createLeaves() {
    const leafGeo = new THREE.PlaneGeometry(0.3, 0.2);

    for (let i = 0; i < LEAF_COUNT; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.08 + Math.random() * 0.1, 0.4, 0.4),
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      const leaf = new THREE.Mesh(leafGeo, mat);
      leaf.position.set(
        (Math.random() - 0.5) * 30 - 15,
        1 + Math.random() * 8,
        (Math.random() - 0.5) * 15
      );
      leaf.userData.baseX = leaf.position.x;
      leaf.userData.speed = 3 + Math.random() * 5;
      leaf.userData.rotSpeed = 2 + Math.random() * 4;
      leaf.userData.bobPhase = Math.random() * Math.PI * 2;
      this.leaves.push(leaf);
      this.group.add(leaf);
    }
  }

  _createGround() {
    const geo = new THREE.PlaneGeometry(60, 60);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x556677,
      roughness: 0.95,
      metalness: 0.0,
    });
    const ground = new THREE.Mesh(geo, mat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    this.group.add(ground);
  }

  update(progress, delta, elapsed) {
    this.windSpeed = smoothstep(0.0, 0.5, progress);
    const turbulence = smoothstep(0.4, 0.8, progress);

    // Flow-field particles
    if (this.particles) {
      const pos = this.particles.geometry.attributes.position.array;
      const noiseScale = 0.08;
      const timeScale = 0.3 + turbulence * 0.7;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const x = pos[i3];
        const y = pos[i3 + 1];
        const z = pos[i3 + 2];

        // Noise-driven direction
        const nx = noise3D(x * noiseScale, y * noiseScale, elapsed * timeScale) * 0.5;
        const ny = noise3D(x * noiseScale + 100, y * noiseScale, elapsed * timeScale) * 0.2;
        const nz = noise3D(x * noiseScale, y * noiseScale + 100, elapsed * timeScale) * 0.3;

        // Primary wind direction (right) + noise turbulence
        const speed = this.particleVelocities[i] * this.windSpeed;
        pos[i3] += (3 * speed + nx * turbulence * 3) * delta;
        pos[i3 + 1] += ny * turbulence * delta;
        pos[i3 + 2] += nz * turbulence * delta;

        // Wrap around
        if (pos[i3] > 20) pos[i3] = -20;
        if (pos[i3] < -20) pos[i3] = 20;
        if (pos[i3 + 1] > 15) pos[i3 + 1] = 0;
        if (pos[i3 + 1] < -2) pos[i3 + 1] = 15;
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
      this.particles.material.uniforms.uOpacity.value = lerp(0, 0.4, this.windSpeed);
    }

    // Streaks
    this.streaks.forEach(streak => {
      const speed = streak.userData.speed * this.windSpeed;
      streak.position.x += speed * delta;
      streak.material.opacity = lerp(0, 0.12, smoothstep(0.2, 0.5, progress));

      // Reset
      if (streak.position.x > 25) {
        streak.position.x = -25;
      }
    });

    // Leaves
    this.leaves.forEach(leaf => {
      if (progress > 0.3) {
        const speed = leaf.userData.speed * this.windSpeed;
        leaf.position.x += speed * delta;
        leaf.position.y += Math.sin(elapsed * 2 + leaf.userData.bobPhase) * delta * 0.5;
        leaf.rotation.x += leaf.userData.rotSpeed * delta;
        leaf.rotation.z += leaf.userData.rotSpeed * 0.7 * delta;
        leaf.material.opacity = lerp(0, 0.7, smoothstep(0.3, 0.5, progress));

        // Reset
        if (leaf.position.x > 20) {
          leaf.position.x = -20;
          leaf.position.y = 1 + Math.random() * 8;
        }
      }
    });

    // Camera shake in strong wind
    const shakeAmount = turbulence * 0.08;
    this.camera.position.x = Math.sin(elapsed * 5) * shakeAmount;
    this.camera.position.y = 3 + Math.cos(elapsed * 4) * shakeAmount * 0.5;
    this.camera.position.z = 12;
    this.camera.lookAt(0, 2, 0);

    // Background
    this.backgroundColor.setRGB(
      lerp(0.4, 0.53, this.windSpeed),
      lerp(0.45, 0.6, this.windSpeed),
      lerp(0.55, 0.73, this.windSpeed)
    );

    this.bloomStrength = 0;
  }

  deactivate() {
    super.deactivate();
    this.camera.position.set(0, 3, 12);
    this.camera.lookAt(0, 2, 0);
  }
}
