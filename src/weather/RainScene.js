import * as THREE from 'three';
import { WeatherScene } from './WeatherScene.js';
import { lerp, smoothstep } from '../utils/math.js';

const RAIN_COUNT = 15000;
const SPLASH_POOL_SIZE = 30;

export class RainScene extends WeatherScene {
  constructor(scene, camera) {
    super(scene, camera);
    this.backgroundColor = new THREE.Color(0x0f1520);
    this.fogConfig = { color: 0x182030, density: 0.025 };
    this.rainPoints = null;
    this.velocities = null;
    this.splashes = [];
    this.splashIndex = 0;
  }

  init() {
    // Lighting
    const ambient = new THREE.AmbientLight(0x334455, 0.4);
    this.group.add(ambient);

    const dirLight = new THREE.DirectionalLight(0x4466aa, 0.3);
    dirLight.position.set(-5, 10, 5);
    this.group.add(dirLight);

    // Rain particles
    this._createRain();

    // Reflective ground
    this._createGround();

    // Splash pool
    this._createSplashPool();
  }

  _createRain() {
    const positions = new Float32Array(RAIN_COUNT * 3);
    this.velocities = new Float32Array(RAIN_COUNT);
    const sizes = new Float32Array(RAIN_COUNT);

    for (let i = 0; i < RAIN_COUNT; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 40;
      positions[i3 + 1] = Math.random() * 25;
      positions[i3 + 2] = (Math.random() - 0.5) * 40;
      this.velocities[i] = 8 + Math.random() * 6;
      sizes[i] = 0.03 + Math.random() * 0.04;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(0x88aacc) },
        uOpacity: { value: 0.6 },
      },
      vertexShader: `
        attribute float size;
        varying float vAlpha;
        void main() {
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPos.z);
          gl_Position = projectionMatrix * mvPos;
          vAlpha = smoothstep(-40.0, -5.0, mvPos.z);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uOpacity;
        varying float vAlpha;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          // Elongated raindrop shape
          float d = length(uv * vec2(1.0, 0.3));
          if (d > 0.5) discard;
          float alpha = (1.0 - d * 2.0) * uOpacity * vAlpha;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.rainPoints = new THREE.Points(geo, mat);
    this.group.add(this.rainPoints);
  }

  _createGround() {
    const geo = new THREE.PlaneGeometry(60, 60, 32, 32);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x111828,
      metalness: 0.9,
      roughness: 0.1,
    });
    const ground = new THREE.Mesh(geo, mat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    this.group.add(ground);
  }

  _createSplashPool() {
    for (let i = 0; i < SPLASH_POOL_SIZE; i++) {
      const geo = new THREE.RingGeometry(0.05, 0.15, 16);
      const mat = new THREE.MeshBasicMaterial({
        color: 0x5588bb,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = -1.98;
      ring.userData.life = 0;
      ring.userData.maxLife = 0;
      this.splashes.push(ring);
      this.group.add(ring);
    }
  }

  _spawnSplash(x, z) {
    const ring = this.splashes[this.splashIndex];
    ring.position.x = x;
    ring.position.z = z;
    ring.userData.life = 0.5 + Math.random() * 0.3;
    ring.userData.maxLife = ring.userData.life;
    ring.scale.set(0.3, 0.3, 0.3);
    ring.material.opacity = 0.7;
    this.splashIndex = (this.splashIndex + 1) % SPLASH_POOL_SIZE;
  }

  update(progress, delta, elapsed) {
    if (!this.rainPoints) return;

    const positions = this.rainPoints.geometry.attributes.position.array;
    const intensity = smoothstep(0.0, 0.3, progress);
    const visibleCount = Math.floor(RAIN_COUNT * intensity);

    // Update rain particles
    for (let i = 0; i < RAIN_COUNT; i++) {
      const i3 = i * 3;
      if (i < visibleCount) {
        positions[i3 + 1] -= this.velocities[i] * delta;

        // Wind drift
        positions[i3] += Math.sin(elapsed * 0.5) * 0.02;

        // Reset at ground
        if (positions[i3 + 1] < -2) {
          // Spawn splash
          if (Math.random() < 0.1) {
            this._spawnSplash(positions[i3], positions[i3 + 2]);
          }
          positions[i3] = (Math.random() - 0.5) * 40;
          positions[i3 + 1] = 20 + Math.random() * 5;
          positions[i3 + 2] = (Math.random() - 0.5) * 40;
        }
      } else {
        // Hide inactive particles
        positions[i3 + 1] = 100;
      }
    }
    this.rainPoints.geometry.attributes.position.needsUpdate = true;

    // Update splashes
    this.splashes.forEach(ring => {
      if (ring.userData.life > 0) {
        ring.userData.life -= delta;
        const t = 1 - (ring.userData.life / ring.userData.maxLife);
        ring.scale.setScalar(0.3 + t * 1.5);
        ring.material.opacity = (1 - t) * 0.5;
      } else {
        ring.material.opacity = 0;
      }
    });

    // Opacity
    this.rainPoints.material.uniforms.uOpacity.value = lerp(0, 0.6, intensity);

    // Camera movement
    const camProgress = smoothstep(0.5, 0.9, progress);
    this.camera.position.y = lerp(3, 1.5, camProgress);
    this.camera.position.z = lerp(12, 8, camProgress);
    this.camera.lookAt(0, lerp(2, 0, camProgress), 0);

    // Fog density based on progress
    this.fogConfig.density = lerp(0.01, 0.04, intensity);

    this.bloomStrength = 0.2;
  }

  deactivate() {
    super.deactivate();
    this.camera.position.set(0, 3, 12);
    this.camera.lookAt(0, 2, 0);
  }
}
