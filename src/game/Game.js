import { InputManager } from './InputManager.js';
import { GameState } from './GameState.js';
import { Camera } from './Camera.js';
import { Player } from '../world/Player.js';
import { Stage } from '../world/Stage.js';
import { BattleManager } from '../battle/BattleManager.js';
import { BattleUI } from '../battle/BattleUI.js';
import { ShopManager } from '../shop/ShopManager.js';
import { ShopUI } from '../shop/ShopUI.js';
import { StoryManager } from '../story/StoryManager.js';
import { DialogUI } from '../story/DialogUI.js';
import { TitleScreen } from '../ui/TitleScreen.js';
import { HUD } from '../ui/HUD.js';
import { EndingScreen } from '../ui/EndingScreen.js';

// 게임 상태
const STATE = {
  TITLE: 'title',
  DIALOG: 'dialog',
  EXPLORE: 'explore',
  BATTLE: 'battle',
  SHOP: 'shop',
  ENDING: 'ending',
};

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;

    this.input = new InputManager();
    this.gs = new GameState();
    this.camera = new Camera(this.width, this.height);
    this.player = new Player();
    this.stage = null;

    this.battleManager = new BattleManager(this.gs);
    this.battleUI = new BattleUI(this.battleManager, this.gs);
    this.shopManager = new ShopManager(this.gs);
    this.shopUI = new ShopUI(this.shopManager, this.gs);
    this.storyManager = new StoryManager();
    this.dialogUI = new DialogUI();
    this.titleScreen = new TitleScreen();
    this.hud = new HUD(this.gs);
    this.endingScreen = new EndingScreen();

    this.state = STATE.TITLE;
    this.hasSave = false;
    this._battleCooldown = 0; // 전투 후 잠시 충돌 무시

    this._run();
  }

  async _run() {
    // 게임 루프 (렌더링)
    this._startRenderLoop();

    // 메인 게임 플로우
    while (true) {
      await this._titlePhase();
      await this._gameLoop();
    }
  }

  _startRenderLoop() {
    const loop = () => {
      this.input.update();

      if (this.state === STATE.EXPLORE) {
        this._updateExplore();
      }

      this._render();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  async _titlePhase() {
    this.state = STATE.TITLE;
    this.hud.hide();
    const result = await this.titleScreen.show(this.hasSave);
    this.titleScreen.hide();

    if (result.action === 'new') {
      this.gs.reset();
      const storyData = this.storyManager.generate(result.theme);
      this.gs.storyData = storyData;
      this.gs.heroType = storyData.heroType;
      this.player.color = storyData.heroType === 'mage' ? '#ab47bc' : '#4fc3f7';
    } else {
      // 이어하기 (New Game+)
      this.gs.resetForNewGamePlus();
      // storyData는 그대로 유지
    }
  }

  async _gameLoop() {
    const story = this.gs.storyData;

    // 인트로 대화
    this.state = STATE.DIALOG;
    await this.dialogUI.show(story.settingName, story.intro, '모험 시작!');
    this.dialogUI.hide();

    // 스테이지 1~3
    for (let stageNum = 1; stageNum <= 3; stageNum++) {
      this.gs.currentStage = stageNum;

      // 스테이지 설명
      this.state = STATE.DIALOG;
      await this.dialogUI.show(
        `Stage ${stageNum}`,
        story.stages[stageNum - 1],
        '진행!'
      );
      this.dialogUI.hide();

      // 탐색 (횡스크롤)
      const exploreResult = await this._explorePhase(stageNum);

      if (exploreResult === 'dead') {
        // 일반 죽음 → HP 복구 후 같은 스테이지 재시작
        this.gs.hp = this.gs.maxHp;
        this.state = STATE.DIALOG;
        await this.dialogUI.show('부활', '정신을 차렸다... 다시 도전하자!', '계속');
        this.dialogUI.hide();
        stageNum -= 1; // 같은 스테이지 반복
        continue;
      }

      if (exploreResult === 'bad-ending') {
        // 최종 보스에게 패배 → 배드 엔딩
        this.hud.hide();
        this.state = STATE.ENDING;
        const endChoice = await this.endingScreen.show(false, story.badEnding);
        this.endingScreen.hide();
        if (endChoice === 'continue') {
          this.hasSave = true;
        }
        return; // 타이틀로
      }

      // 스테이지 클리어 (보스 아닌 경우 상점)
      if (stageNum < 3) {
        this.hud.hide();
        this.state = STATE.SHOP;
        await this.shopUI.show();
        this.shopUI.hide();
      }
    }

    // 최종 보스 클리어 → 굿 엔딩
    this.hud.hide();
    this.state = STATE.ENDING;
    const endChoice = await this.endingScreen.show(true, story.goodEnding);
    this.endingScreen.hide();
    if (endChoice === 'continue') {
      this.hasSave = true;
    }
  }

  _explorePhase(stageNum) {
    return new Promise((resolve) => {
      this.stage = new Stage(stageNum, this.gs.storyData, this.gs.difficultyMultiplier);
      this.player.reset(60);
      this.camera.follow(this.player, this.stage.width);
      this._battleCooldown = 0;
      this.state = STATE.EXPLORE;
      this.hud.show();
      this._exploreResolve = resolve;
    });
  }

  _updateExplore() {
    if (this.state !== STATE.EXPLORE) return;

    this.player.update(this.input);

    // 스테이지 경계
    if (this.player.x + this.player.width > this.stage.width) {
      this.player.x = this.stage.width - this.player.width;
    }

    this.camera.follow(this.player, this.stage.width);
    this.stage.update(this.camera.x, this.width);

    // 전투 쿨다운
    if (this._battleCooldown > 0) {
      this._battleCooldown--;
      return;
    }

    // 몬스터 충돌
    const monster = this.stage.getCollidingMonster(this.player);
    if (monster) {
      this._startBattle(monster);
    }

    // 보스 클리어 체크
    if (this.stage.isBossDefeated()) {
      this.hud.hide();
      this.state = STATE.DIALOG;
      if (this._exploreResolve) {
        this._exploreResolve('clear');
        this._exploreResolve = null;
      }
    }
  }

  async _startBattle(monster) {
    this.state = STATE.BATTLE;
    this.hud.hide();

    const result = await this.battleUI.show(monster);
    this.battleUI.hide();

    this._battleCooldown = 30; // 전투 후 0.5초 무적

    if (result === 'win') {
      this.state = STATE.EXPLORE;
      this.hud.show();
      this.hud.update();
    } else if (result === 'lose-boss') {
      if (this._exploreResolve) {
        this._exploreResolve('bad-ending');
        this._exploreResolve = null;
      }
    } else if (result === 'lose') {
      if (this._exploreResolve) {
        this._exploreResolve('dead');
        this._exploreResolve = null;
      }
    } else if (result === 'run') {
      // 도망 성공 → 플레이어 약간 뒤로
      this.player.x -= 100;
      if (this.player.x < 0) this.player.x = 0;
      this.state = STATE.EXPLORE;
      this.hud.show();
    }
  }

  _render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    if (this.state === STATE.EXPLORE || this.state === STATE.BATTLE) {
      // 스테이지 + 플레이어 그리기
      if (this.stage) {
        this.stage.draw(ctx, this.camera.x, this.width);
      }
      this.player.draw(ctx, this.camera.x);
      this.hud.update();
    } else if (this.state === STATE.TITLE) {
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, this.width, this.height);
    } else {
      // 다른 상태에서도 배경 유지
      if (this.stage) {
        this.stage.draw(ctx, this.camera.x, this.width);
        this.player.draw(ctx, this.camera.x);
      } else {
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, this.width, this.height);
      }
    }
  }
}
