import { BASE_CHARACTERS } from './data/characters.js';
import { ELEMENTS } from './data/elements.js';
import { ElementSystem } from './systems/element.js';
import { BattleSystem } from './systems/battle.js';
import { UpgradeSystem } from './systems/upgrade.js';
import { StageSystem } from './systems/stage.js';

// --- Game State ---
const elementSystem = new ElementSystem();
const battleSystem = new BattleSystem();
const upgradeSystem = new UpgradeSystem();
const stageSystem = new StageSystem();

let gold = 0;
let team = [];
let enemy = null;
let battleActive = false;
let battleInterval = null;
const TICK_MS = 800;

// --- Initialize ---
function initTeam() {
  team = BASE_CHARACTERS.map(c => ({
    ...c,
    attack: c.baseAttack + upgradeSystem.getAttackBonus(),
    maxHp: c.baseHp + upgradeSystem.getHpBonus(),
    currentHp: c.baseHp + upgradeSystem.getHpBonus(),
  }));
}

function refreshTeamStats() {
  team.forEach((char, i) => {
    const base = BASE_CHARACTERS[i];
    char.attack = base.baseAttack + upgradeSystem.getAttackBonus();
    char.maxHp = base.baseHp + upgradeSystem.getHpBonus();
    char.currentHp = char.maxHp;
  });
}

function spawnEnemy() {
  enemy = stageSystem.spawnEnemy();
  battleSystem.clearLog();
  battleSystem.addLog(`⚔️ 스테이지 ${stageSystem.getStage()} — ${enemy.emoji} ${enemy.name} 등장!`);
  battleSystem.addLog(`적 속성: ${elementSystem.getElementLabel(enemy.element)} | HP: ${enemy.maxHp} | 공격력: ${enemy.attack}`);
}

// --- Battle Loop ---
function battleTick() {
  if (!enemy || !battleActive) return;

  // Team attacks enemy
  battleSystem.teamAttackEnemy(team, elementSystem.getElement(), enemy);

  if (battleSystem.isEnemyDead(enemy)) {
    const reward = stageSystem.getGoldReward();
    gold += reward;
    battleSystem.addLog(`🎉 승리! +${reward} 골드`);
    battleActive = false;
    clearInterval(battleInterval);

    // Auto-heal team and spawn next
    setTimeout(() => {
      refreshTeamStats();
      if (stageSystem.canAdvance()) {
        spawnEnemy();
        startBattle();
      } else {
        battleSystem.addLog('🏆 모든 스테이지 클리어! 축하합니다!');
      }
      renderAll();
    }, 600);

    renderAll();
    return;
  }

  // Enemy attacks team
  battleSystem.enemyAttackTeam(enemy, team, elementSystem.getElement());

  if (battleSystem.isTeamDead(team)) {
    battleSystem.addLog('💀 팀이 전멸했습니다... 재도전!');
    battleActive = false;
    clearInterval(battleInterval);

    setTimeout(() => {
      refreshTeamStats();
      spawnEnemy();
      startBattle();
      renderAll();
    }, 1000);

    renderAll();
    return;
  }

  renderAll();
}

function startBattle() {
  battleActive = true;
  clearInterval(battleInterval);
  battleInterval = setInterval(battleTick, TICK_MS);
}

// --- Rendering ---
function renderTeam() {
  const container = document.getElementById('team-cards');
  container.innerHTML = team.map(c => {
    const hpPct = Math.max(0, (c.currentHp / c.maxHp) * 100);
    return `
      <div class="char-card">
        <div class="char-emoji">${c.emoji}</div>
        <div class="char-name">${c.name}</div>
        <div class="hp-bar-wrap">
          <div class="hp-bar" style="width:${hpPct}%"></div>
        </div>
        <div class="char-stats">HP ${c.currentHp}/${c.maxHp} | ATK ${c.attack}</div>
      </div>
    `;
  }).join('');
}

function renderEnemy() {
  const container = document.getElementById('enemy-section');
  if (!enemy) {
    container.innerHTML = '<p>적 없음</p>';
    return;
  }
  const hpPct = Math.max(0, (enemy.currentHp / enemy.maxHp) * 100);
  container.innerHTML = `
    <div class="enemy-card">
      <div class="enemy-emoji">${enemy.emoji}</div>
      <div class="enemy-name">${enemy.name}</div>
      <div class="enemy-element">${elementSystem.getElementLabel(enemy.element)}</div>
      <div class="hp-bar-wrap enemy-hp">
        <div class="hp-bar hp-bar-enemy" style="width:${hpPct}%"></div>
      </div>
      <div class="enemy-stats">HP ${enemy.currentHp}/${enemy.maxHp} | ATK ${enemy.attack}</div>
    </div>
  `;
}

function renderLog() {
  const container = document.getElementById('battle-log');
  container.innerHTML = battleSystem.log.map(l => `<div class="log-line">${l}</div>`).join('');
  container.scrollTop = container.scrollHeight;
}

function renderControls() {
  // Element buttons
  const elContainer = document.getElementById('element-buttons');
  const elements = [ELEMENTS.FIRE, ELEMENTS.WATER, ELEMENTS.LIGHTNING];
  elContainer.innerHTML = elements.map(el => {
    const active = el === elementSystem.getElement() ? 'active' : '';
    return `<button class="el-btn ${active}" data-element="${el}">${elementSystem.getElementLabel(el)}</button>`;
  }).join('');

  // Upgrade buttons
  const atkCost = upgradeSystem.getCost('attack');
  const hpCost = upgradeSystem.getCost('hp');
  const atkLv = upgradeSystem.getLevel('attack');
  const hpLv = upgradeSystem.getLevel('hp');

  document.getElementById('btn-upgrade-atk').textContent = `⚔️ 공격력 UP (Lv${atkLv}) — ${atkCost}G`;
  document.getElementById('btn-upgrade-atk').disabled = gold < atkCost;
  document.getElementById('btn-upgrade-hp').textContent = `❤️ 체력 UP (Lv${hpLv}) — ${hpCost}G`;
  document.getElementById('btn-upgrade-hp').disabled = gold < hpCost;

  // Stage & gold info
  document.getElementById('stage-info').textContent = `스테이지 ${stageSystem.getStage()} / ${stageSystem.maxStage}`;
  document.getElementById('gold-info').textContent = `💰 ${gold} G`;

  // Current element display
  document.getElementById('current-element').textContent = `팀 속성: ${elementSystem.getElementLabel(elementSystem.getElement())}`;

  // Next stage button
  const nextBtn = document.getElementById('btn-next-stage');
  nextBtn.disabled = battleActive || !stageSystem.canAdvance();
}

function renderAll() {
  renderTeam();
  renderEnemy();
  renderLog();
  renderControls();
}

// --- Event Handlers ---
function setupEvents() {
  document.getElementById('element-buttons').addEventListener('click', (e) => {
    const el = e.target.dataset?.element;
    if (el) {
      elementSystem.setElement(el);
      battleSystem.addLog(`🔄 팀 속성 변경 → ${elementSystem.getElementLabel(el)}`);
      renderAll();
    }
  });

  document.getElementById('btn-upgrade-atk').addEventListener('click', () => {
    const cost = upgradeSystem.upgrade('attack', gold);
    if (cost > 0) {
      gold -= cost;
      refreshTeamStats();
      battleSystem.addLog(`⬆️ 공격력 업그레이드! (Lv${upgradeSystem.getLevel('attack')})`);
      renderAll();
    }
  });

  document.getElementById('btn-upgrade-hp').addEventListener('click', () => {
    const cost = upgradeSystem.upgrade('hp', gold);
    if (cost > 0) {
      gold -= cost;
      refreshTeamStats();
      battleSystem.addLog(`⬆️ 체력 업그레이드! (Lv${upgradeSystem.getLevel('hp')})`);
      renderAll();
    }
  });

  document.getElementById('btn-next-stage').addEventListener('click', () => {
    if (!battleActive && stageSystem.canAdvance()) {
      stageSystem.advance();
      refreshTeamStats();
      spawnEnemy();
      startBattle();
      renderAll();
    }
  });
}

// --- Boot ---
function init() {
  initTeam();
  spawnEnemy();
  setupEvents();
  renderAll();
  startBattle();
}

init();
