/**
 * Amit Solanki Portfolio - Interactive JavaScript
 * High performance vanilla JavaScript for theme toggling, animations,
 * filtering, form validation, and scroll interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. Theme Toggle (Dark / Light Mode)
  // =========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Retrieve user's previous preference or system preference
  const savedTheme = localStorage.getItem('portfolio-theme');
  const systemPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

  if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
  } else if (systemPrefersLight) {
    htmlElement.setAttribute('data-theme', 'light');
  } else {
    htmlElement.setAttribute('data-theme', 'dark');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      htmlElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);

      showToast(`Switched to ${newTheme} mode`, 'info');
    });
  }

  // =========================================================================
  // 2. Mobile Drawer Navigation
  // =========================================================================
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const navLinks = document.querySelectorAll('.nav-link');

  const openMobileMenu = () => {
    if (navMenu) {
      navMenu.classList.add('open');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
  };

  const closeMobileMenu = () => {
    if (navMenu) {
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  if (navToggle) {
    navToggle.addEventListener('click', openMobileMenu);
  }

  if (navClose) {
    navClose.addEventListener('click', closeMobileMenu);
  }

  // Close mobile drawer when clicking any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close when clicking outside of the drawer on mobile
  document.addEventListener('click', (event) => {
    if (
      navMenu &&
      navMenu.classList.contains('open') &&
      !navMenu.contains(event.target) &&
      navToggle &&
      !navToggle.contains(event.target)
    ) {
      closeMobileMenu();
    }
  });

  // Close on Escape key press
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navMenu && navMenu.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // =========================================================================
  // 3. Header Scroll Effect & Active Navigation Link (ScrollSpy)
  // =========================================================================
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');

  const handleScroll = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Header sticky shadow
    if (header) {
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // ScrollSpy active link detection
    sections.forEach(currentSection => {
      const sectionHeight = currentSection.offsetHeight;
      const sectionTop = currentSection.offsetTop - 120;
      const sectionId = currentSection.getAttribute('id');
      const targetNavLink = document.querySelector(`.nav-menu a[href*="#${sectionId}"]`);

      if (targetNavLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetNavLink.classList.add('active');
        } else {
          targetNavLink.classList.remove('active');
        }
      }
    });

    // Back to top button visibility
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.visibility = 'visible';
      } else {
        backToTopBtn.style.opacity = '0.7';
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Back to top click handler
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // =========================================================================
  // 4. Hero Typewriter Animation
  // =========================================================================
  const typewriterElement = document.getElementById('typewriter');
  const phrases = [
    'Modern Web Apps',
    'Full-Stack Systems',
    'Interactive Interfaces',
    'Clean & Tested Code',
    'Scalable Cloud APIs'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 100;
  const deletingSpeed = 45;
  const pauseBetweenPhrases = 2000;

  function typeEffect() {
    if (!typewriterElement) return;

    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let currentSpeed = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentPhrase.length) {
      currentSpeed = pauseBetweenPhrases;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      currentSpeed = 400;
    }

    setTimeout(typeEffect, currentSpeed);
  }

  // Start Typewriter
  typeEffect();

  // =========================================================================
  // 5. Statistics Count-Up Animation
  // =========================================================================
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  const animateStats = () => {
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const duration = 1600; // ms
      const stepTime = 30;
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;
      let currentVal = 0;

      const timer = setInterval(() => {
        currentVal += increment;
        if (currentVal >= target) {
          stat.textContent = target;
          clearInterval(timer);
        } else {
          stat.textContent = Math.floor(currentVal);
        }
      }, stepTime);
    });
  };

  const aboutSection = document.getElementById('about');
  if (aboutSection && 'IntersectionObserver' in window) {
    const aboutObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsCounted) {
          animateStats();
          statsCounted = true;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    aboutObserver.observe(aboutSection);
  } else {
    // Fallback if IntersectionObserver is unsupported
    animateStats();
  }

  // =========================================================================
  // 6. Skills Section - Tab Filtering & Progress Bars
  // =========================================================================
  const skillFilterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');
  const skillProgressBars = document.querySelectorAll('.skill-progress');

  // Trigger progress bar animations when skills are in view
  const skillsSection = document.getElementById('skills');
  if (skillsSection && 'IntersectionObserver' in window) {
    const skillsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          skillProgressBars.forEach(bar => bar.classList.add('animated'));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    skillsObserver.observe(skillsSection);
  } else {
    skillProgressBars.forEach(bar => bar.classList.add('animated'));
  }

  // Skill category filter handler
  skillFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active button
      skillFilterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('hidden');
          // Re-trigger bar animation
          const bar = card.querySelector('.skill-progress');
          if (bar) bar.classList.add('animated');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // =========================================================================
  // 7. Projects Section - Interactive Filtering
  // =========================================================================
  const projectFilterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projectFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-category');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCategory === filterCategory) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // =========================================================================
  // 8. Contact Form Handling & Validation
  // =========================================================================
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const submitBtn = document.getElementById('submit-btn');
  const formAlert = document.getElementById('form-alert');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Real-time input clearing
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      nameInput.classList.remove('invalid');
      if (nameError) nameError.textContent = '';
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      emailInput.classList.remove('invalid');
      if (emailError) emailError.textContent = '';
    });
  }

  if (messageInput) {
    messageInput.addEventListener('input', () => {
      messageInput.classList.remove('invalid');
      if (messageError) messageError.textContent = '';
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        nameInput.classList.add('invalid');
        if (nameError) nameError.textContent = 'Please enter your name.';
        isValid = false;
      } else if (nameInput.value.trim().length < 2) {
        nameInput.classList.add('invalid');
        if (nameError) nameError.textContent = 'Name must be at least 2 characters long.';
        isValid = false;
      }

      // Validate Email
      if (!emailInput.value.trim()) {
        emailInput.classList.add('invalid');
        if (emailError) emailError.textContent = 'Please enter your email address.';
        isValid = false;
      } else if (!emailPattern.test(emailInput.value.trim())) {
        emailInput.classList.add('invalid');
        if (emailError) emailError.textContent = 'Please enter a valid email address.';
        isValid = false;
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        messageInput.classList.add('invalid');
        if (messageError) messageError.textContent = 'Please enter your message.';
        isValid = false;
      } else if (messageInput.value.trim().length < 10) {
        messageInput.classList.add('invalid');
        if (messageError) messageError.textContent = 'Message must be at least 10 characters.';
        isValid = false;
      }

      if (!isValid) {
        showToast('Please fix the errors in the form.', 'error');
        return;
      }

      // Simulate sending via visual loading state
      if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
        }

        // Show success state
        if (formAlert) {
          formAlert.className = 'alert-box success';
          formAlert.innerHTML = `<strong>Thank you, ${escapeHTML(nameInput.value.trim())}!</strong> Your message has been sent successfully. I will get back to you shortly.`;
        }

        showToast('Message sent successfully! 🚀', 'success');

        // Reset form fields
        contactForm.reset();

        // Clear alert after 6 seconds
        setTimeout(() => {
          if (formAlert) {
            formAlert.className = 'alert-box';
            formAlert.innerHTML = '';
          }
        }, 6000);
      }, 1000);
    });
  }

  // =========================================================================
  // 9. Copy Email Address to Clipboard
  // =========================================================================
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const emailAddressEl = document.getElementById('email-address');

  if (copyEmailBtn && emailAddressEl) {
    copyEmailBtn.addEventListener('click', () => {
      const emailText = emailAddressEl.textContent.trim();

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(emailText)
          .then(() => {
            showToast('Email address copied to clipboard!', 'success');
            copyEmailBtn.style.color = '#10b981';
            setTimeout(() => { copyEmailBtn.style.color = ''; }, 2000);
          })
          .catch(() => fallbackCopy(emailText));
      } else {
        fallbackCopy(emailText);
      }
    });
  }

  function fallbackCopy(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast('Email address copied to clipboard!', 'success');
    } catch (err) {
      showToast('Could not copy automatically.', 'error');
    }
    document.body.removeChild(tempInput);
  }

  // =========================================================================
  // 10. Download CV Action
  // =========================================================================
  const downloadCvBtn = document.getElementById('download-cv-btn');
  if (downloadCvBtn) {
    downloadCvBtn.addEventListener('click', (e) => {
      e.preventDefault();

      // Generate a structured, formatted text resume summary
      const cvContent = `AMIT SOLANKI
Full Stack Software Developer
Email: amit.solanki@example.com | Location: San Francisco, CA (Remote Worldwide)
GitHub: https://github.com | LinkedIn: https://linkedin.com

SUMMARY
Passionate Full-Stack Developer with 3+ years building responsive, high-performance web applications.
Specialized in modern JavaScript/TypeScript, React, Node.js, and clean architecture.

EXPERIENCE
• Senior Frontend Engineer | NovaTech Solutions (2024 - Present)
  - Led frontend architectural shift to Next.js & React 18, cutting load times by 38%.
• Full Stack Developer | HyperScale Digital (2022 - 2024)
  - Engineered microservices and client portals serving 100k+ active users.

EDUCATION
• B.S. in Computer Science (Honors) | State University of Technology (2018 - 2022)

KEY SKILLS
• Frontend: HTML5, CSS3, JavaScript ES6+, TypeScript, React, Next.js, Tailwind CSS
• Backend: Node.js, Express, Python, FastAPI, PostgreSQL, MongoDB, REST & GraphQL
• Tools: Git, GitHub Actions, Docker, CI/CD, Vite, Webpack
`;

      const blob = new Blob([cvContent], { type: 'text/plain;charset=utf-8' });
      const downloadUrl = URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.href = downloadUrl;
      tempLink.download = 'Amit_Solanki_Resume.txt';
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      URL.revokeObjectURL(downloadUrl);

      showToast('Resume summary downloaded! 📄', 'success');
    });
  }

  // =========================================================================
  // 11. Footer Current Year
  // =========================================================================
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // =========================================================================
  // 12. Toast Notification Helper
  // =========================================================================
  function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span><span>${escapeHTML(message)}</span>`;
    toastContainer.appendChild(toast);

    // Trigger reveal transition
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Automatically remove after 3.5 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3500);
  }

  // Simple HTML Escaper to protect alert and toast rendering
  function escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Global demo preview helper for project buttons
  window.demoAction = (event, projectTitle) => {
    event.preventDefault();
    showToast(`Launching ${projectTitle}... (Simulated local preview)`, 'info');
  };

  // Run initial scroll check
  handleScroll();
});
