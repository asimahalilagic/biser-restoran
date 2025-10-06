// ===== CAROUSEL =====
class LuxuryCarousel {
  constructor() {
    this.currentSlide = 0;
    this.totalSlides = 6;
    this.slides = document.querySelector('.carousel-slides');
    this.dots = document.querySelectorAll('.carousel-dot');
    this.prevBtn = document.querySelector('.carousel-prev');
    this.nextBtn = document.querySelector('.carousel-next');
    this.container = document.querySelector('.carousel-container');
    this.autoplayInterval = null;
    this.isTransitioning = false;
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateCarousel();
    this.startAutoplay();
  }

  bindEvents() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prevSlide());
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.nextSlide());
    }

    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });

    if (this.container) {
      this.container.addEventListener('mouseenter', () => this.stopAutoplay());
      this.container.addEventListener('mouseleave', () => this.startAutoplay());
    }
  }

  updateCarousel() {
    if (this.isTransitioning || !this.slides) return;
    
    this.isTransitioning = true;
    
    const movePercent = this.currentSlide * (100 / 6);
    this.slides.style.transform = `translateX(-${movePercent}%)`;

    const allSlides = document.querySelectorAll('.carousel-slide');
    allSlides.forEach((slide, index) => {
      slide.classList.toggle('active', index === this.currentSlide);
    });

    this.dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentSlide);
    });

    setTimeout(() => {
      this.isTransitioning = false;
    }, 800);
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.updateCarousel();
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.updateCarousel();
  }

  goToSlide(index) {
    if (index === this.currentSlide || index >= this.totalSlides || index < 0) return;
    this.currentSlide = index;
    this.updateCarousel();
  }

  startAutoplay() {
    this.stopAutoplay();
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, 4000);
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }
}

// ===== GALLERY LIGHTBOX =====
class LuxuryGallery {
  constructor() {
    this.currentImageIndex = 0;
    this.images = [];
    this.lightbox = null;
    this.lightboxImage = null;
    this.lightboxInfo = null;
    this.lightboxCounter = null;
    this.isOpen = false;
    
    this.init();
  }

  init() {
    this.createLightbox();
    this.bindEvents();
    this.setupKeyboardNavigation();
  }

  createLightbox() {
    const lightboxHTML = `
      <div class="lightbox" id="lightbox">
        <div class="lightbox-content">
          <div class="lightbox-loading"></div>
          <img class="lightbox-image" src="" alt="" />
          <button class="lightbox-close" aria-label="Zatvori galeriju">&times;</button>
          <button class="lightbox-nav lightbox-prev" aria-label="Prethodna slika">&#8249;</button>
          <button class="lightbox-nav lightbox-next" aria-label="Sledeća slika">&#8250;</button>
          <div class="lightbox-counter"></div>
          <div class="lightbox-info">
            <h3></h3>
            <p></p>
          </div>
          <div class="lightbox-hint">Koristite strelice za navigaciju ili ESC za zatvaranje</div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    
    this.lightbox = document.getElementById('lightbox');
    this.lightboxImage = this.lightbox.querySelector('.lightbox-image');
    this.lightboxInfo = this.lightbox.querySelector('.lightbox-info');
    this.lightboxCounter = this.lightbox.querySelector('.lightbox-counter');
    this.loadingSpinner = this.lightbox.querySelector('.lightbox-loading');
  }

  bindEvents() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-title')?.textContent || '';
      const description = item.querySelector('.gallery-description')?.textContent || '';
      
      this.images.push({
        src: img.src,
        alt: img.alt,
        title: title,
        description: description
      });
      
      item.addEventListener('click', (e) => {
        e.preventDefault();
        this.openLightbox(index);
      });
    });

    this.lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
      this.closeLightbox();
    });

    this.lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
      this.previousImage();
    });

    this.lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
      this.nextImage();
    });

    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) {
        this.closeLightbox();
      }
    });

    this.lightboxImage.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (!this.isOpen) return;
      
      switch(e.key) {
        case 'Escape':
          this.closeLightbox();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          this.previousImage();
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.nextImage();
          break;
      }
    });
  }

  openLightbox(index) {
    if (this.images.length === 0) return;
    
    this.currentImageIndex = index;
    this.isOpen = true;
    
    document.body.style.overflow = 'hidden';
    this.lightbox.classList.add('active');
    this.loadImage();
  }

  closeLightbox() {
    this.isOpen = false;
    document.body.style.overflow = '';
    this.lightbox.style.opacity = '0';
    
    setTimeout(() => {
      this.lightbox.classList.remove('active');
      this.lightbox.style.opacity = '';
    }, 300);
  }

  loadImage() {
    if (this.images.length === 0) return;
    
    const currentImage = this.images[this.currentImageIndex];
    
    this.loadingSpinner.style.display = 'block';
    this.lightboxImage.style.opacity = '0';
    
    const img = new Image();
    
    img.onload = () => {
      this.loadingSpinner.style.display = 'none';
      this.lightboxImage.src = currentImage.src;
      this.lightboxImage.alt = currentImage.alt;
      this.lightboxImage.style.opacity = '1';
      this.updateInfo();
      this.updateCounter();
    };
    
    img.src = currentImage.src;
  }

  updateInfo() {
    const currentImage = this.images[this.currentImageIndex];
    const titleElement = this.lightboxInfo.querySelector('h3');
    const descriptionElement = this.lightboxInfo.querySelector('p');
    
    titleElement.textContent = currentImage.title;
    descriptionElement.textContent = currentImage.description;
    
    if (!currentImage.title && !currentImage.description) {
      this.lightboxInfo.style.display = 'none';
    } else {
      this.lightboxInfo.style.display = 'block';
    }
  }

  updateCounter() {
    this.lightboxCounter.textContent = `${this.currentImageIndex + 1} / ${this.images.length}`;
  }

  nextImage() {
    if (this.images.length <= 1) return;
    
    this.lightboxImage.classList.add('changing');
    
    setTimeout(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
      this.loadImage();
      this.lightboxImage.classList.remove('changing');
    }, 200);
  }

  previousImage() {
    if (this.images.length <= 1) return;
    
    this.lightboxImage.classList.add('changing');
    
    setTimeout(() => {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
      this.loadImage();
      this.lightboxImage.classList.remove('changing');
    }, 200);
  }
}

// ===== RESERVATION FORM (AJAX) =====
document.addEventListener('DOMContentLoaded', function() {
  const reservationForm = document.getElementById('reservationForm');
  
  if (reservationForm) {
    reservationForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const data = Object.fromEntries(formData.entries());
      
      const submitBtn = this.querySelector('.form-submit');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Šalje se...</span>';
      submitBtn.style.opacity = '0.7';
      
      try {
        const response = await fetch('/reservation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
          showNotification('Rezervacija primljena! Hvala što ste nas kontaktirali.', 'success');
          this.reset();
        } else {
          showNotification('Došlo je do greške. Molimo pokušajte ponovo.', 'error');
        }
      } catch (error) {
        console.error('Greška:', error);
        showNotification('Došlo je do greške pri slanju rezervacije.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        submitBtn.style.opacity = '1';
      }
    });
  }
});

// ===== CONTACT FORM (AJAX) =====
let formSubmitted = false;

document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const data = Object.fromEntries(formData.entries());
      
      clearFormValidation();
      
      let isValid = validateContactForm(this, data);
      
      if (!isValid) {
        formSubmitted = true;
        enableRealTimeValidation();
        showNotification('Molimo popunite sva obavezna polja ispravno.', 'error');
        
        const firstInvalid = this.querySelector('.invalid');
        if (firstInvalid) {
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstInvalid.focus();
        }
        return;
      }
      
      const submitBtn = this.querySelector('.form-submit');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Šalje se...</span>';
      submitBtn.style.opacity = '0.7';
      
      try {
        const response = await fetch('/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok) {
          showNotification('Hvala vam! Vaša poruka je uspješno poslana. Kontaktiraćemo vas uskoro.', 'success');
          this.reset();
          clearFormValidation();
          formSubmitted = true;
          enableRealTimeValidation();
        } else {
          showNotification('Došlo je do greške. Molimo pokušajte ponovo.', 'error');
        }
      } catch (error) {
        console.error('Greška:', error);
        showNotification('Došlo je do greške pri slanju poruke.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        submitBtn.style.opacity = '1';
      }
    });
    
    initFormValidation();
  }
  
  initInteractiveFeatures();
});

function validateContactForm(form, data) {
  let isValid = true;
  
  const nameField = form.querySelector('#name');
  const phoneField = form.querySelector('#phone');
  const emailField = form.querySelector('#email');
  const messageField = form.querySelector('#message');
  
  if (!data.name) {
    nameField.classList.add('invalid');
    isValid = false;
  } else {
    nameField.classList.add('valid');
  }
  
  if (!data.phone) {
    phoneField.classList.add('invalid');
    isValid = false;
  } else if (!/^[\+]?[0-9\s\-\(\)]{8,}$/.test(data.phone)) {
    phoneField.classList.add('invalid');
    isValid = false;
  } else {
    phoneField.classList.add('valid');
  }
  
  if (!data.email) {
    emailField.classList.add('invalid');
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    emailField.classList.add('invalid');
    isValid = false;
  } else {
    emailField.classList.add('valid');
  }
  
  if (!data.message) {
    messageField.classList.add('invalid');
    isValid = false;
  } else {
    messageField.classList.add('valid');
  }
  
  return isValid;
}

function showNotification(text, type) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span>${type === 'success' ? '✓' : '✕'}</span>
      <p>${text}</p>
    </div>
  `;
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : '#ef4444'};
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    z-index: 10000;
    animation: slideIn 0.3s ease;
    max-width: 400px;
  `;
  
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
      .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .notification-content span {
        font-size: 24px;
        font-weight: bold;
      }
      .notification-content p {
        margin: 0;
        font-size: 14px;
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 5000);
}

function initFormValidation() {
  const inputs = document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea');
  
  inputs.forEach(input => {
    input.addEventListener('input', clearValidation);
  });
}

function validateField(e) {
  const field = e.target;
  const value = field.value.trim();
  
  field.classList.remove('valid', 'invalid');
  
  if (field.hasAttribute('required') && !value) {
    field.classList.add('invalid');
    return;
  }
  
  if (field.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      field.classList.add('invalid');
      return;
    }
  }
  
  if (field.type === 'tel' && value) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
    if (!phoneRegex.test(value)) {
      field.classList.add('invalid');
      return;
    }
  }
  
  if (value) {
    field.classList.add('valid');
  }
}

function clearValidation(e) {
  if (formSubmitted) {
    e.target.classList.remove('invalid');
    
    if (e.target.value.trim()) {
      validateField(e);
    }
  }
}

function enableRealTimeValidation() {
  const inputs = document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea');
  
  inputs.forEach(input => {
    input.removeEventListener('blur', validateField);
    input.removeEventListener('input', handleInput);
    
    input.addEventListener('blur', validateField);
    input.addEventListener('input', handleInput);
  });
}

function handleInput(e) {
  if (formSubmitted) {
    e.target.classList.remove('invalid');
    
    clearTimeout(e.target.validationTimeout);
    e.target.validationTimeout = setTimeout(() => {
      validateField(e);
    }, 500);
  }
}

function clearFormValidation() {
  const inputs = document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea');
  inputs.forEach(input => {
    input.classList.remove('valid', 'invalid');
  });
}

function initInteractiveFeatures() {
  initSmoothScrolling();
  initContactMethodEffects();
  initMapInteraction();
}

function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

function initContactMethodEffects() {
  const contactMethods = document.querySelectorAll('.contact-method');
  
  contactMethods.forEach(method => {
    method.addEventListener('mouseenter', function() {
      this.style.transform = 'translateX(10px)';
    });
    
    method.addEventListener('mouseleave', function() {
      this.style.transform = 'translateX(0)';
    });
  });
}

function initMapInteraction() {
  const mapIframe = document.querySelector('.map-embed iframe');
  if (mapIframe) {
    mapIframe.addEventListener('load', function() {
      this.style.filter = 'grayscale(30%) contrast(1.1)';
    });
  }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  // Carousel
  const carouselContainer = document.querySelector('.carousel-container');
  if (carouselContainer) {
    const carousel = new LuxuryCarousel();
    window.weddingCarousel = carousel;
  }
  
  // Gallery
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length > 0) {
    const gallery = new LuxuryGallery();
    window.luxuryGallery = gallery;
  }
  
  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);
  
  const sectionsToObserve = document.querySelectorAll('.contact-info, .contact-form-section, .hours-item, .map-container');
  sectionsToObserve.forEach(section => {
    observer.observe(section);
  });
});
// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('nav');
  const body = document.body;
  
  if (!menuToggle) return; // Izlaz ako ne postoji hamburger button
  
  // Kreiraj overlay
  const overlay = document.createElement('div');
  overlay.className = 'mobile-menu-overlay';
  body.appendChild(overlay);
  
  // Kloniraj navigaciju za mobile
  const mobileNav = nav.cloneNode(true);
  mobileNav.classList.add('mobile-menu');
  body.appendChild(mobileNav);
  
  // Toggle funkcija
  function toggleMenu() {
    menuToggle.classList.toggle('active');
    mobileNav.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Spriječi scrolling kada je menu otvoren
    if (mobileNav.classList.contains('active')) {
      body.style.overflow = 'hidden';
      overlay.style.display = 'block';
    } else {
      body.style.overflow = '';
      overlay.style.display = 'none';
    }
  }
  
  // Event listeners
  menuToggle.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);
  
  // Zatvori menu kada se klikne na link
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function() {
      toggleMenu();
    });
  });
});