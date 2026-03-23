export class EndingScreen {
  constructor() {
    this.el = document.getElementById('ending-screen');
    this.titleEl = document.getElementById('ending-title');
    this.textEl = document.getElementById('ending-text');
    this.btnNew = document.getElementById('btn-new-game-end');
    this.btnContinue = document.getElementById('btn-continue-end');
    this._resolve = null;

    this.btnNew.addEventListener('click', () => {
      if (this._resolve) {
        this._resolve('new');
        this._resolve = null;
      }
    });

    this.btnContinue.addEventListener('click', () => {
      if (this._resolve) {
        this._resolve('continue');
        this._resolve = null;
      }
    });
  }

  show(isGoodEnding, text) {
    this.el.className = 'ui-overlay active ' + (isGoodEnding ? 'ending-good' : 'ending-bad');
    this.titleEl.textContent = isGoodEnding ? 'GOOD ENDING' : 'BAD ENDING';
    this.textEl.textContent = text;

    return new Promise((resolve) => {
      this._resolve = resolve;
    });
  }

  hide() {
    this.el.classList.remove('active');
    this.el.className = 'ui-overlay';
  }
}
