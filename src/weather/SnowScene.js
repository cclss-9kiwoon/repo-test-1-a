import * as THREE from 'three';
import { WeatherScene } from './WeatherScene.js';
import { lerp, smoothstep } from '../utils/math.js';

const SNOW_COUNT = 10000;

export class SnowScene extends WeatherScene {
  constructor(scene, camera) {
    super(scene, camera);
    this.backgroundColor = new THREE.Color(0xc0c8d8);
    this.snowPoints = null;
    this.velocities = null;
    this.wobbles = null;
    this.ground = null;
  }

  init() {
    // Soft cool lighting
    const ambient = new THREE.AmbientLight(0xaabbcc, 0.7);
    this.group.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xeeeeff, 0.4);
    dirLight.position.set(3, 10, 5);
    this.group.add(dirLight);

    this._createSnow();
    this._createGround();
  }

  _createSnow() {
    const positions = new Float32Array(SNOW_COUNT * 3);
    this.velocities = new Float32Array(SNOW_COUNT);
    this.wobbles = new Float32Array(SNOW_COUNT);
    const sizes = new Float32Array(SNOW_COUNT);

    for (let i = 0; i < SNOW_COUNT; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 50;
      positions[i3 + 1] = Math.random() * 30;
      positions[i3 + 2] = (Math.random() - 0.5) * 50;
      this.velocities[i] = 0.5 + Math.random() * 1.2;
      this.wobbles[i] = Math.random() * Math.PI * 2;
      sizes[i] = 0.08 + Math.random() * 0.25;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uOpacity: { value: 0.85 },
      },
      vertexShader: `
        attribute float size;
        varying float vSize;
        varying float vDist;
        void main() {
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (250.0 / -mvPos.z);
          gl_Position = projectionMatrix * mvPos;
          vSize = size;
          vDist = -mvPos.z;
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        varying float vSize;
        varying float vDist;
        void main() {
          // Circular snowflake with soft edge
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;

          // Hexagonal hint
          vec2 uv = gl_PointCoord - 0.5;
          float angle = atan(uv.y, uv.x);
          float hex = 0.5 + 0.05 * sin(angle * 6.0);
          float shape = smoothstep(hex, hex - 0.15, d);

          // Depth-based alpha
          float depthAlpha = smoothstep(50.0, 5.0, vDist);
          float alpha = shape * uOpacity * depthAlpha;

          // Slightly blue-white tint
          vec3 color = mix(vec3(0.9, 0.93, 1.0), vec3(1.0), vSize * 3.0);
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
    });

    this.snowPoints = new THREE.Points(geo, mat);
    this.group.add(this.snowPoints);
  }

  _createGround() {
    const geo = new THREE.PlaneGeometry(60, 60, 64, 64);
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uAccumulation: { value: 0.0 },
        uTime: { value: 0.0 },
      },
      vertexShader: `
        uniform float uAccumulation;
        uniform float uTime;
        varying vec2 vUv;
        varying float vHeight;

        // Simple noise
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        void main() {
          vUv = uv;
          vec3 pos = position;

          // Snow accumulation displacement
          float n = noise(uv * 8.0) * 0.6 + noise(uv * 16.0) * 0.3;
          float height = n * uAccumulation * 1.5;
          pos.z += height; // PlaneGeometry is XY, rotated to XZ later
          vHeight = height;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uAccumulation;
        varying vec2 vUv;
        varying float vHeight;
        void main() {
          // White snow with subtle AO in valleys
          float ao = smoothstep(0.0, 0.5, vHeight / (uAccumulation * 1.5 + 0.001));
          vec3 snow = mix(vec3(0.75, 0.78, 0.85), vec3(0.95, 0.96, 1.0), ao);
          vec3 ground = vec3(0.3, 0.32, 0.38);
          vec3 color = mix(ground, snow, smoothstep(0.0, 0.3, uAccumulation));
          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    this.ground = new THREE.Mesh(geo, mat);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.position.y = -2;
    this.group.add(this.ground);
  }

  update(progress, delta, elapsed) {
    if (!this.snowPoints) return;

    const positions = this.snowPoints.geometry.attributes.position.array;
    const intensity = smoothstep(0.0, 0.3, progress);
    const visibleCount = Math.floor(SNOW_COUNT * Math.max(intensity, 0.05));

    for (let i = 0; i < SNOW_COUNT; i++) {
      const i3 = i * 3;
      if (i < visibleCount) {
        // Fall
        positions[i3 + 1] -= this.velocities[i] * delta;
        // Wobble (sinusoidal drift)
        positions[i3] += Math.sin(elapsed * 0.5 + this.wobbles[i]) * 0.01;
        positions[i3 + 2] += Math.cos(elapsed * 0.3 + this.wobbles[i] * 1.3) * 0.008;

        if (positions[i3 + 1] < -2) {
          positions[i3] = (Math.random() - 0.5) * 50;
          positions[i3 + 1] = 25 + Math.random() * 5;
          positions[i3 + 2] = (Math.random() - 0.5) * 50;
        }
      } else {
        positions[i3 + 1] = 100;
      }
    }
    this.snowPoints.geometry.attributes.position.needsUpdate = true;

    // Snow accumulation
    const accumulation = smoothstep(0.2, 0.8, progress);
    this.ground.material.uniforms.uAccumulation.value = accumulation;
    this.ground.material.uniforms.uTime.value = elapsed;

    // Background color transition
    const bgLerp = smoothstep(0.0, 0.3, progress);
    this.backgroundColor.set(
      lerp(0x3a4050, 0xc0c8d8, bgLerp) | 0
    );

    // Camera push-in
    const camPush = smoothstep(0.5, 0.9, progress);
    this.camera.position.z = lerp(12, 7, camPush);
    this.camera.position.y = lerp(3, 2.5, camPush);
    this.camera.lookAt(0, lerp(2, 1, camPush), 0);

    // Close-up bokeh flakes
    if (progress > 0.8) {
      this.snowPoints.material.uniforms.uOpacity.value = lerp(0.85, 1.0, (progress - 0.8) * 5);
    }

    this.bloomStrength = lerp(0, 0.5, intensity);
  }

  deactivate() {
    super.deactivate();
    this.camera.position.set(0, 3, 12);
    this.camera.lookAt(0, 2, 0);
  }
}
