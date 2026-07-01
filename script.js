/* ============================================================
   TYPED HERO HEADLINE
   Cycles through role strings with a typewriter effect.
   ============================================================ */
const roles = [
  'UX/UI Designer',
  'Research-Led Problem Solver',
  'Design Systems Advocate',
  'Prototype-Driven Collaborator',
];

let roleIndex = 0;
let charIndex  = 0;
let deleting   = false;

const typedEl = document.getElementById('typed');

function type() {
  if (!typedEl) return;
  const current = roles[roleIndex];

  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) {
      // Pause at end before deleting
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting   = false;
      roleIndex  = (roleIndex + 1) % roles.length;
    }
  }

  setTimeout(type, deleting ? 50 : 90);
}

if (typedEl) {
  type();
}


/* ============================================================
   NAVBAR — add scrolled class after user scrolls down
   ============================================================ */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }
}, { passive: true });


/* ============================================================
   MOBILE NAV TOGGLE
   ============================================================ */
const toggle    = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

if (toggle && navLinks) {
  toggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}


/* ============================================================
   SCROLL REVEAL — fade-in sections as they enter the viewport
   ============================================================ */
const revealTargets = [
  '#about .about-grid',
  '#about .about-text',
  '#projects .project-card',
  '#contact .contact-info',
  '#contact .contact-form',
];

// Add .reveal class to every matched element
revealTargets.forEach(selector => {
  document.querySelectorAll(selector).forEach(el => {
    el.classList.add('reveal');
  });
});

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ============================================================
   ACTIVE NAV LINK — highlight the current section's nav item
   ============================================================ */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAnchors.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}`
            ? 'var(--white)'
            : '';
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach(s => sectionObserver.observe(s));


/* ============================================================
   CONTACT FORM — client-side validation + simulated submit
   ============================================================ */
const form        = document.getElementById('contact-form');
const successMsg  = document.getElementById('form-success');

function showError(id, msg) {
  const el    = document.getElementById(`${id}-error`);
  const input = document.getElementById(id);
  if (el)    el.textContent = msg;
  if (input) input.classList.toggle('invalid', !!msg);
}

function validateEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

if (form && successMsg) {
  form.addEventListener('submit', async e => {
    e.preventDefault();

  const name    = form.name.value.trim();
  const email   = form.email.value.trim();
  const message = form.message.value.trim();
  let   valid   = true;

  // Clear previous errors
  showError('name',    '');
  showError('email',   '');
  showError('message', '');
  successMsg.hidden = true;

  if (!name) {
    showError('name', 'Please enter your name.');
    valid = false;
  }
  if (!email || !validateEmail(email)) {
    showError('email', 'Please enter a valid email address.');
    valid = false;
  }
  if (!message) {
    showError('message', 'Please write a message.');
    valid = false;
  }

  if (!valid) return;

  // Show loading state
  const btnText    = form.querySelector('.btn-text');
  const btnLoading = form.querySelector('.btn-loading');
  btnText.hidden    = true;
  btnLoading.hidden = false;

  /* ----------------------------------------------------------
     WIRE UP YOUR BACKEND HERE.
     Options:
       • Formspree:  fetch('https://formspree.io/f/YOUR_ID', ...)
       • EmailJS:    emailjs.send(...)
       • Your own API endpoint

     For now we simulate a short delay so you can see the UX.
  ---------------------------------------------------------- */
  await new Promise(r => setTimeout(r, 1200));

  btnText.hidden    = false;
  btnLoading.hidden = true;

    form.reset();
    successMsg.hidden = false;
  });
}


/* ============================================================
   GLOBAL IMAGE LIGHTBOX — click supported content images to zoom
   ============================================================ */
function initImageLightbox() {
  const isCaseStudyPage = window.location.pathname.includes('case-study-');
  const imageSelector = isCaseStudyPage
    ? 'main img'
    : [
        '.case-media img',
        '.flow-card img',
        '.media-row img',
        '.media-pair img',
        '.media-stack img',
        '.desktop-frame-screen img',
        '.settings-compare img',
        '.project-img img'
      ].join(', ');

  const images = document.querySelectorAll(imageSelector);
  if (!images.length) return;

  images.forEach(img => {
    if (!img.closest('a, button')) {
      img.classList.add('image-zoomable');
    }
  });

  let lightbox = document.getElementById('global-lightbox');
  let lightboxImage = document.getElementById('global-lightbox-image');
  let closeButton = document.getElementById('global-lightbox-close');

  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'global-lightbox';
    lightbox.className = 'global-lightbox';
    lightbox.setAttribute('aria-hidden', 'true');

    closeButton = document.createElement('button');
    closeButton.id = 'global-lightbox-close';
    closeButton.className = 'global-lightbox-close';
    closeButton.setAttribute('aria-label', 'Close image overlay');
    closeButton.textContent = '×';

    lightboxImage = document.createElement('img');
    lightboxImage.id = 'global-lightbox-image';
    lightboxImage.alt = 'Expanded image';

    lightbox.appendChild(closeButton);
    lightbox.appendChild(lightboxImage);
    document.body.appendChild(lightbox);
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImage.src = '';
  }

  document.addEventListener('click', event => {
    const targetImage = event.target.closest(imageSelector);
    if (!targetImage) return;
    if (targetImage.closest('#global-lightbox')) return;
    if (targetImage.closest('a, button')) return;
    if (targetImage.dataset.noLightbox === 'true') return;

    lightboxImage.src = targetImage.currentSrc || targetImage.src;
    lightboxImage.alt = targetImage.alt || 'Expanded image';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
  });

  closeButton.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
      closeLightbox();
    }
  });
}

initImageLightbox();


/* ============================================================
   FOOTER YEAR
   ============================================================ */
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
