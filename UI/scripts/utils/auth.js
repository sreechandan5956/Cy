/**
 * Authentication Utility Module
 * Handles authentication state, token management, and user data
 */

import config from '../config.js';

/**
 * Authentication helper object
 */
const Auth = {
  /**
   * Get authentication token from localStorage
   * @returns {string|null} JWT token or null
   */
  getToken() {
    return localStorage.getItem(config.STORAGE_KEYS.TOKEN);
  },

  /**
   * Set authentication token in localStorage
   * @param {string} token - JWT token to store
   */
  setToken(token) {
    if (token) {
      localStorage.setItem(config.STORAGE_KEYS.TOKEN, token);
    }
  },

  /**
   * Remove authentication token from localStorage
   */
  removeToken() {
    localStorage.removeItem(config.STORAGE_KEYS.TOKEN);
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user has a valid token
   */
  isAuthenticated() {
    return !!this.getToken();
  },

  /**
   * Check authentication and redirect to login if not authenticated
   * @param {string} redirectUrl - URL to redirect to after login (optional)
   * @returns {boolean} True if authenticated, false otherwise
   */
  checkAuth(redirectUrl = null) {
    if (!this.isAuthenticated()) {
      // Store current URL for redirect after login
      if (redirectUrl) {
        sessionStorage.setItem('redirectAfterLogin', redirectUrl);
      } else {
        sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      }
      
      window.location.href = '/login.html';
      return false;
    }
    return true;
  },

  /**
   * Logout user and redirect to login page
   * @param {boolean} showMessage - Whether to show logout message
   */
  logout(showMessage = true) {
    this.removeToken();
    this.removeUser();
    
    if (showMessage) {
      sessionStorage.setItem('logoutMessage', 'You have been logged out successfully');
    }
    
    window.location.href = '/login.html';
  },

  /**
   * Get user data from localStorage
   * @returns {Object|null} User object or null
   */
  getUser() {
    const userStr = localStorage.getItem(config.STORAGE_KEYS.USER);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  /**
   * Set user data in localStorage
   * @param {Object} user - User object to store
   */
  setUser(user) {
    if (user) {
      localStorage.setItem(config.STORAGE_KEYS.USER, JSON.stringify(user));
    }
  },

  /**
   * Remove user data from localStorage
   */
  removeUser() {
    localStorage.removeItem(config.STORAGE_KEYS.USER);
  },

  /**
   * Update user data in localStorage
   * @param {Object} updates - Partial user object with updates
   */
  updateUser(updates) {
    const currentUser = this.getUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      this.setUser(updatedUser);
    }
  },

  /**
   * Get redirect URL after login
   * @returns {string} Redirect URL or default dashboard
   */
  getRedirectUrl() {
    const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
    sessionStorage.removeItem('redirectAfterLogin');
    return redirectUrl || '/dashboard.html';
  },

  /**
   * Clear all authentication data
   */
  clearAuth() {
    this.removeToken();
    this.removeUser();
    sessionStorage.clear();
  }
};

// Export Auth object
export default Auth;
