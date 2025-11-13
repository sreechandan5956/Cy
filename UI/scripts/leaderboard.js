/**
 * Leaderboard Page Script
 * Handles leaderboard display with pagination using modular API client and utilities
 */

import api from './api/endpoints.js';
import Auth from './utils/auth.js';
import UI from './utils/ui.js';
import { handleApiCall } from './utils/errorHandler.js';
import stateManager from './utils/state.js';
import config from './config.js';

// Pagination state
let currentPage = 1;
let currentLimit = config.PAGINATION.DEFAULT_LIMIT;
let totalPages = 1;

/**
 * Initialize leaderboard page
 */
async function initLeaderboard() {
  // Check authentication
  if (!Auth.checkAuth()) {
    return;
  }

  // Load user data
  await loadUserData();
  
  // Load leaderboard
  await loadLeaderboard();

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
 * Load leaderboard from API
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 */
async function loadLeaderboard(page = 1, limit = currentLimit) {
  const mainContent = document.querySelector('.main-content-placeholder');
  if (!mainContent) return;

  currentPage = page;
  currentLimit = limit;

  await handleApiCall(
    async () => {
      const response = await api.leaderboard.getGlobal({ page, limit });
      
      if (response && response.data) {
        stateManager.setState({ leaderboard: response.data.leaderboard || [] });
        
        // Update pagination info
        if (response.data.pagination) {
          totalPages = response.data.pagination.totalPages || 1;
        }
        
        renderLeaderboard(response.data.leaderboard || []);
        renderPagination();
      }
    },
    {
      loadingElement: mainContent,
      errorMessage: 'Failed to load leaderboard',
      showErrorToast: true
    }
  );
}

/**
 * Render leaderboard table
 * @param {Array} leaderboard - Array of leaderboard entries
 */
function renderLeaderboard(leaderboard) {
  const mainContent = document.querySelector('.main-content-placeholder');
  if (!mainContent) return;

  const container = mainContent.querySelector('.container');
  if (!container) return;

  if (!leaderboard || leaderboard.length === 0) {
    container.innerHTML = `
      <h1>🏆 Leaderboard</h1>
      <p>Top cybersecurity learners in our community</p>
      <div style="margin-top: 2rem; padding: 2rem; background: rgba(26, 26, 26, 0.5); border-radius: 15px; border: 1px solid var(--border-color);">
        <p style="color: var(--text-muted); font-size: 1.1rem;">No leaderboard data available yet.</p>
        <p style="color: var(--text-dim); font-size: 0.9rem; margin-top: 1rem;">Complete challenges to appear on the leaderboard!</p>
      </div>
    `;
    return;
  }

  const currentUser = Auth.getUser();
  const currentUserId = currentUser?.id;

  const leaderboardHTML = `
    <h1>🏆 Leaderboard</h1>
    <p>Top cybersecurity learners in our community</p>
    
    <div style="margin-top: 2rem; background: rgba(26, 26, 26, 0.5); border-radius: 15px; border: 1px solid var(--border-color); overflow: hidden;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: rgba(88, 166, 255, 0.1); border-bottom: 1px solid var(--border-color);">
            <th style="padding: 1rem; text-align: left; font-weight: 600;">Rank</th>
            <th style="padding: 1rem; text-align: left; font-weight: 600;">User</th>
            <th style="padding: 1rem; text-align: left; font-weight: 600;">Level</th>
            <th style="padding: 1rem; text-align: right; font-weight: 600;">XP</th>
            <th style="padding: 1rem; text-align: right; font-weight: 600;">Challenges</th>
          </tr>
        </thead>
        <tbody>
          ${leaderboard.map((entry, index) => {
            const rank = ((currentPage - 1) * currentLimit) + index + 1;
            const isCurrentUser = entry.user_id === currentUserId;
            const rowStyle = isCurrentUser 
              ? 'background: rgba(88, 166, 255, 0.15); border-left: 3px solid var(--primary-color);' 
              : '';
            
            // Medal emojis for top 3
            let rankDisplay = rank;
            if (rank === 1) rankDisplay = '🥇';
            else if (rank === 2) rankDisplay = '🥈';
            else if (rank === 3) rankDisplay = '🥉';

            return `
              <tr style="border-bottom: 1px solid var(--border-color); ${rowStyle}">
                <td style="padding: 1rem; font-weight: 600; font-size: 1.1rem;">${rankDisplay}</td>
                <td style="padding: 1rem;">
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); display: flex; align-items: center; justify-content: center; font-weight: 600; color: white;">
                      ${entry.username ? entry.username.slice(0, 2).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div style="font-weight: 600;">${entry.username || 'Unknown User'}</div>
                      ${entry.rank ? `<div style="font-size: 0.875rem; color: var(--text-muted);">${entry.rank}</div>` : ''}
                    </div>
                  </div>
                </td>
                <td style="padding: 1rem;">
                  <span style="display: inline-block; padding: 0.25rem 0.75rem; background: rgba(88, 166, 255, 0.2); border-radius: 12px; font-size: 0.875rem; font-weight: 600;">
                    Level ${entry.level || 1}
                  </span>
                </td>
                <td style="padding: 1rem; text-align: right; font-weight: 600; color: var(--primary-color);">
                  ${(entry.total_xp || 0).toLocaleString()} XP
                </td>
                <td style="padding: 1rem; text-align: right; color: var(--text-secondary);">
                  ${entry.challenges_completed || 0}
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
    
    <div id="pagination-container" style="margin-top: 2rem;"></div>
  `;

  container.innerHTML = leaderboardHTML;
}

/**
 * Render pagination controls
 */
function renderPagination() {
  const paginationContainer = document.querySelector('#pagination-container');
  if (!paginationContainer || totalPages <= 1) return;

  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  let paginationHTML = `
    <div style="display: flex; justify-content: center; align-items: center; gap: 0.5rem;">
      <button 
        class="pagination-btn" 
        ${currentPage === 1 ? 'disabled' : ''}
        onclick="window.goToPage(${currentPage - 1})"
        style="padding: 0.5rem 1rem; background: rgba(88, 166, 255, 0.1); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-primary); cursor: pointer; ${currentPage === 1 ? 'opacity: 0.5; cursor: not-allowed;' : ''}"
      >
        Previous
      </button>
  `;

  for (let i = startPage; i <= endPage; i++) {
    const isActive = i === currentPage;
    paginationHTML += `
      <button 
        class="pagination-btn ${isActive ? 'active' : ''}" 
        onclick="window.goToPage(${i})"
        style="padding: 0.5rem 1rem; background: ${isActive ? 'var(--primary-color)' : 'rgba(88, 166, 255, 0.1)'}; border: 1px solid var(--border-color); border-radius: 8px; color: ${isActive ? 'white' : 'var(--text-primary)'}; cursor: pointer; font-weight: ${isActive ? '600' : '400'};"
      >
        ${i}
      </button>
    `;
  }

  paginationHTML += `
      <button 
        class="pagination-btn" 
        ${currentPage === totalPages ? 'disabled' : ''}
        onclick="window.goToPage(${currentPage + 1})"
        style="padding: 0.5rem 1rem; background: rgba(88, 166, 255, 0.1); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-primary); cursor: pointer; ${currentPage === totalPages ? 'opacity: 0.5; cursor: not-allowed;' : ''}"
      >
        Next
      </button>
    </div>
  `;

  paginationContainer.innerHTML = paginationHTML;
}

/**
 * Go to specific page
 * @param {number} page - Page number
 */
function goToPage(page) {
  if (page < 1 || page > totalPages || page === currentPage) return;
  loadLeaderboard(page, currentLimit);
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

// Make goToPage available globally for pagination buttons
window.goToPage = goToPage;

// Initialize leaderboard page when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLeaderboard);
} else {
  initLeaderboard();
}

// Export for testing or external use
export { initLeaderboard, loadLeaderboard, goToPage };
