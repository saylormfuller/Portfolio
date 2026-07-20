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
   ABOUT CAROUSEL — fun photo slider with arrows and dots
   ============================================================ */
function initFunCarousel() {
  const carousels = document.querySelectorAll('.fun-carousel');
  if (!carousels.length) return;

  carousels.forEach(carousel => {
    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const prev = carousel.querySelector('.carousel-btn.prev');
    const next = carousel.querySelector('.carousel-btn.next');
    const dotsContainer = carousel.querySelector('.carousel-dots');

    if (!slides.length || !prev || !next) return;

    let currentIndex = 0;
    let dots = [];

    function getVisibleCount() {
      if (window.innerWidth <= 640) return 1;
      if (window.innerWidth <= 980) return 2;
      return 3;
    }

    function getTotalCount() {
      return Math.max(1, slides.length);
    }

    function buildDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';

      const totalCount = getTotalCount();
      for (let idx = 0; idx < totalCount; idx += 1) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot';
        dot.dataset.slide = String(idx);
        dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
        dot.addEventListener('click', () => render(idx));
        dotsContainer.appendChild(dot);
      }

      dots = Array.from(dotsContainer.querySelectorAll('.carousel-dot'));
    }

    function render(index) {
      const visibleCount = getVisibleCount();
      const totalCount = getTotalCount();
      currentIndex = (index + totalCount) % totalCount;

      let visibleIndexes = [];
      if (visibleCount <= 1) {
        visibleIndexes = [currentIndex];
      } else if (visibleCount === 2) {
        visibleIndexes = [currentIndex, (currentIndex + 1) % totalCount];
      } else {
        visibleIndexes = [
          (currentIndex - 1 + totalCount) % totalCount,
          currentIndex,
          (currentIndex + 1) % totalCount
        ];
      }

      slides.forEach((slide, idx) => {
        const visibleIndex = visibleIndexes.indexOf(idx);
        const isActive = visibleIndex !== -1;
        const isFeatured = visibleCount >= 3 && idx === currentIndex;

        slide.classList.toggle('is-active', isActive);
        slide.classList.toggle('is-featured', isActive && isFeatured);
        slide.setAttribute('aria-hidden', String(!isActive));
        slide.style.order = isActive ? String(visibleIndex) : '99';
      });

      dots.forEach((dot, idx) => {
        dot.classList.toggle('is-active', idx === currentIndex);
      });
    }

    prev.addEventListener('click', () => render(currentIndex - 1));
    next.addEventListener('click', () => render(currentIndex + 1));

    buildDots();
    window.addEventListener('resize', () => {
      const totalCount = getTotalCount();
      if (currentIndex > totalCount - 1) {
        currentIndex = totalCount - 1;
      }
      buildDots();
      render(currentIndex);
    });

    render(0);
  });
}

initFunCarousel();


/* ============================================================
   CASE STUDY SECTION TITLES — kicker + serif summary heading
   ============================================================ */
function initCaseStudySectionTitles() {
  const isCaseStudyPage = window.location.pathname.includes('case-study-');
  if (!isCaseStudyPage) return;

  const summaryMap = {
    overview: 'A quick snapshot of the project scope, goals, and context.',
    problem: 'The core user and business challenges this work needed to solve.',
    solution: 'The product direction and UX decisions that shaped the final experience.',
    process: 'How research, iteration, and collaboration guided design decisions.',
    outcome: 'What changed, what improved, and the impact delivered.',
    impact: 'The measurable results and product value created through this work.',
    research: 'The research methods and key insights that informed design choices.',
    reflection: 'Key lessons learned and what I would refine next time.',
    'my contributions': 'The specific responsibilities and leadership I owned across the project.'
  };

  function getFirstSentence(text) {
    if (!text) return '';
    const compact = text.replace(/\s+/g, ' ').trim();
    const match = compact.match(/[^.!?]+[.!?]/);
    const sentence = (match ? match[0] : compact).trim();
    if (sentence.length <= 120) return sentence;
    return `${sentence.slice(0, 117).trimEnd()}...`;
  }

  document.querySelectorAll('main .case-study-section').forEach(section => {
    const heading = section.querySelector('.container > h2');
    if (!heading || heading.dataset.sectionTitleEnhanced === 'true') return;

    const label = heading.textContent.replace(/\s+/g, ' ').trim();
    if (!label) return;

    const normalizedLabel = label.toLowerCase();
    const customSummary = (heading.dataset.subhead || '').trim();
    const firstParagraph = section.querySelector('.container > p');
    const fallbackSummary = getFirstSentence(firstParagraph ? firstParagraph.textContent : '');
    const summaryText = customSummary || summaryMap[normalizedLabel] || fallbackSummary || 'A focused look at this section of the case study.';

    heading.classList.add('case-section-kicker');
    heading.dataset.sectionTitleEnhanced = 'true';

    const subheading = document.createElement('p');
    subheading.className = 'case-section-subhead';
    subheading.textContent = summaryText;
    heading.insertAdjacentElement('afterend', subheading);
  });
}

initCaseStudySectionTitles();


/* ============================================================
  CASE STUDY SIDE NAV — sticky section navigation
  ============================================================ */
function initCaseStudySideNav() {
  const isCaseStudyPage = window.location.pathname.includes('case-study-');
  if (!isCaseStudyPage) return;

  const main = document.querySelector('main');
  if (!main) return;

  const sections = Array.from(main.querySelectorAll('.case-study-section'));
  if (!sections.length) return;

  const usedIds = new Set();
  const jumpItems = [];

  sections.forEach((section, idx) => {
    const heading = section.querySelector('h2');
    if (!heading) return;

    const baseText = heading.textContent.trim();
    if (!baseText) return;

    let id = (section.id || '').trim();
    if (!id) {
      id = baseText
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || `section-${idx + 1}`;
    }

    let uniqueId = id;
    let suffix = 2;
    while (usedIds.has(uniqueId) || (document.getElementById(uniqueId) && document.getElementById(uniqueId) !== section)) {
      uniqueId = `${id}-${suffix}`;
      suffix += 1;
    }

    section.id = uniqueId;
    usedIds.add(uniqueId);
    jumpItems.push({ id: uniqueId, label: baseText });
  });

  if (!jumpItems.length) return;

  const layoutSection = document.createElement('section');
  layoutSection.className = 'case-study-body';

  const layoutContainer = document.createElement('div');
  layoutContainer.className = 'container case-study-body-grid';

  const sideNav = document.createElement('nav');
  sideNav.className = 'case-side-nav';
  sideNav.setAttribute('aria-label', 'Case study sections');

  const sideLinks = document.createElement('div');
  sideLinks.className = 'case-side-links';

  const sectionsWrap = document.createElement('div');
  sectionsWrap.className = 'case-study-sections';

  jumpItems.forEach(item => {
    const link = document.createElement('a');
    link.href = `#${item.id}`;
    link.textContent = item.label;
    sideLinks.appendChild(link);
  });

  sideNav.appendChild(sideLinks);
  layoutContainer.appendChild(sideNav);
  layoutContainer.appendChild(sectionsWrap);
  layoutSection.appendChild(layoutContainer);

  main.insertBefore(layoutSection, sections[0]);
  sections.forEach(section => sectionsWrap.appendChild(section));

  const jumpLinks = Array.from(sideNav.querySelectorAll('a'));
  if (!jumpLinks.length) return;

  const linkMap = new Map(jumpLinks.map(link => [link.getAttribute('href').slice(1), link]));

  function setActiveLink(id) {
    jumpLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  setActiveLink(jumpItems[0].id);

  const jumpObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const activeId = entry.target.id;
        if (linkMap.has(activeId)) {
          setActiveLink(activeId);
        }
      });
    },
    { rootMargin: '-28% 0px -62% 0px', threshold: 0.02 }
  );

  sections.forEach(section => {
    if (section.id) jumpObserver.observe(section);
  });
}

initCaseStudySideNav();


/* ============================================================
   CASE STUDY PROCESS MEDIA — unified sizing + carousels
   ============================================================ */
function initCaseStudyProcessMedia() {
  const isCaseStudyPage = window.location.pathname.includes('case-study-');
  if (!isCaseStudyPage) return;

  const processSections = Array.from(document.querySelectorAll('main .case-study-section')).filter(section => {
    const heading = section.querySelector('h2');
    if (!heading) return false;
    return heading.textContent.trim().toLowerCase() === 'process';
  });

  if (!processSections.length) return;

  function buildCarousel(group) {
    if (group.dataset.processCarouselReady === 'true') return;

    const candidates = Array.from(group.children).filter(child => child.querySelector('img, video'));
    if (candidates.length < 2) return;

    const carousel = document.createElement('div');
    carousel.className = 'case-process-carousel';

    const prev = document.createElement('button');
    prev.className = 'case-process-carousel-btn prev';
    prev.type = 'button';
    prev.setAttribute('aria-label', 'Previous slide');
    prev.textContent = '<';

    const next = document.createElement('button');
    next.className = 'case-process-carousel-btn next';
    next.type = 'button';
    next.setAttribute('aria-label', 'Next slide');
    next.textContent = '>';

    const viewport = document.createElement('div');
    viewport.className = 'case-process-carousel-viewport';

    const track = document.createElement('div');
    track.className = 'case-process-carousel-track';

    const controls = document.createElement('div');
    controls.className = 'case-process-carousel-controls';

    const dots = document.createElement('div');
    dots.className = 'case-process-carousel-dots';

    candidates.forEach((item, idx) => {
      const slide = document.createElement('div');
      slide.className = 'case-process-slide';
      slide.setAttribute('aria-hidden', String(idx !== 0));
      slide.appendChild(item);
      track.appendChild(slide);
    });

    carousel.appendChild(prev);
    viewport.appendChild(track);
    carousel.appendChild(viewport);
    controls.appendChild(prev);
    controls.appendChild(dots);
    controls.appendChild(next);
    carousel.appendChild(controls);

    group.replaceWith(carousel);

    const slides = Array.from(track.children);
    const slideCount = slides.length;
    if (!slideCount) return;

    const dotButtons = slides.map((_, idx) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'case-process-dot';
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      dot.addEventListener('click', () => render(idx));
      dots.appendChild(dot);
      return dot;
    });
    let currentIndex = 0;

    function getStep() {
      const gap = parseFloat(window.getComputedStyle(track).columnGap || window.getComputedStyle(track).gap || '0') || 0;
      const sampleSlide = slides[0];
      return (sampleSlide ? sampleSlide.getBoundingClientRect().width : 0) + gap;
    }

    function syncState(trackIndex) {
      carousel.classList.toggle('is-at-end', trackIndex === slideCount - 1);
      slides.forEach((slide, idx) => {
        slide.setAttribute('aria-hidden', String(idx !== trackIndex));
      });

      dotButtons.forEach((dot, idx) => {
        dot.classList.toggle('is-active', idx === trackIndex);
      });

      prev.disabled = trackIndex === 0;
      next.disabled = trackIndex === slideCount - 1;
    }

    function render(index) {
      currentIndex = Math.max(0, Math.min(index, slideCount - 1));
      track.style.transition = 'transform 0.35s ease';
      const step = getStep();
      track.style.transform = `translateX(${-currentIndex * step}px)`;
      syncState(currentIndex);
    }

    prev.addEventListener('click', () => render(currentIndex - 1));
    next.addEventListener('click', () => render(currentIndex + 1));
    window.addEventListener('resize', () => render(currentIndex));
    render(0);
  }

  processSections.forEach(section => {
    section.classList.add('case-process-section');

    section.querySelectorAll('img, video').forEach(media => {
      if (media.closest('.flow-grid, .flow-card')) return;
      media.classList.add('case-process-media');
    });

    section.querySelectorAll('.case-media').forEach(frame => {
      frame.classList.add('case-process-frame');
    });

    const horizontalGroups = section.querySelectorAll('.media-row, .settings-compare, .media-pair, .solution-media-row');
    horizontalGroups.forEach(group => buildCarousel(group));
  });
}

initCaseStudyProcessMedia();


/* ============================================================
   CASE STUDY VIDEO BLOBS — load local videos through blob URLs
   ============================================================ */
async function initCaseStudyVideoBlobs() {
  const videos = Array.from(document.querySelectorAll('main .case-study-section video'));
  if (!videos.length) return;

  await Promise.all(videos.map(async video => {
    if (video.dataset.blobLoaded === 'true') return;

    const source = video.querySelector('source[src]');
    const sourceUrl = source ? source.getAttribute('src') : video.getAttribute('src');
    if (!sourceUrl) return;

    try {
      const response = await fetch(sourceUrl);
      if (!response.ok) return;

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      video.src = blobUrl;
      video.dataset.blobLoaded = 'true';
      video.dataset.blobUrl = blobUrl;
      video.load();
    } catch (_error) {
      // Fall back to the original file URL if fetching fails.
    }
  }));
}

initCaseStudyVideoBlobs();


/* ============================================================
   FINDINGS IFRAME AUTO-HEIGHT — remove internal scrolling
   ============================================================ */
function initFindingsEmbedAutoHeight() {
  const findingsFrames = document.querySelectorAll('.findings-embed iframe');
  if (!findingsFrames.length) return;

  function resizeFrame(frame) {
    try {
      const doc = frame.contentDocument || (frame.contentWindow && frame.contentWindow.document);
      if (!doc || !doc.body) return;
      const nextHeight = Math.max(doc.body.scrollHeight, doc.documentElement ? doc.documentElement.scrollHeight : 0);
      if (nextHeight > 0) {
        frame.style.height = `${nextHeight + 4}px`;
      }
    } catch (_err) {
      // Same-origin expected here; ignore if frame is not accessible.
    }
  }

  findingsFrames.forEach(frame => {
    frame.addEventListener('load', () => {
      resizeFrame(frame);
      setTimeout(() => resizeFrame(frame), 60);
      setTimeout(() => resizeFrame(frame), 220);
    });

    if (frame.contentDocument && frame.contentDocument.readyState === 'complete') {
      resizeFrame(frame);
    }
  });

  window.addEventListener('resize', () => {
    findingsFrames.forEach(frame => resizeFrame(frame));
  });
}

initFindingsEmbedAutoHeight();


/* ============================================================
   FOOTER YEAR
   ============================================================ */
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
