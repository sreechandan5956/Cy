/**
 * Tests for API Client
 * Note: These tests require a test environment with jsdom or similar for localStorage
 */

const { ApiClient, ApiError } = require('../api/client.js');

// Mock fetch globally
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

global.localStorage = localStorageMock;

describe('ApiClient', () => {
  let apiClient;
  const baseURL = 'http://localhost:3000/api';

  beforeEach(() => {
    apiClient = new ApiClient(baseURL);
    localStorage.clear();
    fetch.mockClear();
  });

  describe('Token Management', () => {
    it('should get token from localStorage', () => {
      localStorage.setItem('token', 'test-token');
      
      const token = apiClient.getToken();
      
      expect(token).toBe('test-token');
    });

    it('should return null when no token exists', () => {
      const token = apiClient.getToken();
      
      expect(token).toBeNull();
    });

    it('should set token in localStorage', () => {
      apiClient.setToken('new-token');
      
      expect(localStorage.getItem('token')).toBe('new-token');
    });

    it('should remove token from localStorage', () => {
      localStorage.setItem('token', 'test-token');
      
      apiClient.removeToken();
      
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('request method', () => {
    it('should make successful GET request', async () => {
      const mockData = { success: true, data: { id: 1 } };
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData
      });

      const result = await apiClient.request('/test');

      expect(fetch).toHaveBeenCalledWith(
        `${baseURL}/test`,
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
      expect(result).toEqual(mockData);
    });

    it('should include authorization header when token exists', async () => {
      localStorage.setItem('token', 'test-token');
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({})
      });

      await apiClient.request('/test');

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-token'
          })
        })
      );
    });

    it('should not include authorization header when no token', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({})
      });

      await apiClient.request('/test');

      const callArgs = fetch.mock.calls[0][1];
      expect(callArgs.headers['Authorization']).toBeUndefined();
    });

    it('should throw ApiError on HTTP error response', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Not found' })
      });

      await expect(apiClient.request('/test'))
        .rejects
        .toThrow(ApiError);

      await expect(apiClient.request('/test'))
        .rejects
        .toThrow('Not found');
    });

    it('should handle error response with message field', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Bad request' })
      });

      await expect(apiClient.request('/test'))
        .rejects
        .toThrow('Bad request');
    });

    it('should handle error response without error message', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({})
      });

      await expect(apiClient.request('/test'))
        .rejects
        .toThrow('Request failed');
    });

    it('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

      await expect(apiClient.request('/test'))
        .rejects
        .toThrow('Network error');
    });

    it('should handle non-JSON responses on error', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => { throw new Error('Not JSON'); }
      });

      await expect(apiClient.request('/test'))
        .rejects
        .toThrow(ApiError);
    });

    it('should merge custom headers with default headers', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({})
      });

      await apiClient.request('/test', {
        headers: { 'X-Custom-Header': 'value' }
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'X-Custom-Header': 'value'
          })
        })
      );
    });

    it('should pass through fetch options', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({})
      });

      await apiClient.request('/test', {
        method: 'POST',
        body: JSON.stringify({ data: 'test' })
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ data: 'test' })
        })
      );
    });
  });

  describe('Convenience methods', () => {
    beforeEach(() => {
      fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true })
      });
    });

    it('should make GET request', async () => {
      await apiClient.get('/test');

      expect(fetch).toHaveBeenCalledWith(
        `${baseURL}/test`,
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('should make POST request with body', async () => {
      const body = { name: 'test' };
      
      await apiClient.post('/test', body);

      expect(fetch).toHaveBeenCalledWith(
        `${baseURL}/test`,
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(body)
        })
      );
    });

    it('should make POST request without body', async () => {
      await apiClient.post('/test');

      expect(fetch).toHaveBeenCalledWith(
        `${baseURL}/test`,
        expect.objectContaining({
          method: 'POST',
          body: undefined
        })
      );
    });

    it('should make PUT request with body', async () => {
      const body = { name: 'updated' };
      
      await apiClient.put('/test', body);

      expect(fetch).toHaveBeenCalledWith(
        `${baseURL}/test`,
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(body)
        })
      );
    });

    it('should make DELETE request', async () => {
      await apiClient.delete('/test');

      expect(fetch).toHaveBeenCalledWith(
        `${baseURL}/test`,
        expect.objectContaining({ method: 'DELETE' })
      );
    });

    it('should make PATCH request with body', async () => {
      const body = { field: 'value' };
      
      await apiClient.patch('/test', body);

      expect(fetch).toHaveBeenCalledWith(
        `${baseURL}/test`,
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(body)
        })
      );
    });
  });

  describe('ApiError', () => {
    it('should create ApiError with message and status', () => {
      const error = new ApiError('Test error', 404);

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('ApiError');
      expect(error.message).toBe('Test error');
      expect(error.status).toBe(404);
      expect(error.data).toBeNull();
    });

    it('should create ApiError with data', () => {
      const data = { field: 'error details' };
      const error = new ApiError('Test error', 400, data);

      expect(error.data).toEqual(data);
    });
  });
});
