/* ============================================================
   Pro Count Tax Consultancy — script.js
   Theme: Purple / Pink Glassmorphism
   ============================================================ */

/* ═══════════════════════════════════════════════════════════
   LOADING SCREEN
═══════════════════════════════════════════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loading = document.getElementById('loading');
    loading.classList.add('hidden');
    document.body.style.overflow = '';
    initGSAP();
    initBgCanvas();
  }, 1900);
});

/* ═══════════════════════════════════════════════════════════
   GSAP ANIMATIONS
═══════════════════════════════════════════════════════════ */
function initGSAP() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero card entrance
  gsap.fromTo('.hero-card',
    { opacity: 0, y: 70, scale: 0.94 },
    { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'power3.out', delay: 0.1 }
  );

  // Hero float cards staggered entrance
  gsap.fromTo('.hero-float-card',
    { opacity: 0, scale: 0.75, y: 20 },
    { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'back.out(1.7)', stagger: 0.22, delay: 0.5 }
  );

  // Scroll hint fade in
  gsap.fromTo('.scroll-hint',
    { opacity: 0 },
    { opacity: 1, duration: 1, delay: 1.4 }
  );

  // Section headers via ScrollTrigger
  gsap.utils.toArray('.section-header').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 44 },
      {
        opacity: 1, y: 0, duration: 0.85, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      }
    );
  });

  // Service cards stagger by row
  gsap.utils.toArray('.service-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 55 },
      {
        opacity: 1, y: 0, duration: 0.65, ease: 'power2.out',
        delay: (i % 4) * 0.09,
        scrollTrigger: { trigger: card, start: 'top 92%', once: true }
      }
    );
  });

  // Why cards
  gsap.utils.toArray('.why-card').forEach((card, i) => {
    gsap.fromTo(card,
      { opacity: 0, y: 42 },
      {
        opacity: 1, y: 0, duration: 0.65, delay: i * 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: card, start: 'top 90%', once: true }
      }
    );
  });

  // Timeline items
  gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, x: 30 },
      {
        opacity: 1, x: 0, duration: 0.6, delay: i * 0.10, ease: 'power2.out',
        scrollTrigger: { trigger: item, start: 'top 88%', once: true }
      }
    );
  });
}

/* ═══════════════════════════════════════════════════════════
   ANIMATED BACKGROUND CANVAS — drifting star particles
═══════════════════════════════════════════════════════════ */
function initBgCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Build particles
  const count = window.innerWidth < 768 ? 80 : 180;
  const particles = Array.from({ length: count }, () => ({
    x:       Math.random() * canvas.width,
    y:       Math.random() * canvas.height,
    r:       Math.random() * 1.6 + 0.2,
    speed:   Math.random() * 0.4 + 0.05,
    opacity: Math.random() * 0.55 + 0.15,
    pulse:   Math.random() * Math.PI * 2,
    color:   Math.random() < 0.5 ? '200,170,255' : '240,140,220',
  }));

  // Occasional shooting stars
  const shoots = [];
  function spawnShoot() {
    shoots.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.5,
      len: Math.random() * 100 + 60,
      speed: Math.random() * 6 + 4,
      opacity: 1,
      angle: Math.PI / 5,
    });
  }
  setInterval(spawnShoot, 3500);

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Stars
    particles.forEach(p => {
      p.y -= p.speed;
      p.pulse += 0.018;
      if (p.y < -4) { p.y = canvas.height + 4; p.x = Math.random() * canvas.width; }

      const alpha = p.opacity * (0.65 + 0.35 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${alpha})`;
      ctx.fill();
    });

    // Shooting stars
    for (let i = shoots.length - 1; i >= 0; i--) {
      const s = shoots[i];
      const grad = ctx.createLinearGradient(
        s.x, s.y,
        s.x + Math.cos(s.angle) * s.len,
        s.y + Math.sin(s.angle) * s.len
      );
      grad.addColorStop(0, `rgba(255,200,255,${s.opacity})`);
      grad.addColorStop(1, 'rgba(255,200,255,0)');
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x + Math.cos(s.angle) * s.len, s.y + Math.sin(s.angle) * s.len);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.opacity -= 0.018;
      if (s.opacity <= 0) shoots.splice(i, 1);
    }

    requestAnimationFrame(draw);
  }
  draw();
}

/* ═══════════════════════════════════════════════════════════
   SCROLL REVEAL — IntersectionObserver
═══════════════════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.10 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ═══════════════════════════════════════════════════════════
   SIDENAV ACTIVE STATE
═══════════════════════════════════════════════════════════ */
const sideLinks = document.querySelectorAll('.sidenav-link[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      sideLinks.forEach(l => l.classList.remove('active'));
      const link = document.querySelector(`.sidenav-link[href="#${entry.target.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { threshold: 0.40 });

document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));

/* ═══════════════════════════════════════════════════════════
   MOBILE MENU
═══════════════════════════════════════════════════════════ */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileClose = document.getElementById('mobile-close');
const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-cta');

function openMenu() {
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  mobileMenu.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', () => {
  mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
});
mobileClose?.addEventListener('click', closeMenu);
mobileLinks.forEach(el => el.addEventListener('click', closeMenu));

/* ═══════════════════════════════════════════════════════════
   TOP NAV SCROLL SHADOW
═══════════════════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const topnav = document.getElementById('topnav');
  if (topnav) {
    topnav.style.boxShadow = window.scrollY > 10
      ? '0 4px 30px rgba(0,0,0,0.45)'
      : 'none';
  }
}, { passive: true });

/* ═══════════════════════════════════════════════════════════
   TESTIMONIALS CAROUSEL
═══════════════════════════════════════════════════════════ */
(function initTestimonials() {
  const track    = document.getElementById('testimonials-track');
  const dotsWrap = document.getElementById('test-dots');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.testimonial-card'));
  let current  = 0;
  let perView  = getPerView();
  let total    = Math.ceil(cards.length / perView);
  let autoTimer;

  function getPerView() {
    if (window.innerWidth < 768)  return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('div');
      dot.className = 'test-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => { goTo(i); startAuto(); });
      dotsWrap.appendChild(dot);
    }
  }

  function updateDots() {
    dotsWrap.querySelectorAll('.test-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(idx) {
    current = ((idx % total) + total) % total;
    const cardWidth = cards[0].offsetWidth + 22; // 22px = gap
    track.style.transform = `translateX(-${current * perView * cardWidth}px)`;
    updateDots();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startAuto() { stopAuto(); autoTimer = setInterval(next, 5200); }
  function stopAuto()  { clearInterval(autoTimer); }

  document.getElementById('test-next')?.addEventListener('click', () => { next(); startAuto(); });
  document.getElementById('test-prev')?.addEventListener('click', () => { prev(); startAuto(); });

  // Touch swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; stopAuto(); }, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
    startAuto();
  }, { passive: true });

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { next(); startAuto(); }
    if (e.key === 'ArrowLeft')  { prev(); startAuto(); }
  });

  // Resize
  window.addEventListener('resize', () => {
    perView  = getPerView();
    total    = Math.ceil(cards.length / perView);
    current  = 0;
    buildDots();
    goTo(0);
  });

  buildDots();
  startAuto();
})();

/* ═══════════════════════════════════════════════════════════
   STATS COUNTER
═══════════════════════════════════════════════════════════ */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el       = entry.target;
      const target   = parseInt(el.dataset.count, 10);
      const prefix   = el.dataset.prefix || '';
      const suffix   = el.dataset.suffix || '';
      const duration = 2200;
      const start    = performance.now();

      function update(now) {
        const t    = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3); // cubic ease-out
        const val  = Math.round(target * ease);
        el.textContent = prefix + val.toLocaleString() + suffix;
        if (t < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.55 });

  counters.forEach(el => observer.observe(el));
})();

/* ═══════════════════════════════════════════════════════════
   CONTACT FORM — Formspree async submission
═══════════════════════════════════════════════════════════ */
const contactForm = document.getElementById('contact-form');
contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn       = contactForm.querySelector('.submit-btn');
  const btnText   = btn.querySelector('.btn-text');
  const btnLoad   = btn.querySelector('.btn-loading');

  btnText.classList.add('hidden');
  btnLoad.classList.remove('hidden');
  btn.disabled = true;

  try {
    const res = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { 'Accept': 'application/json' },
    });

    if (res.ok) {
      contactForm.classList.add('hidden');
      document.getElementById('form-success').classList.remove('hidden');
    } else {
      throw new Error('Submission failed');
    }
  } catch {
    alert('Something went wrong. Please try again or call us at +1 (416) 555-0123.');
    btnText.classList.remove('hidden');
    btnLoad.classList.add('hidden');
    btn.disabled = false;
  }
});

/* ═══════════════════════════════════════════════════════════
   SMOOTH SCROLL — offset for mobile top nav
═══════════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const mobileNavH = document.getElementById('topnav')?.offsetHeight || 0;
    const isMobile   = window.innerWidth < 1024;
    window.scrollTo({
      top: target.offsetTop - (isMobile ? mobileNavH : 0),
      behavior: 'smooth',
    });
  });
});

/* ═══════════════════════════════════════════════════════════
   FLOATING CTA — drifts to free space per visible section
═══════════════════════════════════════════════════════════ */
(function initFloatingCTADrift() {
  const btn = document.querySelector('.floating-cta');
  if (!btn) return;

  const M  = 28;   // edge margin px
  const SL = 122;  // left safe zone (clears sidenav pill)

  // Returns {top, left} for 4 named corners
  function pos(corner) {
    const bw = btn.offsetWidth  || 160;
    const bh = btn.offsetHeight || 50;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    switch (corner) {
      case 'top-right':    return { top: M,           left: vw - bw - M };
      case 'bottom-right': return { top: vh - bh - M, left: vw - bw - M };
      case 'top-left':     return { top: M,           left: SL };
      case 'bottom-left':  return { top: vh - bh - M, left: SL };
      default:             return { top: M,           left: vw - bw - M };
    }
  }

  // Always pinned to top-right
  const p = pos('top-right');
  btn.style.top    = p.top  + 'px';
  btn.style.left   = p.left + 'px';
  btn.style.right  = 'auto';
  btn.style.bottom = 'auto';

  window.addEventListener('resize', () => {
    const rp = pos('top-right');
    btn.style.top  = rp.top  + 'px';
    btn.style.left = rp.left + 'px';
  }, { passive: true });
})();

/* ═══════════════════════════════════════════════════════════
   SERVICE CARD — subtle glow on hover (CSS handles most)
   Add parallax mouse effect on hero card
═══════════════════════════════════════════════════════════ */
(function initHeroParallax() {
  const heroCard = document.querySelector('.hero-card');
  if (!heroCard || window.innerWidth < 1024) return;

  document.addEventListener('mousemove', e => {
    const cx  = window.innerWidth / 2;
    const cy  = window.innerHeight / 2;
    const dx  = (e.clientX - cx) / cx;
    const dy  = (e.clientY - cy) / cy;
    heroCard.style.transform = `perspective(1000px) rotateY(${dx * 3}deg) rotateX(${-dy * 2}deg)`;
  });

  document.addEventListener('mouseleave', () => {
    heroCard.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
  });
})();
