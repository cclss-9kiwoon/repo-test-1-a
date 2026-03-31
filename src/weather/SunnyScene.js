import * as THREE from 'three';
import { WeatherScene } from './WeatherScene.js';
import { lerp, smoothstep } from '../utils/math.js';

export class SunnyScene extends WeatherScene {
  constructor(scene, camera) {
    super(scene, camera);
    this.backgroundColor = new THREE.Color(0x87ceeb);
    this.sun = null;
    this.sunLight = null;
    this.godRays = null;
    this.dustParticles = null;
    this.sunGlow = null;
    this.halo = null;
  }

  init() {
    // Warm ambient
    const ambient = new THREE.AmbientLight(0xffeedd, 0.4);
    this.group.add(ambient);

    // Sun light
    this.sunLight = new THREE.PointLight(0xffdd44, 0, 80);
    this.sunLight.position.set(0, 15, -15);
    this.group.add(this.sunLight);

    this._createSun();
    this._createGodRays();
    this._createDustMotes();
    this._createGround();
  }

  _createSun() {
    // Sun core
    const sunGeo = new THREE.SphereGeometry(2.5, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xffee55 });
    this.sun = new THREE.Mesh(sunGeo, sunMat);
    this.sun.position.set(0, -5, -15);  // Start below view
    this.group.add(this.sun);

    // Glow ring
    const glowGeo = new THREE.SphereGeometry(3.5, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xffdd44,
      transparent: true,
      opacity: 0.3,
      side: THREE.BackSide,
    });
    this.sunGlow = new THREE.Mesh(glowGeo, glowMat);
    this.sunGlow.position.copy(this.sun.position);
    this.group.add(this.sunGlow);

    // Outer halo
    const haloGeo = new THREE.SphereGeometry(5, 32, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xffcc33,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide,
    });
    this.halo = new THREE.Mesh(haloGeo, haloMat);
    this.halo.position.copy(this.sun.position);
    this.group.add(this.halo);
  }

  _createGodRays() {
    this.godRays = new THREE.Group();
    const rayCount = 12;

    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 2;
      const length = 15 + Math.random() * 10;
      const width = 0.8 + Math.random() * 1.2;

      const geo = new THREE.PlaneGeometry(width, length);
      const mat = new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: new THREE.Color(0xffee88) },
          uOpacity: { value: 0.08 },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          uniform float uOpacity;
          varying vec2 vUv;
          void main() {
            // Gradient: bright at center (uv.y=0.5 is sun end), fading outward
            float grad = 1.0 - vUv.y;
            float edgeFade = 1.0 - abs(vUv.x - 0.5) * 2.0;
            float alpha = grad * edgeFade * uOpacity;
            gl_FragColor = vec4(uColor, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });

      const ray = new THREE.Mesh(geo, mat);
      ray.position.set(0, 0, 0);
      // Rotate around Z then position
      ray.rotation.z = angle;
      // Move the pivot to one end
      geo.translate(0, length * 0.5, 0);
      this.godRays.add(ray);
    }

    this.godRays.position.copy(this.sun.position);
    this.godRays.visible = false;
    this.group.add(this.godRays);
  }

  _createDustMotes() {
    const count = 500;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = Math.random() * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      sizes[i] = 0.02 + Math.random() * 0.04;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uOpacity: { value: 0 },
      },
      vertexShader: `
        attribute float size;
        void main() {
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (200.0 / -mvPos.z);
          gl_Position = projectionMatrix * mvPos;
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          float alpha = (1.0 - d * 2.0) * uOpacity;
          gl_FragColor = vec4(1.0, 0.95, 0.8, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.dustParticles = new THREE.Points(geo, mat);
    this.group.add(this.dustParticles);
  }

  _createGround() {
    const geo = new THREE.PlaneGeometry(60, 60);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x8B7355,
      roughness: 0.9,
      metalness: 0.0,
    });
    const ground = new THREE.Mesh(geo, mat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    this.group.add(ground);
  }

  update(progress, delta, elapsed) {
    // Sun rise (0.0 - 0.4)
    const riseProgress = smoothstep(0.0, 0.4, progress);
    const sunY = lerp(-5, 12, riseProgress);
    this.sun.position.y = sunY;
    this.sunGlow.position.y = sunY;
    this.halo.position.y = sunY;
    this.godRays.position.y = sunY;
    this.sunLight.position.y = sunY;

    // Sun pulsation
    const pulse = 1 + Math.sin(elapsed * 2) * 0.03;
    this.sun.scale.setScalar(pulse);
    this.sunGlow.scale.setScalar(pulse * 1.2);

    // Light intensity
    this.sunLight.intensity = lerp(0, 3, riseProgress);

    // God rays appear (0.3 - 0.5)
    const rayProgress = smoothstep(0.3, 0.5, progress);
    this.godRays.visible = rayProgress > 0;
    this.godRays.rotation.z = elapsed * 0.02;
    this.godRays.children.forEach(ray => {
      ray.material.uniforms.uOpacity.value = rayProgress * 0.08;
    });

    // Background color transition
    const bgProgress = smoothstep(0.0, 0.5, progress);
    this.backgroundColor.setRGB(
      lerp(0.15, 0.53, bgProgress),
      lerp(0.15, 0.81, bgProgress),
      lerp(0.3, 0.92, bgProgress),
    );

    // Dust motes (0.5+)
    const dustProgress = smoothstep(0.5, 0.7, progress);
    this.dustParticles.material.uniforms.uOpacity.value = dustProgress * 0.4;
    const dustPos = this.dustParticles.geometry.attributes.position.array;
    for (let i = 0; i < dustPos.length; i += 3) {
      dustPos[i + 1] += delta * 0.2;
      dustPos[i] += Math.sin(elapsed + i) * delta * 0.05;
      if (dustPos[i + 1] > 15) dustPos[i + 1] = 0;
    }
    this.dustParticles.geometry.attributes.position.needsUpdate = true;

    // Camera
    const camProgress = smoothstep(0.3, 0.8, progress);
    this.camera.position.y = lerp(3, 4, camProgress);
    this.camera.lookAt(0, lerp(2, sunY * 0.5, camProgress), -5);

    // Bloom
    this.bloomStrength = lerp(0, 2.0, riseProgress);

    // Warm fog
    if (riseProgress > 0.3) {
      this.fogConfig = { color: 0xffe4b5, density: lerp(0, 0.015, riseProgress) };
    } else {
      this.fogConfig = null;
    }
  }

  deactivate() {
    super.deactivate();
    this.camera.position.set(0, 3, 12);
    this.camera.lookAt(0, 2, 0);
    this.fogConfig = null;
  }
}
