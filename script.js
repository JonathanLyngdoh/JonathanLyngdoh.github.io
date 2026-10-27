const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hero = document.querySelector('.hero');
const year = document.querySelector('#year');
const progress = document.querySelector('.scroll-progress span');
const glow = document.querySelector('.cursor-glow');
const parallax = document.querySelector('[data-parallax]');
const portrait = document.querySelector('.portrait-frame');

if (year) year.textContent = new Date().getFullYear();

requestAnimationFrame(() => hero?.classList.add('is-ready'));

const revealItems = document.querySelectorAll('.reveal-item:not(.hero .reveal-item)');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const group = entry.target.parentElement;
      const siblings = [...(group?.querySelectorAll(':scope > .reveal-item') ?? [])];
      const delay = Math.max(0, siblings.indexOf(entry.target)) * 90;
      entry.target.style.transitionDelay = `${Math.min(delay, 270)}ms`;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -30px 0px' });

  revealItems.forEach((item) => revealObserver.observe(item));
}

let ticking = false;
const updateScroll = () => {
  if (progress) {
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${distance > 0 ? window.scrollY / distance : 0})`;
  }
  ticking = false;
};

window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(updateScroll);
}, { passive: true });
updateScroll();

const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
if (!reduceMotion && canHover) {
  window.addEventListener('pointermove', (event) => {
    if (glow) {
      glow.classList.add('active');
      glow.style.left = `${event.clientX}px`;
      glow.style.top = `${event.clientY}px`;
    }

    if (!parallax || !portrait || !hero?.classList.contains('is-ready')) return;
    const bounds = parallax.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
      portrait.style.transform = '';
      return;
    }
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    portrait.style.transform = `translate3d(${x * 8}px, ${y * 8}px, 0) rotateY(${x * -3}deg) rotateX(${y * 3}deg)`;
  }, { passive: true });

  document.addEventListener('pointerleave', () => {
    glow?.classList.remove('active');
    if (portrait) portrait.style.transform = '';
  });
}
