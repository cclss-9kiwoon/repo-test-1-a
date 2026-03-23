export class Camera {
  constructor(viewWidth, viewHeight) {
    this.x = 0;
    this.y = 0;
    this.viewWidth = viewWidth;
    this.viewHeight = viewHeight;
  }

  follow(target, stageWidth) {
    this.x = target.x - this.viewWidth / 2 + target.width / 2;
    if (this.x < 0) this.x = 0;
    if (this.x > stageWidth - this.viewWidth) {
      this.x = Math.max(0, stageWidth - this.viewWidth);
    }
    this.y = 0;
  }

  isVisible(entity) {
    return (
      entity.x + entity.width > this.x &&
      entity.x < this.x + this.viewWidth
    );
  }
}
