// =========================================================
// HAN HONGGU — Personal Universe
// Main JS: preloader, particle bg, nav, reveal, chart, lightbox
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hidden'), 400);
  });
  // fallback in case load event already fired
  setTimeout(() => preloader && preloader.classList.add('hidden'), 2500);

  /* ---------- Particle Network Background ---------- */
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width, height;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const PARTICLE_COUNT = Math.min(90, Math.floor((width * height) / 18000));

  function createParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.8 + 0.6
      });
    }
  }
  createParticles();

  function drawParticles() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 229, 255, 0.55)';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(0, 229, 255, ${0.12 * (1 - dist / 130)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawParticles);
  }
  drawParticles();

  /* ---------- Navbar scroll state ---------- */
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);

    // scroll-top button
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);

    // active nav link
    updateActiveNav();
  }, { passive: true });

  /* ---------- Mobile Nav Toggle ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const navLinksEl = document.getElementById('nav-links');
  navToggle.addEventListener('click', () => {
    navLinksEl.classList.toggle('open');
    navToggle.classList.toggle('active');
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => navLinksEl.classList.remove('open'));
  });

  /* ---------- Active Nav Highlight ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinkMap = {};
  document.querySelectorAll('.nav-link').forEach(link => {
    navLinkMap[link.dataset.section] = link;
  });

  function updateActiveNav() {
    let current = sections[0] ? sections[0].id : '';
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 120) current = sec.id;
    });
    Object.keys(navLinkMap).forEach(key => {
      navLinkMap[key].classList.toggle('active', key === current);
    });
  }

  /* ---------- Reveal on Scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => observer.observe(el));

  /* ---------- Hero Stat Counters ---------- */
  const statEls = document.querySelectorAll('.hero-stat-num');
  let countersStarted = false;

  function animateCounters() {
    if (countersStarted) return;
    countersStarted = true;
    statEls.forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      const duration = 1400;
      const startTime = performance.now();
      function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.floor(progress * target);
        el.textContent = value;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
    });
  }
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        heroObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) heroObserver.observe(heroSection);

  /* ---------- Scroll to Top ---------- */
  const scrollTopBtn = document.getElementById('scroll-top');
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Gallery Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = item.dataset.caption || '';
      lightbox.classList.add('active');
    });
  });
  lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.classList.remove('active');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lightbox.classList.remove('active');
  });

  /* ---------- Contact Form (client-side demo) ---------- */
  const contactForm = document.getElementById('contact-form');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> 전송 완료 (데모)';
    btn.style.opacity = '0.7';
    contactForm.reset();
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.opacity = '1';
    }, 2500);
  });

  /* ---------- Life Balance Radar Chart ---------- */
  const chartCanvas = document.getElementById('balanceChart');
  if (chartCanvas && window.Chart) {
    new Chart(chartCanvas, {
      type: 'radar',
      data: {
        labels: ['지구력', '지속성', '절제력', '회복력', '목표의식', '도전정신'],
        datasets: [{
          label: '한홍구 라이프 밸런스',
          data: [88, 95, 100, 85, 92, 90],
          backgroundColor: 'rgba(0, 229, 255, 0.15)',
          borderColor: '#00e5ff',
          borderWidth: 2,
          pointBackgroundColor: '#ff2ecb',
          pointBorderColor: '#ff2ecb',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            angleLines: { color: 'rgba(255,255,255,0.1)' },
            grid: { color: 'rgba(255,255,255,0.1)' },
            pointLabels: {
              color: '#e8f1ff',
              font: { family: 'Noto Sans KR', size: 12 }
            },
            ticks: {
              display: false,
              backdropColor: 'transparent'
            },
            suggestedMin: 0,
            suggestedMax: 100
          }
        },
        plugins: {
          legend: {
            labels: { color: '#e8f1ff', font: { family: 'Noto Sans KR' } }
          }
        }
      }
    });
  }

});
