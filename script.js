// ── NAV SCROLL SHADOW ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
});

// ── HAMBURGER MENU (mobile, accessible) ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  const expanded = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', String(!expanded));
  nav.classList.toggle('open');
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Close menu when Escape pressed (accessibility)
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav.classList.contains('open')) {
    nav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.focus();
  }
});

// ── SCROLL REVEAL ──
const reveals  = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
    }
  });
}, { threshold: 0.1 });

reveals.forEach(el => observer.observe(el));

// ── CONTACT FORM (AJAX submit to Formspree) ──
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot (bots) — field named "website" is hidden in the form; if filled, silently abort
    const hp = form.querySelector('input[name="website"]');
    if (hp && hp.value) {
      statusEl.textContent = '✓ Message sent';
      statusEl.className = 'form-status success';
      form.reset();
      return;
    }

    // Basic client-side validation
    const formData = new FormData(form);
    const name = (formData.get('name') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const message = (formData.get('message') || '').toString().trim();

    if (!name || !email || !message) {
      statusEl.textContent = 'Please complete name, email, and message.';
      statusEl.className = 'form-status error';
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-disabled', 'true');
    const prevLabel = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';
    statusEl.textContent = '';
    statusEl.className = 'form-status';

    try {
      const resp = await fetch(form.action, {
        method: form.method || 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (resp.ok) {
        statusEl.textContent = '✓ Message sent — I will get back to you soon.';
        statusEl.className = 'form-status success';
        form.reset();
      } else {
        const data = await resp.json().catch(() => null);
        const msg = data?.error || 'Something went wrong. Please try again later.';
        statusEl.textContent = msg;
        statusEl.className = 'form-status error';
      }
    } catch (err) {
      statusEl.textContent = 'Network error — please check your connection and try again.';
      statusEl.className = 'form-status error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.removeAttribute('aria-disabled');
      submitBtn.textContent = prevLabel || 'Send Message';
    }
  });

  // Copy-to-clipboard for email link (small micro-interaction)
  const emailLink = document.querySelector('.contact-detail a[href^="mailto:"]');
  if (emailLink) {
    const emailText = emailLink.getAttribute('href').replace('mailto:', '');
    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'copy-email-btn';
    copyBtn.title = 'Copy email address';
    copyBtn.textContent = 'Copy';
    copyBtn.style.marginLeft = '8px';
    emailLink.parentElement.appendChild(copyBtn);

    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(emailText);
        copyBtn.textContent = 'Copied';
        setTimeout(() => (copyBtn.textContent = 'Copy'), 2000);
      } catch (e) {
        copyBtn.textContent = 'Copy';
      }
    });
  }
});
