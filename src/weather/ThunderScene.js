import * as THREE from 'three';
import { WeatherScene } from './WeatherScene.js';
import { createLightningBolt } from '../utils/LightningBolt.js';
import { smoothstep, lerp } from '../utils/math.js';

export class ThunderScene extends WeatherScene {
  constructor(scene, camera) {
    super(scene, camera);
    this.backgroundColor = new THREE.Color(0x050510);
    this.bolt = null;
    this.boltGroup = null;
    this.flashIntensity = 0;
    this.clouds = [];
    this.secondaryBolts = [];
    this.ambientLight = null;
    this.pointLight = null;
  }

  init() {
    // Ambient light (very dim for storm)
    this.ambientLight = new THREE.AmbientLight(0x222244, 0.15);
    this.group.add(this.ambientLight);

    // Point light for flash
    this.pointLight = new THREE.PointLight(0x8888ff, 0, 50);
    this.pointLight.position.set(0, 8, 0);
    this.group.add(this.pointLight);

    // Storm clouds
    this._createClouds();

    // Ground plane
    const groundGeo = new THREE.PlaneGeometry(60, 60);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a15,
      roughness: 0.8,
      metalness: 0.2,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    this.group.add(ground);

    // Create initial bolt
    this._regenerateBolt();

    // Create secondary bolts
    for (let i = 0; i < 3; i++) {
      this._createSecondaryBolt(i);
    }
  }

  _createClouds() {
    const cloudCount = 8;
    for (let i = 0; i < cloudCount; i++) {
      const geo = new THREE.PlaneGeometry(
        8 + Math.random() * 12,
        3 + Math.random() * 4
      );
      const mat = new THREE.MeshBasicMaterial({
        color: 0x1a1a2e,
        transparent: true,
        opacity: 0.6 + Math.random() * 0.3,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const cloud = new THREE.Mesh(geo, mat);
      cloud.position.set(
        (Math.random() - 0.5) * 30,
        9 + Math.random() * 5,
        -5 + (Math.random() - 0.5) * 15
      );
      cloud.userData.baseX = cloud.position.x;
      cloud.userData.speed = 0.1 + Math.random() * 0.2;
      this.clouds.push(cloud);
      this.group.add(cloud);
    }
  }

  _regenerateBolt() {
    if (this.boltGroup) {
      this.group.remove(this.boltGroup);
    }
    const start = new THREE.Vector3(0 + (Math.random() - 0.5) * 2, 12, 0);
    const end = new THREE.Vector3(0 + (Math.random() - 0.5) * 3, -2, 0);
    this.bolt = createLightningBolt(start, end, {
      generations: 7,
      maxOffset: 2.0,
      branchChance: 0.35,
      thickness: 0.05,
    });
    this.boltGroup = this.bolt.group;
    this.boltGroup.visible = false;
    this.group.add(this.boltGroup);
  }

  _createSecondaryBolt(index) {
    const offsetX = (index - 1) * 8;
    const start = new THREE.Vector3(offsetX + (Math.random() - 0.5) * 3, 12, -3 + Math.random() * 2);
    const end = new THREE.Vector3(offsetX + (Math.random() - 0.5) * 4, -2, -3 + Math.random() * 2);
    const bolt = createLightningBolt(start, end, {
      generations: 5,
      maxOffset: 1.5,
      branchChance: 0.2,
      thickness: 0.03,
    });
    bolt.group.visible = false;
    bolt.group.scale.setScalar(0.7);
    this.secondaryBolts.push(bolt);
    this.group.add(bolt.group);
  }

  activate() {
    super.activate();
    this._regenerateBolt();
    this.secondaryBolts.forEach((b, i) => {
      this.group.remove(b.group);
    });
    this.secondaryBolts = [];
    for (let i = 0; i < 3; i++) {
      this._createSecondaryBolt(i);
    }
  }

  update(progress, delta, elapsed) {
    // Cloud drift
    this.clouds.forEach(cloud => {
      cloud.position.x = cloud.userData.baseX + Math.sin(elapsed * cloud.userData.speed) * 2;
    });

    // Main lightning bolt reveal (0.25 - 0.5)
    const boltProgress = smoothstep(0.25, 0.5, progress);
    if (this.boltGroup) {
      this.boltGroup.visible = boltProgress > 0;
      // Scale Y to reveal from top to bottom
      this.boltGroup.scale.y = boltProgress;
      // Clamp position so it scales from the top
      this.boltGroup.position.y = (1 - boltProgress) * 12;
    }

    // Flash effect (0.45 - 0.6)
    const flashProgress = smoothstep(0.45, 0.5, progress) * (1 - smoothstep(0.5, 0.65, progress));
    this.flashIntensity = flashProgress;
    this.pointLight.intensity = flashProgress * 15;
    this.ambientLight.intensity = lerp(0.15, 2.0, flashProgress);
    this.bloomStrength = lerp(0, 3.5, flashProgress);

    // Clouds flash
    this.clouds.forEach(cloud => {
      cloud.material.color.setHex(
        flashProgress > 0.3 ? 0x6666aa : 0x1a1a2e
      );
    });

    // Secondary bolts flicker (0.6 - 1.0)
    const secondaryPhase = smoothstep(0.6, 0.65, progress);
    this.secondaryBolts.forEach((bolt, i) => {
      if (secondaryPhase > 0) {
        const flicker = Math.sin(elapsed * (8 + i * 3)) > 0.3;
        bolt.group.visible = flicker && progress > 0.6;
      } else {
        bolt.group.visible = false;
      }
    });

    // Camera shake during flash
    const shakeAmount = flashProgress * 0.15;
    this.camera.position.x = Math.sin(elapsed * 30) * shakeAmount;
    this.camera.position.y = 3 + Math.cos(elapsed * 25) * shakeAmount;

    // Scene darkening based on progress
    if (progress < 0.25) {
      this.backgroundColor.setHex(0x080818);
      this.ambientLight.intensity = lerp(0.3, 0.1, progress * 4);
    }
  }

  deactivate() {
    super.deactivate();
    this.camera.position.set(0, 3, 12);
    this.bloomStrength = 0;
  }
}
