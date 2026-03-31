export class Navigation {
  constructor(scrollController) {
    this.scrollController = scrollController;
    this.buttons = document.querySelectorAll('.nav-btn');
    this.activeScene = 'thunder';

    this._initEvents();
  }

  _initEvents() {
    this.buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const scene = btn.dataset.scene;
        this.scrollController.scrollToScene(scene);
      });
    });
  }

  setActive(sceneName) {
    this.activeScene = sceneName;
    this.buttons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.scene === sceneName);
    });

    // Update nav background tint
    const nav = document.getElementById('weather-nav');
    const tints = {
      thunder: 'rgba(10, 10, 26, 0.7)',
      rain: 'rgba(15, 21, 32, 0.7)',
      snow: 'rgba(180, 190, 210, 0.5)',
      sunny: 'rgba(50, 40, 20, 0.5)',
      wind: 'rgba(100, 110, 130, 0.5)',
    };
    nav.style.background = tints[sceneName] || 'rgba(10, 10, 26, 0.5)';

    // Text color for snow (light bg)
    if (sceneName === 'snow') {
      nav.style.color = '#2a3040';
      document.querySelectorAll('.nav-btn:not(.active)').forEach(b => {
        b.style.color = 'rgba(30, 40, 60, 0.6)';
      });
      document.querySelector('.nav-logo').style.color = '#2a3040';
    } else {
      nav.style.color = '';
      document.querySelectorAll('.nav-btn:not(.active)').forEach(b => {
        b.style.color = '';
      });
      document.querySelector('.nav-logo').style.color = '';
    }
  }
}
