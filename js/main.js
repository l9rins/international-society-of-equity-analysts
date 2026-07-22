/* =====================================================
   ISEA — International Society of Equity Analysts
   Main JavaScript
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initPageTransition();
  initNavigation();
  initScrollAnimations();
  initCounterAnimations();
  initScrollToTop();
  initTabs();
  initMemberAuth();
  initPasswordToggle();
  initSideNav();
});

/* ---------- Page Transitions ---------- */
function initPageTransition() {
  const overlay = document.querySelector('.page-transition');
  if (!overlay) return;

  // Fade in on load, then fade out
  requestAnimationFrame(() => {
    overlay.classList.add('active');
    requestAnimationFrame(() => {
      setTimeout(() => {
        overlay.classList.remove('active');
      }, 50);
    });
  });

  // Intercept internal nav links for smooth transitions
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a:not([href^="#"]):not([href^="mailto:"]):not([href^="http"]):not([target="_blank"])');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href === '#' || href.startsWith('javascript:')) return;

    const isSamePage = window.location.pathname.endsWith(href) ||
      (!href.includes('/') && window.location.pathname.split('/').pop() === href);

    if (isSamePage) return;

    e.preventDefault();
    overlay.classList.add('active');
    setTimeout(() => {
      window.location.href = href;
    }, 350);
  });
}

/* ---------- Navigation ---------- */
function initNavigation() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  const navItems = document.querySelectorAll('.nav-item');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Mobile toggle
  if (toggle) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      menu.classList.toggle('active');
      document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });
  }

  // Mobile dropdown toggle
  navItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.nav-dropdown');
    if (dropdown && link) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 992) {
          e.preventDefault();
          item.classList.toggle('open');
        }
      });
    }
  });

  // Close menu on link click (mobile)
  document.querySelectorAll('.nav-dropdown a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 992) {
        toggle.classList.remove('active');
        menu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Set active nav link (handles merged nav items)
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const activeMap = {
    'development.html': 'careers.html',
    'blog.html': 'news.html',
  };
  const activeTarget = activeMap[currentPage] || currentPage;
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === activeTarget) {
      link.classList.add('active');
    }
  });
}

/* ---------- Scroll Animations ---------- */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .stagger-children');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
  } else {
    elements.forEach(el => el.classList.add('visible'));
  }
}

/* ---------- Counter Animations ---------- */
function initCounterAnimations() {
  const counters = document.querySelectorAll('.stat-number[data-target]');

  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.dataset.target);
  const suffix = element.dataset.suffix || '';
  const prefix = element.dataset.prefix || '';
  const duration = 2000;
  const start = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);

    element.textContent = prefix + current.toLocaleString() + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = prefix + target.toLocaleString() + suffix;
    }
  }

  requestAnimationFrame(update);
}

/* ---------- Scroll to Top ---------- */
function initScrollToTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------- Tabs ---------- */
function initTabs() {
  const tabContainers = document.querySelectorAll('[data-tabs]');

  tabContainers.forEach(container => {
    const buttons = container.querySelectorAll('.tab-btn');
    const panels = container.querySelectorAll('.tab-content');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;

        buttons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const panel = container.querySelector(`#${target}`);
        if (panel) panel.classList.add('active');
      });
    });
  });
}

/* ---------- Member Authentication (Demo) ---------- */
function initMemberAuth() {
  const loginForm = document.getElementById('loginForm');
  const logoutBtn = document.getElementById('logoutBtn');

  if (loginForm) {
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const alertEl = document.getElementById('loginAlert');
    const submitBtn = document.getElementById('loginSubmitBtn');
    const btnText = document.getElementById('loginBtnText');
    const btnSpinner = document.getElementById('loginBtnSpinner');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    // Real-time validation on blur
    if (emailInput) {
      emailInput.addEventListener('blur', () => {
        if (emailInput.value && !emailInput.checkValidity()) {
          emailInput.classList.add('error');
          if (emailError) emailError.classList.add('visible');
        } else {
          emailInput.classList.remove('error');
          if (emailError) emailError.classList.remove('visible');
        }
      });
      emailInput.addEventListener('input', () => {
        emailInput.classList.remove('error');
        if (emailError) emailError.classList.remove('visible');
        if (alertEl) alertEl.classList.remove('visible');
      });
    }

    if (passwordInput) {
      passwordInput.addEventListener('blur', () => {
        if (passwordInput.value && passwordInput.value.length < 6) {
          passwordInput.classList.add('error');
          if (passwordError) passwordError.classList.add('visible');
        } else {
          passwordInput.classList.remove('error');
          if (passwordError) passwordError.classList.remove('visible');
        }
      });
      passwordInput.addEventListener('input', () => {
        passwordInput.classList.remove('error');
        if (passwordError) passwordError.classList.remove('visible');
        if (alertEl) alertEl.classList.remove('visible');
      });
    }

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Reset errors
      if (emailInput) emailInput.classList.remove('error');
      if (passwordInput) passwordInput.classList.remove('error');
      if (emailError) emailError.classList.remove('visible');
      if (passwordError) passwordError.classList.remove('visible');
      if (alertEl) alertEl.classList.remove('visible');

      const email = emailInput ? emailInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value : '';

      // Client-side validation
      let hasError = false;
      if (!email || !emailInput.checkValidity()) {
        if (emailInput) emailInput.classList.add('error');
        if (emailError) emailError.classList.add('visible');
        hasError = true;
      }
      if (!password || password.length < 6) {
        if (passwordInput) passwordInput.classList.add('error');
        if (passwordError) passwordError.classList.add('visible');
        hasError = true;
      }
      if (hasError) {
        if (alertEl) {
          alertEl.textContent = 'Please fix the errors above and try again.';
          alertEl.classList.add('visible');
        }
        return;
      }

      // Show loading state
      if (submitBtn) submitBtn.classList.add('loading');
      if (btnText) btnText.textContent = 'Signing In...';
      if (btnSpinner) btnSpinner.style.display = 'inline-block';

      // Simulate network delay
      setTimeout(() => {
        const member = {
          email: email,
          name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          loggedIn: true,
          loginTime: new Date().toISOString()
        };
        localStorage.setItem('isea_member', JSON.stringify(member));
        window.location.href = 'members/dashboard.html';
      }, 800);
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('isea_member');
      window.location.href = '../login.html';
    });
  }

  // Protect member pages
  if (window.location.pathname.includes('/members/')) {
    const member = JSON.parse(localStorage.getItem('isea_member') || 'null');
    if (!member || !member.loggedIn) {
      window.location.href = '../login.html';
      return;
    }

    // Populate member name
    const nameEl = document.getElementById('memberName');
    if (nameEl && member.name) {
      nameEl.textContent = member.name;
    }
  }

  // Update nav login/member link
  updateAuthUI();
}

function updateAuthUI() {
  const member = JSON.parse(localStorage.getItem('isea_member') || 'null');
  const loginLinks = document.querySelectorAll('[data-auth-link]');

  loginLinks.forEach(link => {
    if (member && member.loggedIn) {
      link.textContent = 'My Account';
      link.href = link.dataset.memberUrl || 'members/dashboard.html';
    }
  });
}

/* ---------- Blog Filter ---------- */
function filterBlog(category) {
  const cards = document.querySelectorAll('.blog-card');
  const buttons = document.querySelectorAll('.blog-filter-btn');

  buttons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === category);
  });

  cards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = '';
      setTimeout(() => card.style.opacity = '1', 50);
    } else {
      card.style.opacity = '0';
      setTimeout(() => card.style.display = 'none', 300);
    }
  });
}

/* ---------- Password Toggle ---------- */
function initPasswordToggle() {
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input');
      if (!input) return;
      const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
      input.setAttribute('type', type);
      btn.innerHTML = type === 'password'
        ? '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>'
        : '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"></path><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
    });
  });
}

/* ---------- Side Nav Scroll Spy ---------- */
function initSideNav() {
  const sideLinks = document.querySelectorAll('.side-nav a');
  if (sideLinks.length === 0) return;

  const sections = [];
  sideLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const section = document.querySelector(href);
      if (section) sections.push({ el: section, link: link, id: href });
    }
  });

  if (sections.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        sideLinks.forEach(l => l.classList.remove('active'));
        const match = sections.find(s => s.el === entry.target);
        if (match) match.link.classList.add('active');
      }
    });
  }, { threshold: 0.2, rootMargin: '-80px 0px -50% 0px' });

  sections.forEach(s => observer.observe(s.el));
}

/* ---------- Smooth Scroll for Anchors ---------- */
document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a[href^="#"]');
  if (anchor) {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      const offset = 100;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }
});
