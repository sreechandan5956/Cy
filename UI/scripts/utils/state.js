/**
 * State Management Module
 * Provides centralized application state management with subscribe/notify pattern
 */

/**
 * StateManager class for managing application state
 * Implements observer pattern for reactive state updates
 */
class StateManager {
  /**
   * Initialize StateManager with default state structure
   */
  constructor() {
    this.state = {
      user: null,
      isAuthenticated: false,
      loading: false,
      challenges: [],
      domains: [],
      currentChallenge: null,
      currentDomain: null,
      leaderboard: [],
      achievements: [],
      progress: null
    };
    this.listeners = [];
  }

  /**
   * Update state with new values and notify listeners
   * @param {Object} updates - Object containing state updates
   * @example
   * stateManager.setState({ user: userData, isAuthenticated: true });
   */
  setState(updates) {
    this.state = { ...this.state, ...updates };
    this.notify();
  }

  /**
   * Get a copy of the current state
   * @returns {Object} Copy of current state
   * @example
   * const currentState = stateManager.getState();
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Subscribe to state changes
   * @param {Function} listener - Callback function to be called on state changes
   * @returns {Function} Unsubscribe function
   * @example
   * const unsubscribe = stateManager.subscribe((state) => {
   *   console.log('State updated:', state);
   * });
   * // Later: unsubscribe();
   */
  subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Listener must be a function');
    }
    
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify all listeners of state changes
   * @private
   */
  notify() {
    this.listeners.forEach(listener => {
      try {
        listener(this.state);
      } catch (error) {
        console.error('Error in state listener:', error);
      }
    });
  }

  /**
   * Reset state to default values
   * @example
   * stateManager.reset();
   */
  reset() {
    this.state = {
      user: null,
      isAuthenticated: false,
      loading: false,
      challenges: [],
      domains: [],
      currentChallenge: null,
      currentDomain: null,
      leaderboard: [],
      achievements: [],
      progress: null
    };
    this.notify();
  }

  /**
   * Get a specific state property
   * @param {string} key - State property key
   * @returns {*} Value of the state property
   * @example
   * const user = stateManager.get('user');
   */
  get(key) {
    return this.state[key];
  }

  /**
   * Set a specific state property
   * @param {string} key - State property key
   * @param {*} value - Value to set
   * @example
   * stateManager.set('loading', true);
   */
  set(key, value) {
    this.setState({ [key]: value });
  }
}

// Create and export singleton instance
const stateManager = new StateManager();

// Export both the class and the singleton instance
export { StateManager, stateManager };
export default stateManager;
