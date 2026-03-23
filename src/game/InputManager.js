export class InputManager {
  constructor() {
    this.keys = {};
    this.justPressed = {};
    this._prevKeys = {};

    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      e.preventDefault();
    });
    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
      e.preventDefault();
    });
  }

  update() {
    for (const code in this.keys) {
      this.justPressed[code] = this.keys[code] && !this._prevKeys[code];
    }
    this._prevKeys = { ...this.keys };
  }

  isDown(code) {
    return !!this.keys[code];
  }

  isJustPressed(code) {
    return !!this.justPressed[code];
  }
}
