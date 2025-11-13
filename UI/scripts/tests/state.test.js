/**
 * Tests for StateManager utility
 */

// Import StateManager class
let StateManager;

describe('StateManager', () => {
  let stateManager;

  beforeEach(async () => {
    // Dynamic import to get fresh instance
    const stateModule = await import('../utils/state.js');
    StateManager = stateModule.StateManager;
    stateManager = new StateManager();
  });

  describe('Initialization', () => {
    it('should initialize with default state', () => {
      const state = stateManager.getState();

      expect(state).toEqual({
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
      });
    });

    it('should initialize with empty listeners array', () => {
      expect(stateManager.listeners).toEqual([]);
    });
  });

  describe('setState', () => {
    it('should update state with new values', () => {
      stateManager.setState({ loading: true });

      const state = stateManager.getState();
      expect(state.loading).toBe(true);
    });

    it('should merge updates with existing state', () => {
      stateManager.setState({ user: { id: 1, name: 'Test' } });
      stateManager.setState({ loading: true });

      const state = stateManager.getState();
      expect(state.user).toEqual({ id: 1, name: 'Test' });
      expect(state.loading).toBe(true);
    });

    it('should update multiple properties at once', () => {
      stateManager.setState({
        user: { id: 1 },
        isAuthenticated: true,
        loading: false
      });

      const state = stateManager.getState();
      expect(state.user).toEqual({ id: 1 });
      expect(state.isAuthenticated).toBe(true);
      expect(state.loading).toBe(false);
    });

    it('should notify listeners on state change', () => {
      const listener = jest.fn();
      stateManager.subscribe(listener);

      stateManager.setState({ loading: true });

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(expect.objectContaining({
        loading: true
      }));
    });
  });

  describe('getState', () => {
    it('should return a copy of state', () => {
      const state1 = stateManager.getState();
      const state2 = stateManager.getState();

      expect(state1).toEqual(state2);
      expect(state1).not.toBe(state2);
    });

    it('should not allow direct state mutation', () => {
      const state = stateManager.getState();
      state.loading = true;

      const actualState = stateManager.getState();
      expect(actualState.loading).toBe(false);
    });
  });

  describe('subscribe', () => {
    it('should add listener to listeners array', () => {
      const listener = jest.fn();

      stateManager.subscribe(listener);

      expect(stateManager.listeners).toContain(listener);
    });

    it('should call listener when state changes', () => {
      const listener = jest.fn();
      stateManager.subscribe(listener);

      stateManager.setState({ loading: true });

      expect(listener).toHaveBeenCalled();
    });

    it('should return unsubscribe function', () => {
      const listener = jest.fn();

      const unsubscribe = stateManager.subscribe(listener);

      expect(typeof unsubscribe).toBe('function');
    });

    it('should remove listener when unsubscribe is called', () => {
      const listener = jest.fn();
      const unsubscribe = stateManager.subscribe(listener);

      unsubscribe();

      expect(stateManager.listeners).not.toContain(listener);
    });

    it('should not call listener after unsubscribe', () => {
      const listener = jest.fn();
      const unsubscribe = stateManager.subscribe(listener);

      unsubscribe();
      stateManager.setState({ loading: true });

      expect(listener).not.toHaveBeenCalled();
    });

    it('should throw error if listener is not a function', () => {
      expect(() => stateManager.subscribe('not a function'))
        .toThrow('Listener must be a function');
    });

    it('should support multiple listeners', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      stateManager.subscribe(listener1);
      stateManager.subscribe(listener2);

      stateManager.setState({ loading: true });

      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });
  });

  describe('notify', () => {
    it('should call all listeners with current state', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();

      stateManager.subscribe(listener1);
      stateManager.subscribe(listener2);

      stateManager.setState({ loading: true });

      expect(listener1).toHaveBeenCalledWith(stateManager.state);
      expect(listener2).toHaveBeenCalledWith(stateManager.state);
    });

    it('should handle errors in listeners gracefully', () => {
      const errorListener = jest.fn(() => {
        throw new Error('Listener error');
      });
      const normalListener = jest.fn();

      stateManager.subscribe(errorListener);
      stateManager.subscribe(normalListener);

      // Should not throw
      expect(() => stateManager.setState({ loading: true })).not.toThrow();

      // Normal listener should still be called
      expect(normalListener).toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('should reset state to default values', () => {
      stateManager.setState({
        user: { id: 1 },
        isAuthenticated: true,
        loading: true,
        challenges: [{ id: 1 }]
      });

      stateManager.reset();

      const state = stateManager.getState();
      expect(state).toEqual({
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
      });
    });

    it('should notify listeners on reset', () => {
      const listener = jest.fn();
      stateManager.subscribe(listener);

      stateManager.reset();

      expect(listener).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('should get specific state property', () => {
      stateManager.setState({ user: { id: 1, name: 'Test' } });

      const user = stateManager.get('user');

      expect(user).toEqual({ id: 1, name: 'Test' });
    });

    it('should return undefined for non-existent property', () => {
      const value = stateManager.get('nonExistent');

      expect(value).toBeUndefined();
    });
  });

  describe('set', () => {
    it('should set specific state property', () => {
      stateManager.set('loading', true);

      expect(stateManager.get('loading')).toBe(true);
    });

    it('should notify listeners when using set', () => {
      const listener = jest.fn();
      stateManager.subscribe(listener);

      stateManager.set('loading', true);

      expect(listener).toHaveBeenCalled();
    });

    it('should work with complex values', () => {
      const challenges = [{ id: 1 }, { id: 2 }];

      stateManager.set('challenges', challenges);

      expect(stateManager.get('challenges')).toEqual(challenges);
    });
  });

  describe('Integration scenarios', () => {
    it('should handle authentication flow', () => {
      const listener = jest.fn();
      stateManager.subscribe(listener);

      // Login
      stateManager.setState({
        user: { id: 1, username: 'testuser' },
        isAuthenticated: true
      });

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          isAuthenticated: true,
          user: { id: 1, username: 'testuser' }
        })
      );

      // Logout
      stateManager.setState({
        user: null,
        isAuthenticated: false
      });

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          isAuthenticated: false,
          user: null
        })
      );
    });

    it('should handle loading states', () => {
      const listener = jest.fn();
      stateManager.subscribe(listener);

      // Start loading
      stateManager.set('loading', true);
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ loading: true })
      );

      // Finish loading
      stateManager.set('loading', false);
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({ loading: false })
      );
    });

    it('should handle data fetching flow', () => {
      const listener = jest.fn();
      stateManager.subscribe(listener);

      // Start loading
      stateManager.set('loading', true);

      // Data received
      stateManager.setState({
        loading: false,
        challenges: [{ id: 1 }, { id: 2 }]
      });

      expect(listener).toHaveBeenLastCalledWith(
        expect.objectContaining({
          loading: false,
          challenges: [{ id: 1 }, { id: 2 }]
        })
      );
    });
  });
});
