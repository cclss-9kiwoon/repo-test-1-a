export class UIController {
  constructor({ onTextChange, onShapeChange, onColorChange, onRandomColor, onExport }) {
    this.callbacks = { onTextChange, onShapeChange, onColorChange, onRandomColor, onExport };
    this._adModalResolve = null;

    this._bindInput();
    this._bindShapeSelector();
    this._bindColorPicker();
    this._bindExportButton();
    this._bindAdModal();
  }

  _bindInput() {
    const input = document.getElementById('text-input');
    const exportBtn = document.getElementById('export-btn');
    let debounceTimer = null;

    input.addEventListener('input', (e) => {
      const text = e.target.value;
      exportBtn.disabled = !text.length;

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        this.callbacks.onTextChange(text);
      }, 80);
    });
  }

  _bindShapeSelector() {
    const buttons = document.querySelectorAll('.shape-btn');
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.callbacks.onShapeChange(btn.dataset.shape);
      });
    });
  }

  _bindColorPicker() {
    const picker = document.getElementById('color-picker');
    const randomCheckbox = document.getElementById('random-color');

    picker.addEventListener('input', (e) => {
      if (!randomCheckbox.checked) {
        this.callbacks.onColorChange(e.target.value);
      }
    });

    randomCheckbox.addEventListener('change', (e) => {
      this.callbacks.onRandomColor(e.target.checked);
      if (!e.target.checked) {
        this.callbacks.onColorChange(picker.value);
      }
    });
  }

  _bindExportButton() {
    const btn = document.getElementById('export-btn');
    btn.addEventListener('click', () => {
      this.callbacks.onExport();
    });
  }

  _bindAdModal() {
    const closeBtn = document.getElementById('ad-modal-close');
    closeBtn.addEventListener('click', () => {
      this.hideAdModal();
      if (this._adModalResolve) {
        this._adModalResolve();
        this._adModalResolve = null;
      }
    });
  }

  showAdModal() {
    document.getElementById('ad-modal').classList.remove('hidden');
  }

  hideAdModal() {
    document.getElementById('ad-modal').classList.add('hidden');
  }

  waitForAdDismissal() {
    return new Promise((resolve) => {
      this._adModalResolve = resolve;
    });
  }

  showExportProgress() {
    document.getElementById('export-progress').classList.remove('hidden');
  }

  hideExportProgress() {
    document.getElementById('export-progress').classList.add('hidden');
  }
}
