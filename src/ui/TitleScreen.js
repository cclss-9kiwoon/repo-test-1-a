export class TitleScreen {
  constructor() {
    this.el = document.getElementById('title-screen');
    this.input = document.getElementById('theme-input');
    this.btnNew = document.getElementById('btn-new-game');
    this.btnContinue = document.getElementById('btn-continue');
    this._resolve = null;
    this._hasSave = false;

    this.btnNew.addEventListener('click', () => {
      const theme = this.input.value.trim() || '랜덤 모험';
      if (this._resolve) {
        this._resolve({ action: 'new', theme });
        this._resolve = null;
      }
    });

    this.btnContinue.addEventListener('click', () => {
      if (this._resolve && this._hasSave) {
        this._resolve({ action: 'continue' });
        this._resolve = null;
      }
    });

    // Enter 키로 새 게임 시작
    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.btnNew.click();
      }
    });
  }

  show(hasSave = false) {
    this._hasSave = hasSave;
    this.btnContinue.disabled = !hasSave;
    this.input.value = '';
    this.el.classList.add('active');
    this.input.focus();

    return new Promise((resolve) => {
      this._resolve = resolve;
    });
  }

  hide() {
    this.el.classList.remove('active');
  }
}
