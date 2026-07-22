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
  initScrollProgress();
  initParticles();
  initParallax();
  initFaqAccordion();
  initSearchModal();
  initCookieConsent();
  initCounterRings();
  initContactForm();
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

/* ---------- Scroll Progress Bar ---------- */
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
  });
}

/* ---------- Hero Particle Network ---------- */
function initParticles() {
  const canvas = document.getElementById('heroParticles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationId;
  let particles = [];
  let mouse = { x: -1000, y: -1000 };

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  const particleCount = Math.min(60, Math.floor((canvas.width * canvas.height) / 15000));

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.5 + 1,
      alpha: Math.random() * 0.4 + 0.1,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201, 168, 76, ${p.alpha})`;
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const dx = p.x - particles[j].x;
        const dy = p.y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          const alpha = (1 - dist / 150) * 0.25;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(201, 168, 76, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Connection to mouse
      const mx = p.x - mouse.x;
      const my = p.y - mouse.y;
      const mDist = Math.sqrt(mx * mx + my * my);
      if (mDist < 200) {
        const alpha = (1 - mDist / 200) * 0.4;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = `rgba(201, 168, 76, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    animationId = requestAnimationFrame(draw);
  }

  draw();
}

/* ---------- Parallax Hero ---------- */
function initParallax() {
  const heroBg = document.querySelector('.hero .hero-bg img');
  if (!heroBg) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const hero = heroBg.closest('.hero');
    if (!hero) return;
    const heroHeight = hero.offsetHeight;
    if (scrollY > heroHeight) return;
    const translateY = scrollY * 0.35;
    heroBg.style.transform = `translateY(${translateY}px) scale(1.1)`;
  });
}

/* ---------- FAQ Accordion ---------- */
function initFaqAccordion() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('open');

      // Close all
      item.parentElement.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));

      // Toggle this one
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ---------- Search Modal ---------- */
function initSearchModal() {
  const modal = document.getElementById('searchModal');
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  const triggers = document.querySelectorAll('[data-search-toggle]');

  if (!modal) return;

  // Search index: page title + URL + description for key pages
  const pages = [
    { title: 'Home', url: 'index.html', desc: 'ISEA homepage — setting the global standard for equity analysis' },
    { title: 'About the Society', url: 'about.html', desc: 'History, mission, governance, chapters and partnerships' },
    { title: 'Membership', url: 'membership.html', desc: 'Membership grades, benefits, code of ethics, apply' },
    { title: 'Credentials & Certification', url: 'credentials.html', desc: 'CEA program, curriculum, exams, CPD, digital badges' },
    { title: 'Research & Publications', url: 'research.html', desc: 'Journal of Equity Analysis, market reports, white papers, library' },
    { title: 'Events & Global Forums', url: 'events.html', desc: 'Annual conference, speaker series, symposia, webinars' },
    { title: 'Professional Development', url: 'development.html', desc: 'CPD portal, masterclasses, executive education, mentorship' },
    { title: 'Career & Talent Centre', url: 'careers.html', desc: 'Job board, career pathways, employer partners, coaching' },
    { title: 'News & Advocacy', url: 'news.html', desc: 'ISEA news, press releases, regulatory updates' },
    { title: 'Insights Blog', url: 'blog.html', desc: 'Expert analysis, market commentary, professional insights' },
    { title: 'Member Login', url: 'login.html', desc: 'Members-only job board, document library and resources' },
    { title: 'Members Area', url: 'members/dashboard.html', desc: 'Job board, document library, CPD portal, profile' },
    { title: 'Contact Us', url: 'contact.html', desc: 'Get in touch with the ISEA team' },
  ];

  function doSearch(query) {
    if (!query || query.length < 2) {
      results.innerHTML = '';
      return;
    }
    const q = query.toLowerCase();
    const matches = pages.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q)
    );
    if (matches.length === 0) {
      results.innerHTML = '<p style="color: var(--text-muted); font-size: var(--font-size-sm); text-align: center; margin-top: var(--space-xl);">No results found.</p>';
      return;
    }
    results.innerHTML = matches.map(p =>
      `<a href="${p.url}" class="search-result-item" onclick="document.getElementById('searchModal').classList.remove('active')">
        <div class="search-result-title">${p.title}</div>
        <div class="search-result-desc">${p.desc}</div>
      </a>`
    ).join('');
  }

  // Open modal
  triggers.forEach(t => {
    t.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      setTimeout(() => input && input.focus(), 100);
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
  });

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  // Live search
  if (input) {
    input.addEventListener('input', () => doSearch(input.value));
  }
}

/* ---------- Cookie Consent ---------- */
function initCookieConsent() {
  const banner = document.getElementById('cookieConsent');
  if (!banner) return;
  if (localStorage.getItem('isea_cookies_accepted')) {
    banner.classList.remove('visible');
    return;
  }
  setTimeout(() => banner.classList.add('visible'), 500);

  document.querySelectorAll('[data-cookie-accept]').forEach(btn => {
    btn.addEventListener('click', () => {
      localStorage.setItem('isea_cookies_accepted', 'true');
      banner.classList.remove('visible');
    });
  });
}

/* ---------- Counter Rings ---------- */
function initCounterRings() {
  document.querySelectorAll('.stat-ring-fill').forEach(ring => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(ring);
  });
}

/* ---------- Contact Form ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner"></span> Sending...';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = 'Message Sent ✓';
      btn.style.background = 'rgba(34, 197, 94, 0.2)';
      btn.style.color = '#86efac';
      btn.style.borderColor = 'rgba(34, 197, 94, 0.3)';
      form.querySelectorAll('input, textarea').forEach(el => el.value = '');
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.style.background = '';
        btn.style.color = '';
        btn.style.borderColor = '';
      }, 3000);
    }, 1200);
  });
}

/* ---------- Smooth Scroll for Anchors ---------- */
document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a[href^="#"]');
  if (anchor) {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      const nav = document.querySelector('.navbar');
      const navHeight = nav ? nav.offsetHeight : 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }
});
