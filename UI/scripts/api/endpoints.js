/**
 * API Endpoints
 * Defines all API endpoint methods organized by module
 */

import { ApiClient } from './client.js';
import config from '../config.js';

// Create API client instance
const apiClient = new ApiClient(config.API_BASE_URL);

/**
 * Authentication API endpoints
 */
const auth = {
  /**
   * Login user
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} Login response with token and user data
   */
  login: (credentials) => {
    return apiClient.post(config.ENDPOINTS.AUTH_LOGIN, credentials);
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @param {string} userData.username - Username
   * @param {string} userData.email - Email address
   * @param {string} userData.password - Password
   * @param {string} userData.fullName - Full name
   * @returns {Promise<Object>} Registration response
   */
  register: (userData) => {
    return apiClient.post(config.ENDPOINTS.AUTH_REGISTER, userData);
  },

  /**
   * Logout user
   * @returns {Promise<Object>} Logout response
   */
  logout: () => {
    return apiClient.post(config.ENDPOINTS.AUTH_LOGOUT);
  },

  /**
   * Verify email address
   * @param {string} token - Email verification token
   * @returns {Promise<Object>} Verification response
   */
  verifyEmail: (token) => {
    return apiClient.post(config.ENDPOINTS.AUTH_VERIFY_EMAIL, { token });
  },

  /**
   * Request password reset
   * @param {string} email - User email address
   * @returns {Promise<Object>} Password reset response
   */
  forgotPassword: (email) => {
    return apiClient.post(config.ENDPOINTS.AUTH_FORGOT_PASSWORD, { email });
  },

  /**
   * Reset password with token
   * @param {string} token - Password reset token
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} Reset response
   */
  resetPassword: (token, newPassword) => {
    return apiClient.post(config.ENDPOINTS.AUTH_RESET_PASSWORD, {
      token,
      newPassword
    });
  }
};

/**
 * User API endpoints
 */
const users = {
  /**
   * Get user profile by ID
   * @param {number} userId - User ID
   * @returns {Promise<Object>} User profile data
   */
  getProfile: (userId) => {
    const endpoint = config.buildEndpoint(config.ENDPOINTS.USER_PROFILE, { id: userId });
    return apiClient.get(endpoint);
  },

  /**
   * Update user profile
   * @param {number} userId - User ID
   * @param {Object} data - Profile data to update
   * @returns {Promise<Object>} Updated profile data
   */
  updateProfile: (userId, data) => {
    const endpoint = config.buildEndpoint(config.ENDPOINTS.USER_PROFILE, { id: userId });
    return apiClient.put(endpoint, data);
  },

  /**
   * Get user statistics
   * @param {number} userId - User ID
   * @returns {Promise<Object>} User statistics
   */
  getStats: (userId) => {
    const endpoint = config.buildEndpoint(config.ENDPOINTS.USER_STATS, { id: userId });
    return apiClient.get(endpoint);
  }
};

/**
 * Domain API endpoints
 */
const domains = {
  /**
   * Get all domains
   * @param {Object} filters - Optional filters
   * @returns {Promise<Object>} List of domains
   */
  getAll: (filters = {}) => {
    const queryString = config.buildQueryString(filters);
    return apiClient.get(`${config.ENDPOINTS.DOMAINS}${queryString}`);
  },

  /**
   * Get domain by slug
   * @param {string} slug - Domain slug
   * @returns {Promise<Object>} Domain details with modules and challenges
   */
  getBySlug: (slug) => {
    const endpoint = config.buildEndpoint(config.ENDPOINTS.DOMAIN_BY_SLUG, { slug });
    return apiClient.get(endpoint);
  }
};

/**
 * Challenge API endpoints
 */
const challenges = {
  /**
   * Get all challenges
   * @param {Object} filters - Optional filters
   * @param {string} filters.difficulty - Filter by difficulty (easy, medium, hard)
   * @param {string} filters.domain - Filter by domain slug
   * @param {number} filters.page - Page number
   * @param {number} filters.limit - Items per page
   * @returns {Promise<Object>} List of challenges
   */
  getAll: (filters = {}) => {
    const queryString = config.buildQueryString(filters);
    return apiClient.get(`${config.ENDPOINTS.CHALLENGES}${queryString}`);
  },

  /**
   * Get challenge by slug
   * @param {string} slug - Challenge slug
   * @returns {Promise<Object>} Challenge details
   */
  getBySlug: (slug) => {
    const endpoint = config.buildEndpoint(config.ENDPOINTS.CHALLENGE_BY_SLUG, { slug });
    return apiClient.get(endpoint);
  }
};

/**
 * Submission API endpoints
 */
const submissions = {
  /**
   * Submit a challenge solution
   * @param {Object} submission - Submission data
   * @param {number} submission.challengeId - Challenge ID
   * @param {string} submission.flag - Submitted flag
   * @param {number} submission.timeTaken - Time taken in seconds (optional)
   * @param {number} submission.hintsUsed - Number of hints used (optional)
   * @returns {Promise<Object>} Submission result
   */
  submit: (submission) => {
    return apiClient.post(config.ENDPOINTS.SUBMISSIONS, submission);
  },

  /**
   * Get user submissions
   * @param {number} userId - User ID
   * @param {Object} filters - Optional filters
   * @returns {Promise<Object>} List of user submissions
   */
  getUserSubmissions: (userId, filters = {}) => {
    const endpoint = config.buildEndpoint(config.ENDPOINTS.USER_SUBMISSIONS, { userId });
    const queryString = config.buildQueryString(filters);
    return apiClient.get(`${endpoint}${queryString}`);
  }
};

/**
 * Progress API endpoints
 */
const progress = {
  /**
   * Get user progress
   * @param {number} userId - User ID
   * @returns {Promise<Object>} User progress data
   */
  getUserProgress: (userId) => {
    const endpoint = config.buildEndpoint(config.ENDPOINTS.USER_PROGRESS, { userId });
    return apiClient.get(endpoint);
  },

  /**
   * Get domain progress for user
   * @param {number} domainId - Domain ID
   * @param {number} userId - User ID (optional, uses current user if not provided)
   * @returns {Promise<Object>} Domain progress data
   */
  getDomainProgress: (domainId, userId = null) => {
    const endpoint = config.buildEndpoint(config.ENDPOINTS.DOMAIN_PROGRESS, { domainId });
    const queryString = userId ? config.buildQueryString({ userId }) : '';
    return apiClient.get(`${endpoint}${queryString}`);
  }
};

/**
 * Achievement API endpoints
 */
const achievements = {
  /**
   * Get all achievements
   * @returns {Promise<Object>} List of all achievements
   */
  getAll: () => {
    return apiClient.get(config.ENDPOINTS.ACHIEVEMENTS);
  },

  /**
   * Get user achievements
   * @param {number} userId - User ID
   * @returns {Promise<Object>} User achievements with unlock status
   */
  getUserAchievements: (userId) => {
    const endpoint = config.buildEndpoint(config.ENDPOINTS.USER_ACHIEVEMENTS, { userId });
    return apiClient.get(endpoint);
  }
};

/**
 * Leaderboard API endpoints
 */
const leaderboard = {
  /**
   * Get global leaderboard
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise<Object>} Global leaderboard data
   */
  getGlobal: (params = {}) => {
    const queryString = config.buildQueryString({
      page: params.page || config.PAGINATION.DEFAULT_PAGE,
      limit: params.limit || config.PAGINATION.DEFAULT_LIMIT
    });
    return apiClient.get(`${config.ENDPOINTS.LEADERBOARD_GLOBAL}${queryString}`);
  },

  /**
   * Get domain-specific leaderboard
   * @param {number} domainId - Domain ID
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise<Object>} Domain leaderboard data
   */
  getByDomain: (domainId, params = {}) => {
    const endpoint = config.buildEndpoint(config.ENDPOINTS.LEADERBOARD_DOMAIN, { domainId });
    const queryString = config.buildQueryString({
      page: params.page || config.PAGINATION.DEFAULT_PAGE,
      limit: params.limit || config.PAGINATION.DEFAULT_LIMIT
    });
    return apiClient.get(`${endpoint}${queryString}`);
  }
};

/**
 * Unified API object with all endpoint modules
 */
const api = {
  auth,
  users,
  domains,
  challenges,
  submissions,
  progress,
  achievements,
  leaderboard,
  
  // Expose client for direct access if needed
  client: apiClient,
  
  // Token management helpers
  setToken: (token) => apiClient.setToken(token),
  getToken: () => apiClient.getToken(),
  removeToken: () => apiClient.removeToken()
};

// Export API object
export default api;
