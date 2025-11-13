/**
 * Tests for Auth utility module
 */

// Mock localStorage and sessionStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

const sessionStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

global.localStorage = localStorageMock;
global.sessionStorage = sessionStorageMock;

// Mock window.location
delete global.window;
global.window = {
  location: {
    href: '',
    pathname: '/dashboard.html'
  }
};

// Mock config
jest.mock('../config.js', () => ({
  default: {
    STORAGE_KEYS: {
      TOKEN: 'token',
      USER: 'user'
    }
  }
}), { virtual: true });

// Import Auth after mocks are set up
let Auth;

describe('Auth Utility', () => {
  beforeEach(async () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '';
    window.location.pathname = '/dashboard.html';
    
    // Dynamic import to ensure mocks are applied
    const authModule = await import('../utils/auth.js');
    Auth = authModule.default;
  });

  describe('Token Management', () => {
    it('should get token from localStorage', () => {
      localStorage.setItem('token', 'test-token');
      
      const token = Auth.getToken();
      
      expect(token).toBe('test-token');
    });

    it('should return null when no token exists', () => {
      const token = Auth.getToken();
      
      expect(token).toBeNull();
    });

    it('should set token in localStorage', () => {
      Auth.setToken('new-token');
      
      expect(localStorage.getItem('token')).toBe('new-token');
    });

    it('should not set token if value is falsy', () => {
      Auth.setToken(null);
      
      expect(localStorage.getItem('token')).toBeNull();
    });

    it('should remove token from localStorage', () => {
      localStorage.setItem('token', 'test-token');
      
      Auth.removeToken();
      
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('Authentication Status', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('token', 'test-token');
      
      const isAuth = Auth.isAuthenticated();
      
      expect(isAuth).toBe(true);
    });

    it('should return false when no token exists', () => {
      const isAuth = Auth.isAuthenticated();
      
      expect(isAuth).toBe(false);
    });
  });

  describe('checkAuth', () => {
    it('should return true when authenticated', () => {
      localStorage.setItem('token', 'test-token');
      
      const result = Auth.checkAuth();
      
      expect(result).toBe(true);
      expect(window.location.href).toBe('');
    });

    it('should redirect to login when not authenticated', () => {
      const result = Auth.checkAuth();
      
      expect(result).toBe(false);
      expect(window.location.href).toBe('/login.html');
    });

    it('should store current pathname for redirect', () => {
      window.location.pathname = '/challenges.html';
      
      Auth.checkAuth();
      
      expect(sessionStorage.getItem('redirectAfterLogin')).toBe('/challenges.html');
    });

    it('should store custom redirect URL', () => {
      Auth.checkAuth('/custom-page.html');
      
      expect(sessionStorage.getItem('redirectAfterLogin')).toBe('/custom-page.html');
    });
  });

  describe('logout', () => {
    it('should remove token and user data', () => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify({ id: 1 }));
      
      Auth.logout(false);
      
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });

    it('should redirect to login page', () => {
      Auth.logout(false);
      
      expect(window.location.href).toBe('/login.html');
    });

    it('should set logout message when showMessage is true', () => {
      Auth.logout(true);
      
      expect(sessionStorage.getItem('logoutMessage')).toBe('You have been logged out successfully');
    });

    it('should not set logout message when showMessage is false', () => {
      Auth.logout(false);
      
      expect(sessionStorage.getItem('logoutMessage')).toBeNull();
    });
  });

  describe('User Data Management', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      totalXp: 100
    };

    it('should get user from localStorage', () => {
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      const user = Auth.getUser();
      
      expect(user).toEqual(mockUser);
    });

    it('should return null when no user exists', () => {
      const user = Auth.getUser();
      
      expect(user).toBeNull();
    });

    it('should return null for invalid JSON', () => {
      localStorage.setItem('user', 'invalid-json');
      
      const user = Auth.getUser();
      
      expect(user).toBeNull();
    });

    it('should set user in localStorage', () => {
      Auth.setUser(mockUser);
      
      const stored = JSON.parse(localStorage.getItem('user'));
      expect(stored).toEqual(mockUser);
    });

    it('should not set user if value is falsy', () => {
      Auth.setUser(null);
      
      expect(localStorage.getItem('user')).toBeNull();
    });

    it('should remove user from localStorage', () => {
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      Auth.removeUser();
      
      expect(localStorage.getItem('user')).toBeNull();
    });

    it('should update user data', () => {
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      Auth.updateUser({ totalXp: 200, level: 2 });
      
      const updated = Auth.getUser();
      expect(updated.totalXp).toBe(200);
      expect(updated.level).toBe(2);
      expect(updated.username).toBe('testuser');
    });

    it('should not update if no user exists', () => {
      Auth.updateUser({ totalXp: 200 });
      
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('Redirect Management', () => {
    it('should get redirect URL from sessionStorage', () => {
      sessionStorage.setItem('redirectAfterLogin', '/challenges.html');
      
      const url = Auth.getRedirectUrl();
      
      expect(url).toBe('/challenges.html');
    });

    it('should return default dashboard when no redirect URL', () => {
      const url = Auth.getRedirectUrl();
      
      expect(url).toBe('/dashboard.html');
    });

    it('should remove redirect URL after getting it', () => {
      sessionStorage.setItem('redirectAfterLogin', '/challenges.html');
      
      Auth.getRedirectUrl();
      
      expect(sessionStorage.getItem('redirectAfterLogin')).toBeNull();
    });
  });

  describe('clearAuth', () => {
    it('should clear all authentication data', () => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify({ id: 1 }));
      sessionStorage.setItem('redirectAfterLogin', '/test.html');
      
      Auth.clearAuth();
      
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      expect(sessionStorage.getItem('redirectAfterLogin')).toBeNull();
    });
  });
});
