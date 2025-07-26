(() => {
  // DOM Elements
  const scrollBar = document.querySelector('.scroll-bar');
  const scrollDot = scrollBar.querySelector('.scroll-dot');
  const scrollTooltip = scrollBar.querySelector('.scroll-tooltip');
  const navLinks = document.querySelectorAll('nav ul.nav-links a');
  const accentBtn = document.getElementById('accent-btn');
  const accentMenu = document.getElementById('accent-menu');
  const accentCircles = accentMenu.querySelectorAll('.accent-circle');
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const body = document.body;
  const serviceCards = document.querySelectorAll('.service-card');
  const modalOverlay = document.getElementById('modal-overlay');
  const serviceModal = document.getElementById('service-modal');
  const modalTitle = serviceModal.querySelector('#modal-title');
  const modalDesc = serviceModal.querySelector('#modal-desc');
  const modalClose = serviceModal.querySelector('.close');
  const btnLearnMore = document.getElementById('btn-learn-more');
  const signinBtn = document.getElementById('signin-btn');
  const signinModal = document.getElementById('signin-modal');
  const signinClose = signinModal.querySelector('.close');
  const contactForm = document.querySelector('form.contact-form');
  const formFeedback = contactForm.querySelector('.form-feedback');

  // Service data
  const serviceData = {
    webdev: {
      title: 'Web Development',
      description: 'Custom websites, responsive UI, and scalable web apps designed for speed and performance.'
    },
    cloud: {
      title: 'Cloud Solutions',
      description: 'Secure cloud infrastructure and deployment services to keep your business agile and reliable.'
    },
    ai: {
      title: 'AI & Automation',
      description: 'Intelligent systems and automation tools that optimize your workflows and boost efficiency.'
    },
    consulting: {
      title: 'Consulting',
      description: 'Strategic advice and technical guidance to bring your projects from idea to reality.'
    }
  };

  // Get and set initial accent color
  let currentAccent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();

  function updateScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight ? (scrollTop / docHeight) : 0;
    const scrollBarHeight = scrollBar.clientHeight;
    const dotHeight = scrollDot.clientHeight;
    const maxTop = scrollBarHeight - dotHeight;
    const newTop = maxTop * scrollPercent;
    scrollDot.style.top = `${newTop}px`;
    scrollBar.setAttribute('aria-valuenow', Math.round(scrollPercent * 100));
    scrollTooltip.textContent = `${Math.round(scrollPercent * 100)}%`;
    scrollTooltip.style.top = `${newTop + 30}px`;
  }

  // Scroll on dragging the dot
  let isDragging = false;
  let startY;
  let startTop;

  scrollDot.addEventListener('mousedown', e => {
    isDragging = true;
    startY = e.clientY;
    startTop = parseFloat(window.getComputedStyle(scrollDot).top);
    scrollDot.style.cursor = 'grabbing';
    e.preventDefault();
  });

  window.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      scrollDot.style.cursor = 'grab';
    }
  });

  window.addEventListener('mousemove', e => {
    if (!isDragging) return;
    const deltaY = e.clientY - startY;
    const scrollBarHeight = scrollBar.clientHeight;
    const dotHeight = scrollDot.clientHeight;
    const maxTop = scrollBarHeight - dotHeight;
    let newTop = startTop + deltaY;
    if (newTop < 0) newTop = 0;
    if (newTop > maxTop) newTop = maxTop;
    scrollDot.style.top = `${newTop}px`;

    // Scroll page accordingly
    const scrollPercent = newTop / maxTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, scrollPercent * docHeight);
  });

  // Scroll dot keyboard accessibility
  scrollDot.addEventListener('keydown', e => {
    e.preventDefault();
    const step = 20;
    const scrollBarHeight = scrollBar.clientHeight;
    const dotHeight = scrollDot.clientHeight;
    const maxTop = scrollBarHeight - dotHeight;
    let top = parseFloat(window.getComputedStyle(scrollDot).top);

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      top = Math.min(top + step, maxTop);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      top = Math.max(top - step, 0);
    } else if (e.key === 'Home') {
      top = 0;
    } else if (e.key === 'End') {
      top = maxTop;
    } else {
      return;
    }
    scrollDot.style.top = `${top}px`;
    const scrollPercent = top / maxTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, scrollPercent * docHeight);
  });

  // Sticky nav shadow on scroll
  const nav = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 15) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    updateScroll();
  });

  // Smooth scroll for nav links
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.focus({ preventScroll: true });
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Accent color toggle menu
  accentBtn.addEventListener('click', () => {
    const expanded = accentBtn.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      accentMenu.style.display = 'none';
      accentBtn.setAttribute('aria-expanded', 'false');
    } else {
      accentMenu.style.display = 'flex';
      accentMenu.focus();
      accentBtn.setAttribute('aria-expanded', 'true');
    }
  });

  // Choose accent color
  accentCircles.forEach(circle => {
    circle.addEventListener('click', () => {
      const color = circle.getAttribute('data-color');
      setAccent(color);
      setActiveAccent(circle);
      accentMenu.style.display = 'none';
      accentBtn.setAttribute('aria-expanded', 'false');
      accentBtn.focus();
    });
    circle.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        circle.click();
      }
    });
  });

  function setAccent(color) {
    currentAccent = color;
    document.documentElement.style.setProperty('--accent', color);
  }

  function setActiveAccent(activeCircle) {
    accentCircles.forEach(c => c.classList.remove('active'));
    activeCircle.classList.add('active');
  }

  // Initialize active accent
  accentCircles.forEach(c => {
    if (c.getAttribute('data-color') === currentAccent) {
      c.classList.add('active');
    }
  });

  // Theme toggle (dark/light)
  themeToggle.addEventListener('click', () => {
    const isDark = body.getAttribute('data-theme') !== 'light';
    if (isDark) {
      body.setAttribute('data-theme', 'light');
      themeToggle.setAttribute('aria-pressed', 'true');
      setThemeIcon(false);
    } else {
      body.removeAttribute('data-theme');
      themeToggle.setAttribute('aria-pressed', 'false');
      setThemeIcon(true);
    }
  });

  function setThemeIcon(isDark) {
    // Moon icon for dark mode, sun for light mode
    if (isDark) {
      themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>`; // moon
    } else {
      themeIcon.innerHTML = `
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/>
        <line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/>
        <line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      `; // sun
    }
  }

  // Initialize theme icon
  setThemeIcon(body.getAttribute('data-theme') !== 'light');

  // Service cards modal open
  serviceCards.forEach(card => {
    card.addEventListener('click', () => openModal(card.getAttribute('data-service')));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card.getAttribute('data-service'));
      }
    });
  });

  function openModal(serviceKey) {
    const data = serviceData[serviceKey];
    if (!data) return;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.description;
    modalOverlay.classList.add('active');
    serviceModal.classList.add('active');
    serviceModal.focus();
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    serviceModal.classList.remove('active');
  }

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);

  serviceModal.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // Learn More button scroll to about
  btnLearnMore.addEventListener('click', () => {
    const about = document.getElementById('about');
    about.focus();
    about.scrollIntoView({ behavior: 'smooth' });
  });

  // Sign In modal open/close
  signinBtn.addEventListener('click', () => {
    signinModal.style.display = 'block';
    signinBtn.setAttribute('aria-expanded', 'true');
    signinModal.focus();
  });

  signinClose.addEventListener('click', () => {
    signinModal.style.display = 'none';
    signinBtn.setAttribute('aria-expanded', 'false');
    signinBtn.focus();
  });

  signinModal.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      signinModal.style.display = 'none';
      signinBtn.setAttribute('aria-expanded', 'false');
      signinBtn.focus();
    }
  });

  // Contact form validation & feedback
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    if (!name || !email || !message) {
      formFeedback.textContent = 'Please fill in all fields.';
      formFeedback.style.color = '#ef4444';
      return;
    }
    // Simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      formFeedback.textContent = 'Please enter a valid email address.';
      formFeedback.style.color = '#ef4444';
      return;
    }

    formFeedback.textContent = 'Thank you for contacting us!';
    formFeedback.style.color = '#10b981';

    contactForm.reset();
  });

  // Initial scroll position update
  updateScroll();

  // Accessibility: close accent menu on blur or click outside
  document.addEventListener('click', e => {
    if (!accentMenu.contains(e.target) && e.target !== accentBtn) {
      accentMenu.style.display = 'none';
      accentBtn.setAttribute('aria-expanded', 'false');
    }
  });

  accentMenu.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      accentMenu.style.display = 'none';
      accentBtn.setAttribute('aria-expanded', 'false');
      accentBtn.focus();
    }
  });

  // Keyboard trap for modals (basic)
  function trapFocus(element) {
    const focusableEls = element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstFocusableEl = focusableEls[0];
    const lastFocusableEl = focusableEls[focusableEls.length - 1];

    element.addEventListener('keydown', e => {
      if (e.key === 'Tab') {
        if (e.shiftKey) { // shift + tab
          if (document.activeElement === firstFocusableEl) {
            e.preventDefault();
            lastFocusableEl.focus();
          }
        } else { // tab
          if (document.activeElement === lastFocusableEl) {
            e.preventDefault();
            firstFocusableEl.focus();
          }
        }
      }
    });
  }
  trapFocus(serviceModal);
  trapFocus(signinModal);

})();
