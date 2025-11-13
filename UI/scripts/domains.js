/**
 * Domains Page Script
 * Handles domains listing using modular API client and utilities
 */

import api from './api/endpoints.js';
import Auth from './utils/auth.js';
import UI from './utils/ui.js';
import { handleApiCall } from './utils/errorHandler.js';
import stateManager from './utils/state.js';

/**
 * Initialize domains page
 */
async function initDomains() {
  // Check authentication
  if (!Auth.checkAuth()) {
    return;
  }

  // Load user data
  await loadUserData();
  
  // Load domains
  await loadDomains();

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
 * Load domains from API
 */
async function loadDomains() {
  const domainsGrid = document.querySelector('.cyber-grid-3');
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
      showErrorToast: true
    }
  );
}

/**
 * Render domains in the grid
 * @param {Array} domains - Array of domain objects
 */
function renderDomains(domains) {
  const domainsGrid = document.querySelector('.cyber-grid-3');
  if (!domainsGrid) return;

  if (!domains || domains.length === 0) {
    domainsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
        <p style="color: var(--text-secondary); font-size: 1.125rem;">
          No domains available at the moment.
        </p>
      </div>
    `;
    return;
  }

  // Map domain icons and colors
  const domainConfig = {
    'web-security': {
      icon: 'globe',
      color: 'neon-green',
      bgColor: 'rgba(34, 197, 94, 0.2)'
    },
    'cryptography': {
      icon: 'lock',
      color: 'cyber-purple',
      bgColor: 'rgba(110, 64, 201, 0.2)'
    },
    'forensics': {
      icon: 'search',
      color: 'warning',
      bgColor: 'rgba(245, 158, 11, 0.2)'
    },
    'reverse-engineering': {
      icon: 'cpu',
      color: 'info',
      bgColor: 'rgba(59, 130, 246, 0.2)'
    },
    'malware': {
      icon: 'bug',
      color: 'error',
      bgColor: 'rgba(248, 81, 73, 0.2)'
    },
    'network-security': {
      icon: 'shield',
      color: 'success',
      bgColor: 'rgba(46, 160, 67, 0.2)'
    },
    'vapt': {
      icon: 'shield-alert',
      color: 'warning',
      bgColor: 'rgba(245, 158, 11, 0.2)'
    }
  };

  domainsGrid.innerHTML = domains.map(domain => {
    const config = domainConfig[domain.slug] || {
      icon: 'shield',
      color: 'info',
      bgColor: 'rgba(59, 130, 246, 0.2)'
    };

    const isActive = domain.is_active !== false;
    const challengeCount = domain.total_challenges || 0;
    const difficultyBadge = domain.difficulty_level 
      ? `badge-${domain.difficulty_level}` 
      : 'badge-medium';

    // Determine if domain page exists
    const domainLink = isActive ? `domain-${domain.slug}.html` : '#';
    const opacity = isActive ? '1' : '0.7';

    return `
      <a href="${domainLink}" class="cyber-card" style="text-decoration: none; color: inherit; opacity: ${opacity};">
        <div style="width: 80px; height: 80px; background: ${config.bgColor}; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
          <i data-lucide="${config.icon}" style="width: 48px; height: 48px; color: var(--${config.color});"></i>
        </div>
        <h3 style="color: var(--${config.color}); margin-bottom: 0.75rem;">${domain.name}</h3>
        <p style="color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.6;">
          ${domain.description || 'Explore challenges in this domain'}
        </p>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="cyber-badge ${difficultyBadge}">${challengeCount} Challenges</span>
          ${isActive 
            ? `<i data-lucide="arrow-right" style="width: 20px; height: 20px; color: var(--${config.color});"></i>`
            : `<span style="color: var(--text-muted); font-size: 0.875rem;">Coming Soon</span>`
          }
        </div>
      </a>
    `;
  }).join('');

  // Reinitialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
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
}

/**
 * Handle user logout
 */
function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    Auth.logout();
  }
}

// Initialize domains page when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDomains);
} else {
  initDomains();
}

// Export for testing or external use
export { initDomains, loadDomains };
