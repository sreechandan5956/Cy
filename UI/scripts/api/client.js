/**
 * Custom error class for API errors
 */
class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * API Client for handling all HTTP requests to the backend
 */
class ApiClient {
  /**
   * Create an API client instance
   * @param {string} baseURL - Base URL for API requests
   */
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  /**
   * Get authentication token from localStorage
   * @returns {string|null} JWT token or null
   */
  getToken() {
    return localStorage.getItem('token');
  }

  /**
   * Set authentication token in localStorage
   * @param {string} token - JWT token to store
   */
  setToken(token) {
    localStorage.setItem('token', token);
  }

  /**
   * Remove authentication token from localStorage
   */
  removeToken() {
    localStorage.removeItem('token');
  }

  /**
   * Make an HTTP request to the API
   * @param {string} endpoint - API endpoint path
   * @param {Object} options - Fetch options
   * @returns {Promise<Object>} Response data
   * @throws {ApiError} When request fails
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      // Parse response as JSON
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        // If response is not JSON, create a generic error
        if (!response.ok) {
          throw new ApiError(
            'Request failed',
            response.status,
            null
          );
        }
        data = {};
      }

      // Handle error responses
      if (!response.ok) {
        const errorMessage = data.error || data.message || 'Request failed';
        throw new ApiError(errorMessage, response.status, data);
      }

      return data;
    } catch (error) {
      // Re-throw ApiError as-is
      if (error instanceof ApiError) {
        throw error;
      }

      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError('Network error. Please check your connection.', 0, null);
      }

      // Handle other errors
      throw new ApiError(error.message || 'An unexpected error occurred', 0, null);
    }
  }

  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint path
   * @param {Object} options - Additional fetch options
   * @returns {Promise<Object>} Response data
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'GET'
    });
  }

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint path
   * @param {Object} body - Request body data
   * @param {Object} options - Additional fetch options
   * @returns {Promise<Object>} Response data
   */
  async post(endpoint, body = null, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined
    });
  }

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint path
   * @param {Object} body - Request body data
   * @param {Object} options - Additional fetch options
   * @returns {Promise<Object>} Response data
   */
  async put(endpoint, body = null, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined
    });
  }

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint path
   * @param {Object} options - Additional fetch options
   * @returns {Promise<Object>} Response data
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'DELETE'
    });
  }

  /**
   * Make a PATCH request
   * @param {string} endpoint - API endpoint path
   * @param {Object} body - Request body data
   * @param {Object} options - Additional fetch options
   * @returns {Promise<Object>} Response data
   */
  async patch(endpoint, body = null, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined
    });
  }
}

// Export classes for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ApiClient, ApiError };
}
