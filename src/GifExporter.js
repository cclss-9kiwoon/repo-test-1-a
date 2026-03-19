export class GifExporter {
  constructor(canvas, particleSystem) {
    this.canvas = canvas;
    this.particleSystem = particleSystem;
  }

  async export() {
    const ps = this.particleSystem;
    const finalText = ps.currentText;
    if (!finalText) return null;

    // Dynamically import modern-gif (keep initial bundle small)
    const { encode } = await import('modern-gif');
    const workerUrl = (await import('modern-gif/worker?url')).default;

    // Build incremental text steps: 'h' -> 'he' -> 'hel' -> ...
    const steps = [];
    for (let i = 1; i <= finalText.length; i++) {
      steps.push(finalText.substring(0, i));
    }

    // Save current state
    const savedText = ps.currentText;
    const savedRandomColor = ps.randomColorMode;
    const savedColor = ps.particleColor;

    // Scale down for reasonable GIF size
    const gifWidth = Math.min(this.canvas.width, 480);
    const gifHeight = Math.min(this.canvas.height, 270);

    const offscreen = document.createElement('canvas');
    offscreen.width = gifWidth;
    offscreen.height = gifHeight;
    const offCtx = offscreen.getContext('2d');

    const frames = [];
    const frameDelay = 80;
    const convergenceFrames = 25;
    const holdFrames = 12;

    // Reset particles for clean replay
    ps.resetParticles();

    for (const step of steps) {
      ps.setText(step);

      // Simulate convergence
      for (let f = 0; f < convergenceFrames; f++) {
        ps.update(1 / 30);
        ps.draw();

        offCtx.fillStyle = '#0a0a1a';
        offCtx.fillRect(0, 0, gifWidth, gifHeight);
        offCtx.drawImage(this.canvas, 0, 0, gifWidth, gifHeight);

        const imageData = offCtx.getImageData(0, 0, gifWidth, gifHeight);
        frames.push({ data: imageData.data, delay: frameDelay });
      }

      // Hold formed text
      for (let f = 0; f < holdFrames; f++) {
        ps.update(1 / 30);
        ps.draw();

        offCtx.fillStyle = '#0a0a1a';
        offCtx.fillRect(0, 0, gifWidth, gifHeight);
        offCtx.drawImage(this.canvas, 0, 0, gifWidth, gifHeight);

        const imageData = offCtx.getImageData(0, 0, gifWidth, gifHeight);
        frames.push({ data: imageData.data, delay: frameDelay });
      }
    }

    // Encode to GIF
    const output = await encode({
      workerUrl,
      width: gifWidth,
      height: gifHeight,
      frames,
    });

    // Restore state
    ps.resetParticles();
    ps.currentText = savedText;
    ps.randomColorMode = savedRandomColor;
    ps.particleColor = savedColor;
    if (savedText) {
      ps.setText(savedText);
    }

    return new Blob([output], { type: 'image/gif' });
  }
}
