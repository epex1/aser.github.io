/* global */ 'use strict';

// ── Sticky header ──────────────────────────────────────────────────────────────
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });


// ── Mobile menu ────────────────────────────────────────────────────────────────
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu    = document.getElementById('mobileMenu');

function openMenu() {
  mobileMenu.classList.add('open');
  mobileMenuBtn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  mobileMenu.classList.remove('open');
  mobileMenuBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

mobileMenuBtn.addEventListener('click', () =>
  mobileMenu.classList.contains('open') ? closeMenu() : openMenu()
);

mobileMenu.querySelectorAll('.mobile-nav-link, .mobile-cta').forEach(link => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
});


// ── Smooth scroll for anchor links ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    window.scrollTo({
      top: target.getBoundingClientRect().top + window.scrollY - offset,
      behavior: 'smooth'
    });
  });
});


// ── Scroll reveal (IntersectionObserver) ───────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -48px 0px' });

document.querySelectorAll('.reveal-up, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});


// ── Count-up animation for stats bar ──────────────────────────────────────────
function animateCount(el, target, decimals = 0, duration = 1800) {
  const start = performance.now();

  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = (target * eased).toFixed(decimals);
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = target.toFixed(decimals);
  }

  requestAnimationFrame(tick);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.dataset.target || '0');
    const isFloat = el.classList.contains('count-float');
    animateCount(el, target, isFloat ? 1 : 0);
    statObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.count, .count-float').forEach(el => {
  statObserver.observe(el);
});


// ── Contact form (AJAX → Netlify Forms) ───────────────────────────────────────
const contactForm  = document.getElementById('contactForm');
const formSuccess  = document.getElementById('formSuccess');
const submitBtn    = document.getElementById('submitBtn');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const label = submitBtn.querySelector('.btn-label');
    submitBtn.disabled = true;
    label.textContent = 'Sending…';

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(contactForm)).toString(),
      });

      if (res.ok) {
        contactForm.hidden = true;
        formSuccess.hidden = false;
      } else {
        throw new Error(`Status ${res.status}`);
      }
    } catch (err) {
      console.error('Form error:', err);
      label.textContent = 'Send Message';
      submitBtn.disabled = false;

      // Surface a polite inline error
      let errMsg = contactForm.querySelector('.form-err');
      if (!errMsg) {
        errMsg = document.createElement('p');
        errMsg.className = 'form-err';
        errMsg.style.cssText =
          'font-size:13.5px;color:rgba(255,90,90,0.85);margin-top:4px';
        contactForm.appendChild(errMsg);
      }
      errMsg.textContent =
        'Something went wrong — please try again or email us directly.';
    }
  });
}

console.log('ASER IS — Built with precision.');
