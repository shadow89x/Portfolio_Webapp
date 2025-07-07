/**
 * Contact Page JavaScript
 * 
 * This module handles all contact page functionality including:
 * - Form validation and submission
 * - FAQ accordion functionality
 * - Success modal management
 * - Form state management
 * - Accessibility features
 * 
 * Architecture:
 * - Class-based organization
 * - Event-driven interactions
 * - Modular functionality
 * - Error handling
 * - Accessibility support
 */

// ========================================
// Contact Form Manager Class
// ========================================

class ContactFormManager {
  constructor() {
    this.form = null;
    this.isSubmitting = false;
    this.validationRules = {
      name: {
        required: true,
        minLength: 2,
        maxLength: 50
      },
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      },
      subject: {
        required: true
      },
      message: {
        required: true,
        minLength: 10,
        maxLength: 1000
      }
    };
    
    this.init();
  }
  
  /**
   * Initialize the contact form manager
   */
  init() {
    this.form = document.getElementById('contact-form');
    if (this.form) {
      this.bindFormEvents();
      this.setupFormValidation();
    }
    
    this.setupFAQAccordion();
    this.setupSuccessModal();
  }
  
  /**
   * Bind form event listeners
   */
  bindFormEvents() {
    // Form submission
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    
    // Real-time validation
    this.form.addEventListener('input', this.debounce(this.handleInputValidation.bind(this), 300));
    this.form.addEventListener('blur', this.handleBlurValidation.bind(this), true);
    
    // Form reset
    this.form.addEventListener('reset', this.handleReset.bind(this));
  }
  
  /**
   * Setup form validation
   */
  setupFormValidation() {
    // Add ARIA attributes for accessibility
    const inputs = this.form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      const fieldName = input.name;
      const rules = this.validationRules[fieldName];
      
      if (rules) {
        if (rules.required) {
          input.setAttribute('aria-required', 'true');
        }
        
        if (rules.minLength) {
          input.setAttribute('aria-describedby', `${fieldName}-error`);
        }
      }
    });
  }
  
  /**
   * Handle form submission
   */
  async handleSubmit(event) {
    event.preventDefault();
    
    if (this.isSubmitting) return;
    
    // Validate all fields
    const isValid = this.validateAllFields();
    if (!isValid) {
      this.focusFirstError();
      return;
    }
    
    this.setSubmitting(true);
    
    try {
      const formData = this.getFormData();
      await this.submitForm(formData);
      this.showSuccessModal();
      this.resetForm();
    } catch (error) {
      console.error('Form submission error:', error);
      this.showError('Failed to send message. Please try again later.');
    } finally {
      this.setSubmitting(false);
    }
  }
  
  /**
   * Get form data
   */
  getFormData() {
    const formData = new FormData(this.form);
    const data = {};
    
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }
    
    return data;
  }
  
  /**
   * Submit form data
   */
  async submitForm(data) {
    // In a real implementation, this would be an API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Form data submitted:', data);
        resolve({ success: true });
      }, 2000);
    });
  }
  
  /**
   * Handle input validation
   */
  handleInputValidation(event) {
    const field = event.target;
    const fieldName = field.name;
    
    if (this.validationRules[fieldName]) {
      this.validateField(field, fieldName);
    }
  }
  
  /**
   * Handle blur validation
   */
  handleBlurValidation(event) {
    const field = event.target;
    const fieldName = field.name;
    
    if (this.validationRules[fieldName]) {
      this.validateField(field, fieldName);
    }
  }
  
  /**
   * Validate all fields
   */
  validateAllFields() {
    let isValid = true;
    const fields = this.form.querySelectorAll('input, select, textarea');
    
    fields.forEach(field => {
      const fieldName = field.name;
      if (this.validationRules[fieldName]) {
        const fieldValid = this.validateField(field, fieldName);
        if (!fieldValid) {
          isValid = false;
        }
      }
    });
    
    return isValid;
  }
  
  /**
   * Validate individual field
   */
  validateField(field, fieldName) {
    const value = field.value.trim();
    const rules = this.validationRules[fieldName];
    const errorElement = document.getElementById(`${fieldName}-error`);
    
    // Clear previous validation state
    field.classList.remove('is-valid', 'is-invalid');
    
    // Check required
    if (rules.required && !value) {
      this.showFieldError(field, errorElement, 'This field is required');
      return false;
    }
    
    // Skip other validations if field is empty and not required
    if (!value && !rules.required) {
      this.clearFieldError(field, errorElement);
      return true;
    }
    
    // Check min length
    if (rules.minLength && value.length < rules.minLength) {
      this.showFieldError(field, errorElement, `Must be at least ${rules.minLength} characters`);
      return false;
    }
    
    // Check max length
    if (rules.maxLength && value.length > rules.maxLength) {
      this.showFieldError(field, errorElement, `Must be no more than ${rules.maxLength} characters`);
      return false;
    }
    
    // Check pattern (email)
    if (rules.pattern && !rules.pattern.test(value)) {
      this.showFieldError(field, errorElement, 'Please enter a valid email address');
      return false;
    }
    
    // Field is valid
    this.showFieldSuccess(field, errorElement);
    return true;
  }
  
  /**
   * Show field error
   */
  showFieldError(field, errorElement, message) {
    field.classList.add('is-invalid');
    field.classList.remove('is-valid');
    
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
    
    // Announce error to screen readers
    this.announceToScreenReader(message);
  }
  
  /**
   * Show field success
   */
  showFieldSuccess(field, errorElement) {
    field.classList.add('is-valid');
    field.classList.remove('is-invalid');
    
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
  }
  
  /**
   * Clear field error
   */
  clearFieldError(field, errorElement) {
    field.classList.remove('is-valid', 'is-invalid');
    
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
  }
  
  /**
   * Focus first error field
   */
  focusFirstError() {
    const firstError = this.form.querySelector('.is-invalid');
    if (firstError) {
      firstError.focus();
    }
  }
  
  /**
   * Handle form reset
   */
  handleReset() {
    // Clear all validation states
    const fields = this.form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
      field.classList.remove('is-valid', 'is-invalid');
    });
    
    const errors = this.form.querySelectorAll('.form-error');
    errors.forEach(error => {
      error.textContent = '';
      error.style.display = 'none';
    });
  }
  
  /**
   * Set submitting state
   */
  setSubmitting(submitting) {
    this.isSubmitting = submitting;
    
    const submitBtn = this.form.querySelector('#submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    if (submitting) {
      submitBtn.disabled = true;
      btnText.hidden = true;
      btnLoading.hidden = false;
    } else {
      submitBtn.disabled = false;
      btnText.hidden = false;
      btnLoading.hidden = true;
    }
  }
  
  /**
   * Reset form
   */
  resetForm() {
    this.form.reset();
    this.handleReset();
  }
  
  /**
   * Announce to screen reader
   */
  announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }
  
  /**
   * Show error message
   */
  showError(message) {
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
  
  /**
   * Utility function for debouncing
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// ========================================
// FAQ Accordion Manager Class
// ========================================

class FAQAccordionManager {
  constructor() {
    this.faqItems = [];
    this.init();
  }
  
  /**
   * Initialize FAQ accordion
   */
  init() {
    this.faqItems = document.querySelectorAll('.faq-item');
    this.bindEvents();
  }
  
  /**
   * Bind FAQ events
   */
  bindEvents() {
    this.faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      
      if (question && answer) {
        question.addEventListener('click', () => {
          this.toggleFAQ(item, question, answer);
        });
        
        question.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.toggleFAQ(item, question, answer);
          }
        });
      }
    });
  }
  
  /**
   * Toggle FAQ item
   */
  toggleFAQ(item, question, answer) {
    const isExpanded = question.getAttribute('aria-expanded') === 'true';
    
    // Close all other FAQ items
    this.faqItems.forEach(otherItem => {
      if (otherItem !== item) {
        const otherQuestion = otherItem.querySelector('.faq-question');
        const otherAnswer = otherItem.querySelector('.faq-answer');
        
        if (otherQuestion && otherAnswer) {
          this.closeFAQ(otherQuestion, otherAnswer);
        }
      }
    });
    
    // Toggle current item
    if (isExpanded) {
      this.closeFAQ(question, answer);
    } else {
      this.openFAQ(question, answer);
    }
  }
  
  /**
   * Open FAQ item
   */
  openFAQ(question, answer) {
    question.setAttribute('aria-expanded', 'true');
    answer.hidden = false;
    
    // Smooth height animation
    const height = answer.scrollHeight;
    answer.style.height = '0px';
    answer.style.overflow = 'hidden';
    
    requestAnimationFrame(() => {
      answer.style.transition = 'height 0.3s ease-out';
      answer.style.height = height + 'px';
      
      setTimeout(() => {
        answer.style.height = '';
        answer.style.overflow = '';
        answer.style.transition = '';
      }, 300);
    });
  }
  
  /**
   * Close FAQ item
   */
  closeFAQ(question, answer) {
    question.setAttribute('aria-expanded', 'false');
    
    // Smooth height animation
    const height = answer.scrollHeight;
    answer.style.height = height + 'px';
    answer.style.overflow = 'hidden';
    
    requestAnimationFrame(() => {
      answer.style.transition = 'height 0.3s ease-out';
      answer.style.height = '0px';
      
      setTimeout(() => {
        answer.hidden = true;
        answer.style.height = '';
        answer.style.overflow = '';
        answer.style.transition = '';
      }, 300);
    });
  }
}

// ========================================
// Success Modal Manager Class
// ========================================

class SuccessModalManager {
  constructor() {
    this.modal = null;
    this.backdrop = null;
    this.closeBtn = null;
    this.okBtn = null;
    this.init();
  }
  
  /**
   * Initialize success modal
   */
  init() {
    this.modal = document.getElementById('success-modal');
    this.backdrop = document.getElementById('success-backdrop');
    this.closeBtn = document.getElementById('success-close');
    this.okBtn = document.getElementById('success-ok');
    
    if (this.modal) {
      this.bindEvents();
    }
  }
  
  /**
   * Bind modal events
   */
  bindEvents() {
    if (this.backdrop) {
      this.backdrop.addEventListener('click', this.closeModal.bind(this));
    }
    
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', this.closeModal.bind(this));
    }
    
    if (this.okBtn) {
      this.okBtn.addEventListener('click', this.closeModal.bind(this));
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', this.handleKeyboard.bind(this));
  }
  
  /**
   * Show success modal
   */
  showModal() {
    if (this.modal) {
      this.modal.setAttribute('aria-hidden', 'false');
      this.modal.style.display = 'flex';
      
      // Focus management
      setTimeout(() => {
        this.okBtn?.focus();
      }, 100);
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }
  }
  
  /**
   * Close success modal
   */
  closeModal() {
    if (this.modal) {
      this.modal.setAttribute('aria-hidden', 'true');
      this.modal.style.display = 'none';
    }
    
    // Restore body scroll
    document.body.style.overflow = '';
  }
  
  /**
   * Handle keyboard navigation
   */
  handleKeyboard(event) {
    if (this.modal?.getAttribute('aria-hidden') === 'false') {
      if (event.key === 'Escape') {
        this.closeModal();
      }
      
      // Trap focus within modal
      if (event.key === 'Tab') {
        const focusableElements = this.modal.querySelectorAll(
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
  }
}

// ========================================
// Initialize All Managers
// ========================================

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = new ContactFormManager();
  const faqAccordion = new FAQAccordionManager();
  const successModal = new SuccessModalManager();
  
  // Make managers globally accessible for form submission
  window.contactForm = contactForm;
  window.successModal = successModal;
});

// ========================================
// Global Functions
// ========================================

/**
 * Show success modal (called from ContactFormManager)
 */
function showSuccessModal() {
  if (window.successModal) {
    window.successModal.showModal();
  }
}

// Export classes for potential use in other modules
window.ContactFormManager = ContactFormManager;
window.FAQAccordionManager = FAQAccordionManager;
window.SuccessModalManager = SuccessModalManager; 