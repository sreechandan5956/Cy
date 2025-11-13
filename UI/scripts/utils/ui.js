/**
 * UI Utility Module
 * Provides common UI operations like loading states, notifications, modals, and form helpers
 */

import config from '../config.js';

/**
 * UI helper object
 */
const UI = {
  /**
   * Show loading state on an element
   * @param {HTMLElement} element - Element to show loading state on
   * @param {string} loadingText - Optional loading text to display
   */
  showLoading(element, loadingText = 'Loading...') {
    if (!element) return;
    
    element.classList.add('loading');
    element.setAttribute('aria-busy', 'true');
    
    // Store original content if not already stored
    if (!element.dataset.originalContent) {
      element.dataset.originalContent = element.innerHTML;
    }
    
    // Add loading spinner if element is a button or has specific class
    if (element.tagName === 'BUTTON' || element.classList.contains('loading-container')) {
      element.innerHTML = `
        <span class="loading-spinner"></span>
        <span>${loadingText}</span>
      `;
      element.disabled = true;
    }
  },

  /**
   * Hide loading state on an element
   * @param {HTMLElement} element - Element to hide loading state from
   */
  hideLoading(element) {
    if (!element) return;
    
    element.classList.remove('loading');
    element.setAttribute('aria-busy', 'false');
    
    // Restore original content if it was stored
    if (element.dataset.originalContent) {
      element.innerHTML = element.dataset.originalContent;
      delete element.dataset.originalContent;
    }
    
    if (element.tagName === 'BUTTON') {
      element.disabled = false;
    }
  },

  /**
   * Show toast notification
   * @param {string} message - Message to display
   * @param {string} type - Toast type: 'success', 'error', 'warning', 'info'
   * @param {number} duration - Duration in milliseconds (0 for persistent)
   */
  showToast(message, type = 'info', duration = null) {
    // Use default duration from config if not specified
    if (duration === null) {
      duration = type === 'error' 
        ? config.UI.TOAST_ERROR_DURATION 
        : type === 'success'
        ? config.UI.TOAST_SUCCESS_DURATION
        : config.UI.TOAST_DURATION;
    }

    // Create toast container if it doesn't exist
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      document.body.appendChild(container);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };
    
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <div class="toast-content">
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Close notification">×</button>
    `;
    
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Close button functionality
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      this.closeToast(toast);
    });
    
    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        if (toast.parentElement) {
          this.closeToast(toast);
        }
      }, duration);
    }
    
    return toast;
  },

  /**
   * Close a toast notification
   * @param {HTMLElement} toast - Toast element to close
   */
  closeToast(toast) {
    if (!toast) return;
    
    toast.classList.remove('show');
    toast.classList.add('hide');
    
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, config.UI.FADE_DURATION);
  },

  /**
   * Show modal dialog
   * @param {string|HTMLElement} content - Modal content (HTML string or element)
   * @param {Object} options - Modal options
   * @param {string} options.title - Modal title
   * @param {boolean} options.closeButton - Show close button (default: true)
   * @param {boolean} options.backdrop - Show backdrop (default: true)
   * @param {Function} options.onClose - Callback when modal closes
   * @returns {HTMLElement} Modal element
   */
  showModal(content, options = {}) {
    const {
      title = '',
      closeButton = true,
      backdrop = true,
      onClose = null
    } = options;

    // Create modal backdrop
    const modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'modal-backdrop';
    if (backdrop) {
      modalBackdrop.addEventListener('click', () => {
        this.closeModal(modal, onClose);
      });
    }

    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    if (title) {
      modal.setAttribute('aria-labelledby', 'modal-title');
    }

    let modalHTML = '<div class="modal-content">';
    
    if (title || closeButton) {
      modalHTML += '<div class="modal-header">';
      if (title) {
        modalHTML += `<h2 id="modal-title" class="modal-title">${title}</h2>`;
      }
      if (closeButton) {
        modalHTML += '<button class="modal-close" aria-label="Close modal">×</button>';
      }
      modalHTML += '</div>';
    }
    
    modalHTML += '<div class="modal-body">';
    if (typeof content === 'string') {
      modalHTML += content;
    }
    modalHTML += '</div></div>';
    
    modal.innerHTML = modalHTML;
    
    // Append non-string content
    if (typeof content !== 'string' && content instanceof HTMLElement) {
      modal.querySelector('.modal-body').appendChild(content);
    }

    // Append to body
    document.body.appendChild(modalBackdrop);
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Trigger animation
    setTimeout(() => {
      modalBackdrop.classList.add('show');
      modal.classList.add('show');
    }, 10);

    // Close button functionality
    if (closeButton) {
      const closeBtn = modal.querySelector('.modal-close');
      closeBtn.addEventListener('click', () => {
        this.closeModal(modal, onClose);
      });
    }

    // Store backdrop reference
    modal.dataset.backdropId = modalBackdrop.className;
    modal._backdrop = modalBackdrop;

    return modal;
  },

  /**
   * Close modal dialog
   * @param {HTMLElement} modal - Modal element to close (optional, closes all if not specified)
   * @param {Function} callback - Callback function to execute after closing
   */
  closeModal(modal = null, callback = null) {
    const modals = modal ? [modal] : document.querySelectorAll('.modal');
    
    modals.forEach(m => {
      m.classList.remove('show');
      if (m._backdrop) {
        m._backdrop.classList.remove('show');
      }
      
      setTimeout(() => {
        m.remove();
        if (m._backdrop) {
          m._backdrop.remove();
        }
        
        // Re-enable body scroll if no more modals
        if (!document.querySelector('.modal')) {
          document.body.style.overflow = '';
        }
        
        if (callback) {
          callback();
        }
      }, config.UI.MODAL_ANIMATION_DURATION);
    });
  },

  /**
   * Get form data as an object
   * @param {HTMLFormElement} form - Form element
   * @returns {Object} Form data as key-value pairs
   */
  getFormData(form) {
    if (!form) return {};
    
    const formData = new FormData(form);
    const data = {};
    
    for (const [key, value] of formData.entries()) {
      // Handle multiple values (checkboxes with same name)
      if (data[key]) {
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    }
    
    return data;
  },

  /**
   * Set form errors
   * @param {HTMLFormElement} form - Form element
   * @param {Object} errors - Errors object with field names as keys
   */
  setFormErrors(form, errors) {
    if (!form || !errors) return;
    
    // Clear existing errors first
    this.clearFormErrors(form);
    
    Object.entries(errors).forEach(([field, message]) => {
      const input = form.querySelector(`[name="${field}"]`);
      if (input) {
        // Add error class to input
        input.classList.add('error', 'is-invalid');
        input.setAttribute('aria-invalid', 'true');
        
        // Find or create error message element
        let errorEl = input.parentElement.querySelector('.error-message');
        if (!errorEl) {
          errorEl = document.createElement('div');
          errorEl.className = 'error-message';
          errorEl.setAttribute('role', 'alert');
          input.parentElement.appendChild(errorEl);
        }
        
        errorEl.textContent = message;
        input.setAttribute('aria-describedby', errorEl.id || `${field}-error`);
      }
    });
  },

  /**
   * Clear form errors
   * @param {HTMLFormElement} form - Form element
   */
  clearFormErrors(form) {
    if (!form) return;
    
    // Remove error classes from inputs
    form.querySelectorAll('.error, .is-invalid').forEach(el => {
      el.classList.remove('error', 'is-invalid');
      el.removeAttribute('aria-invalid');
      el.removeAttribute('aria-describedby');
    });
    
    // Remove error messages
    form.querySelectorAll('.error-message').forEach(el => {
      el.textContent = '';
      el.remove();
    });
  },

  /**
   * Disable form inputs
   * @param {HTMLFormElement} form - Form element
   */
  disableForm(form) {
    if (!form) return;
    
    form.querySelectorAll('input, textarea, select, button').forEach(el => {
      el.disabled = true;
    });
  },

  /**
   * Enable form inputs
   * @param {HTMLFormElement} form - Form element
   */
  enableForm(form) {
    if (!form) return;
    
    form.querySelectorAll('input, textarea, select, button').forEach(el => {
      el.disabled = false;
    });
  },

  /**
   * Scroll to element smoothly
   * @param {HTMLElement|string} element - Element or selector to scroll to
   * @param {Object} options - Scroll options
   */
  scrollTo(element, options = {}) {
    const target = typeof element === 'string' 
      ? document.querySelector(element) 
      : element;
    
    if (!target) return;
    
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      ...options
    });
  },

  /**
   * Debounce function calls
   * @param {Function} func - Function to debounce
   * @param {number} delay - Delay in milliseconds
   * @returns {Function} Debounced function
   */
  debounce(func, delay = config.UI.SEARCH_DEBOUNCE_DELAY) {
    let timeoutId;
    return function(...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  },

  /**
   * Throttle function calls
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function} Throttled function
   */
  throttle(func, limit = 100) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// Export UI object
export default UI;
