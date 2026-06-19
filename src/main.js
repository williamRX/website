import './style.css';

document.addEventListener('DOMContentLoaded', () => {
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

  // 3. Card-specific hover glows (Project cards and Certification card)
  const cards = document.querySelectorAll('.project-card, .cert-card');
  
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
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Reset classes
      formStatus.className = 'form-status-msg active';
      formStatus.textContent = 'Sending message...';
      
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
          formStatus.className = 'form-status-msg active success';
          formStatus.textContent = 'Message sent successfully! I will get back to you shortly.';
          contactForm.reset();
        } else {
          console.error(json);
          formStatus.className = 'form-status-msg active error';
          formStatus.textContent = json.message || 'Something went wrong. Please try again.';
        }
      })
      .catch((error) => {
        console.error(error);
        formStatus.className = 'form-status-msg active error';
        formStatus.textContent = 'Network error. Please try again later.';
      })
      .finally(() => {
        setTimeout(() => {
          formStatus.className = 'form-status-msg';
          formStatus.textContent = '';
        }, 5000);
      });
    });
  }
});
