import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  // Language Switcher Logic
  const langSwitchBtn = document.getElementById('lang-switch');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  const placeholderTranslations = {
    en: {
      name: "John Doe",
      email: "john@example.com",
      message: "Let's talk about machine learning..."
    },
    fr: {
      name: "John Doe",
      email: "john@example.com",
      message: "Discutons de machine learning..."
    }
  };

  const statusTranslations = {
    en: {
      sending: 'Sending message...',
      success: 'Message sent successfully! I will get back to you shortly.',
      invalidName: 'Please enter both your first and last name (e.g. John Doe).',
      invalidEmail: 'Please enter a valid email address (temporary domains are not allowed).',
      error: 'Something went wrong. Please try again.',
      networkError: 'Network error. Please try again later.'
    },
    fr: {
      sending: 'Envoi du message en cours...',
      success: 'Message envoyé avec succès ! Je vous répondrai rapidement.',
      invalidName: 'Veuillez saisir votre prénom et votre nom (ex: John Doe).',
      invalidEmail: 'Veuillez saisir une adresse email valide (les emails temporaires ne sont pas acceptés).',
      error: 'Une erreur est survenue. Veuillez réessayer.',
      networkError: 'Erreur réseau. Veuillez réessayer plus tard.'
    }
  };

  let currentLang = localStorage.getItem('portfolio-lang');
  if (!currentLang) {
    const userLang = navigator.language || navigator.userLanguage;
    currentLang = userLang.startsWith('fr') ? 'fr' : 'en';
  }

  function updateDynamicTexts() {
    if (nameInput) nameInput.placeholder = placeholderTranslations[currentLang].name;
    if (emailInput) emailInput.placeholder = placeholderTranslations[currentLang].email;
    if (messageInput) messageInput.placeholder = placeholderTranslations[currentLang].message;
  }

  document.body.classList.add(`lang-${currentLang}`);
  updateDynamicTexts();
  
  if (langSwitchBtn) {
    langSwitchBtn.addEventListener('click', () => {
      document.body.classList.remove(`lang-${currentLang}`);
      currentLang = currentLang === 'en' ? 'fr' : 'en';
      document.body.classList.add(`lang-${currentLang}`);
      localStorage.setItem('portfolio-lang', currentLang);
      updateDynamicTexts();
    });
  }

  // 1. Set current year in footer
  const currentYearEl = document.getElementById('current-year');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear().toString();
  }

  // 2. Mouse Tracking Spotlight Effect
  const spotlightBg = document.getElementById('spotlight-bg');
  
  window.addEventListener('mousemove', (e) => {
    const x = ((e.clientX / window.innerWidth) * 100).toFixed(2);
    const y = ((e.clientY / window.innerHeight) * 100).toFixed(2);
    
    document.documentElement.style.setProperty('--mouse-x', `${x}%`);
    document.documentElement.style.setProperty('--mouse-y', `${y}%`);
  });

  // 3. Card-specific hover glows (Project cards, Certification card, Stack card)
  const cards = document.querySelectorAll('.project-card, .cert-card, .stack-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--card-mouse-x', `${x}px`);
      card.style.setProperty('--card-mouse-y', `${y}px`);
    });
  });

  // 4. Scroll Reveal Intersection Observer
  const revealElements = document.querySelectorAll('.section-reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Once revealed, no need to track again
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // 5. Active Navbar Link Highlighting on Scroll
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  const activeSectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    threshold: 0.5,
    rootMargin: '-20% 0px -60% 0px' // Focus observer center range of screen
  });

  sections.forEach(section => {
    activeSectionObserver.observe(section);
  });

  // 6. Smooth Scrolling for Navigation Links with Offset
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      if (targetId === '#') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        return;
      }
      
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        const offsetTop = targetSection.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // 7. AJAX Contact Form Submission
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  
  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (nameInput) {
        const nameValue = nameInput.value.trim();
        const nameParts = nameValue.split(/\s+/).filter(part => part.length >= 2);
        if (nameParts.length < 2) {
          formStatus.className = 'form-status-msg active error';
          formStatus.textContent = statusTranslations[currentLang].invalidName;
          nameInput.focus();
          return;
        }
      }

      // Disable submit button to prevent click spamming
      const submitBtn = contactForm.querySelector('.btn-submit');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.6';
        submitBtn.style.cursor = 'not-allowed';
      }

      if (emailInput) {
        const emailValue = emailInput.value.trim().toLowerCase();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const blockedDomains = [
          'yopmail.com', 'yopmail.fr', 'yopmail.net', 'cool.fr.nf', 'jetable.fr.nf', 
          'courriel.fr.nf', 'moncourrier.fr.nf', 'monemail.fr.nf', 'monmail.fr.nf', 
          'nomail.xl.cx', 'mega.zippy.co.uk', 'speed.1s.fr', 'angry.im', 
          'mailinator.com', 'tempmail.com', 'guerrillamail.com', 'sharklasers.com', 
          '10minutemail.com', 'trashmail.com', 'dispostable.com', 'getairmail.com', 
          'throwawaymail.com', 'temp-mail.org', 'temp-mail.ru', 'tempmail.net'
        ];
        
        const parts = emailValue.split('@');
        if (parts.length !== 2 || !emailRegex.test(emailValue) || blockedDomains.includes(parts[1])) {
          formStatus.className = 'form-status-msg active error';
          formStatus.textContent = statusTranslations[currentLang].invalidEmail;
          emailInput.focus();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '';
            submitBtn.style.cursor = '';
          }
          return;
        }

        const domain = parts[1];

        // Show verifying status
        formStatus.className = 'form-status-msg active';
        formStatus.textContent = currentLang === 'fr' ? 'Vérification de l\'adresse email...' : 'Verifying email address...';

        // Perform DNS check for MX records
        try {
          const dnsResponse = await fetch(`https://cloudflare-dns.com/dns-query?name=${domain}&type=MX`, {
            headers: {
              'Accept': 'application/dns-json'
            }
          });
          const dnsJson = await dnsResponse.json();
          
          if (dnsJson.Status === 3 || !dnsJson.Answer || dnsJson.Answer.length === 0) {
            formStatus.className = 'form-status-msg active error';
            formStatus.textContent = statusTranslations[currentLang].invalidEmail;
            emailInput.focus();
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.style.opacity = '';
              submitBtn.style.cursor = '';
            }
            return;
          }
        } catch (dnsErr) {
          console.warn("DNS check failed, passing validation to prevent blocking legitimate requests:", dnsErr);
        }
      }

      // Reset classes
      formStatus.className = 'form-status-msg active';
      formStatus.textContent = statusTranslations[currentLang].sending;
      
      const formData = new FormData(contactForm);
      
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(formData))
      })
      .then(async (response) => {
        const json = await response.json();
        if (response.status === 200) {
          formStatus.className = 'form-status-msg';
          formStatus.textContent = '';
          contactForm.reset();
          
          // Show Success Modal
          const successModal = document.getElementById('success-modal');
          if (successModal) {
            document.body.classList.add('modal-open');
            successModal.classList.add('active');
            successModal.setAttribute('aria-hidden', 'false');
          }
        } else {
          console.error(json);
          formStatus.className = 'form-status-msg active error';
          formStatus.textContent = json.message || statusTranslations[currentLang].error;
        }
      })
      .catch((error) => {
        console.error(error);
        formStatus.className = 'form-status-msg active error';
        formStatus.textContent = statusTranslations[currentLang].networkError;
      })
      .finally(() => {
        // Re-enable submit button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '';
          submitBtn.style.cursor = '';
        }
        
        setTimeout(() => {
          if (!formStatus.classList.contains('error')) {
            formStatus.className = 'form-status-msg';
            formStatus.textContent = '';
          }
        }, 5000);
      });
    });
  }

  // 8. Project Details Modal Implementation
  const projectModal = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-project-content');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const projectCardWrappers = document.querySelectorAll('.project-card-wrapper');

  // Inject "Learn More / En savoir plus" link to all project cards dynamically
  projectCardWrappers.forEach(wrapper => {
    const cardContent = wrapper.querySelector('.project-card-content');
    if (cardContent) {
      const learnMore = document.createElement('div');
      learnMore.className = 'project-learn-more';
      learnMore.innerHTML = `
        <span class="lang-en">Learn more &rarr;</span>
        <span class="lang-fr">En savoir plus &rarr;</span>
      `;
      cardContent.appendChild(learnMore);
    }
  });

  function openProjectModal(wrapper) {
    if (!projectModal || !modalContent) return;

    // Get card content elements
    const header = wrapper.querySelector('.project-header');
    const desc = wrapper.querySelector('.project-desc');
    const tags = wrapper.querySelector('.project-tags');

    // Clear previous modal content
    modalContent.innerHTML = '';

    // Create a container to hold cloned content
    const container = document.createElement('div');
    container.className = 'modal-project-details';

    // Clone header, description, and tags
    if (header) {
      const clonedHeader = header.cloneNode(true);
      container.appendChild(clonedHeader);
    }
    if (desc) {
      const clonedDesc = desc.cloneNode(true);
      container.appendChild(clonedDesc);
    }
    if (tags) {
      const clonedTags = tags.cloneNode(true);
      container.appendChild(clonedTags);
    }

    modalContent.appendChild(container);

    // Open modal
    document.body.classList.add('modal-open');
    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
  }

  function closeProjectModal() {
    if (!projectModal) return;
    document.body.classList.remove('modal-open');
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
  }

  // Bind click event on each card
  projectCardWrappers.forEach(wrapper => {
    wrapper.addEventListener('click', () => {
      openProjectModal(wrapper);
    });

    // Prevent modal from opening when clicking directly on the GitHub link
    const githubLink = wrapper.querySelector('.project-header-link');
    if (githubLink) {
      githubLink.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  });

  // Bind close events
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeProjectModal);
  }

  // Success Modal close handlers
  const successModal = document.getElementById('success-modal');
  const successCloseBtn = document.getElementById('success-modal-close-btn');
  const successBackdrop = document.getElementById('success-modal-backdrop');
  const successBtn = document.getElementById('success-modal-btn');

  function closeSuccessModal() {
    if (!successModal) return;
    document.body.classList.remove('modal-open');
    successModal.classList.remove('active');
    successModal.setAttribute('aria-hidden', 'true');
  }

  if (successCloseBtn) {
    successCloseBtn.addEventListener('click', closeSuccessModal);
  }
  if (successBackdrop) {
    successBackdrop.addEventListener('click', closeSuccessModal);
  }
  if (successBtn) {
    successBtn.addEventListener('click', closeSuccessModal);
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (projectModal && projectModal.classList.contains('active')) {
        closeProjectModal();
      }
      if (successModal && successModal.classList.contains('active')) {
        closeSuccessModal();
      }
    }
  });

});

