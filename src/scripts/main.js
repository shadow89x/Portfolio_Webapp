/**
 * Main JavaScript File
 * 
 * This file contains the core functionality for the portfolio website including:
 * - Theme management (light/dark mode)
 * - Mobile navigation
 * - Scroll effects
 * - Accessibility features
 * - Performance optimizations
 * - GitHub integration
 * - Portfolio management
 * 
 * Architecture:
 * - Class-based organization
 * - Event-driven interactions
 * - Modular functionality
 * - Error handling
 * - Accessibility support
 */

// ========================================
// Theme Manager Class
// ========================================

class ThemeManager {
  constructor() {
    this.currentTheme = 'light';
    this.themeToggle = null;
    this.init();
  }
  
  /**
   * Initialize theme manager
   */
  init() {
    this.loadTheme();
    this.setupThemeToggle();
    this.applyTheme();
  }
  
  /**
   * Load theme from localStorage or system preference
   */
  loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    this.currentTheme = savedTheme || systemTheme;
  }
  
  /**
   * Setup theme toggle button
   */
  setupThemeToggle() {
    this.themeToggle = document.querySelector('.theme-toggle');
    
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
      
      // Update tooltip
      this.updateTooltip();
    }
  }
  
  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.saveTheme();
    this.applyTheme();
    this.updateTooltip();
  }
  
  /**
   * Save theme to localStorage
   */
  saveTheme() {
    localStorage.setItem('theme', this.currentTheme);
  }
  
  /**
   * Apply current theme to document
   */
  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.currentTheme);
    
    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', this.currentTheme === 'dark' ? '#1a1a1a' : '#ffffff');
    }
  }
  
  /**
   * Update tooltip text
   */
  updateTooltip() {
    if (this.themeToggle) {
      const nextTheme = this.currentTheme === 'light' ? 'dark' : 'light';
      this.themeToggle.setAttribute('data-tooltip', `Switch to ${nextTheme} mode`);
    }
  }
}

// ========================================
// Navigation Manager Class
// ========================================

class NavigationManager {
  constructor() {
    this.mobileMenuToggle = null;
    this.navMenu = null;
    this.isMenuOpen = false;
    this.init();
  }
  
  /**
   * Initialize navigation manager
   */
  init() {
    this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    this.navMenu = document.querySelector('.nav-menu');
    
    if (this.mobileMenuToggle && this.navMenu) {
      this.setupMobileMenu();
    }
    
    this.setupScrollEffects();
  }
  
  /**
   * Setup mobile menu functionality
   */
  setupMobileMenu() {
    this.mobileMenuToggle.addEventListener('click', () => {
      this.toggleMobileMenu();
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      if (this.isMenuOpen && 
          !this.mobileMenuToggle.contains(event.target) && 
          !this.navMenu.contains(event.target)) {
        this.closeMobileMenu();
      }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }
  
  /**
   * Toggle mobile menu
   */
  toggleMobileMenu() {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }
  
  /**
   * Open mobile menu
   */
  openMobileMenu() {
    this.isMenuOpen = true;
    this.mobileMenuToggle.setAttribute('aria-expanded', 'true');
    this.navMenu.classList.add('nav-menu-open');
    
    // Focus first menu item
    const firstMenuItem = this.navMenu.querySelector('.nav-link');
    if (firstMenuItem) {
      setTimeout(() => firstMenuItem.focus(), 100);
    }
  }
  
  /**
   * Close mobile menu
   */
  closeMobileMenu() {
    this.isMenuOpen = false;
    this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
    this.navMenu.classList.remove('nav-menu-open');
    
    // Return focus to toggle button
    this.mobileMenuToggle.focus();
  }
  
  /**
   * Setup scroll effects
   */
  setupScrollEffects() {
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    if (header) {
      window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for styling
        if (scrollTop > 10) {
          header.classList.add('header-scrolled');
        } else {
          header.classList.remove('header-scrolled');
        }
        
        // Hide/show header on scroll (optional)
        if (scrollTop > lastScrollTop && scrollTop > 100) {
          header.classList.add('header-hidden');
        } else {
          header.classList.remove('header-hidden');
        }
        
        lastScrollTop = scrollTop;
      });
    }
  }
}

// ========================================
// Performance Manager Class
// ========================================

class PerformanceManager {
  constructor() {
    this.init();
  }
  
  /**
   * Initialize performance optimizations
   */
  init() {
    this.setupLazyLoading();
    this.setupIntersectionObserver();
    this.setupPreloadHints();
  }
  
  /**
   * Setup lazy loading for images
   */
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });
      
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }
  
  /**
   * Setup intersection observer for animations
   */
  setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
      
      document.querySelectorAll('.animate-on-scroll').forEach(element => {
        animationObserver.observe(element);
      });
    }
  }
  
  /**
   * Setup preload hints for critical resources
   */
  setupPreloadHints() {
    // Preload critical CSS
    const criticalCSS = document.createElement('link');
    criticalCSS.rel = 'preload';
    criticalCSS.as = 'style';
    criticalCSS.href = '/src/styles/base/variables.css';
    document.head.appendChild(criticalCSS);
  }
}

// ========================================
// Accessibility Manager Class
// ========================================

class AccessibilityManager {
  constructor() {
    this.init();
  }
  
  /**
   * Initialize accessibility features
   */
  init() {
    this.setupSkipLinks();
    this.setupFocusManagement();
    this.setupKeyboardNavigation();
    this.setupAnnouncements();
  }
  
  /**
   * Setup skip links
   */
  setupSkipLinks() {
    const skipLinks = document.querySelectorAll('.skip-link');
    
    skipLinks.forEach(link => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
  
  /**
   * Setup focus management
   */
  setupFocusManagement() {
    // Trap focus in modals
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        const modal = document.querySelector('.modal[aria-hidden="false"]');
        if (modal) {
          const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];
          
          if (event.shiftKey) {
            if (document.activeElement === firstElement) {
              event.preventDefault();
              lastElement.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              event.preventDefault();
              firstElement.focus();
            }
          }
        }
      }
    });
  }
  
  /**
   * Setup keyboard navigation
   */
  setupKeyboardNavigation() {
    // Handle keyboard navigation for interactive elements
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        const target = event.target;
        
        if (target.classList.contains('nav-link') && target.getAttribute('aria-current') === 'page') {
          event.preventDefault();
        }
      }
    });
  }
  
  /**
   * Setup announcements for screen readers
   */
  setupAnnouncements() {
    // Create announcement region
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.id = 'announcement';
    document.body.appendChild(announcement);
  }
  
  /**
   * Announce message to screen readers
   */
  announce(message) {
    const announcement = document.getElementById('announcement');
    if (announcement) {
      announcement.textContent = message;
    }
  }
}

// ========================================
// Error Handler Class
// ========================================

class ErrorHandler {
  constructor() {
    this.init();
  }
  
  /**
   * Initialize error handling
   */
  init() {
    this.setupGlobalErrorHandling();
    this.setupUnhandledRejectionHandling();
  }
  
  /**
   * Setup global error handling
   */
  setupGlobalErrorHandling() {
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      this.handleError(event.error);
    });
  }
  
  /**
   * Setup unhandled promise rejection handling
   */
  setupUnhandledRejectionHandling() {
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.handleError(event.reason);
    });
  }
  
  /**
   * Handle errors
   */
  handleError(error) {
    // Log error
    console.error('Error occurred:', error);
    
    // Show user-friendly error message
    this.showErrorMessage('An unexpected error occurred. Please refresh the page and try again.');
  }
  
  /**
   * Show error message to user
   */
  showErrorMessage(message) {
    // Create error notification
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <svg class="notification-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        <span>${message}</span>
        <button class="notification-close" aria-label="Close notification">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(notification);
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 5000);
  }
}

// ========================================
// App Manager Class
// ========================================

class AppManager {
  constructor() {
    this.managers = {};
    this.init();
  }
  
  /**
   * Initialize all managers
   */
  init() {
    // Initialize core managers
    this.managers.theme = new ThemeManager();
    this.managers.navigation = new NavigationManager();
    this.managers.performance = new PerformanceManager();
    this.managers.accessibility = new AccessibilityManager();
    this.managers.error = new ErrorHandler();
    
    // Initialize page-specific managers based on current page
    this.initializePageManagers();
    
    // Setup global event listeners
    this.setupGlobalEvents();
  }
  
  /**
   * Initialize page-specific managers
   */
  initializePageManagers() {
    const currentPath = window.location.pathname;
    
    // Portfolio page
    if (currentPath.includes('/portfolio') || currentPath === '/') {
      // Portfolio manager will be initialized by portfolio.js
      console.log('Portfolio page detected');
    }
    
    // Contact page
    if (currentPath.includes('/contact')) {
      // Contact managers will be initialized by contact.js
      console.log('Contact page detected');
    }
    
    // GitHub integration (available on all pages)
    this.initializeGitHubIntegration();
  }
  
  /**
   * Initialize GitHub integration
   */
  initializeGitHubIntegration() {
    // Check if GitHub integration is available
    if (window.GitHubIntegrationManager) {
      const githubConfig = {
        username: 'your-github-username', // Replace with actual username
        token: null, // Add GitHub token for authenticated requests
        cacheTimeout: 5 * 60 * 1000 // 5 minutes
      };
      
      this.managers.github = new GitHubIntegrationManager(githubConfig);
      
      // Listen for GitHub data updates
      document.addEventListener('github-data-updated', (event) => {
        console.log('GitHub data updated:', event.detail);
        this.handleGitHubDataUpdate(event.detail);
      });
    }
  }
  
  /**
   * Handle GitHub data updates
   */
  handleGitHubDataUpdate(data) {
    // Update portfolio if on portfolio page
    if (window.portfolioManager) {
      window.portfolioManager.updateGitHubData(data);
    }
    
    // Update any other components that need GitHub data
    this.updateGitHubStats(data);
  }
  
  /**
   * Update GitHub statistics display
   */
  updateGitHubStats(data) {
    // Update stats in header or sidebar if they exist
    const statsElements = document.querySelectorAll('[data-github-stats]');
    
    statsElements.forEach(element => {
      const statType = element.dataset.githubStats;
      
      switch (statType) {
        case 'repos':
          element.textContent = data.repositories.length;
          break;
        case 'stars':
          element.textContent = data.stats.totalStars;
          break;
        case 'followers':
          element.textContent = data.profile.followers;
          break;
        default:
          break;
      }
    });
  }
  
  /**
   * Setup global event listeners
   */
  setupGlobalEvents() {
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.handlePageVisible();
      }
    });
    
    // Handle online/offline status
    window.addEventListener('online', () => {
      this.handleOnline();
    });
    
    window.addEventListener('offline', () => {
      this.handleOffline();
    });
  }
  
  /**
   * Handle page becoming visible
   */
  handlePageVisible() {
    // Refresh data if needed
    if (this.managers.github) {
      // Check if GitHub data is stale
      const lastUpdate = localStorage.getItem('github-last-update');
      const now = Date.now();
      
      if (!lastUpdate || (now - parseInt(lastUpdate)) > 300000) { // 5 minutes
        this.managers.github.refresh();
        localStorage.setItem('github-last-update', now.toString());
      }
    }
  }
  
  /**
   * Handle coming online
   */
  handleOnline() {
    console.log('Application is online');
    // Refresh data when coming back online
    this.handlePageVisible();
  }
  
  /**
   * Handle going offline
   */
  handleOffline() {
    console.log('Application is offline');
    // Show offline notification
    if (this.managers.accessibility) {
      this.managers.accessibility.announce('Application is now offline');
    }
  }
  
  /**
   * Get manager by name
   */
  getManager(name) {
    return this.managers[name];
  }
  
  /**
   * Get all managers
   */
  getAllManagers() {
    return this.managers;
  }
}

// ========================================
// Initialize Application
// ========================================

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Create main app manager
  window.appManager = new AppManager();
  
  // Make managers globally accessible for debugging
  window.themeManager = window.appManager.getManager('theme');
  window.navigationManager = window.appManager.getManager('navigation');
  window.performanceManager = window.appManager.getManager('performance');
  window.accessibilityManager = window.appManager.getManager('accessibility');
  window.errorHandler = window.appManager.getManager('error');
  
  console.log('Portfolio application initialized successfully');
});

// Export classes for potential use in other modules
window.ThemeManager = ThemeManager;
window.NavigationManager = NavigationManager;
window.PerformanceManager = PerformanceManager;
window.AccessibilityManager = AccessibilityManager;
window.ErrorHandler = ErrorHandler;
window.AppManager = AppManager;

// 네온 EXP/레벨 시스템
let exp = 400;
let level = 27;
let expMax = 1000;

function updateExpBar() {
  document.getElementById('exp-level').textContent = level;
  document.getElementById('exp-now').textContent = exp;
  document.getElementById('exp-max').textContent = expMax;
  document.getElementById('exp-bar-inner').style.width = (exp/expMax*100) + '%';
}

function gainExp(amount) {
  exp += amount;
  showExpFloat('+'+amount+' EXP!');
  if (exp >= expMax) {
    exp = exp - expMax;
    level++;
    showExpFloat('LEVEL UP!', true);
  }
  updateExpBar();
}

function showExpFloat(text, isLevelUp) {
  const container = document.getElementById('exp-float-container');
  const el = document.createElement('div');
  el.className = 'exp-float';
  el.textContent = text;
  if(isLevelUp) {
    el.style.color = '#ffe066';
    el.style.textShadow = '0 0 24px #ffe066, 0 0 8px #fff';
    el.style.fontSize = '1.5rem';
  }
  container.appendChild(el);
  setTimeout(()=>{ el.remove(); }, 1200);
}

// 스크롤 시 경험치 +1 (100px마다)
let lastScrollY = 0;
window.addEventListener('scroll', () => {
  const now = Math.floor(window.scrollY/100);
  if(now !== lastScrollY) {
    gainExp(1);
    lastScrollY = now;
  }
});

// 클릭 시 경험치 +5
window.addEventListener('click', (e) => {
  // 버튼/카드 등 주요 영역 클릭만 체크하려면 조건 추가 가능
  gainExp(5);
});

// 페이지 로드 시 경험치 +10
window.addEventListener('DOMContentLoaded', () => {
  updateExpBar();
  gainExp(10);
}); 

// ========================================
// Iframe Toggle Function
// ========================================

// Iframe Toggle Function
function toggleIframeView(projectId) {
  const description = document.getElementById(projectId + '-description');
  const iframe = document.getElementById(projectId + '-iframe');
  const button = event.target.closest('.iframe-control-btn');
  
  if (description && iframe && button) {
    if (description.style.display === 'none') {
      // Show description
      description.style.display = 'block';
      iframe.style.display = 'none';
      button.classList.remove('showing-iframe');
    } else {
      // Show iframe
      description.style.display = 'none';
      iframe.style.display = 'block';
      button.classList.add('showing-iframe');
    }
  }
} 