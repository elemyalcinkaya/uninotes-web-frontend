import { getApiUrl, API_ENDPOINTS } from '../config/api';
import { authService } from './authService';

// API request helper
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = authService.getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(getApiUrl(endpoint), {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Unauthorized - logout user
      authService.logout();
      window.location.href = '/login';
    }
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// File upload helper
async function apiFileUpload(
  endpoint: string,
  formData: FormData
): Promise<any> {
  const token = authService.getToken();

  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(getApiUrl(endpoint), {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    if (response.status === 401) {
      authService.logout();
      window.location.href = '/login';
    }
    const error = await response.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(error.message || 'Upload failed');
  }

  return response.json();
}

// File download helper
async function downloadFile(fileId: number, fileName: string): Promise<void> {
  const token = authService.getToken();
  const response = await fetch(getApiUrl(API_ENDPOINTS.FILES.DOWNLOAD(fileId)), {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Download failed');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

// Types
export interface Note {
  id: number;
  title: string;
  courseCode?: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
  fileCount?: number;
}

export interface File {
  id: number;
  noteId?: number;
  title: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteDto {
  title: string;
  courseCode?: string;
  summary?: string;
}

export interface UpdateNoteDto {
  title?: string;
  courseCode?: string;
  summary?: string;
}

// API Service
export const apiService = {
  // Notes
  notes: {
    // Get all notes
    async getAll(): Promise<Note[]> {
      return apiRequest<Note[]>(API_ENDPOINTS.NOTES.LIST);
    },

    // Get note by ID
    async getById(id: number): Promise<Note & { files: File[] }> {
      return apiRequest<Note & { files: File[] }>(API_ENDPOINTS.NOTES.GET(id));
    },

    // Create note
    async create(note: CreateNoteDto): Promise<Note> {
      return apiRequest<Note>(API_ENDPOINTS.NOTES.CREATE, {
        method: 'POST',
        body: JSON.stringify(note),
      });
    },

    // Update note
    async update(id: number, note: UpdateNoteDto): Promise<Note> {
      return apiRequest<Note>(API_ENDPOINTS.NOTES.UPDATE(id), {
        method: 'PUT',
        body: JSON.stringify(note),
      });
    },

    // Delete note
    async delete(id: number): Promise<void> {
      return apiRequest<void>(API_ENDPOINTS.NOTES.DELETE(id), {
        method: 'DELETE',
      });
    },
  },

  // Files
  files: {
    // Get all files (optional noteId filter)
    async getAll(noteId?: number): Promise<File[]> {
      const endpoint = noteId
        ? `${API_ENDPOINTS.FILES.LIST}?noteId=${noteId}`
        : API_ENDPOINTS.FILES.LIST;
      return apiRequest<File[]>(endpoint);
    },

    // Upload file
    async upload(
      file: File,
      noteId?: number,
      title?: string
    ): Promise<File> {
      const formData = new FormData();
      formData.append('file', file);
      if (noteId) {
        formData.append('noteId', noteId.toString());
      }
      if (title) {
        formData.append('title', title);
      }

      const response = await apiFileUpload(API_ENDPOINTS.FILES.UPLOAD, formData);
      return response.file;
    },

    // Download file
    async download(fileId: number, fileName: string): Promise<void> {
      return downloadFile(fileId, fileName);
    },

    // Delete file
    async delete(id: number): Promise<void> {
      return apiRequest<void>(API_ENDPOINTS.FILES.DELETE(id), {
        method: 'DELETE',
      });
    },
  },
};


