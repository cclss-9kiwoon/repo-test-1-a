import { matchSetting, pickHeroType } from './mockData.js';

export class StoryManager {
  constructor() {
    this.setting = null;
    this.heroType = null;
    this.story = null;
  }

  generate(input) {
    this.setting = matchSetting(input);
    this.heroType = pickHeroType(input);
    this.story = this.setting.stories[this.heroType];
    return this.getStoryData();
  }

  getStoryData() {
    return {
      settingName: this.setting.name,
      bgColor: this.setting.bgColor,
      heroName: this.story.heroName,
      heroType: this.heroType,
      intro: this.story.intro,
      stages: this.story.stages,
      goodEnding: this.story.goodEnding,
      badEnding: this.story.badEnding,
      monsters: this.setting.monsters,
    };
  }
}
