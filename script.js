// ── NAV SCROLL SHADOW ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 30);
});

// ── HAMBURGER MENU (mobile) ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.style.display === 'flex';
  if (isOpen) {
    navLinks.style.display = 'none';
  } else {
    Object.assign(navLinks.style, {
      display:       'flex',
      flexDirection: 'column',
      position:      'absolute',
      top:           '64px',
      right:         '24px',
      background:    'white',
      padding:       '20px',
      borderRadius:  '12px',
      boxShadow:     '0 8px 30px rgba(0,0,0,0.12)',
      zIndex:        '200'
    });
  }
});

// Close mobile menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.style.display = 'none';
  });
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

// ── CONTACT FORM (mock submit) ──
function handleFormSubmit(btn) {
  btn.textContent = 'Sending…';
  btn.disabled    = true;

  setTimeout(() => {
    btn.textContent       = '✓ Message Sent!';
    btn.style.background  = '#22c55e';

    setTimeout(() => {
      btn.textContent      = 'Send Message';
      btn.style.background = '';
      btn.disabled         = false;
    }, 3000);
  }, 1200);
}
