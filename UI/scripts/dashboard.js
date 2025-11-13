/**
 * Dashboard Page Script
 * Handles dashboard functionality using modular API client and utilities
 */

import api from './api/endpoints.js';
import Auth from './utils/auth.js';
import UI from './utils/ui.js';
import { handleApiCall } from './utils/errorHandler.js';
import stateManager from './utils/state.js';

/**
 * Initialize dashboard page
 */
async function initDashboard() {
  // Check authentication
  if (!Auth.checkAuth()) {
    return;
  }

  // Load user data
  await loadUserData();
  
  // Load dashboard data
  await Promise.all([
    loadDomains(),
    loadRecentActivity(),
    loadUserProgress()
  ]);

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
  } else {
    // Fetch user data from API if not in localStorage
    try {
      const userData = await handleApiCall(
        () => api.users.getProfile('me'),
        {
          showErrorToast: false
        }
      );
      
      if (userData && userData.data) {
        Auth.setUser(userData.data);
        updateUserDisplay(userData.data);
        stateManager.setState({ user: userData.data, isAuthenticated: true });
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  }
}

/**
 * Update user display in header
 * @param {Object} user - User data
 */
function updateUserDisplay(user) {
  const userNameEl = document.querySelector('.user-name');
  const userAvatarEl = document.querySelector('.user-avatar');
  const welcomeEl = document.querySelector('.welcome-section h1');

  if (userNameEl && user.username) {
    userNameEl.textContent = user.username;
  }

  if (userAvatarEl && user.username) {
    // Create initials from username or full name
    const initials = user.fullName 
      ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      : user.username.slice(0, 2).toUpperCase();
    userAvatarEl.textContent = initials;
  }

  if (welcomeEl && user.username) {
    welcomeEl.innerHTML = `Welcome back, ${user.username} <i data-lucide="bot"></i>`;
    // Reinitialize Lucide icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }
}

/**
 * Load domains data
 */
async function loadDomains() {
  const domainsGrid = document.querySelector('.domains-grid');
  if (!domainsGrid) return;

  await handleApiCall(
    async () => {
      const response = await api.domains.getAll();
      
      if (response && response.data && response.data.domains) {
        stateManager.setState({ domains: response.data.domains });
        renderDomains(response.data.domains);
      }
    },
    {
      loadingElement: domainsGrid,
      errorMessage: 'Failed to load domains',
      showErrorToast: false // Don't show error toast, keep static content
    }
  );
}

/**
 * Render domains in the grid
 * @param {Array} domains - Array of domain objects
 */
function renderDomains(domains) {
  const domainsGrid = document.querySelector('.domains-grid');
  if (!domainsGrid || !domains || domains.length === 0) return;

  // Map domain icons
  const iconMap = {
    'cryptography': 'lock',
    'forensics': 'search',
    'malware': 'bug',
    'reverse-engineering': 'cpu',
    'web-security': 'globe',
    'vapt': 'shield',
    'network-security': 'wifi'
  };

  domainsGrid.innerHTML = domains.map(domain => `
    <a href="domain-${domain.slug}.html" class="domain-card">
      <div class="domain-icon">
        <i data-lucide="${iconMap[domain.slug] || 'shield'}"></i>
      </div>
      <h3>${domain.name}</h3>
      <p>${domain.description || 'Explore challenges in this domain.'}</p>
    </a>
  `).join('');

  // Reinitialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

/**
 * Load recent activity
 */
async function loadRecentActivity() {
  const activityList = document.querySelector('.activity-list');
  if (!activityList) return;

  const user = Auth.getUser();
  if (!user || !user.id) return;

  await handleApiCall(
    async () => {
      const response = await api.submissions.getUserSubmissions(user.id, {
        limit: 5,
        page: 1
      });
      
      if (response && response.data && response.data.submissions) {
        renderRecentActivity(response.data.submissions);
      }
    },
    {
      errorMessage: 'Failed to load recent activity',
      showErrorToast: false // Keep static content on error
    }
  );
}

/**
 * Render recent activity
 * @param {Array} submissions - Array of submission objects
 */
function renderRecentActivity(submissions) {
  const activityList = document.querySelector('.activity-list');
  if (!activityList || !submissions || submissions.length === 0) return;

  activityList.innerHTML = submissions.map(submission => {
    const statusClass = submission.is_correct ? 'status-solved' : 'status-failed';
    const statusIcon = submission.is_correct ? 'check-circle' : 'x-circle';
    const statusText = submission.is_correct 
      ? `+${submission.xp_earned} XP` 
      : 'Try Again';

    return `
      <div class="activity-item">
        <div class="activity-info">
          <div class="activity-status ${statusClass}">
            <i data-lucide="${statusIcon}"></i>
          </div>
          <span>${submission.challenge_title || 'Challenge'}</span>
        </div>
        <span>${statusText}</span>
      </div>
    `;
  }).join('');

  // Reinitialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

/**
 * Load user progress
 */
async function loadUserProgress() {
  const progressSection = document.querySelector('.progress-section');
  if (!progressSection) return;

  const user = Auth.getUser();
  if (!user || !user.id) return;

  await handleApiCall(
    async () => {
      const response = await api.progress.getUserProgress(user.id);
      
      if (response && response.data) {
        renderUserProgress(response.data);
      }
    },
    {
      errorMessage: 'Failed to load progress',
      showErrorToast: false
    }
  );
}

/**
 * Render user progress
 * @param {Object} progress - Progress data
 */
function renderUserProgress(progress) {
  const progressFill = document.querySelector('.progress-fill');
  const progressInfo = document.querySelector('.progress-info');
  
  if (!progressFill || !progressInfo) return;

  const user = Auth.getUser();
  const currentXP = user?.totalXp || progress.total_xp || 0;
  const currentLevel = user?.level || progress.level || 1;
  
  // Calculate XP for next level (simple formula: level * 1000)
  const xpForNextLevel = currentLevel * 1000;
  const xpProgress = currentXP % 1000;
  const progressPercentage = (xpProgress / 1000) * 100;

  // Update progress bar
  progressFill.style.width = `${progressPercentage}%`;

  // Update progress info
  progressInfo.innerHTML = `
    <span>Level ${currentLevel}</span>
    <span>${xpProgress} XP / ${1000} XP</span>
  `;
}

/**
 * Initialize UI components
 */
function initializeUIComponents() {
  // Logout button handler
  const logoutBtn = document.querySelector('.logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogout();
    });
  }

  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('nav');
  
  if (mobileMenuBtn && nav) {
    mobileMenuBtn.addEventListener('click', () => {
      nav.classList.toggle('active');
    });
  }

  // User menu dropdown
  const userProfileToggle = document.querySelector('.user-profile-toggle');
  const dropdownMenu = document.querySelector('.dropdown-menu');

  if (userProfileToggle && dropdownMenu) {
    userProfileToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const isOpen = dropdownMenu.style.display === 'block';
      dropdownMenu.style.display = isOpen ? 'none' : 'block';
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!userProfileToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.style.display = 'none';
      }
    });
  }
}

/**
 * Handle user logout
 */
function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    Auth.logout();
  }
}

// Initialize dashboard when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDashboard);
} else {
  initDashboard();
}

// Export for testing or external use
export { initDashboard, loadUserData, loadDomains, loadRecentActivity, loadUserProgress };
