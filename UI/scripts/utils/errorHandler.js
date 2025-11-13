/**
 * Error Handler Utility Module
 * Provides centralized error handling for API calls with loading states and notifications
 */

import UI from './ui.js';
import Auth from './auth.js';

/**
 * Handle API call with loading states and error handling
 * @param {Function} apiFunction - Async function that makes the API call
 * @param {Object} options - Handler options
 * @param {HTMLElement} options.loadingElement - Element to show loading state on
 * @param {string} options.successMessage - Message to show on success
 * @param {string} options.errorMessage - Custom error message
 * @param {boolean} options.showSuccessToast - Whether to show success toast (default: true if successMessage provided)
 * @param {boolean} options.showErrorToast - Whether to show error toast (default: true)
 * @param {Function} options.onSuccess - Callback function on success
 * @param {Function} options.onError - Callback function on error
 * @param {boolean} options.rethrow - Whether to rethrow the error after handling (default: false)
 * @returns {Promise<any>} Result from API call
 * @throws {Error} If rethrow is true and an error occurs
 */
async function handleApiCall(apiFunction, options = {}) {
  const {
    loadingElement = null,
    successMessage = null,
    errorMessage = null,
    showSuccessToast = !!successMessage,
    showErrorToast = true,
    onSuccess = null,
    onError = null,
    rethrow = false
  } = options;

  try {
    // Show loading state
    if (loadingElement) {
      UI.showLoading(loadingElement);
    }
    
    // Execute API call
    const result = await apiFunction();
    
    // Show success message
    if (showSuccessToast && successMessage) {
      UI.showToast(successMessage, 'success');
    }
    
    // Execute success callback
    if (onSuccess) {
      onSuccess(result);
    }
    
    return result;
  } catch (error) {
    console.error('API call error:', error);
    
    // Handle authentication errors
    if (error.status === 401) {
      UI.showToast('Your session has expired. Please login again.', 'error');
      setTimeout(() => {
        Auth.logout(false);
      }, 1500);
      return;
    }
    
    // Handle forbidden errors
    if (error.status === 403) {
      const message = error.message || 'You do not have permission to perform this action.';
      if (showErrorToast) {
        UI.showToast(message, 'error');
      }
    }
    // Handle not found errors
    else if (error.status === 404) {
      const message = error.message || 'The requested resource was not found.';
      if (showErrorToast) {
        UI.showToast(message, 'error');
      }
    }
    // Handle validation errors
    else if (error.status === 400) {
      const message = error.message || errorMessage || 'Invalid request. Please check your input.';
      if (showErrorToast) {
        UI.showToast(message, 'error');
      }
    }
    // Handle server errors
    else if (error.status >= 500) {
      const message = errorMessage || 'A server error occurred. Please try again later.';
      if (showErrorToast) {
        UI.showToast(message, 'error');
      }
    }
    // Handle network errors
    else if (error.status === 0) {
      const message = errorMessage || 'Network error. Please check your connection.';
      if (showErrorToast) {
        UI.showToast(message, 'error');
      }
    }
    // Handle other errors
    else {
      const message = error.message || errorMessage || 'An error occurred. Please try again.';
      if (showErrorToast) {
        UI.showToast(message, 'error');
      }
    }
    
    // Execute error callback
    if (onError) {
      onError(error);
    }
    
    // Rethrow if requested
    if (rethrow) {
      throw error;
    }
  } finally {
    // Hide loading state
    if (loadingElement) {
      UI.hideLoading(loadingElement);
    }
  }
}

/**
 * Handle form submission with API call
 * @param {HTMLFormElement} form - Form element
 * @param {Function} apiFunction - Async function that makes the API call with form data
 * @param {Object} options - Handler options (same as handleApiCall)
 * @returns {Promise<any>} Result from API call
 */
async function handleFormSubmit(form, apiFunction, options = {}) {
  if (!form) {
    throw new Error('Form element is required');
  }

  // Clear previous errors
  UI.clearFormErrors(form);

  // Get form data
  const formData = UI.getFormData(form);

  // Disable form during submission
  UI.disableForm(form);

  try {
    const result = await handleApiCall(
      () => apiFunction(formData),
      {
        ...options,
        onError: (error) => {
          // Handle validation errors
          if (error.status === 400 && error.data && error.data.errors) {
            UI.setFormErrors(form, error.data.errors);
          }
          
          // Call custom error handler if provided
          if (options.onError) {
            options.onError(error);
          }
        }
      }
    );

    return result;
  } finally {
    // Re-enable form
    UI.enableForm(form);
  }
}

/**
 * Retry an API call with exponential backoff
 * @param {Function} apiFunction - Async function that makes the API call
 * @param {Object} options - Retry options
 * @param {number} options.maxRetries - Maximum number of retries (default: 3)
 * @param {number} options.initialDelay - Initial delay in milliseconds (default: 1000)
 * @param {number} options.maxDelay - Maximum delay in milliseconds (default: 10000)
 * @param {Function} options.shouldRetry - Function to determine if error should be retried
 * @returns {Promise<any>} Result from API call
 */
async function retryApiCall(apiFunction, options = {}) {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    shouldRetry = (error) => error.status >= 500 || error.status === 0
  } = options;

  let lastError;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiFunction();
    } catch (error) {
      lastError = error;

      // Don't retry if this is the last attempt or if error shouldn't be retried
      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));

      // Exponential backoff with max delay
      delay = Math.min(delay * 2, maxDelay);
    }
  }

  throw lastError;
}

/**
 * Create a safe async handler that catches errors
 * Useful for event handlers
 * @param {Function} handler - Async handler function
 * @param {Object} options - Error handling options
 * @returns {Function} Wrapped handler function
 */
function createSafeHandler(handler, options = {}) {
  return async function(...args) {
    try {
      await handler.apply(this, args);
    } catch (error) {
      console.error('Handler error:', error);
      
      if (options.showError !== false) {
        const message = options.errorMessage || 'An error occurred';
        UI.showToast(message, 'error');
      }
      
      if (options.onError) {
        options.onError(error);
      }
    }
  };
}

// Export functions
export {
  handleApiCall,
  handleFormSubmit,
  retryApiCall,
  createSafeHandler
};

export default {
  handleApiCall,
  handleFormSubmit,
  retryApiCall,
  createSafeHandler
};
