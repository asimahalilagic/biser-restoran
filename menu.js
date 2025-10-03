// Menu Navigation Functionality - Luxury Restaurant Biser
class LuxuryMenu {
  constructor() {
    this.navButtons = document.querySelectorAll('.menu-nav-btn');
    this.dropdownLinks = document.querySelectorAll('.dropdown-menu a');
    this.dropdownBtns = document.querySelectorAll('.dropdown-btn');
    this.menuCategories = document.querySelectorAll('.menu-category');
    this.menuItems = document.querySelectorAll('.menu-item');
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.addScrollEffects();
    this.addItemAnimations();
    this.setupDropdowns();
  }

  setupDropdowns() {
    // Handle dropdown functionality
    this.dropdownBtns.forEach(btn => {
      const dropdown = btn.nextElementSibling;
      
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Close other dropdowns
        this.dropdownBtns.forEach(otherBtn => {
          if (otherBtn !== btn) {
            otherBtn.nextElementSibling.style.display = 'none';
            otherBtn.classList.remove('dropdown-open');
          }
        });
        
        // Toggle current dropdown
        if (dropdown.style.display === 'block') {
          dropdown.style.display = 'none';
          btn.classList.remove('dropdown-open');
        } else {
          dropdown.style.display = 'block';
          btn.classList.add('dropdown-open');
        }
      });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown')) {
        this.dropdownBtns.forEach(btn => {
          btn.nextElementSibling.style.display = 'none';
          btn.classList.remove('dropdown-open');
        });
      }
    });
  }

  bindEvents() {
    // Main category navigation buttons
    this.navButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const category = e.target.dataset.category;
        if (category) {
          this.filterMenu(category);
          this.setActiveButton(e.target);
        }
      });
    });

    // Dropdown links
    this.dropdownLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = e.target.dataset.category;
        if (category) {
          this.filterMenu(category);
          this.setActiveDropdownLink(e.target);
          // Close dropdown after selection
          e.target.closest('.dropdown-menu').style.display = 'none';
          e.target.closest('.dropdown').querySelector('.dropdown-btn').classList.remove('dropdown-open');
        }
      });
    });

    // Smooth scroll for menu navigation
    document.addEventListener('DOMContentLoaded', () => {
      this.smoothScrollToMenu();
    });
  }

  filterMenu(category) {
    // Handle special cases for grouped categories
    const categoryMappings = {
      'predjela': ['hladna-predjela', 'topla-predjela', 'juhe-corbe'],
      'glavna-jela': ['rostilj', 'po-narudzbi', 'riblji', 'planstek', 'biftek', 'pecenja'],
      'salate': ['salate-kao-jela', 'salate-kao-predjela'],
      'dodaci': ['prilozi', 'pogacice', 'peciva'],
      'pica': ['topli-napici', 'negazirani', 'gazirani', 'pivo', 'vina', 'likeri', 'zestoka']
    };

    this.menuCategories.forEach(categoryElement => {
      const categoryData = categoryElement.dataset.category;
      let shouldShow = false;

      if (category === 'all') {
        shouldShow = true;
      } else if (categoryData === category) {
        shouldShow = true;
      } else if (categoryMappings[category] && categoryMappings[category].includes(categoryData)) {
        shouldShow = true;
      }

      if (shouldShow) {
        // Show category with fade in animation
        categoryElement.classList.remove('hidden');
        categoryElement.style.display = 'block';
        categoryElement.style.opacity = '0';
        categoryElement.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
          categoryElement.style.opacity = '1';
          categoryElement.style.transform = 'translateY(0)';
        }, 100);
      } else {
        // Hide category with fade out animation
        categoryElement.style.opacity = '0';
        categoryElement.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
          categoryElement.classList.add('hidden');
          categoryElement.style.display = 'none';
        }, 300);
      }
    });

    // Add staggered animation to menu items
    setTimeout(() => {
      this.animateMenuItems();
    }, 150);
  }

  setActiveButton(activeButton) {
    // Remove active class from all buttons and dropdown links
    this.navButtons.forEach(button => {
      button.classList.remove('active');
    });
    this.dropdownLinks.forEach(link => {
      link.classList.remove('active');
    });

    // Add active class to clicked button
    activeButton.classList.add('active');

    // Add ripple effect
    this.addRippleEffect(activeButton);
  }

  setActiveDropdownLink(activeLink) {
    // Remove active class from all buttons and dropdown links
    this.navButtons.forEach(button => {
      button.classList.remove('active');
    });
    this.dropdownLinks.forEach(link => {
      link.classList.remove('active');
    });

    // Add active class to clicked link
    activeLink.classList.add('active');
    
    // Also make parent dropdown button appear active
    const parentDropdown = activeLink.closest('.dropdown').querySelector('.dropdown-btn');
    parentDropdown.classList.add('active');
  }

  addRippleEffect(element) {
    // Create ripple element
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    
    // Style the ripple
    ripple.style.position = 'absolute';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.background = 'rgba(255,255,255,0.6)';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple-effect 0.6s ease-out';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.marginLeft = '-10px';
    ripple.style.marginTop = '-10px';
    
    // Add ripple to element
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }

  animateMenuItems() {
    const visibleItems = document.querySelectorAll('.menu-category:not(.hidden) .menu-item');
    
    visibleItems.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        item.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, index * 50); // Faster animation for better UX
    });
  }

  addScrollEffects() {
    // Add intersection observer for scroll animations
    if ('IntersectionObserver' in window) {
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

      // Observe menu categories
      this.menuCategories.forEach(category => {
        observer.observe(category);
      });
    }
  }

  addItemAnimations() {
    // Add hover effects to menu items
    this.menuItems.forEach(item => {
      // Mouse enter effect
      item.addEventListener('mouseenter', () => {
        const price = item.querySelector('.price');
        if (price) {
          price.style.transform = 'scale(1.1)';
          price.style.textShadow = '0 0 10px rgba(212, 175, 55, 0.6)';
        }

        // Add glow effect to featured items
        if (item.classList.contains('featured')) {
          item.style.boxShadow = '0 15px 40px rgba(212, 175, 55, 0.4)';
        }
      });

      // Mouse leave effect
      item.addEventListener('mouseleave', () => {
        const price = item.querySelector('.price');
        if (price) {
          price.style.transform = 'scale(1)';
          price.style.textShadow = '0 1px 3px rgba(212, 175, 55, 0.3)';
        }

        if (item.classList.contains('featured')) {
          item.style.boxShadow = '0 15px 40px rgba(212, 175, 55, 0.2)';
        }
      });
    });
  }

  smoothScrollToMenu() {
    // If URL contains hash, scroll to that section
    if (window.location.hash) {
      const targetCategory = window.location.hash.substring(1);
      const targetButton = document.querySelector(`[data-category="${targetCategory}"]`);
      
      if (targetButton) {
        setTimeout(() => {
          targetButton.click();
          document.querySelector('.menu-content').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }, 500);
      }
    }
  }

  // Method to highlight search results (for future search functionality)
  highlightItems(searchTerm) {
    this.menuItems.forEach(item => {
      const title = item.querySelector('h4').textContent.toLowerCase();
      const description = item.querySelector('.description').textContent.toLowerCase();
      
      if (title.includes(searchTerm.toLowerCase()) || description.includes(searchTerm.toLowerCase())) {
        item.style.background = 'linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(255, 255, 255, 0.9))';
        item.style.border = '2px solid var(--gold-primary)';
      } else {
        item.style.background = '';
        item.style.border = '';
      }
    });
  }

  // Method to reset highlights
  resetHighlights() {
    this.menuItems.forEach(item => {
      if (!item.classList.contains('featured')) {
        item.style.background = '';
        item.style.border = '';
      }
    });
  }
}

// Add CSS animations and dropdown styles dynamically
const addMenuAnimations = () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple-effect {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    .menu-category {
      transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .menu-category.animate-in {
      animation: slideInUp 0.8s ease-out;
    }
    
    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(50px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .menu-item {
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    /* Dropdown Menu Styles */
    .dropdown {
      position: relative;
    }
    
    .dropdown-menu {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      background: var(--deep-black);
      border: 1px solid var(--gold-primary);
      border-radius: 8px;
      padding: 10px 0;
      box-shadow: 0 8px 25px rgba(0,0,0,0.3);
      z-index: 1000;
      min-width: 200px;
    }
    
    .dropdown-menu a {
      display: block;
      padding: 10px 20px;
      color: white;
      text-decoration: none;
      font-size: 14px;
      transition: all 0.3s ease;
      border-left: 3px solid transparent;
    }
    
    .dropdown-menu a:hover,
    .dropdown-menu a.active {
      background: var(--gold-primary);
      color: var(--deep-black);
      border-left-color: var(--gold-accent);
      transform: translateX(5px);
    }
    
    .dropdown-arrow {
      margin-left: 5px;
      transition: transform 0.3s ease;
      font-size: 12px;
    }
    
    .dropdown-btn.dropdown-open .dropdown-arrow {
      transform: rotate(180deg);
    }
    
    .dropdown-btn.active {
      background: var(--gold-primary);
      color: var(--deep-black);
    }
    
    /* Mobile dropdown adjustments */
    @media (max-width: 768px) {
      .dropdown-menu {
        position: static;
        box-shadow: none;
        border: none;
        background: rgba(0,0,0,0.1);
        margin-top: 10px;
      }
    }
  `;
  document.head.appendChild(style);
};

// Initialize menu functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Add animations and styles
  addMenuAnimations();
  
  // Initialize menu
  const menu = new LuxuryMenu();
  
  // Make menu globally accessible
  window.luxuryMenu = menu;
  
  // Add loading animation
  setTimeout(() => {
    document.querySelectorAll('.menu-category').forEach((category, index) => {
      setTimeout(() => {
        category.classList.add('animate-in');
      }, index * 200);
    });
  }, 300);
});