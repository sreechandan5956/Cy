/**
 * Challenges Page Script
 * Handles challenges listing and filtering using modular API client and utilities
 */

import api from './api/endpoints.js';
import Auth from './utils/auth.js';
import UI from './utils/ui.js';
import { handleApiCall } from './utils/errorHandler.js';
import stateManager from './utils/state.js';

// Current filter state
let currentFilter = 'all';

/**
 * Initialize challenges page
 */
async function initChallenges() {
  // Check authentication
  if (!Auth.checkAuth()) {
    return;
  }

  // Load user data
  await loadUserData();
  
  // Load challenges
  await loadChallenges();

  // Initialize UI components
  initializeUIComponents();
}

/**
 * Load user data and update UI
 */
async function loadUserData() {
  const user = Auth.getUser();
  
  if (user) {
    updateUserDisplay(user);
    stateManager.setState({ user, isAuthenticated: true });
  }
}

/**
 * Update user display in header
 * @param {Object} user - User data
 */
function updateUserDisplay(user) {
  const userNameEl = document.querySelector('.user-name');
  const userAvatarEl = document.querySelector('.user-avatar');

  if (userNameEl && user.username) {
    userNameEl.textContent = user.username;
  }

  if (userAvatarEl && user.username) {
    const initials = user.fullName 
      ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      : user.username.slice(0, 2).toUpperCase();
    userAvatarEl.textContent = initials;
  }
}

/**
 * Load challenges from API
 * @param {Object} filters - Filter options
 */
async function loadChallenges(filters = {}) {
  const challengesGrid = document.querySelector('#challenges-grid');
  if (!challengesGrid) return;

  await handleApiCall(
    async () => {
      const response = await api.challenges.getAll(filters);
      
      if (response && response.data && response.data.challenges) {
        stateManager.setState({ challenges: response.data.challenges });
        renderChallenges(response.data.challenges);
      }
    },
    {
      loadingElement: challengesGrid,
      errorMessage: 'Failed to load challenges',
      showErrorToast: true
    }
  );
}

/**
 * Render challenges in the grid
 * @param {Array} challenges - Array of challenge objects
 */
function renderChallenges(challenges) {
  const challengesGrid = document.querySelector('#challenges-grid');
  if (!challengesGrid) return;

  if (!challenges || challenges.length === 0) {
    challengesGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <p style="color: var(--text-secondary); font-size: 1.125rem;">
          No challenges found. Try adjusting your filters.
        </p>
      </div>
    `;
    return;
  }

  // Map challenge icons based on domain or difficulty
  const iconMap = {
    'easy': 'unlock',
    'medium': 'code',
    'hard': 'shield-alert'
  };

  challengesGrid.innerHTML = challenges.map(challenge => {
    const icon = iconMap[challenge.difficulty] || 'shield';
    const badgeClass = `badge-${challenge.difficulty}`;
    const xpReward = challenge.xp_reward || 100;
    const estimatedTime = challenge.estimated_time || 30;

    return `
      <div class="challenge-card" data-difficulty="${challenge.difficulty}">
        <div class="challenge-inner">
          <div class="challenge-front">
            <div class="challenge-icon">
              <i data-lucide="${icon}" style="width: 64px; height: 64px; color: var(--${challenge.difficulty === 'easy' ? 'neon-green' : challenge.difficulty === 'medium' ? 'cyber-purple' : 'error'});"></i>
            </div>
            <h3 style="margin-bottom: 1rem;">${challenge.title}</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">
              ${challenge.description || 'Test your skills with this challenge'}
            </p>
            <span class="cyber-badge ${badgeClass}">${challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}</span>
          </div>
          <div class="challenge-back">
            <h3 style="margin-bottom: 1rem;">${challenge.title}</h3>
            <p style="margin-bottom: 2rem; opacity: 0.9;">
              Points: ${xpReward} | Time: ${estimatedTime} min
            </p>
            <a href="challenge-${challenge.slug}.html" class="cyber-btn" style="background: white; color: var(--${challenge.difficulty === 'easy' ? 'neon-green' : challenge.difficulty === 'medium' ? 'cyber-purple' : 'error'}); border: none;">
              Start Challenge
            </a>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Reinitialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

/**
 * Filter challenges by difficulty
 * @param {string} difficulty - Difficulty level ('all', 'easy', 'medium', 'hard')
 * @param {HTMLElement} button - Button element that triggered the filter
 */
async function filterChallenges(difficulty, button) {
  currentFilter = difficulty;

  // Update button states
  const buttons = document.querySelectorAll('button[onclick^="filterChallenges"]');
  buttons.forEach(btn => {
    btn.className = 'cyber-btn cyber-btn-secondary';
  });
  if (button) {
    button.className = 'cyber-btn cyber-btn-primary';
  }

  // Load challenges with filter
  const filters = difficulty !== 'all' ? { difficulty } : {};
  await loadChallenges(filters);
}

/**
 * Initialize UI components
 */
function initializeUIComponents() {
  // Logout button handler
  const logoutBtn = document.querySelector('.logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogout();
    });
  }

  // User menu dropdown
  const userToggle = document.querySelector('.user-toggle');
  const userDropdown = document.querySelector('.user-dropdown');

  if (userToggle && userDropdown) {
    userToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle('show');
      userToggle.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!userToggle.contains(e.target) && !userDropdown.contains(e.target)) {
        userDropdown.classList.remove('show');
        userToggle.classList.remove('active');
      }
    });
  }

  // Filter buttons
  const filterButtons = document.querySelectorAll('button[onclick^="filterChallenges"]');
  filterButtons.forEach(button => {
    const difficulty = button.textContent.trim().toLowerCase();
    button.removeAttribute('onclick');
    button.addEventListener('click', () => {
      filterChallenges(difficulty, button);
    });
  });
}

/**
 * Handle user logout
 */
function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    Auth.logout();
  }
}

// Make filterChallenges available globally for inline onclick handlers
window.filterChallenges = filterChallenges;

// Initialize challenges page when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChallenges);
} else {
  initChallenges();
}

// Export for testing or external use
export { initChallenges, loadChallenges, filterChallenges };
