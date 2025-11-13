/**
 * Application configuration
 * Centralized configuration for API endpoints, pagination, and UI constants
 */

const config = {
  /**
   * Base URL for API requests
   * Change this for production deployment
   */
  API_BASE_URL: 'http://localhost:3000/api',

  /**
   * API endpoint paths
   */
  ENDPOINTS: {
    // Authentication endpoints
    AUTH: '/auth',
    AUTH_LOGIN: '/auth/login',
    AUTH_REGISTER: '/auth/register',
    AUTH_LOGOUT: '/auth/logout',
    AUTH_VERIFY_EMAIL: '/auth/verify-email',
    AUTH_FORGOT_PASSWORD: '/auth/forgot-password',
    AUTH_RESET_PASSWORD: '/auth/reset-password',

    // User endpoints
    USERS: '/users',
    USER_PROFILE: '/users/:id',
    USER_STATS: '/users/:id/stats',

    // Domain endpoints
    DOMAINS: '/domains',
    DOMAIN_BY_SLUG: '/domains/:slug',

    // Challenge endpoints
    CHALLENGES: '/challenges',
    CHALLENGE_BY_SLUG: '/challenges/:slug',

    // Submission endpoints
    SUBMISSIONS: '/submissions',
    USER_SUBMISSIONS: '/submissions/user/:userId',

    // Progress endpoints
    PROGRESS: '/progress',
    USER_PROGRESS: '/progress/user/:userId',
    DOMAIN_PROGRESS: '/progress/domain/:domainId',

    // Achievement endpoints
    ACHIEVEMENTS: '/achievements',
    USER_ACHIEVEMENTS: '/achievements/user/:userId',

    // Leaderboard endpoints
    LEADERBOARD: '/leaderboard',
    LEADERBOARD_GLOBAL: '/leaderboard/global',
    LEADERBOARD_DOMAIN: '/leaderboard/domain/:domainId'
  },

  /**
   * Pagination defaults
   */
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
    MIN_LIMIT: 1
  },

  /**
   * UI constants
   */
  UI: {
    // Toast notification duration (milliseconds)
    TOAST_DURATION: 3000,
    TOAST_ERROR_DURATION: 5000,
    TOAST_SUCCESS_DURATION: 2500,

    // Modal animation duration (milliseconds)
    MODAL_ANIMATION_DURATION: 300,

    // Loading spinner delay (milliseconds)
    LOADING_DELAY: 200,

    // Debounce delay for search inputs (milliseconds)
    SEARCH_DEBOUNCE_DELAY: 300,

    // Animation durations
    FADE_DURATION: 200,
    SLIDE_DURATION: 300,

    // Difficulty colors
    DIFFICULTY_COLORS: {
      easy: '#22c55e',
      medium: '#f59e0b',
      hard: '#ef4444'
    },

    // XP level colors
    LEVEL_COLORS: {
      beginner: '#3b82f6',
      intermediate: '#8b5cf6',
      advanced: '#ec4899',
      expert: '#f59e0b'
    },

    // Status colors
    STATUS_COLORS: {
      success: '#22c55e',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    }
  },

  /**
   * Local storage keys
   */
  STORAGE_KEYS: {
    TOKEN: 'token',
    USER: 'user',
    THEME: 'theme',
    LANGUAGE: 'language'
  },

  /**
   * Challenge difficulty levels
   */
  DIFFICULTY_LEVELS: ['easy', 'medium', 'hard'],

  /**
   * User rank thresholds (XP required)
   */
  RANK_THRESHOLDS: {
    'Novice': 0,
    'Apprentice': 100,
    'Practitioner': 500,
    'Expert': 1500,
    'Master': 3000,
    'Legend': 5000
  },

  /**
   * Form validation rules
   */
  VALIDATION: {
    USERNAME_MIN_LENGTH: 3,
    USERNAME_MAX_LENGTH: 30,
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_MAX_LENGTH: 128,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    USERNAME_REGEX: /^[a-zA-Z0-9_-]+$/
  },

  /**
   * Feature flags
   */
  FEATURES: {
    EMAIL_VERIFICATION: true,
    ACHIEVEMENTS: true,
    LEADERBOARD: true,
    SOCIAL_SHARING: false,
    DARK_MODE: true
  }
};

/**
 * Helper function to replace URL parameters
 * @param {string} endpoint - Endpoint with parameters (e.g., '/users/:id')
 * @param {Object} params - Parameters to replace (e.g., { id: 123 })
 * @returns {string} Endpoint with replaced parameters
 */
config.buildEndpoint = function(endpoint, params = {}) {
  let result = endpoint;
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(`:${key}`, encodeURIComponent(value));
  }
  return result;
};

/**
 * Helper function to build query string
 * @param {Object} params - Query parameters
 * @returns {string} Query string (e.g., '?page=1&limit=20')
 */
config.buildQueryString = function(params = {}) {
  const filtered = Object.entries(params)
    .filter(([_, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
  
  return filtered ? `?${filtered}` : '';
};

// Export configuration
export default config;
