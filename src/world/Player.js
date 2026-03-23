import { clamp } from '../utils/helpers.js';

const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const MOVE_SPEED = 4;
const GROUND_Y = 480; // 바닥 높이 (canvas 600 기준)

export class Player {
  constructor() {
    this.x = 60;
    this.y = GROUND_Y;
    this.width = 32;
    this.height = 48;
    this.vx = 0;
    this.vy = 0;
    this.onGround = true;
    this.color = '#4fc3f7';
    this.facingRight = true;
  }

  reset(startX = 60) {
    this.x = startX;
    this.y = GROUND_Y;
    this.vx = 0;
    this.vy = 0;
    this.onGround = true;
  }

  update(input) {
    // 좌우 이동
    this.vx = 0;
    if (input.isDown('ArrowLeft') || input.isDown('KeyA')) {
      this.vx = -MOVE_SPEED;
      this.facingRight = false;
    }
    if (input.isDown('ArrowRight') || input.isDown('KeyD')) {
      this.vx = MOVE_SPEED;
      this.facingRight = true;
    }

    // 점프
    if ((input.isJustPressed('ArrowUp') || input.isJustPressed('KeyW') || input.isJustPressed('Space')) && this.onGround) {
      this.vy = JUMP_FORCE;
      this.onGround = false;
    }

    // 물리
    this.vy += GRAVITY;
    this.x += this.vx;
    this.y += this.vy;

    // 바닥 충돌
    if (this.y >= GROUND_Y) {
      this.y = GROUND_Y;
      this.vy = 0;
      this.onGround = true;
    }

    // 왼쪽 벽
    if (this.x < 0) this.x = 0;
  }

  draw(ctx, cameraX) {
    const sx = this.x - cameraX;
    const sy = this.y;

    // 몸체
    ctx.fillStyle = this.color;
    ctx.fillRect(sx, sy, this.width, this.height);

    // 눈
    ctx.fillStyle = '#fff';
    const eyeX = this.facingRight ? sx + 20 : sx + 4;
    ctx.fillRect(eyeX, sy + 10, 8, 8);
    ctx.fillStyle = '#000';
    const pupilX = this.facingRight ? eyeX + 4 : eyeX;
    ctx.fillRect(pupilX, sy + 12, 4, 4);
  }

  getBounds() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }
}
