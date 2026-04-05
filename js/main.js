/**
 * NoctavHosting — Main JS
 * Cursor, scroll reveal, nav, toasts
 */

// ── CURSOR ──────────────────────────────────────────────
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  if (cursor) {
    cursor.style.left = mx - 4 + 'px';
    cursor.style.top  = my - 4 + 'px';
  }
});

function animateRing() {
  rx += (mx - rx) * 0.13;
  ry += (my - ry) * 0.13;
  if (cursorRing) {
    cursorRing.style.left = rx - 16 + 'px';
    cursorRing.style.top  = ry - 16 + 'px';
  }
  requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, input, textarea, select, .card, .pricing-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor?.classList.add('hover');
    cursorRing?.classList.add('hover');
  });
  el.addEventListener('mouseleave', () => {
    cursor?.classList.remove('hover');
    cursorRing?.classList.remove('hover');
  });
});

// ── SCROLL REVEAL ────────────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || i * 80;
      setTimeout(() => entry.target.classList.add('visible'), parseInt(delay));
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ── ACTIVE NAV LINK ──────────────────────────────────────
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

// ── MOBILE NAV ───────────────────────────────────────────
const mobileBtn = document.getElementById('nav-mobile-btn');
const navLinks  = document.querySelector('.nav-links');
mobileBtn?.addEventListener('click', () => {
  navLinks?.classList.toggle('open');
  mobileBtn.textContent = navLinks?.classList.contains('open') ? '✕' : '☰';
});

// ── TOAST NOTIFICATION ───────────────────────────────────
window.showToast = function(msg, type = 'success', duration = 3500) {
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || 'ℹ'}</span>
    <span class="toast-msg">${msg}</span>
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

// ── COUNTER ANIMATION ────────────────────────────────────
window.animateCounter = function(el, target, suffix = '') {
  let current = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current) + suffix;
    }
  }, 16);
};

// ── SMOOTH ANCHOR SCROLL ─────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
