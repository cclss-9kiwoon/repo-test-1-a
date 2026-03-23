export class DialogUI {
  constructor() {
    this.el = document.getElementById('dialog-screen');
    this.titleEl = document.getElementById('dialog-title');
    this.textEl = document.getElementById('dialog-text');
    this.btnNext = document.getElementById('btn-dialog-next');
    this._resolve = null;

    this.btnNext.addEventListener('click', () => {
      if (this._resolve) {
        this._resolve();
        this._resolve = null;
      }
    });
  }

  show(title, text, buttonText = '계속') {
    this.titleEl.textContent = title;
    this.textEl.textContent = text;
    this.btnNext.textContent = buttonText;
    this.el.classList.add('active');

    return new Promise((resolve) => {
      this._resolve = resolve;
    });
  }

  hide() {
    this.el.classList.remove('active');
  }
}
