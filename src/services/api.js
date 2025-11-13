import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // Flask backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const secondBrainAPI = {
  // System status
  async getStatus() {
    const response = await api.get('/status');
    return response.data;
  },

  // Chat
  async sendMessage(message, useHistory = true) {
    const response = await api.post('/query', {
      question: message,
      use_history: useHistory
    });
    return response.data;
  },

  // File upload
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/ingest', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Memories
  async getMemories() {
    const response = await api.get('/memories');
    return response.data;
  },

  async addMemory(command) {
    const response = await api.post('/memories', { command });
    return response.data;
  },

  async deleteMemory(memoryKey) {
    const response = await api.delete(`/memories/${memoryKey}`);
    return response.data;
  },

  // Data management
  async getDocuments() {
    const response = await api.get('/documents');
    return response.data;
  },

  async deleteDocument(filename) {
    const response = await api.delete(`/documents/${filename}`);
    return response.data;
  },

  async searchDocuments(query) {
    const response = await api.get('/search', { params: { q: query } });
    return response.data;
  }
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