/* ===== DOM Elements ===== */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const backToTop = document.getElementById('backToTop');
const typingText = document.getElementById('typingText');
const contactForm = document.getElementById('contactForm');

/* ===== Typing Animation ===== */
const typingStrings = [
  'MERN Stack Developer',
  'Frontend Dev Intern',
  'Machine Learning Enthusiast',
  'B.Tech CSE Student',
  'Python Developer'
];

let stringIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100;

function typeEffect() {
  const current = typingStrings[stringIndex];

  if (isDeleting) {
    typingText.textContent = current.substring(0, charIndex - 1);
    charIndex--;
    typingDelay = 50;
  } else {
    typingText.textContent = current.substring(0, charIndex + 1);
    charIndex++;
    typingDelay = 100;
  }

  if (!isDeleting && charIndex === current.length) {
    typingDelay = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    stringIndex = (stringIndex + 1) % typingStrings.length;
    typingDelay = 400;
  }

  setTimeout(typeEffect, typingDelay);
}

typeEffect();

/* ===== Navbar Scroll Effect ===== */
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  // Add scrolled class
  if (currentScroll > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Back to top button
  if (currentScroll > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }

  // Active nav link based on scroll position
  const sections = document.querySelectorAll('.section, .hero');
  const navLinksAll = document.querySelectorAll('.nav-link');

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (currentScroll >= sectionTop && currentScroll < sectionTop + sectionHeight) {
      navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + sectionId) {
          link.classList.add('active');
        }
      });
    }
  });

  lastScroll = currentScroll;
});

/* ===== Mobile Navigation ===== */
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close nav on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ===== Back to Top ===== */
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===== Scroll Animations (Intersection Observer) ===== */
const observerOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Stagger animation delay for sibling elements
      const siblings = entry.target.parentElement.querySelectorAll('.animate-on-scroll');
      let delay = 0;
      siblings.forEach((sibling, i) => {
        if (sibling === entry.target) delay = i * 100;
      });

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      // Animate skill progress bars
      if (entry.target.classList.contains('skill-card')) {
        const progressBar = entry.target.querySelector('.skill-progress');
        if (progressBar) {
          const progress = progressBar.getAttribute('data-progress');
          setTimeout(() => {
            progressBar.style.width = progress + '%';
          }, delay + 300);
        }
      }

      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});

/* ===== Counter Animation ===== */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('.stat-number');
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        let current = 0;
        const increment = target / 40;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = target;
            clearInterval(timer);
          } else {
            counter.textContent = Math.ceil(current);
          }
        }, 40);
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.about-stats');
if (statsSection) counterObserver.observe(statsSection);

/* ===== Contact Form with Formspree + Validation ===== */
const toastOverlay = document.getElementById('toastOverlay');
const toastCloseBtn = document.getElementById('toastCloseBtn');

// Validation helpers
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(inputEl, errorEl, message) {
  inputEl.classList.add('input-error');
  inputEl.classList.remove('input-success');
  errorEl.textContent = message;
  errorEl.classList.add('visible');
}

function clearError(inputEl, errorEl) {
  inputEl.classList.remove('input-error');
  errorEl.textContent = '';
  errorEl.classList.remove('visible');
}

function markSuccess(inputEl) {
  inputEl.classList.remove('input-error');
  inputEl.classList.add('input-success');
}

function validateForm() {
  const name = document.getElementById('formName');
  const email = document.getElementById('formEmail');
  const message = document.getElementById('formMessage');
  const nameErr = document.getElementById('nameError');
  const emailErr = document.getElementById('emailError');
  const msgErr = document.getElementById('messageError');
  let isValid = true;

  // Name validation
  if (!name.value.trim()) {
    showError(name, nameErr, 'Please enter your name');
    isValid = false;
  } else if (name.value.trim().length < 2) {
    showError(name, nameErr, 'Name must be at least 2 characters');
    isValid = false;
  } else {
    clearError(name, nameErr);
    markSuccess(name);
  }

  // Email validation
  if (!email.value.trim()) {
    showError(email, emailErr, 'Please enter your email address');
    isValid = false;
  } else if (!isValidEmail(email.value.trim())) {
    showError(email, emailErr, 'Please enter a valid email address');
    isValid = false;
  } else {
    clearError(email, emailErr);
    markSuccess(email);
  }

  // Message validation
  if (!message.value.trim()) {
    showError(message, msgErr, 'Please enter your message');
    isValid = false;
  } else if (message.value.trim().length < 10) {
    showError(message, msgErr, 'Message must be at least 10 characters');
    isValid = false;
  } else {
    clearError(message, msgErr);
    markSuccess(message);
  }

  return isValid;
}

// Real-time validation on blur
['formName', 'formEmail', 'formMessage'].forEach(id => {
  const el = document.getElementById(id);
  const errEl = document.getElementById(id.replace('form', '').toLowerCase() + 'Error');
  if (!el || !errEl) return;

  el.addEventListener('blur', () => {
    if (id === 'formName') {
      if (!el.value.trim()) showError(el, errEl, 'Please enter your name');
      else if (el.value.trim().length < 2) showError(el, errEl, 'Name must be at least 2 characters');
      else { clearError(el, errEl); markSuccess(el); }
    }
    if (id === 'formEmail') {
      if (!el.value.trim()) showError(el, errEl, 'Please enter your email address');
      else if (!isValidEmail(el.value.trim())) showError(el, errEl, 'Please enter a valid email address');
      else { clearError(el, errEl); markSuccess(el); }
    }
    if (id === 'formMessage') {
      if (!el.value.trim()) showError(el, errEl, 'Please enter your message');
      else if (el.value.trim().length < 10) showError(el, errEl, 'Message must be at least 10 characters');
      else { clearError(el, errEl); markSuccess(el); }
    }
  });

  // Clear error on input
  el.addEventListener('input', () => {
    if (el.classList.contains('input-error')) {
      clearError(el, errEl);
    }
  });
});

// Form submit
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  const btn = document.getElementById('submitBtn');
  const btnText = btn.querySelector('.btn-text');

  // Set loading state
  btn.classList.add('loading');
  btn.disabled = true;

  try {
    const formData = new FormData(contactForm);

    const response = await fetch(contactForm.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      // Success state
      btn.classList.remove('loading');
      btn.classList.add('success');
      btnText.textContent = 'Sent!';

      // Show success toast popup
      toastOverlay.classList.add('visible');

      // Reset form after a delay
      setTimeout(() => {
        contactForm.reset();
        btn.classList.remove('success');
        btnText.textContent = 'Send Message';
        btn.disabled = false;

        // Remove success borders
        document.querySelectorAll('.form-input').forEach(inp => {
          inp.classList.remove('input-success');
        });
      }, 3000);
    } else {
      throw new Error('Form submission failed');
    }
  } catch (error) {
    // Error state
    btn.classList.remove('loading');
    btnText.textContent = 'Failed to send';
    btn.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
    btn.style.boxShadow = '0 4px 20px rgba(231,76,60,0.4)';

    setTimeout(() => {
      btnText.textContent = 'Send Message';
      btn.style.background = '';
      btn.style.boxShadow = '';
      btn.disabled = false;
    }, 3000);
  }
});

// Close toast popup
toastCloseBtn.addEventListener('click', () => {
  toastOverlay.classList.remove('visible');
});

// Close toast on overlay click
toastOverlay.addEventListener('click', (e) => {
  if (e.target === toastOverlay) {
    toastOverlay.classList.remove('visible');
  }
});

// Close toast on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && toastOverlay.classList.contains('visible')) {
    toastOverlay.classList.remove('visible');
  }
});

/* ===== Footer Year ===== */
document.getElementById('currentYear').textContent = new Date().getFullYear();

/* ===== Smooth Scroll for all anchor links ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

