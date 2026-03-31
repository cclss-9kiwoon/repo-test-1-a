import './style.css';
import { SceneManager } from './scene/SceneManager.js';
import { ScrollController, scrollState } from './scroll/ScrollController.js';
import { Navigation } from './ui/Navigation.js';
import { ThunderScene } from './weather/ThunderScene.js';
import { RainScene } from './weather/RainScene.js';
import { SnowScene } from './weather/SnowScene.js';
import { SunnyScene } from './weather/SunnyScene.js';
import { WindScene } from './weather/WindScene.js';

class App {
  constructor() {
    this.sceneManager = null;
    this.scrollController = null;
    this.navigation = null;
    this._init();
  }

  _init() {
    const canvas = document.getElementById('webgl');
    if (!canvas) return;

    // Scene manager
    this.sceneManager = new SceneManager(canvas);

    // Register weather scenes
    const { scene, camera } = this.sceneManager;
    this.sceneManager.registerScene('thunder', new ThunderScene(scene, camera));
    this.sceneManager.registerScene('rain', new RainScene(scene, camera));
    this.sceneManager.registerScene('snow', new SnowScene(scene, camera));
    this.sceneManager.registerScene('sunny', new SunnyScene(scene, camera));
    this.sceneManager.registerScene('wind', new WindScene(scene, camera));

    // Start with thunder
    this.sceneManager.switchScene('thunder');

    // Scroll controller
    this.scrollController = new ScrollController((sceneName) => {
      this.sceneManager.switchScene(sceneName);
      this.navigation.setActive(sceneName);
    });

    // Navigation
    this.navigation = new Navigation(this.scrollController);

    // Start render loop
    this._animate();

    // Hide loader
    setTimeout(() => {
      const loader = document.getElementById('loader');
      if (loader) loader.classList.add('hidden');
    }, 800);
  }

  _animate() {
    requestAnimationFrame(() => this._animate());
    this.sceneManager.update(scrollState);
  }
}

// Boot
new App();
