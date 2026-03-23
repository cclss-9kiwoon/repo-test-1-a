export class Monster {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.x = config.x;
    this.y = config.y || 488; // 바닥 기준 (약간 위)
    this.width = config.width || 30;
    this.height = config.height || 30;
    this.color = config.color || '#f44';
    this.hp = config.hp;
    this.maxHp = config.hp;
    this.attack = config.attack;
    this.defense = config.defense;
    this.exp = config.exp;
    this.gold = config.gold;
    this.isBoss = config.isBoss || false;

    this.alive = true;
    this.wasOffScreen = false; // 화면 밖에 나간 적 있는지
  }

  update(cameraX, viewWidth) {
    const onScreen = this.x + this.width > cameraX && this.x < cameraX + viewWidth;

    if (!onScreen) {
      this.wasOffScreen = true;
    }

    // 화면 밖에 나갔다가 다시 돌아오면 리스폰 (죽었던 경우만)
    if (onScreen && this.wasOffScreen && !this.alive) {
      this.alive = true;
      this.hp = this.maxHp;
      this.wasOffScreen = false;
    }

    if (onScreen && this.wasOffScreen && this.alive) {
      this.wasOffScreen = false;
    }
  }

  draw(ctx, cameraX) {
    if (!this.alive) return;

    const sx = this.x - cameraX;
    const sy = this.y;

    // 몸체
    ctx.fillStyle = this.color;
    if (this.isBoss) {
      // 보스는 좀 더 큰 사각형 + 왕관
      ctx.fillRect(sx, sy, this.width, this.height);
      ctx.fillStyle = '#ffd700';
      // 왕관
      ctx.fillRect(sx + 4, sy - 8, this.width - 8, 8);
      ctx.fillRect(sx + 2, sy - 14, 6, 6);
      ctx.fillRect(sx + this.width / 2 - 3, sy - 16, 6, 8);
      ctx.fillRect(sx + this.width - 8, sy - 14, 6, 6);
    } else {
      ctx.fillRect(sx, sy, this.width, this.height);
    }

    // 눈
    ctx.fillStyle = '#fff';
    ctx.fillRect(sx + 4, sy + 6, 7, 7);
    ctx.fillRect(sx + this.width - 11, sy + 6, 7, 7);
    ctx.fillStyle = '#000';
    ctx.fillRect(sx + 7, sy + 8, 3, 3);
    ctx.fillRect(sx + this.width - 8, sy + 8, 3, 3);

    // HP 바 (보스만)
    if (this.isBoss) {
      const barWidth = this.width;
      const barHeight = 4;
      const barX = sx;
      const barY = sy - (this.isBoss ? 20 : 8);
      ctx.fillStyle = '#333';
      ctx.fillRect(barX, barY, barWidth, barHeight);
      ctx.fillStyle = '#4caf50';
      ctx.fillRect(barX, barY, barWidth * (this.hp / this.maxHp), barHeight);
    }
  }

  collidesWithPlayer(player) {
    if (!this.alive) return false;
    const pb = player.getBounds();
    return (
      this.x < pb.x + pb.width &&
      this.x + this.width > pb.x &&
      this.y < pb.y + pb.height &&
      this.y + this.height > pb.y
    );
  }
}
