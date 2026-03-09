/* ════════════════════════════════════════════
   PORTFOLIO — main.js
   ════════════════════════════════════════════ */

// ── EmailJS Config ──────────────────────────
// ⚠️  REPLACE the values below with your own from https://www.emailjs.com
const EMAILJS_SERVICE_ID = 'service_hge8uva';   // ← REPLACE THIS
const EMAILJS_TEMPLATE_ID = 'template_u14yvhy';  // ← REPLACE THIS
const EMAILJS_PUBLIC_KEY = 'lzgygM1oK5T-X5tec';   // ← REPLACE THIS
// ────────────────────────────────────────────

(function () {
  'use strict';

  // ── Init EmailJS ──────────────────────────
  if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  // ── DOM helpers ───────────────────────────
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => document.querySelectorAll(selector);

  // ─────────────────────────────────────────
  // 1. PARTICLES CANVAS BACKGROUND
  // ─────────────────────────────────────────
  const canvas = $('#particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 60;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
    };
  }

  function initParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const particleColor = isDark ? '108, 99, 255' : '108, 99, 255';

    particles.forEach((p, i) => {
      // Move
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${particleColor}, ${p.alpha})`;
      ctx.fill();

      // Draw connections
      particles.slice(i + 1).forEach((p2) => {
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${particleColor}, ${0.08 * (1 - dist / 130)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    });
    requestAnimationFrame(drawParticles);
  }

  resizeCanvas();
  initParticles();
  drawParticles();
  window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

  // ─────────────────────────────────────────
  // 2. NAVBAR SCROLL BEHAVIOR
  // ─────────────────────────────────────────
  const navbar = $('#navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    // Scroll-to-top button
    const scrollTopBtn = $('#scroll-top');
    if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    // Active nav link
    updateActiveNavLink();
  });

  // ─────────────────────────────────────────
  // 3. ACTIVE NAV LINK on SCROLL
  // ─────────────────────────────────────────
  function updateActiveNavLink() {
    const sections = $$('section[id]');
    const scrollPos = window.scrollY + 120;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const h = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + h) {
        $$('.nav-link').forEach((link) => link.classList.remove('active'));
        const activeLink = $(`.nav-link[data-section="${section.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }

  // ─────────────────────────────────────────
  // 4. MOBILE HAMBURGER MENU
  // ─────────────────────────────────────────
  const hamburger = $('#hamburger');
  const navLinks = $('#nav-links');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close on nav link click
  $$('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      navLinks?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ─────────────────────────────────────────
  // 5. DARK / LIGHT THEME TOGGLE
  // ─────────────────────────────────────────
  const themeToggle = $('#theme-toggle');
  const themeIcon = $('#theme-icon');
  const html = document.documentElement;

  // Load saved theme
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle?.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
    updateThemeIcon(next);
  });

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    themeIcon.className = theme === 'dark' ? 'ri-sun-line' : 'ri-moon-line';
  }

  // ─────────────────────────────────────────
  // 6. TYPEWRITER EFFECT
  // ─────────────────────────────────────────
  const roles = [
    'Software Developer',
    // 'UI/UX Designer',
    // 'React Specialist',
    'Problem Solver',
    'Open Source Contributor',
  ];
  const typewriterEl = $('#typewriter');
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 90;
  const deletingSpeed = 50;
  const pauseMs = 2000;

  function typewrite() {
    if (!typewriterEl) return;
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      charIndex--;
      typewriterEl.textContent = currentRole.slice(0, charIndex);
    } else {
      charIndex++;
      typewriterEl.textContent = currentRole.slice(0, charIndex);
    }

    let delay = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
      delay = pauseMs;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }
    setTimeout(typewrite, delay);
  }
  setTimeout(typewrite, 1500);

  // ─────────────────────────────────────────
  // 7. SCROLL REVEAL (IntersectionObserver)
  // ─────────────────────────────────────────
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Stagger children if any
          const children = entry.target.querySelectorAll('.stat-card, .tech-card, .project-card, .timeline-item');
          children.forEach((child, i) => {
            setTimeout(() => child.classList.add('visible'), i * 100);
          });
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  $$('.reveal').forEach((el) => revealObserver.observe(el));

  // ─────────────────────────────────────────
  // 8. SKILL BAR ANIMATIONS
  // ─────────────────────────────────────────
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          $$('.skill-fill').forEach((bar) => {
            bar.style.width = bar.dataset.width + '%';
          });
          skillObserver.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );
  const skillsSection = $('#skills');
  if (skillsSection) skillObserver.observe(skillsSection);

  // ─────────────────────────────────────────
  // 9. COUNTER ANIMATION (Stats)
  // ─────────────────────────────────────────
  function animateCounter(el, target, duration = 1800) {
    let start = 0;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          $$('.stat-number').forEach((el) => {
            animateCounter(el, parseInt(el.dataset.target));
          });
          statsObserver.disconnect();
        }
      });
    },
    { threshold: 0.4 }
  );
  const statsGrid = $('.stats-grid');
  if (statsGrid) statsObserver.observe(statsGrid);

  // ─────────────────────────────────────────
  // 10. PROJECT FILTER
  // ─────────────────────────────────────────
  const filterBtns = $$('.filter-btn');
  const projectCards = $$('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      projectCards.forEach((card) => {
        const matches = filter === 'all' || card.dataset.category === filter;
        if (matches) {
          card.classList.remove('hidden-card');
          setTimeout(() => card.classList.add('visible'), 10);
        } else {
          card.classList.add('hidden-card');
          card.classList.remove('visible');
        }
      });
    });
  });

  // ─────────────────────────────────────────
  // 11. EXPERIENCE TABS
  // ─────────────────────────────────────────
  const tabWork = $('#tab-work');
  const tabEdu = $('#tab-edu');
  const timelineWork = $('#timeline-work');
  const timelineEdu = $('#timeline-education');

  function switchTab(showEl, hideEl, activeBtn, inactiveBtn) {
    hideEl?.classList.add('hidden');
    showEl?.classList.remove('hidden');
    inactiveBtn?.classList.remove('active');
    activeBtn?.classList.add('active');
    // Re-trigger reveal for new items
    showEl?.querySelectorAll('.timeline-item').forEach((item, i) => {
      item.classList.remove('visible');
      setTimeout(() => item.classList.add('visible'), i * 150);
    });
  }

  tabWork?.addEventListener('click', () => switchTab(timelineWork, timelineEdu, tabWork, tabEdu));
  tabEdu?.addEventListener('click', () => switchTab(timelineEdu, timelineWork, tabEdu, tabWork));

  // ─────────────────────────────────────────
  // 12. CONTACT FORM
  // ─────────────────────────────────────────
  const contactForm = $('#contact-form');
  const submitBtn = $('#submit-btn');
  const successMsg = $('#form-success');

  function showError(id, msg) {
    const el = $(`#${id}`);
    if (el) el.textContent = msg;
  }
  function clearErrors() {
    ['err-name', 'err-email', 'err-subject', 'err-message'].forEach((id) => {
      const el = $(`#${id}`);
      if (el) el.textContent = '';
    });
  }
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();
    successMsg?.classList.add('hidden');

    const name = $('#user_name')?.value.trim();
    const email = $('#user_email')?.value.trim();
    const subject = $('#subject')?.value.trim();
    const message = $('#message')?.value.trim();

    let hasError = false;
    if (!name) { showError('err-name', 'Please enter your name.'); hasError = true; }
    if (!email) { showError('err-email', 'Please enter your email.'); hasError = true; }
    else if (!validateEmail(email)) { showError('err-email', 'Please enter a valid email.'); hasError = true; }
    if (!subject) { showError('err-subject', 'Please enter a subject.'); hasError = true; }
    if (!message) { showError('err-message', 'Please write a message.'); hasError = true; }
    if (hasError) return;

    // Loading state
    const btnText = submitBtn?.querySelector('.btn-text');
    const btnLoader = submitBtn?.querySelector('.btn-loader');
    btnText?.classList.add('hidden');
    btnLoader?.classList.remove('hidden');
    submitBtn.disabled = true;

    try {
      if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
        // Demo mode — simulate success if EmailJS not configured
        await new Promise((res) => setTimeout(res, 1500));
        contactForm.reset();
        successMsg?.classList.remove('hidden');
      } else {
        await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm);
        contactForm.reset();
        successMsg?.classList.remove('hidden');
      }
    } catch (err) {
      showError('err-message', 'Failed to send. Please email me directly at suman@example.com');
      console.error('EmailJS error:', err);
    } finally {
      btnText?.classList.remove('hidden');
      btnLoader?.classList.add('hidden');
      submitBtn.disabled = false;
      setTimeout(() => successMsg?.classList.add('hidden'), 6000);
    }
  });

  // ─────────────────────────────────────────
  // 13. SCROLL TO TOP BUTTON
  // ─────────────────────────────────────────
  const scrollTopBtn = $('#scroll-top');
  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─────────────────────────────────────────
  // 14. SMOOTH SCROLL for anchor links
  // ─────────────────────────────────────────
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ─────────────────────────────────────────
  // 15. INITIAL LOAD — trigger visible items
  // ─────────────────────────────────────────
  window.addEventListener('load', () => {
    updateActiveNavLink();
    // Animate education timeline items on load (default active tab)
    timelineEdu?.querySelectorAll('.timeline-item').forEach((item, i) => {
      setTimeout(() => item.classList.add('visible'), 300 + i * 150);
    });
  });

})();
