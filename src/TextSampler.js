export class TextSampler {
  constructor() {
    this.offscreenCanvas = document.createElement('canvas');
    this.offscreenCtx = this.offscreenCanvas.getContext('2d', { willReadFrequently: true });
  }

  sample(text, canvasWidth, canvasHeight, maxPoints = 3000) {
    if (!text) return [];

    const oc = this.offscreenCanvas;
    const ctx = this.offscreenCtx;

    oc.width = canvasWidth;
    oc.height = canvasHeight;

    ctx.clearRect(0, 0, oc.width, oc.height);

    const fontSize = this._calculateFontSize(text, canvasWidth, canvasHeight);
    ctx.font = `800 ${fontSize}px "Inter", Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, oc.width / 2, oc.height / 2);

    const imageData = ctx.getImageData(0, 0, oc.width, oc.height);
    const data = imageData.data;

    const points = [];
    const gap = 2;
    for (let y = 0; y < oc.height; y += gap) {
      for (let x = 0; x < oc.width; x += gap) {
        const index = (y * oc.width + x) * 4;
        if (data[index + 3] > 128) {
          points.push({ x, y });
        }
      }
    }

    if (points.length > maxPoints) {
      return this._subsample(points, maxPoints);
    }
    return points;
  }

  _calculateFontSize(text, width, height) {
    const maxByHeight = height * 0.5;
    const maxByWidth = (width * 0.8) / Math.max(text.length * 0.6, 1);
    return Math.max(40, Math.min(200, Math.min(maxByHeight, maxByWidth)));
  }

  _subsample(points, count) {
    const result = [...points];
    for (let i = result.length - 1; i > result.length - 1 - count && i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result.slice(result.length - count);
  }
}
