import { Particle, ParticleState } from './Particle.js';
import { TextSampler } from './TextSampler.js';
import { drawParticle } from './shapes.js';
import { lerp, easeOutCubic } from './easing.js';

const PARTICLE_COUNT = 4000;

export class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.textSampler = new TextSampler();
    this.currentText = '';
    this.elapsed = 0;
    this.randomColorMode = false;
    this.particleColor = '#ffffff';
    this.particleShape = 'circle';

    this._depthSorted = []; // Pre-sorted for draw()
    this._initParticles();
  }

  _initParticles() {
    this.particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = new Particle(this.canvas.width, this.canvas.height);
      p.color = this.particleColor;
      p.shape = this.particleShape;
      this.particles.push(p);
    }
    // Pre-sort by depth (doesn't change at runtime)
    this._depthSorted = [...this.particles].sort((a, b) => a.depth - b.depth);
  }

  setText(text) {
    this.currentText = text;
    const targets = this.textSampler.sample(text, this.canvas.width, this.canvas.height);

    if (targets.length === 0) {
      // No text — all particles float
      for (const p of this.particles) {
        p.hasTarget = false;
        p.state = ParticleState.FLOATING;
      }
      return;
    }

    this._assignTargets(targets);
  }

  _assignTargets(targets) {
    // Fast assignment: pair each target with a nearby particle
    // Sort particles by x-position for spatial locality
    const indexed = this.particles.map((p, i) => ({ p, i }));
    indexed.sort((a, b) => a.p.x - b.p.x);

    const targetsSorted = targets.map((t, i) => ({ t, i, assigned: -1 }));
    targetsSorted.sort((a, b) => a.t.x - b.t.x);

    const used = new Uint8Array(this.particles.length);

    // For each target, find nearest particle in a local window
    const WINDOW = 40; // Check nearby particles in sorted order
    for (const ts of targetsSorted) {
      // Binary search for closest x in indexed
      let lo = 0, hi = indexed.length - 1;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (indexed[mid].p.x < ts.t.x) lo = mid + 1;
        else hi = mid;
      }

      let bestIdx = -1;
      let bestDist = Infinity;
      const start = Math.max(0, lo - WINDOW);
      const end = Math.min(indexed.length, lo + WINDOW);

      for (let j = start; j < end; j++) {
        const { p, i } = indexed[j];
        if (used[i]) continue;
        const dx = p.x - ts.t.x;
        const dy = p.y - ts.t.y;
        const dist = dx * dx + dy * dy;
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      }

      if (bestIdx !== -1) {
        ts.assigned = bestIdx;
        used[bestIdx] = 1;
      }
    }

    // Apply assignments
    const assignMap = new Map();
    for (const ts of targetsSorted) {
      if (ts.assigned !== -1) {
        assignMap.set(ts.assigned, ts.t);
      }
    }

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      const target = assignMap.get(i);
      if (target) {
        p.targetX = target.x;
        p.targetY = target.y;
        p.hasTarget = true;
        p.startX = p.x;
        p.startY = p.y;
        p.convergeProgress = 0;
        p.state = ParticleState.CONVERGING;
      } else {
        p.hasTarget = false;
        p.state = ParticleState.FLOATING;
      }
    }
  }

  setShape(shape) {
    this.particleShape = shape;
    for (const p of this.particles) {
      p.shape = shape;
    }
  }

  setColor(color) {
    this.particleColor = color;
    this.randomColorMode = false;
    for (const p of this.particles) {
      p.color = color;
    }
  }

  setRandomColorMode(enabled) {
    this.randomColorMode = enabled;
  }

  update(deltaTime) {
    this.elapsed += deltaTime;

    for (const p of this.particles) {
      // Update color if random mode
      if (this.randomColorMode) {
        const hue = (this.elapsed * 30 + p.depth * 360 + p.wobblePhase * 57) % 360;
        p.color = `hsl(${hue}, 80%, 60%)`;
      }

      switch (p.state) {
        case ParticleState.FLOATING:
          this._updateFloating(p, deltaTime);
          break;
        case ParticleState.CONVERGING:
          this._updateConverging(p, deltaTime);
          break;
        case ParticleState.FORMED:
          this._updateFormed(p, deltaTime);
          break;
      }
    }
  }

  _updateFloating(p, dt) {
    const speed = p.baseSpeed;

    // Wobble for organic motion
    p.wobblePhase += p.wobbleSpeed * dt;
    const wobbleX = Math.sin(p.wobblePhase) * p.wobbleAmplitude;
    const wobbleY = Math.cos(p.wobblePhase * 0.7) * p.wobbleAmplitude;

    p.x += (p.vx * speed + wobbleX) * dt * 60;
    p.y += (p.vy * speed + wobbleY) * dt * 60;

    // Wrap around edges
    const w = this.canvas.width;
    const h = this.canvas.height;
    if (p.x < -10) p.x = w + 10;
    if (p.x > w + 10) p.x = -10;
    if (p.y < -10) p.y = h + 10;
    if (p.y > h + 10) p.y = -10;

    p.size = p.baseSize;
    p.opacity = p.baseOpacity;
  }

  _updateConverging(p, dt) {
    p.convergeProgress += p.convergeSpeed * dt * 60;

    if (p.convergeProgress >= 1) {
      p.convergeProgress = 1;
      p.state = ParticleState.FORMED;
      p.x = p.targetX;
      p.y = p.targetY;
      return;
    }

    const t = easeOutCubic(p.convergeProgress);
    p.x = lerp(p.startX, p.targetX, t);
    p.y = lerp(p.startY, p.targetY, t);

    // Grow slightly brighter as converging
    p.opacity = lerp(p.baseOpacity, 1, t);
    p.size = lerp(p.baseSize, p.baseSize * 1.2, t * (1 - t) * 4); // Slight bulge mid-converge
  }

  _updateFormed(p, dt) {
    p.jitterPhase += dt * 2;
    p.x = p.targetX + Math.sin(p.jitterPhase) * p.jitterAmplitude;
    p.y = p.targetY + Math.cos(p.jitterPhase * 1.3) * p.jitterAmplitude;
    p.opacity = 1;
    p.size = p.baseSize;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw back-to-front using pre-sorted array (depth never changes)
    for (const p of this._depthSorted) {
      drawParticle(this.ctx, p);
    }
  }

  handleResize(w, h) {
    // Re-sample text if there is text
    if (this.currentText) {
      const targets = this.textSampler.sample(this.currentText, w, h);
      if (targets.length > 0) {
        this._assignTargets(targets);
      }
    }

    // Clamp floating particles
    for (const p of this.particles) {
      if (p.state === ParticleState.FLOATING) {
        p.x = Math.min(p.x, w);
        p.y = Math.min(p.y, h);
      }
    }
  }

  // Used by GIF exporter to reset state
  resetParticles() {
    for (const p of this.particles) {
      p.reset(this.canvas.width, this.canvas.height);
    }
    this.currentText = '';
  }
}
