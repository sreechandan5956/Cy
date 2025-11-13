// API Configuration - Update this URL when deploying
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : 'https://your-production-domain.com';

const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/api/auth`
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { API_BASE_URL, API_ENDPOINTS };
}
