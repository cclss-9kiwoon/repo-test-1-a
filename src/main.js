import './style.css';
import { ParticleSystem } from './ParticleSystem.js';
import { UIController } from './UIController.js';
import { GifExporter } from './GifExporter.js';
import { ThemeManager } from './ThemeManager.js';
import { WidthMarker } from './WidthMarker.js';

class App {
  constructor() {
    this.canvas = document.getElementById('particle-canvas');
    this.particleSystem = null;
    this.uiController = null;
    this.gifExporter = null;
    this.themeManager = null;
    this.widthMarker = null;
    this.lastFrameTime = 0;
    this.isExporting = false;

    this._init();
  }

  _init() {
    this._resizeCanvas();
    window.addEventListener('resize', () => this._resizeCanvas());

    this.particleSystem = new ParticleSystem(this.canvas);
    this.themeManager = new ThemeManager(this.particleSystem);
    this.gifExporter = new GifExporter(this.canvas, this.particleSystem);

    this.widthMarker = new WidthMarker(
      document.getElementById('width-marker-bar'),
      this.canvas,
      (left, right) => this.particleSystem.setTextAreaBounds(left, right)
    );

    this.uiController = new UIController({
      onTextChange: (text) => this.particleSystem.setText(text),
      onShapeChange: (shape) => this.particleSystem.setShape(shape),
      onColorChange: (color) => this.particleSystem.setColor(color),
      onRandomColor: (enabled) => this.particleSystem.setRandomColorMode(enabled),
      onCycleShape: (enabled) => this.particleSystem.setCycleShapeMode(enabled),
      onSpeedChange: (val) => this.particleSystem.setSpeedMultiplier(val),
      onDensityChange: (val) => this.particleSystem.setDensity(val),
      onFontSizeChange: (val) => this.particleSystem.setFontSize(val),
      onGifDurationChange: (val) => this.gifExporter.setDuration(val),
      onGifQualityChange: (val) => this.gifExporter.setQuality(val),
      onExport: () => this._handleExport(),
    });

    requestAnimationFrame((t) => this._animate(t));
  }

  _resizeCanvas() {
    const container = this.canvas.parentElement;
    if (!container) return;
    this.canvas.width = container.clientWidth;
    this.canvas.height = container.clientHeight;
    if (this.particleSystem) {
      this.particleSystem.handleResize(this.canvas.width, this.canvas.height);
    }
    if (this.widthMarker) {
      this.widthMarker.handleResize();
    }
  }

  _animate(timestamp) {
    if (!this.isExporting) {
      const deltaTime = Math.min((timestamp - this.lastFrameTime) / 1000, 0.05);
      this.lastFrameTime = timestamp;

      this.particleSystem.update(deltaTime);
      this.particleSystem.draw();
    }

    requestAnimationFrame((t) => this._animate(t));
  }

  async _handleExport() {
    if (this.isExporting) return;

    this.uiController.showAdModal();
    await this.uiController.waitForAdDismissal();

    this.isExporting = true;
    this.uiController.showExportProgress();

    try {
      const blob = await this.gifExporter.export();
      if (blob) {
        this._downloadBlob(blob, 'particle-text.gif');
      }
    } catch (err) {
      console.error('GIF export failed:', err);
    } finally {
      this.isExporting = false;
      this.uiController.hideExportProgress();
    }
  }

  _downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

new App();
