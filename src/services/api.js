// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://192.168.163.172:8000'; // Flask backend URL

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials: false, // Important for CORS
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear invalid token
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // // Redirect to login page
      // if (window.location.pathname !== '/login') {
      //   window.location.href = '/login';
      // }
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error);
      // You could show a network error notification here
    }
    
    return Promise.reject(error);
  }
);

// Auth services
export const authServices = {
  async googleLogin(token, clientId) {
    try {
      const response = await api.post('/api/auth/google', {
        token,
        clientId
      });
      return response.data;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  },

  async validateToken() {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        return { valid: false, message: 'No token found' };
      }
      
      const response = await api.get('/api/auth/validate');
      return response.data;
    } catch (error) {
      console.error('Token validation error:', error);
      return { 
        valid: false, 
        message: error.response?.data?.error || 'Token validation failed' 
      };
    }
  },

  async getProfile() {
    try {
      const response = await api.get('/api/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  async logout() {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }
};

// Second Brain API services
export const secondBrainAPI = {
  // System status (public)
  async getStatus() {
    try {
      const response = await api.get('/status');
      return response.data;
    } catch (error) {
      console.error('Status check error:', error);
      throw error;
    }
  },

  // Chat (protected - user isolated)
  async sendMessage(message, useHistory = true) {
    try {
      const response = await api.post('/query', {
        question: message,
        use_history: useHistory
      });
      return response.data;
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  },

  // File upload (protected - user isolated)
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await api.post('/ingest', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('File upload error:', error);
      
      // Extract user-friendly error message
      let userMessage = 'Upload failed. Please try again.';
      let detailedError = 'Unknown error';
      
      if (error.response) {
        // Server responded with error
        const status = error.response.status;
        const serverError = error.response.data?.error || error.response.data?.message || error.response.statusText;
        detailedError = serverError;
        
        // Map HTTP status codes to user-friendly messages
        switch (status) {
          case 400:
            if (serverError.includes('encrypted') || serverError.includes('Encrypted') || 
                serverError.includes('password') || serverError.includes('Password')) {
              userMessage = 'File is password-protected or encrypted';
            } else if (serverError.includes('corrupted') || serverError.includes('corrupt')) {
              userMessage = 'File appears to be corrupted';
            } else if (serverError.includes('No text') || serverError.includes('empty content') || 
                      serverError.includes('extractable')) {
              userMessage = 'No readable text found in file';
            } else if (serverError.includes('Unsupported')) {
              userMessage = 'File format is not supported';
            } else {
              userMessage = serverError || 'Invalid file format or content';
            }
            break;
          case 413:
            userMessage = 'File too large (maximum 50MB)';
            break;
          case 401:
            userMessage = 'Please login again to upload files';
            break;
          case 500:
            userMessage = 'Server error. Please try again later.';
            break;
          default:
            userMessage = serverError || `Upload failed (Error ${status})`;
        }
      } else if (error.request) {
        // Network error
        userMessage = 'Network error. Please check your internet connection.';
        detailedError = 'Network request failed';
      } else if (error.message) {
        // Axios setup error
        userMessage = 'Upload failed. Please try again.';
        detailedError = error.message;
      }
      
      // Create a proper error object with user-friendly message
      const userError = new Error(userMessage);
      userError.detailedError = detailedError;
      userError.originalError = error;
      
      throw userError;
    }
  },

  // Memories (protected - user isolated)
  async getMemories() {
    try {
      const response = await api.get('/memories');
      return response.data;
    } catch (error) {
      console.error('Get memories error:', error);
      throw error;
    }
  },

  // Time-based memory operations
  async getUpcomingMemories(hoursAhead = 24) {
    try {
      const response = await api.get('/memories/upcoming', {
        params: { hours: hoursAhead }
      });
      return response.data;
    } catch (error) {
      console.error('Get upcoming memories error:', error);
      throw error;
    }
  },

  async getExpiredMemories() {
    try {
      const response = await api.get('/memories/expired');
      return response.data;
    } catch (error) {
      console.error('Get expired memories error:', error);
      throw error;
    }
  },

  async completeMemory(memoryKey, category = null) {
    try {
      const url = category 
        ? `/memories/${memoryKey}/complete?category=${encodeURIComponent(category)}`
        : `/memories/${memoryKey}/complete`;
      
      const response = await api.post(url);
      return response.data;
    } catch (error) {
      console.error('Complete memory error:', error);
      throw error;
    }
  },

  async cleanupMemories(daysOld = 30) {
    try {
      const response = await api.post('/memories/cleanup', { days_old: daysOld });
      return response.data;
    } catch (error) {
      console.error('Cleanup memories error:', error);
      throw error;
    }
  },

  async getMemoryTimeStats() {
    try {
      const response = await api.get('/memories/stats/time');
      return response.data;
    } catch (error) {
      console.error('Get memory time stats error:', error);
      throw error;
    }
  },

  async searchMemories(query) {
    try {
      const response = await api.get('/memories/search', { 
        params: { q: query } 
      });
      return response.data;
    } catch (error) {
      console.error('Search memories error:', error);
      throw error;
    }
  },

  async addMemory(command) {
    try {
      const response = await api.post('/memories', { command });
      return response.data;
    } catch (error) {
      console.error('Add memory error:', error);
      throw error;
    }
  },

  async addMemoryDirect(category, key, value, description = '') {
    try {
      const response = await api.post('/memories', { 
        category, 
        key, 
        value, 
        description 
      });
      return response.data;
    } catch (error) {
      console.error('Add memory direct error:', error);
      throw error;
    }
  },

  async deleteMemory(memoryKey, category = null) {
    try {
      const url = category 
        ? `/memories/${memoryKey}?category=${encodeURIComponent(category)}`
        : `/memories/${memoryKey}`;
      
      const response = await api.delete(url);
      return response.data;
    } catch (error) {
      console.error('Delete memory error:', error);
      throw error;
    }
  },

  // Documents (protected - user isolated)
  async getDocuments() {
    try {
      const response = await api.get('/documents');
      return response.data;
    } catch (error) {
      console.error('Get documents error:', error);
      throw error;
    }
  },

  async deleteDocument(filename) {
    try {
      const response = await api.delete(`/documents/${filename}`);
      return response.data;
    } catch (error) {
      console.error('Delete document error:', error);
      throw error;
    }
  },

  async searchDocuments(query) {
    try {
      const response = await api.get('/search', { 
        params: { q: query } 
      });
      return response.data;
    } catch (error) {
      console.error('Search documents error:', error);
      throw error;
    }
  },

  // User stats (protected - user isolated)
  async getUserStats() {
    try {
      const response = await api.get('/stats');
      return response.data;
    } catch (error) {
      console.error('Get user stats error:', error);
      throw error;
    }
  },

  async getUploadInfo() {
    try {
      const response = await api.get('/documents/upload-url');
      return response.data;
    } catch (error) {
      console.error('Get upload info error:', error);
      throw error;
    }
  },

  async exportMemories() {
    try {
      const response = await api.get('/export/memories');
      return response.data;
    } catch (error) {
      console.error('Export memories error:', error);
      throw error;
    }
  },

  // Conversation History (protected - user isolated)
  async getConversationHistory() {
    try {
      const response = await api.get('/conversation/history');
      return response.data;
    } catch (error) {
      console.error('Get conversation history error:', error);
      throw error;
    }
  },

  async clearConversationHistory() {
    try {
      const response = await api.delete('/conversation/history');
      return response.data;
    } catch (error) {
      console.error('Clear conversation history error:', error);
      throw error;
    }
  },

  async exportConversationHistory() {
    try {
      const response = await api.get('/conversation/history/export');
      return response.data;
    } catch (error) {
      console.error('Export conversation history error:', error);
      throw error;
    }
  },
};

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    throw error;
  }
);

export default api;