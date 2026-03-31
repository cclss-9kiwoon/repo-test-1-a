import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export const scrollState = {
  activeScene: 'thunder',
  sectionProgress: 0,
  globalProgress: 0,
};

const SECTIONS = ['thunder', 'rain', 'snow', 'sunny', 'wind'];

export class ScrollController {
  constructor(onSceneChange) {
    this.onSceneChange = onSceneChange;
    this.triggers = [];
    this._init();
  }

  _init() {
    // Hero section animation
    this._animateHero();

    // Weather sections with pinning
    SECTIONS.forEach((name, index) => {
      const section = document.getElementById(`section-${name}`);
      if (!section) return;

      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: '+=300%',
        pin: true,
        scrub: 1.5,
        onUpdate: (self) => {
          scrollState.sectionProgress = self.progress;
          scrollState.activeScene = name;
        },
        onEnter: () => {
          scrollState.activeScene = name;
          this.onSceneChange(name);
          this._animateSectionText(name, 'enter');
        },
        onEnterBack: () => {
          scrollState.activeScene = name;
          this.onSceneChange(name);
          this._animateSectionText(name, 'enter');
        },
        onLeave: () => {
          this._animateSectionText(name, 'leave');
        },
        onLeaveBack: () => {
          this._animateSectionText(name, 'leave');
        },
      });

      this.triggers.push(trigger);
    });
  }

  _animateHero() {
    const lines = document.querySelectorAll('.hero-line');
    const subtitle = document.querySelector('.hero-subtitle');
    const indicator = document.querySelector('.scroll-indicator');

    const tl = gsap.timeline({ delay: 0.5 });
    lines.forEach((line, i) => {
      tl.to(line, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, i * 0.15);
    });
    tl.to(subtitle, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.6);
    tl.to(indicator, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.9);

    // Fade out hero on scroll
    ScrollTrigger.create({
      trigger: '#section-hero',
      start: 'top top',
      end: '50% top',
      scrub: true,
      onUpdate: (self) => {
        const content = document.querySelector('.hero-section .section-content');
        if (content) {
          content.style.opacity = 1 - self.progress;
          content.style.transform = `translateY(${self.progress * -50}px)`;
        }
      }
    });
  }

  _animateSectionText(name, direction) {
    const section = document.getElementById(`section-${name}`);
    if (!section) return;

    const title = section.querySelector('.weather-title');
    const desc = section.querySelector('.weather-desc');
    const stats = section.querySelector('.weather-stats');
    const label = section.querySelector('.weather-label');

    if (direction === 'enter') {
      const tl = gsap.timeline();
      if (label) tl.to(label, { opacity: 0.3, duration: 0.4 }, 0);
      if (title) tl.to(title, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.1);
      if (desc) tl.to(desc, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.3);
      if (stats) tl.to(stats, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.5);
    } else {
      if (title) gsap.set(title, { opacity: 0, y: 60 });
      if (desc) gsap.set(desc, { opacity: 0, y: 30 });
      if (stats) gsap.set(stats, { opacity: 0, y: 20 });
    }
  }

  scrollToScene(name) {
    const section = document.getElementById(`section-${name}`);
    if (section) {
      gsap.to(window, {
        scrollTo: { y: section, offsetY: 0 },
        duration: 1.5,
        ease: 'power2.inOut',
      });
    }
  }

  dispose() {
    this.triggers.forEach(t => t.kill());
    ScrollTrigger.getAll().forEach(t => t.kill());
  }
}
