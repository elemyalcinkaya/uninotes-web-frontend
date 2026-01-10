// API Configuration
export const API_BASE_URL = 'http://localhost:5276/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
  },
  // Notes
  NOTES: {
    LIST: "/notes",
    SHARED: "/notes/shared",
    GET: (id: number) => `/notes/${id}`,
    CREATE: "/notes",
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

  // Contact
  CONTACT: {
    SEND: '/contact/send',
  },

  // Courses
  COURSES: {
    LIST: '/courses',
    BY_CLASS_AND_SEMESTER: (classLevel: number, semester: number) =>
      `/courses/ByClassLevelAndSemester/${classLevel}/${semester}`,
  },

  // Downloads
  DOWNLOADS: {
    TRACK: '/downloads',
    MY: '/downloads/my',
  },

  // Reports
  REPORTS: {
    CREATE: '/reports',
    LIST: '/reports',
  },

  // Report Reasons
  REPORT_REASONS: {
    LIST: '/reportreasons',
  },

};

// Helper function to get full URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};
