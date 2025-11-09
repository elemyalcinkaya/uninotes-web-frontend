// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7095/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
  },
  // Notes
  NOTES: {
    LIST: '/notes',
    GET: (id: number) => `/notes/${id}`,
    CREATE: '/notes',
    UPDATE: (id: number) => `/notes/${id}`,
    DELETE: (id: number) => `/notes/${id}`,
  },
  // Files
  FILES: {
    LIST: '/files',
    UPLOAD: '/files/upload',
    DOWNLOAD: (id: number) => `/files/download/${id}`,
    DELETE: (id: number) => `/files/${id}`,
  },
};

// Helper function to get full URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

