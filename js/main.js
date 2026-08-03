const revealEls = document.querySelectorAll('[data-reveal]');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealEls.forEach(el => el.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
  revealEls.forEach(el => revealObserver.observe(el));
}

const header = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 40);
}, { passive: true });

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');
const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { threshold: 0.5 });
sections.forEach(section => spyObserver.observe(section));

document.querySelectorAll('.phone-carousel').forEach(carousel => {
  const track = carousel.querySelector('.phone-carousel__track');
  const cards = Array.from(track.querySelectorAll('.phone-frame'));
  const prevBtn = carousel.querySelector('.carousel-btn--prev');
  const nextBtn = carousel.querySelector('.carousel-btn--next');

  const CARD_WIDTH = 260;
  const CARD_GAP = 32;
  const MIN_SCALE = 0.75;

  function updateScales() {
    const trackRect = track.getBoundingClientRect();
    const trackCenter = trackRect.left + trackRect.width / 2;
    cards.forEach(card => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2 - track.scrollLeft + trackRect.left;
      const distance = Math.abs(cardCenter - trackCenter);
      const t = Math.max(0, 1 - distance / (CARD_WIDTH + CARD_GAP));
      const scale = MIN_SCALE + (1 - MIN_SCALE) * t;
      card.style.transform = `scale(${scale.toFixed(3)})`;
      card.style.opacity = (0.5 + 0.5 * t).toFixed(2);
      card.style.zIndex = Math.round(t * 100);
    });
  }

  let ticking = false;
  track.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { updateScales(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', updateScales);
  updateScales();

  const scrollByCard = (dir) => {
    track.scrollBy({ left: dir * (CARD_WIDTH + CARD_GAP), behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };
  prevBtn.addEventListener('click', () => scrollByCard(-1));
  nextBtn.addEventListener('click', () => scrollByCard(1));
});

const snapSections = document.querySelectorAll('body.snap-page .hero, body.snap-page .section');

if (snapSections.length) {
  let scrollEndTimer;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollEndTimer);
    scrollEndTimer = setTimeout(() => {
      let nearest = null;
      let nearestDistance = Infinity;
      snapSections.forEach(section => {
        const distance = Math.abs(section.getBoundingClientRect().top);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearest = section;
        }
      });
      if (nearest && nearestDistance > 4) {
        nearest.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      }
    }, 800);
  }, { passive: true });
}

if (!prefersReducedMotion) {
  const BLACK = [10, 10, 18];
  const DARK_BLUE = [15, 30, 90];
  const COLOR_PERIOD = 5000;
  const root = document.documentElement;
  const lerp = (a, b, t) => a + (b - a) * t;

  const BASE_RADIUS = 30;
  const PEAK_RADIUS = 55;

  function tick(time) {
    const colorT = (Math.sin((time / COLOR_PERIOD) * Math.PI * 2) + 1) / 2;
    const r = Math.round(lerp(BLACK[0], DARK_BLUE[0], colorT));
    const g = Math.round(lerp(BLACK[1], DARK_BLUE[1], colorT));
    const b = Math.round(lerp(BLACK[2], DARK_BLUE[2], colorT));
    root.style.setProperty('--edge-color', `rgb(${r}, ${g}, ${b})`);

    if (snapSections.length) {
      const viewportCenter = window.innerHeight / 2;
      let maxIntensity = 0;
      snapSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);
        const intensity = Math.max(0, 1 - distance / viewportCenter);
        if (intensity > maxIntensity) maxIntensity = intensity;
      });

      const radius = BASE_RADIUS + (PEAK_RADIUS - BASE_RADIUS) * maxIntensity;
      root.style.setProperty('--white-radius', `${radius.toFixed(1)}%`);
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}
